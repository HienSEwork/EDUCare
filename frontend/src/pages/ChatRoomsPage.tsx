import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Mic, MicOff, Send, Sparkles, Volume2, Plus, UserPlus, UserMinus, Pin, Settings, Users, LogOut, Search, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { apiRequest, ApiError, getStoredToken } from "@/lib/api/client";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";

function getWebSocketUrl() {
  const token = getStoredToken() || "";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  let host = window.location.host;
  
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.startsWith("http")) {
    host = envApiUrl.replace(/^https?:\/\//, "");
  }
  
  return `${protocol}//${host}/ws/chat?token=${token}`;
}
import { useAuth } from "@/contexts/AuthContext";
import type { ChatMessage, ChatRoom, ChatRoomMember, ChatStickerResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CHAT_PAGE_COPY } from "@/content/socialCopy";

type LocalAttachmentMessage = {
  id: string;
  roomSlug: string;
  author: string;
  authorId: string | null;
  createdAt: string;
  content: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  audioName?: string | null;
  authorXp?: number;
  authorStreak?: number;
  authorRole?: string;
  reactions?: ChatMessage["reactions"];
  isSystem?: boolean;
};

type ImageDraft = {
  url: string;
  name: string;
  file: File;
};

type AudioDraft = {
  url: string;
  name: string;
  blob: Blob;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMessageContent(content: string) {
  const lines = content.split(/\r?\n/);
  
  return lines.map((line, lineIndex) => {
    // If the line starts with a list marker (e.g. "* " or "- ")
    const isBullet = /^\s*[\*\-]\s+/.test(line);
    let cleanLine = line;
    if (isBullet) {
      cleanLine = line.replace(/^\s*[\*\-]\s+/, "");
    }
    
    // Parse bold segments: **text**
    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;
    let keyIndex = 0;
    
    while ((match = boldRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      parts.push(<strong key={keyIndex++} className="font-bold">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    
    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }
    
    if (parts.length === 0) {
      parts.push(cleanLine);
    }
    
    if (isBullet) {
      return (
        <span key={lineIndex} className="block pl-4 relative text-base leading-6 before:content-['•'] before:absolute before:left-1 before:text-current/70">
          {parts}
        </span>
      );
    }
    
    return (
      <span key={lineIndex} className="block text-base leading-6 min-h-[1.5rem]">
        {parts}
      </span>
    );
  });
}

function createAttachmentSummary(imageDraft: ImageDraft | null, audioDraft: AudioDraft | null) {
  const parts = [];

  if (imageDraft) {
    parts.push("Đã gửi một ảnh.");
  }

  if (audioDraft) {
    parts.push("Đã gửi một đoạn ghi âm.");
  }

  return parts.join(" ");
}

function calculateUserLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function getUserBadge(xp: number, streak: number, role?: string): { title: string; color: string } | null {
  if (role === "ADMIN") {
    return { title: "Admin", color: "bg-red-500 text-white" };
  }
  if (role === "SPECIALIST") {
    return { title: "Chuyên gia tâm lý", color: "bg-indigo-600 text-white" };
  }
  if (xp >= 500) {
    return { title: "Học giả tích cực 🎓", color: "bg-amber-500 text-white" };
  }
  if (streak >= 7) {
    return { title: "Chiến binh kiên trì 🔥", color: "bg-orange-500 text-white" };
  }
  if (xp >= 200) {
    return { title: "Người chăm học ✨", color: "bg-emerald-500 text-white" };
  }
  return null;
}

function getUserNameColor(role?: string, xp?: number): string {
  if (role === "ADMIN") return "text-red-600 font-extrabold";
  if (role === "SPECIALIST") return "text-indigo-600 font-bold";
  if (xp && xp >= 500) return "text-amber-600 font-bold";
  return "text-foreground";
}

export default function ChatRoomsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState("");
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [imageDraft, setImageDraft] = useState<ImageDraft | null>(null);
  const [audioDraft, setAudioDraft] = useState<AudioDraft | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, LocalAttachmentMessage[]>>({});
  const [stickersList, setStickersList] = useState<ChatStickerResponse[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [lastReadTimes, setLastReadTimes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("chat_last_read_times");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMaximized]);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const list = await apiRequest<ChatStickerResponse[]>("/community/stickers");
        setStickersList(list);
      } catch (err) {
        console.error("Failed to load stickers/GIFs", err);
      }
    };
    void fetchStickers();
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Real-time Chat States
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isCurrentUserTyping, setIsCurrentUserTyping] = useState(false);

  // Create Room modal states
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Invite member states
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | number | null>(null);
  const [gifPanelOpen, setGifPanelOpen] = useState(false);
  const [gifTab, setGifTab] = useState<"stickers" | "gifs">("stickers");

  const [invitations, setInvitations] = useState<ChatRoom[]>([]);
  const [members, setMembers] = useState<ChatRoomMember[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [showMembersPanel, setShowMembersPanel] = useState(false);

  // Edit room info
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [editRoomName, setEditRoomName] = useState("");
  const [editRoomDesc, setEditRoomDesc] = useState("");
  const [isEditingRoom, setIsEditingRoom] = useState(false);

  // Custom confirmation modal states
  const [confirmType, setConfirmType] = useState<"leave" | "kick" | null>(null);
  const [kickTarget, setKickTarget] = useState<{ id: string; name: string } | null>(null);

  // Sticker/GIF search & categories
  const [stickerGifSearch, setStickerGifSearch] = useState("");
  const [stickerGifCategory, setStickerGifCategory] = useState<string>("all");

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !newRoomDesc.trim()) {
      toast.error("Vui lòng nhập tên và mô tả nhóm.");
      return;
    }
    try {
      setIsCreatingRoom(true);
      const created = await apiRequest<ChatRoom>("/community/chat-rooms", {
        method: "POST",
        body: JSON.stringify({
          name: newRoomName.trim(),
          description: newRoomDesc.trim(),
        }),
      });
      toast.success(`Đã tạo nhóm "${created.name}" thành công.`);
      setCreateRoomOpen(false);
      setNewRoomName("");
      setNewRoomDesc("");
      const data = await apiRequest<ChatRoom[]>("/community/chat-rooms");
      setRooms(data);
      setActiveRoom(created.slug);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể tạo nhóm chat.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteUsername.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập.");
      return;
    }
    try {
      setIsInviting(true);
      await apiRequest(`/community/chat-rooms/${activeRoom}/invite`, {
        method: "POST",
        body: JSON.stringify({
          username: inviteUsername.trim(),
        }),
      });
      toast.success(`Đã gửi lời mời tới "${inviteUsername}" tham gia nhóm.`);
      setInviteOpen(false);
      setInviteUsername("");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể mời thành viên.");
    } finally {
      setIsInviting(false);
    }
  };

  const loadMembers = async () => {
    if (!activeRoom || activeRoom === "crew-bot") return;
    try {
      setIsMembersLoading(true);
      const data = await apiRequest<ChatRoomMember[]>(`/community/chat-rooms/${activeRoom}/members`);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setIsMembersLoading(false);
    }
  };

  useEffect(() => {
    void loadMembers();
  }, [activeRoom]);

  const handleAcceptInvite = async (slug: string) => {
    try {
      await apiRequest(`/community/chat-rooms/${slug}/accept`, { method: "POST" });
      toast.success("Đã đồng ý tham gia nhóm chat.");
      const [data, pendingData] = await Promise.all([
        apiRequest<ChatRoom[]>("/community/chat-rooms"),
        apiRequest<ChatRoom[]>("/community/chat-rooms/invitations")
      ]);
      setRooms(data);
      setInvitations(pendingData);
      setActiveRoom(slug);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Thao tác thất bại.");
    }
  };

  const handleRejectInvite = async (slug: string) => {
    try {
      await apiRequest(`/community/chat-rooms/${slug}/reject`, { method: "POST" });
      toast.success("Đã từ chối lời mời.");
      const pendingData = await apiRequest<ChatRoom[]>("/community/chat-rooms/invitations");
      setInvitations(pendingData);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Thao tác thất bại.");
    }
  };

  const handleLeaveRoomClick = () => {
    setConfirmType("leave");
  };

  const handleLeaveRoomConfirm = async () => {
    if (!activeRoom) return;
    try {
      await apiRequest(`/community/chat-rooms/${activeRoom}/leave`, { method: "POST" });
      toast.success("Đã rời khỏi nhóm chat.");
      const data = await apiRequest<ChatRoom[]>("/community/chat-rooms");
      setRooms(data);
      setActiveRoom(data.find((room) => room.slug === "crew-bot")?.slug ?? data[0]?.slug ?? "");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Rời nhóm thất bại.");
    } finally {
      setConfirmType(null);
    }
  };

  const handleKickMemberClick = (targetUserId: string, targetName: string) => {
    setKickTarget({ id: targetUserId, name: targetName });
    setConfirmType("kick");
  };

  const handleKickMemberConfirm = async () => {
    if (!activeRoom || !kickTarget) return;
    try {
      await apiRequest(`/community/chat-rooms/${activeRoom}/kick/${kickTarget.id}`, { method: "POST" });
      toast.success(`Đã mời ${kickTarget.name} ra khỏi nhóm.`);
      void loadMembers();
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Trục xuất thành viên thất bại.");
    } finally {
      setConfirmType(null);
      setKickTarget(null);
    }
  };

  const handleUpdateRoom = async () => {
    if (!activeRoom || !editRoomName.trim() || !editRoomDesc.trim()) {
      toast.error("Vui lòng nhập tên và mô tả nhóm.");
      return;
    }
    try {
      setIsEditingRoom(true);
      const updated = await apiRequest<ChatRoom>(`/community/chat-rooms/${activeRoom}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editRoomName.trim(),
          description: editRoomDesc.trim(),
        }),
      });
      toast.success("Cập nhật thông tin nhóm thành công.");
      setRooms((current) => current.map((r) => r.slug === updated.slug ? updated : r));
      setEditRoomOpen(false);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Cập nhật nhóm thất bại.");
    } finally {
      setIsEditingRoom(false);
    }
  };

  const handleToggleReaction = async (messageId: string | number, emoji: string) => {
    if (!user) return;
    try {
      const nextMessages = await apiRequest<ChatMessage[]>(`/community/chat-messages/${messageId}/reactions`, {
        method: "POST",
        body: JSON.stringify({ emoji }),
      });
      setMessages(nextMessages);
    } catch (requestError) {
      toast.error("Không thể cập nhật cảm xúc tin nhắn.");
    }
  };

  const handleSendStickerOrGif = async (url: string, type: "STICKER" | "GIF") => {
    if (!user || !activeRoom) return;
    try {
      const content = `[${type}] ${url}`;
      const nextMessages = await apiRequest<ChatMessage[]>(`/community/chat-rooms/${activeRoom}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setMessages(nextMessages);
      setGifPanelOpen(false);
    } catch (requestError) {
      toast.error("Không thể gửi nhãn dán/GIF.");
    }
  };

  useEffect(() => {
    let active = true;

    const loadRooms = async () => {
      try {
        const [data, pendingData] = await Promise.all([
          apiRequest<ChatRoom[]>("/community/chat-rooms"),
          apiRequest<ChatRoom[]>("/community/chat-rooms/invitations")
        ]);
        if (!active) {
          return;
        }
        setRooms(data);
        setInvitations(pendingData);
        setActiveRoom((current) => {
          if (current && data.some((room) => room.slug === current)) {
            return current;
          }

          return data.find((room) => room.slug === "crew-bot")?.slug ?? data[0]?.slug ?? "";
        });
        setError(null);
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(requestError instanceof ApiError ? requestError.message : CHAT_PAGE_COPY.loadRoomsError);
      } finally {
        if (active) {
          setIsRoomsLoading(false);
        }
      }
    };

    void loadRooms();
    const intervalId = window.setInterval(() => void loadRooms(), 10000);

    const handleUpdateEvent = () => {
      void loadRooms();
    };
    window.addEventListener("chat_room_update", handleUpdateEvent);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("chat_room_update", handleUpdateEvent);
    };
  }, []);

  useEffect(() => {
    if (activeRoom) {
      const nowStr = new Date().toISOString();
      setLastReadTimes((prev) => {
        const next = { ...prev, [activeRoom]: nowStr };
        localStorage.setItem("chat_last_read_times", JSON.stringify(next));
        return next;
      });
    }
  }, [activeRoom]);

  useEffect(() => {
    if (!activeRoom) {
      return;
    }

    let active = true;

    setTypingUsers([]);
    setIsMessagesLoading(true);
    setMessages([]);

    const loadMessages = async () => {
      try {
        const data = await apiRequest<ChatMessage[]>(`/community/chat-rooms/${activeRoom}/messages`);
        if (!active) {
          return;
        }
        setMessages(data);
        setError(null);
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(requestError instanceof ApiError ? requestError.message : CHAT_PAGE_COPY.loadMessagesError);
      } finally {
        if (active) {
          setIsMessagesLoading(false);
        }
      }
    };

    void loadMessages();

    let reconnectTimeoutId: number | null = null;
    const connect = () => {
      if (!active) return;
      const ws = new WebSocket(getWebSocketUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected to room:", activeRoom);
        ws.send(JSON.stringify({ type: "SUBSCRIBE", roomSlug: activeRoom }));
        ws.send(JSON.stringify({ type: "READ", roomSlug: activeRoom }));
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.roomSlug !== activeRoom) return;

          switch (response.type) {
            case "ONLINE_COUNT":
              const onlineData = response.data as { onlineCount: number };
              setOnlineCount(onlineData.onlineCount);
              break;
            case "NEW_MESSAGE":
              const newMsg = response.data as ChatMessage;
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              setLastReadTimes((prev) => {
                const nowStr = new Date().toISOString();
                const next = { ...prev, [activeRoom]: nowStr };
                localStorage.setItem("chat_last_read_times", JSON.stringify(next));
                return next;
              });
              break;
            case "ROOM_PIN_UPDATE":
              const updatedRoom = response.data as ChatRoom;
              setRooms((prev) => prev.map((r) => r.slug === updatedRoom.slug ? {
                ...r,
                pinnedMessageId: updatedRoom.pinnedMessageId,
                pinnedMessageAuthor: updatedRoom.pinnedMessageAuthor,
                pinnedMessageContent: updatedRoom.pinnedMessageContent
              } : r));
              break;
            case "ROOM_INFO_UPDATE":
              const updatedInfoRoom = response.data as ChatRoom;
              setRooms((prev) => prev.map((r) => r.slug === updatedInfoRoom.slug ? {
                ...r,
                name: updatedInfoRoom.name,
                description: updatedInfoRoom.description
              } : r));
              break;
            case "MESSAGE_REACTION":
              const updatedMsg = response.data as ChatMessage;
              setMessages((prev) => {
                return prev.map((m) => m.id === updatedMsg.id ? updatedMsg : m);
              });
              break;
            case "TYPING_STATUS":
              const typingData = response.data as { userId: string; username: string; isTyping: boolean };
              setTypingUsers((prev) => {
                if (typingData.isTyping) {
                  if (prev.includes(typingData.username)) return prev;
                  return [...prev, typingData.username];
                } else {
                  return prev.filter((u) => u !== typingData.username);
                }
              });
              break;
            default:
              break;
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed, clean =", event.wasClean, "code =", event.code);
        if (active) {
          reconnectTimeoutId = window.setTimeout(() => connect(), 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket connection error:", error);
      };
    };

    connect();

    return () => {
      active = false;
      if (reconnectTimeoutId) window.clearTimeout(reconnectTimeoutId);
      if (wsRef.current) wsRef.current.close();
    };
  }, [activeRoom]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const activeRoomMeta = rooms.find((room) => room.slug === activeRoom);

  const hashtags = useMemo(() => {
    const tags = new Set<string>();
    rooms.forEach(room => {
      const text = `${room.name} ${room.description}`;
      const matches = text.match(/#[\w\d-]+/g);
      if (matches) {
        matches.forEach(tag => tags.add(tag.toLowerCase()));
      }
    });
    return Array.from(tags);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    let list = rooms;
    if (selectedHashtag) {
      list = rooms.filter(room => {
        const text = `${room.name} ${room.description}`.toLowerCase();
        return text.includes(selectedHashtag.toLowerCase());
      });
    }
    return [...list].sort((a, b) => {
      if (a.slug === "crew-bot") return -1;
      if (b.slug === "crew-bot") return 1;
      return 0;
    });
  }, [rooms, selectedHashtag]);

  const handlePinMessage = async (messageId: number | string) => {
    if (!activeRoom) return;
    try {
      const updatedRoom = await apiRequest<ChatRoom>(`/community/chat-rooms/${activeRoom}/pin/${messageId}`, {
        method: "POST"
      });
      setRooms((current) => current.map((r) => r.slug === updatedRoom.slug ? updatedRoom : r));
      toast.success("Đã ghim tin nhắn này.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Ghim tin nhắn thất bại.");
    }
  };

  const handleUnpinMessage = async () => {
    if (!activeRoom) return;
    try {
      const updatedRoom = await apiRequest<ChatRoom>(`/community/chat-rooms/${activeRoom}/unpin`, {
        method: "POST"
      });
      setRooms((current) => current.map((r) => r.slug === updatedRoom.slug ? updatedRoom : r));
      toast.success("Đã bỏ ghim tin nhắn.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Bỏ ghim thất bại.");
    }
  };
  const combinedMessages = useMemo(() => {
    const local = localMessages[activeRoom] ?? [];

    return [...messages, ...local].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [activeRoom, localMessages, messages]);

  const prevMsgLengthRef = useRef(combinedMessages.length);
  const prevRoomRef = useRef(activeRoom);
  const prevLoadingRef = useRef(isMessagesLoading);

  useEffect(() => {
    const lengthChanged = combinedMessages.length > prevMsgLengthRef.current;
    const roomChanged = activeRoom !== prevRoomRef.current;
    const loadingFinished = !isMessagesLoading && prevLoadingRef.current;

    if (roomChanged || lengthChanged || loadingFinished) {
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, 60);
    }

    prevMsgLengthRef.current = combinedMessages.length;
    prevRoomRef.current = activeRoom;
    prevLoadingRef.current = isMessagesLoading;
  }, [combinedMessages.length, activeRoom, isMessagesLoading]);

  const clearDrafts = () => {
    if (imageDraft?.url) {
      URL.revokeObjectURL(imageDraft.url);
    }

    if (audioDraft?.url) {
      URL.revokeObjectURL(audioDraft.url);
    }

    setImageDraft(null);
    setAudioDraft(null);
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (imageDraft?.url) {
      URL.revokeObjectURL(imageDraft.url);
    }

    setImageDraft({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!user) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng kéo thả file hình ảnh.");
      return;
    }

    if (imageDraft?.url) {
      URL.revokeObjectURL(imageDraft.url);
    }

    setImageDraft({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    });
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        if (audioDraft?.url) {
          URL.revokeObjectURL(audioDraft.url);
        }

        setAudioDraft({
          url: URL.createObjectURL(blob),
          name: `ghi-am-${Date.now()}.webm`,
          blob,
        });
      });

      recorder.start();
      setIsRecording(true);
      setError(null);
    } catch {
      setError(CHAT_PAGE_COPY.recordError);
    }
  };

  const handleSend = async () => {
    if (!user || !activeRoom || (!message.trim() && !imageDraft && !audioDraft) || isSending) {
      return;
    }

    const trimmed = message.trim();
    const fallbackSummary = createAttachmentSummary(imageDraft, audioDraft);
    const content = trimmed || fallbackSummary;

    // Backup current text and attachments in case of request failure
    const backupMessage = message;
    const backupImageDraft = imageDraft;
    const backupAudioDraft = audioDraft;

    setIsSending(true);
    // Clear input field and drafts immediately for instant visual response
    setMessage("");
    setImageDraft(null);
    setAudioDraft(null);

    try {
      let uploadedImageUrl: string | null = null;
      let uploadedAudioUrl: string | null = null;
      let uploadedAudioName: string | null = null;

      if (backupImageDraft) {
        const formData = new FormData();
        formData.append("file", backupImageDraft.file);
        const uploadRes = await apiRequest<{ url: string }>("/media/upload", {
          method: "POST",
          body: formData,
        });
        uploadedImageUrl = uploadRes.url;
      }

      if (backupAudioDraft) {
        const formData = new FormData();
        formData.append("file", new File([backupAudioDraft.blob], backupAudioDraft.name, { type: "audio/webm" }));
        const uploadRes = await apiRequest<{ url: string }>("/media/upload", {
          method: "POST",
          body: formData,
        });
        uploadedAudioUrl = uploadRes.url;
        uploadedAudioName = backupAudioDraft.name;
      }

      const nextMessages = await apiRequest<ChatMessage[]>(`/community/chat-rooms/${activeRoom}/messages`, {
        method: "POST",
        body: JSON.stringify({
          content,
          imageUrl: uploadedImageUrl,
          audioUrl: uploadedAudioUrl,
          audioName: uploadedAudioName,
        }),
      });

      setMessages(nextMessages);
      setLastReadTimes((prev) => {
        const nowStr = new Date().toISOString();
        const next = { ...prev, [activeRoom]: nowStr };
        localStorage.setItem("chat_last_read_times", JSON.stringify(next));
        return next;
      });
      setError(null);

      // Reset typing status on send
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      setIsCurrentUserTyping(false);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "TYPING",
          roomSlug: activeRoom,
          content: "false"
        }));
      }
    } catch (requestError) {
      // Restore the backup text and drafts if the request fails
      setMessage(backupMessage);
      setImageDraft(backupImageDraft);
      setAudioDraft(backupAudioDraft);
      setError(requestError instanceof ApiError ? requestError.message : CHAT_PAGE_COPY.sendError);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageChange = (val: string) => {
    setMessage(val);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (!isCurrentUserTyping) {
        setIsCurrentUserTyping(true);
        wsRef.current.send(JSON.stringify({
          type: "TYPING",
          roomSlug: activeRoom,
          content: "true"
        }));
      }

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsCurrentUserTyping(false);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "TYPING",
            roomSlug: activeRoom,
            content: "false"
          }));
        }
      }, 2000);
    }
  };

  const filteredStickers = useMemo(() => {
    return stickersList
      .filter((item) => item.type === "STICKER")
      .filter((item) => {
        const matchCategory = stickerGifCategory === "all" || item.category === stickerGifCategory;
        const matchSearch =
          stickerGifSearch.trim() === "" ||
          item.name.toLowerCase().includes(stickerGifSearch.toLowerCase()) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(stickerGifSearch.toLowerCase()));
        return matchCategory && matchSearch;
      });
  }, [stickersList, stickerGifSearch, stickerGifCategory]);

  const filteredGifs = useMemo(() => {
    return stickersList
      .filter((item) => item.type === "GIF")
      .filter((item) => {
        const matchCategory = stickerGifCategory === "all" || item.category === stickerGifCategory;
        const matchSearch =
          stickerGifSearch.trim() === "" ||
          item.name.toLowerCase().includes(stickerGifSearch.toLowerCase()) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(stickerGifSearch.toLowerCase()));
        return matchCategory && matchSearch;
      });
  }, [stickersList, stickerGifSearch, stickerGifCategory]);

  const pickerCategories = [
    { id: "all", label: "Tất cả" },
    { id: "study", label: "📚 Học tập" },
    { id: "motivation", label: "🔥 Động lực" },
    { id: "emotion", label: "🥺 Cảm xúc" },
    { id: "funny", label: "😂 Vui nhộn" },
    { id: "congrats", label: "🎉 Chúc mừng" },
  ];

  return (
    <div className={isMaximized ? "" : "min-h-screen pb-16 pt-8"}>
      <div className={isMaximized ? "" : "container mx-auto px-4 lg:max-w-[1400px]"}>
        <section
          className={
            isMaximized
              ? "fixed inset-0 z-[100] w-screen h-screen rounded-none bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-4 shadow-card md:p-5"
              : "rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-5 shadow-card md:p-6"
          }
        >
          <div className={isMaximized ? "grid h-full gap-5 lg:grid-cols-[340px_minmax(0,1fr)]" : "grid h-[760px] gap-5 lg:grid-cols-[340px_minmax(0,1fr)]"}>
            <aside className="flex flex-col h-full overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,248,252,0.94)_0%,rgba(247,243,255,0.94)_100%)] p-4 shadow-soft backdrop-blur">
              <div className="border-b border-border/70 px-2 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{CHAT_PAGE_COPY.eyebrow}</p>
                <h1 className="mt-2 font-heading text-3xl font-bold">{CHAT_PAGE_COPY.title}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{CHAT_PAGE_COPY.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[1.3rem] border border-white/70 bg-white/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{CHAT_PAGE_COPY.pollingLabel}</p>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>

              {user && (
                <Button
                  onClick={() => setCreateRoomOpen(true)}
                  className="mt-4 w-full rounded-[1.3rem] gradient-primary text-primary-foreground py-2 text-xs font-bold shadow-soft flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tạo phòng chat mới
                </Button>
              )}

              {/* Hashtag Filters */}
              {hashtags.length > 0 && (
                <div className="mt-4 border-b border-border/70 pb-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">🏷️ Chủ đề chuyên đề</p>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1" style={{ overscrollBehaviorY: "contain" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedHashtag(null)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedHashtag === null
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-white/70 hover:bg-white text-muted-foreground hover:text-foreground border border-white/40"
                      }`}
                    >
                      Tất cả
                    </button>
                    {hashtags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedHashtag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          selectedHashtag === tag
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "bg-white/70 hover:bg-white text-muted-foreground hover:text-foreground border border-white/40"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1" style={{ overscrollBehaviorY: "contain" }}>
                {invitations.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary px-1">
                      Lời mời đang chờ ({invitations.length})
                    </p>
                    {invitations.map((room) => (
                      <div
                        key={room.slug}
                        className="rounded-[1.5rem] p-4 bg-amber-50/50 border border-amber-100/70 shadow-soft"
                      >
                        <p className="font-semibold text-foreground text-sm">{room.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{room.description}</p>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptInvite(room.slug)}
                            className="bg-primary text-white text-xs px-2 py-1 h-7 rounded-lg hover:bg-primary/90 flex-1"
                          >
                            Đồng ý
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectInvite(room.slug)}
                            className="bg-transparent border-red-200 text-red-600 text-xs px-2 py-1 h-7 rounded-lg hover:bg-red-50 hover:text-red-700 flex-1"
                          >
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {isRoomsLoading ? (
                    [1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-full rounded-[1.5rem] p-4 bg-background/76 animate-pulse space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="h-4 bg-muted-foreground/15 rounded-full w-24"></div>
                          <div className="h-5 bg-muted-foreground/15 rounded-full w-8"></div>
                        </div>
                        <div className="h-3 bg-muted-foreground/15 rounded-full w-full"></div>
                        <div className="h-3 bg-muted-foreground/15 rounded-full w-5/6"></div>
                      </div>
                    ))
                  ) : (
                    filteredRooms.map((room) => {
                      const isCrewBot = room.slug === "crew-bot";
                      const lastRead = lastReadTimes[room.slug];
                      const hasUnread = room.lastMessageTime && (!lastRead || new Date(room.lastMessageTime) > new Date(lastRead)) && room.slug !== activeRoom;

                      return (
                        <motion.button
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          key={room.slug}
                          onClick={() => setActiveRoom(room.slug)}
                          className={`w-full rounded-[1.5rem] p-4 text-left transition-all ${
                            room.slug === activeRoom
                              ? "bg-[linear-gradient(135deg,rgba(196,110,255,0.16)_0%,rgba(255,255,255,0.92)_100%)] shadow-soft border border-primary/20"
                              : isCrewBot
                                ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(196,110,255,0.06)_100%)] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(196,110,255,0.1)_100%)] border border-primary/10"
                                : "bg-background/76 hover:bg-background border border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`font-semibold ${hasUnread ? "text-foreground font-bold" : "text-foreground/90"}`}>{room.name}</p>
                                {isCrewBot ? (
                                  <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-semibold text-primary">
                                    {CHAT_PAGE_COPY.crewBotLabel}
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground truncate w-full pr-2">
                                {room.lastMessageContent ? (
                                  <span>{room.lastMessageContent}</span>
                                ) : (
                                  room.description
                                )}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 justify-center h-full">
                              {room.lastMessageTime ? (
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                  {new Date(room.lastMessageTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">Mới</span>
                              )}
                              {hasUnread && (
                                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(196,110,255,0.8)]" />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </aside>

            <section
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(249,247,255,0.88)_100%)] shadow-soft backdrop-blur"
            >
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-primary/20 backdrop-blur-md border-4 border-dashed border-primary m-2 rounded-[1.8rem] pointer-events-none"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex flex-col items-center justify-center p-6 bg-white/90 rounded-2xl shadow-xl"
                    >
                      <ImagePlus className="h-12 w-12 text-primary mb-2" />
                      <p className="font-bold text-primary text-base">Thả ảnh vào đây để gửi</p>
                      <p className="text-xs text-muted-foreground mt-1">Chấp nhận tệp hình ảnh</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="border-b border-border/70 px-5 py-4 md:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-2xl font-bold">{activeRoomMeta?.name ?? "Chọn một nhóm chat"}</h2>
                      {activeRoomMeta?.slug === "crew-bot" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          <Sparkles className="h-3.5 w-3.5" />
                          {CHAT_PAGE_COPY.crewBotLabel}
                        </span>
                      ) : null}
                      {activeRoomMeta && activeRoomMeta.slug !== "crew-bot" && (
                        <div className="flex flex-wrap gap-2 mt-1 items-center">
                          {user && activeRoomMeta.ownerId === user.id ? (
                            <>
                              <Button
                                onClick={() => {
                                  setEditRoomName(activeRoomMeta.name);
                                  setEditRoomDesc(activeRoomMeta.description);
                                  setEditRoomOpen(true);
                                }}
                                size="sm"
                                variant="outline"
                                className="rounded-full h-9 px-4 text-sm flex items-center gap-1.5 border-border bg-white text-foreground hover:bg-muted font-semibold shadow-sm transition-all active:scale-95"
                              >
                                <Settings className="h-4 w-4" />
                                Cài đặt nhóm
                              </Button>
                              <Button
                                onClick={() => setInviteOpen(true)}
                                size="sm"
                                variant="outline"
                                className="rounded-full h-9 px-4 text-sm flex items-center gap-1.5 border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white font-semibold shadow-sm transition-all active:scale-95"
                              >
                                <UserPlus className="h-4 w-4" />
                                Mời bạn bè
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={handleLeaveRoomClick}
                              size="sm"
                              variant="outline"
                              className="rounded-full h-9 px-4 text-sm flex items-center gap-1.5 border-red-200 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white font-semibold shadow-sm transition-all active:scale-95 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Rời nhóm
                            </Button>
                          )}
                          <Button
                            onClick={() => setShowMembersPanel(prev => !prev)}
                            size="sm"
                            variant="outline"
                            className={`rounded-full h-9 px-4 text-sm flex items-center gap-1.5 border-border font-semibold shadow-sm transition-all active:scale-95 ${
                              showMembersPanel ? "bg-primary text-white hover:bg-primary/90" : "bg-white text-foreground hover:bg-muted"
                            }`}
                          >
                            <Users className="h-4 w-4" />
                            Thành viên ({members.filter(m => m.status === "ACTIVE").length})
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{activeRoomMeta?.description ?? "Trao đổi nhẹ nhàng, tôn trọng và an toàn."}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {activeRoomMeta?.slug === "crew-bot" ? (
                      <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-600 flex items-center gap-1.5 shadow-sm h-9">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Trợ lý AI đang hoạt động
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowMembersPanel((prev) => !prev)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm h-9 ${
                          onlineCount > 0
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${onlineCount > 0 ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                        {onlineCount} thành viên trực tuyến
                      </button>
                    )}

                    {activeRoomMeta && (
                       <Button
                        onClick={() => setIsMaximized((prev) => !prev)}
                        size="sm"
                        variant="outline"
                        className="rounded-full h-9 w-9 p-0 flex items-center justify-center border-border bg-white text-foreground hover:bg-muted shadow-sm transition-all active:scale-95"
                        title={isMaximized ? "Thu nhỏ" : "Phóng to toàn màn hình"}
                      >
                        {isMaximized ? <Minimize2 className="h-4 w-4 text-muted-foreground" /> : <Maximize2 className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {error ? <div className="mx-5 mt-4 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive md:mx-6">{error}</div> : null}

              <div className="flex flex-1 overflow-hidden relative w-full h-full">
                <div className="flex flex-1 flex-col overflow-hidden h-full">

              {activeRoomMeta?.pinnedMessageId && (
                <div className="bg-mint/15 border-b border-mint/20 px-5 py-3 md:px-6 flex items-center justify-between gap-4 text-sm relative z-30">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-base flex-shrink-0 mt-0.5">📌</span>
                    <div className="min-w-0">
                      <p className="font-bold text-mint-foreground text-[10px] tracking-wider leading-none">TIN GHIM</p>
                      <p className="font-semibold text-foreground/80 mt-1 truncate">
                        {activeRoomMeta.pinnedMessageAuthor}: <span className="font-normal text-muted-foreground">{activeRoomMeta.pinnedMessageContent}</span>
                      </p>
                    </div>
                  </div>
                  {(user?.isAdmin || (user && activeRoomMeta.ownerId === user.id)) && (
                    <button
                      onClick={() => void handleUnpinMessage()}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline transition-colors flex-shrink-0"
                    >
                      Bỏ ghim
                    </button>
                  )}
                </div>
              )}

              <div ref={messageContainerRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6" style={{ overscrollBehaviorY: "contain" }}>
                {isMessagesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => {
                      const isOwn = i % 2 === 0;
                      return (
                        <div key={i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] w-64 rounded-[1.6rem] px-4 py-3 bg-background/88 animate-pulse space-y-2 ${isOwn ? "bg-primary/20" : ""}`}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 bg-muted-foreground/15 rounded-full w-16"></div>
                              <div className="h-2.5 bg-muted-foreground/15 rounded-full w-8 ml-auto"></div>
                            </div>
                            <div className="h-4 bg-muted-foreground/15 rounded-full w-full"></div>
                            <div className="h-4 bg-muted-foreground/15 rounded-full w-4/5"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : combinedMessages.length === 0 ? (
                  <div className="rounded-[1.6rem] border border-dashed border-border/70 bg-background/55 p-6 text-sm text-muted-foreground">
                    {CHAT_PAGE_COPY.empty}
                  </div>
                ) : (
                  combinedMessages.map((entry) => {
                    if (entry.isSystem) {
                      return (
                        <div key={entry.id} className="flex justify-center my-3 w-full">
                          <span className="bg-muted/40 text-muted-foreground text-xs px-4 py-1.5 rounded-full border border-border/40 italic font-medium shadow-sm">
                            {entry.content}
                          </span>
                        </div>
                      );
                    }

                    const isOwn = user && entry.authorId === user.id;

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={() => setActiveReactionMessageId(current => current === entry.id ? null : entry.id)}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"} group relative mb-2 cursor-pointer`}
                      >
                        {user && (
                          <div className={`absolute -top-8 z-20 flex items-center gap-1 bg-white/95 shadow-lg border border-border px-2 py-1 rounded-full transition-all duration-200 ${
                            isOwn ? "right-2" : "left-2"
                          } ${
                            activeReactionMessageId === entry.id
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                          }`}>
                            {["👍", "❤️", "😂", "😢", "😮", "🙏"].map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleToggleReaction(entry.id, emoji);
                                  setActiveReactionMessageId(null);
                                }}
                                className="hover:scale-125 transition-transform duration-150 text-base leading-none p-1"
                              >
                                {emoji}
                              </button>
                            ))}
                            {(user?.isAdmin || (user && activeRoomMeta?.ownerId === user.id)) && (
                              <>
                                <div className="w-[1px] h-4 bg-border mx-1" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    void handlePinMessage(entry.id);
                                    setActiveReactionMessageId(null);
                                  }}
                                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                                  title="Ghim tin nhắn"
                                >
                                  <Pin className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        <div
                          className={`max-w-[84%] rounded-[1.6rem] px-4 py-3 shadow-soft ${
                            isOwn ? "bg-primary text-primary-foreground" : "bg-background/88"
                          }`}
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <p className={`text-[15px] font-semibold ${isOwn ? "text-primary-foreground" : getUserNameColor(entry.authorRole, entry.authorXp)}`}>
                              {entry.author}
                            </p>
                            {entry.authorXp !== undefined && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isOwn ? "bg-white/20 text-white" : "bg-muted/80 text-muted-foreground"}`}>
                                Lv.{calculateUserLevel(entry.authorXp ?? 0)}
                              </span>
                            )}
                            {!isOwn && entry.authorXp !== undefined && entry.authorStreak !== undefined && (() => {
                              const badge = getUserBadge(entry.authorXp ?? 0, entry.authorStreak ?? 0, entry.authorRole);
                              return badge ? (
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${badge.color}`}>
                                  {badge.title}
                                </span>
                              ) : null;
                            })()}
                            <span className={`text-xs ml-auto ${isOwn ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{formatTime(entry.createdAt)}</span>
                          </div>

                          {entry.content ? (
                            entry.content.startsWith("[GIF]") || entry.content.startsWith("[STICKER]") ? (
                              <img
                                src={entry.content.substring(entry.content.indexOf(" ") + 1)}
                                alt="sticker/gif"
                                className="max-h-48 max-w-48 object-contain rounded-xl mt-1"
                              />
                            ) : (
                              <div className={`text-base leading-6 ${isOwn ? "text-primary-foreground" : "text-foreground/84"}`}>
                                {formatMessageContent(entry.content)}
                              </div>
                            )
                          ) : null}

                          {entry.imageUrl ? (
                            <img
                              src={entry.imageUrl}
                              alt="Ảnh đã gửi"
                              className="mt-3 max-h-72 w-full rounded-[1.2rem] object-cover"
                            />
                          ) : null}

                          {entry.audioUrl ? (
                            <div className={`mt-3 rounded-[1.1rem] px-3 py-3 ${isOwn ? "bg-white/12" : "bg-muted/55"}`}>
                              <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                                <Volume2 className="h-3.5 w-3.5" />
                                {entry.audioName ?? CHAT_PAGE_COPY.attachmentAudio}
                              </div>
                              <audio controls src={entry.audioUrl} className="w-full" />
                            </div>
                          ) : null}

                          {entry.reactions && entry.reactions.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {(() => {
                                const grouped = entry.reactions.reduce((acc, curr) => {
                                  acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
                                  return acc;
                                }, {} as Record<string, number>);

                                return (Object.entries(grouped) as [string, number][]).map(([emoji, count]) => {
                                  const hasReacted = !!(user && entry.reactions?.some((r) => r.userId === user.id && r.emoji === emoji));
                                  return (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        void handleToggleReaction(entry.id, emoji);
                                      }}
                                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition-all ${
                                        hasReacted
                                          ? isOwn
                                            ? "bg-white/20 border-white/40 text-white scale-105"
                                            : "bg-primary/10 border-primary/30 text-primary scale-105"
                                          : isOwn
                                            ? "bg-white/10 border-white/20 text-white/90 hover:bg-white/15"
                                            : "bg-background/80 border-border hover:bg-background"
                                      }`}
                                    >
                                      <span>{emoji}</span>
                                      {count > 1 && <span className="font-semibold text-[10px]">{count}</span>}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}

                {typingUsers.length > 0 && (
                  <div className="text-sm text-muted-foreground italic flex items-center gap-1.5 animate-pulse mt-2 pl-4">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                    {typingUsers.join(", ")} đang soạn tin nhắn...
                  </div>
                )}

                {isSending && activeRoom === "crew-bot" && (
                  <div className="text-sm text-muted-foreground italic flex items-center gap-2 mt-2 pl-4">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>crewBot đang suy nghĩ câu trả lời...</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border/70 px-5 py-4 md:px-6">
                {imageDraft || audioDraft ? (
                  <div className="mb-3 flex flex-wrap items-center gap-3 rounded-[1.4rem] border border-white/75 bg-background/76 px-4 py-3">
                    {imageDraft ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{imageDraft.name}</span> : null}
                    {audioDraft ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{audioDraft.name}</span> : null}
                    <button type="button" onClick={clearDrafts} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                      {CHAT_PAGE_COPY.clearAttachment}
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3">
                  {gifPanelOpen && (
                    <div className="mb-1 rounded-[1.6rem] border border-white/80 bg-background/95 p-4 shadow-lg backdrop-blur flex flex-col h-[380px]">
                      <div className="flex flex-col gap-3 pb-2 border-b mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setGifTab("stickers")}
                              className={`text-sm font-bold pb-1 transition-all ${gifTab === "stickers" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                            >
                              Nhãn dán
                            </button>
                            <button
                              type="button"
                              onClick={() => setGifTab("gifs")}
                              className={`text-sm font-bold pb-1 transition-all ${gifTab === "gifs" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                            >
                              Ảnh động (GIF)
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setGifPanelOpen(false)}
                            className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                          >
                            Đóng
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder={gifTab === "stickers" ? "Tìm nhãn dán..." : "Tìm ảnh động GIF..."}
                            value={stickerGifSearch}
                            onChange={(e) => setStickerGifSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-white/80 bg-background/50 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
                          />
                        </div>

                        {/* Category Selector Tabs */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {pickerCategories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setStickerGifCategory(cat.id)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                                stickerGifCategory === cat.id
                                  ? "bg-primary text-white border-primary shadow-sm"
                                  : "bg-white/70 hover:bg-white text-muted-foreground hover:text-foreground border-white/40"
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0" style={{ overscrollBehaviorY: "contain" }}>
                        {gifTab === "stickers" ? (
                          filteredStickers.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-8">Không tìm thấy nhãn dán phù hợp.</p>
                          ) : (
                            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 p-1">
                              {filteredStickers.map((st) => (
                                <button
                                  key={st.url}
                                  type="button"
                                  onClick={() => void handleSendStickerOrGif(st.url, "STICKER")}
                                  className="hover:scale-110 hover:shadow-sm active:scale-95 transition-all p-2 bg-background/50 rounded-xl border border-border hover:border-primary/20 flex items-center justify-center"
                                  title={st.name}
                                >
                                  <img src={st.url} alt={st.name} className="h-10 w-10 object-contain" />
                                </button>
                              ))}
                            </div>
                          )
                        ) : (
                          filteredGifs.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-8">Không tìm thấy ảnh động phù hợp.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-1">
                              {filteredGifs.map((gf) => (
                                <button
                                  key={gf.url}
                                  type="button"
                                  onClick={() => void handleSendStickerOrGif(gf.url, "GIF")}
                                  className="hover:scale-[1.03] hover:shadow-md active:scale-98 transition-all overflow-hidden rounded-xl border border-border hover:border-primary/20 bg-background/50 flex flex-col group h-auto"
                                  title={gf.name}
                                >
                                  <img src={gf.url} alt={gf.name} className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                  <p className="text-[10px] text-center py-1 text-muted-foreground font-semibold truncate w-full px-1.5 bg-white/40 border-t border-border/30">{gf.name}</p>
                                </button>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <Textarea
                    value={message}
                    onChange={(event) => handleMessageChange(event.target.value)}
                    placeholder={user ? CHAT_PAGE_COPY.inputPlaceholder : CHAT_PAGE_COPY.loginPlaceholder}
                    className="min-h-[96px] resize-none rounded-[1.4rem] bg-background/68 text-base"
                    disabled={!user || isSending}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                      <Button type="button" variant="outline" className="rounded-full" disabled={!user || isSending} onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        {CHAT_PAGE_COPY.imageAction}
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full" disabled={!user || isSending} onClick={() => void handleRecordToggle()}>
                        {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {isRecording ? CHAT_PAGE_COPY.stopAudioAction : CHAT_PAGE_COPY.audioAction}
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full" disabled={!user || isSending} onClick={() => setGifPanelOpen(prev => !prev)}>
                        <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                        Nhãn dán/GIF
                      </Button>
                    </div>

                    <Button onClick={() => void handleSend()} disabled={!user || isSending || (!message.trim() && !imageDraft && !audioDraft)} className="rounded-full gradient-primary text-primary-foreground">
                      {isSending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isSending ? "Đang gửi..." : CHAT_PAGE_COPY.sendAction}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Members Sidebar Panel */}
              {showMembersPanel && activeRoomMeta && activeRoomMeta.slug !== "crew-bot" && (
                <div className="w-80 border-l border-border/70 bg-white/40 backdrop-blur-md flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                  <div className="px-4 py-4 border-b border-border/70 flex items-center justify-between flex-shrink-0">
                    <p className="font-semibold text-foreground flex items-center gap-1.5 text-base">
                      <Users className="h-4 w-4 text-primary" />
                      Thành viên nhóm ({members.filter(m => m.status === "ACTIVE").length})
                    </p>
                    <button
                      onClick={() => setShowMembersPanel(false)}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Đóng
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overscrollBehaviorY: "contain" }}>
                    {isMembersLoading ? (
                      <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-muted-foreground/15 rounded-full" />
                            <div className="space-y-1.5 flex-1">
                              <div className="h-3 bg-muted-foreground/15 rounded-full w-24" />
                              <div className="h-2.5 bg-muted-foreground/15 rounded-full w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      members.map((member) => {
                        const isMemberOwner = member.role === "OWNER";
                        const isMemberPending = member.status === "PENDING";
                        const badge = getUserBadge(member.xp, 0, member.userRole);

                        return (
                          <div key={member.userId} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-10 w-10 border border-white/70 shadow-sm flex-shrink-0">
                                <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(member.username)} text-sm font-bold text-foreground`}>
                                  {getInitials(member.username)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className={`text-[15px] font-semibold truncate ${getUserNameColor(member.userRole, member.xp)}`}>
                                    {member.username}
                                  </p>
                                  {isMemberOwner ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white leading-none">
                                      Trưởng nhóm
                                    </span>
                                  ) : isMemberPending ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 leading-none">
                                      Đang chờ
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                  <span className="text-[11px] text-muted-foreground font-semibold">
                                    Lv.{calculateUserLevel(member.xp)}
                                  </span>
                                  {badge && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded leading-none ${badge.color}`}>
                                      {badge.title.replace(/🎓|🔥|✨/, "").trim()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Owner kick controls */}
                            {user && activeRoomMeta.ownerId === user.id && member.userId !== user.id && (
                              <button
                                onClick={() => handleKickMemberClick(member.userId, member.username)}
                                className="rounded-full border border-red-200 bg-red-50/50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-semibold px-2.5 py-1.5 flex items-center gap-1 transition-all active:scale-95 flex-shrink-0 shadow-sm"
                                title="Mời thành viên ra khỏi nhóm"
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                                Mời ra
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Close row wrapper */}
              </div>
            </section>
          </div>
        </section>
      </div>
      <AnimatePresence>
        {createRoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,248,252,0.98)_0%,rgba(247,243,255,0.98)_100%)] p-6 shadow-card"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Tạo nhóm chat mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên nhóm</label>
                  <input
                    type="text"
                    placeholder="Nhập tên nhóm..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Mô tả</label>
                  <Textarea
                    placeholder="Mô tả mục đích nhóm chat..."
                    value={newRoomDesc}
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary min-h-24 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Gợi ý chủ đề (Click để thêm hashtag vào mô tả)</label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {["#ap-luc-thi-cu", "#cam-xuc-tuoi-day-thi", "#giai-dap-gioi-tinh", "#tinh-ban-tuoi-teen", "#chia-se-hoc-tap"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!newRoomDesc.includes(tag)) {
                            setNewRoomDesc((current) => current ? `${current} ${tag}` : tag);
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-[11px] font-semibold text-primary border border-white/50 transition-all shadow-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  onClick={() => setCreateRoomOpen(false)}
                  variant="outline"
                  className="rounded-full px-5"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => void handleCreateRoom()}
                  disabled={isCreatingRoom || !newRoomName.trim() || !newRoomDesc.trim()}
                  className="rounded-full gradient-primary text-primary-foreground px-5"
                >
                  Tạo nhóm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,248,252,0.98)_0%,rgba(247,243,255,0.98)_100%)] p-6 shadow-card"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Mời bạn bè tham gia
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Nhập tên đăng nhập (Username) của người bạn muốn mời vào nhóm chat này.
              </p>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên đăng nhập (Username)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: nguyenkhoa..."
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  onClick={() => setInviteOpen(false)}
                  variant="outline"
                  className="rounded-full px-5"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => void handleInviteMember()}
                  disabled={isInviting || !inviteUsername.trim()}
                  className="rounded-full gradient-primary text-primary-foreground px-5"
                >
                  Gửi lời mời
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editRoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,248,252,0.98)_0%,rgba(247,243,255,0.98)_100%)] p-6 shadow-card"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Cài đặt nhóm chat</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tên nhóm</label>
                  <input
                    type="text"
                    placeholder="Nhập tên nhóm..."
                    value={editRoomName}
                    onChange={(e) => setEditRoomName(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Mô tả</label>
                  <Textarea
                    placeholder="Mô tả mục đích nhóm chat..."
                    value={editRoomDesc}
                    onChange={(e) => setEditRoomDesc(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary min-h-24 resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  onClick={() => setEditRoomOpen(false)}
                  variant="outline"
                  className="rounded-full px-5"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => void handleUpdateRoom()}
                  disabled={isEditingRoom || !editRoomName.trim() || !editRoomDesc.trim()}
                  className="rounded-full gradient-primary text-primary-foreground px-5"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmType !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,248,252,0.98)_0%,rgba(247,243,255,0.98)_100%)] p-6 shadow-card"
            >
              <h3 className="font-heading text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                ⚠️ Xác nhận hành động
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {confirmType === "leave"
                  ? "Bạn có chắc chắn muốn rời khỏi nhóm chat này không? Bạn sẽ không nhận được tin nhắn mới từ nhóm này nữa."
                  : `Bạn có chắc chắn muốn mời thành viên "${kickTarget?.name}" ra khỏi nhóm chat này không?`}
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    setConfirmType(null);
                    setKickTarget(null);
                  }}
                  variant="outline"
                  className="rounded-full px-5 h-9 text-xs font-bold"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={() => {
                    if (confirmType === "leave") {
                      void handleLeaveRoomConfirm();
                    } else if (confirmType === "kick") {
                      void handleKickMemberConfirm();
                    }
                  }}
                  className="rounded-full px-5 h-9 text-xs font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-sm"
                >
                  Xác nhận
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
