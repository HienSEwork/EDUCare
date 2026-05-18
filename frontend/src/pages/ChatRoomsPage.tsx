import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Mic, MicOff, Send, Sparkles, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

import { apiRequest, ApiError } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatMessage, ChatRoom } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
};

type ImageDraft = {
  url: string;
  name: string;
};

type AudioDraft = {
  url: string;
  name: string;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
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

export default function ChatRoomsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [imageDraft, setImageDraft] = useState<ImageDraft | null>(null);
  const [audioDraft, setAudioDraft] = useState<AudioDraft | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, LocalAttachmentMessage[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadRooms = async () => {
      try {
        const data = await apiRequest<ChatRoom[]>("/community/chat-rooms");
        if (!active) {
          return;
        }
        setRooms(data);
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
      }
    };

    void loadRooms();
    const intervalId = window.setInterval(() => void loadRooms(), 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!activeRoom) {
      return;
    }

    let active = true;

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
      }
    };

    void loadMessages();
    const intervalId = window.setInterval(() => void loadMessages(), 4000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [activeRoom]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const activeRoomMeta = rooms.find((room) => room.slug === activeRoom);
  const combinedMessages = useMemo(() => {
    const local = localMessages[activeRoom] ?? [];

    return [...messages, ...local].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [activeRoom, localMessages, messages]);

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
    if (!user || !activeRoom || (!message.trim() && !imageDraft && !audioDraft)) {
      return;
    }

    const trimmed = message.trim();
    const fallbackSummary = createAttachmentSummary(imageDraft, audioDraft);
    const content = trimmed || fallbackSummary;

    try {
      const nextMessages = await apiRequest<ChatMessage[]>(`/community/chat-rooms/${activeRoom}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      setMessages(nextMessages);
      setError(null);

      if (imageDraft || audioDraft) {
        const attachmentMessage: LocalAttachmentMessage = {
          id: `local-${Date.now()}`,
          roomSlug: activeRoom,
          author: user.fullName,
          authorId: user.id,
          createdAt: new Date().toISOString(),
          content: trimmed ? "" : fallbackSummary,
          imageUrl: imageDraft?.url ?? null,
          audioUrl: audioDraft?.url ?? null,
          audioName: audioDraft?.name ?? null,
        };

        setLocalMessages((current) => ({
          ...current,
          [activeRoom]: [...(current[activeRoom] ?? []), attachmentMessage],
        }));
      }

      setMessage("");
      setImageDraft(null);
      setAudioDraft(null);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : CHAT_PAGE_COPY.sendError);
    }
  };

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-5 shadow-card md:p-6">
          <div className="grid min-h-[760px] gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,248,252,0.94)_0%,rgba(247,243,255,0.94)_100%)] p-4 shadow-soft backdrop-blur">
              <div className="border-b border-border/70 px-2 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{CHAT_PAGE_COPY.eyebrow}</p>
                <h1 className="mt-2 font-heading text-3xl font-bold">{CHAT_PAGE_COPY.title}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{CHAT_PAGE_COPY.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[1.3rem] border border-white/70 bg-white/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{CHAT_PAGE_COPY.pollingLabel}</p>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="mt-4 space-y-3">
                {rooms.map((room) => {
                  const isCrewBot = room.slug === "crew-bot";

                  return (
                    <button
                      key={room.slug}
                      onClick={() => setActiveRoom(room.slug)}
                      className={`w-full rounded-[1.5rem] p-4 text-left transition-all ${
                        room.slug === activeRoom
                          ? "bg-[linear-gradient(135deg,rgba(196,110,255,0.16)_0%,rgba(255,255,255,0.92)_100%)] shadow-soft"
                          : "bg-background/76 hover:bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{room.name}</p>
                            {isCrewBot ? (
                              <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-semibold text-primary">
                                {CHAT_PAGE_COPY.crewBotLabel}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{room.description}</p>
                        </div>
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary">
                          {room.messageCount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="flex min-h-[640px] flex-col overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(249,247,255,0.88)_100%)] shadow-soft backdrop-blur">
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
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{activeRoomMeta?.description ?? "Trao đổi nhẹ nhàng, tôn trọng và an toàn."}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {combinedMessages.length} tin nhắn
                  </div>
                </div>
              </div>

              {error ? <div className="mx-5 mt-4 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive md:mx-6">{error}</div> : null}

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6">
                {combinedMessages.length === 0 ? (
                  <div className="rounded-[1.6rem] border border-dashed border-border/70 bg-background/55 p-6 text-sm text-muted-foreground">
                    {CHAT_PAGE_COPY.empty}
                  </div>
                ) : null}

                {combinedMessages.map((entry) => {
                  const isOwn = user && entry.authorId === user.id;
                  const isAttachmentMessage = "imageUrl" in entry || "audioUrl" in entry;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[84%] rounded-[1.6rem] px-4 py-3 shadow-soft ${
                          isOwn ? "bg-primary text-primary-foreground" : "bg-background/88"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <p className={`text-sm font-semibold ${isOwn ? "text-primary-foreground" : "text-foreground"}`}>{entry.author}</p>
                          <span className={`text-xs ${isOwn ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{formatTime(entry.createdAt)}</span>
                        </div>

                        {entry.content ? (
                          <p className={`text-sm leading-6 ${isOwn ? "text-primary-foreground" : "text-foreground/84"}`}>{entry.content}</p>
                        ) : null}

                        {isAttachmentMessage && "imageUrl" in entry && entry.imageUrl ? (
                          <img
                            src={entry.imageUrl}
                            alt="Ảnh đã gửi"
                            className="mt-3 max-h-72 w-full rounded-[1.2rem] object-cover"
                          />
                        ) : null}

                        {isAttachmentMessage && "audioUrl" in entry && entry.audioUrl ? (
                          <div className={`mt-3 rounded-[1.1rem] px-3 py-3 ${isOwn ? "bg-white/12" : "bg-muted/55"}`}>
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                              <Volume2 className="h-3.5 w-3.5" />
                              {entry.audioName ?? CHAT_PAGE_COPY.attachmentAudio}
                            </div>
                            <audio controls src={entry.audioUrl} className="w-full" />
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
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
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={user ? CHAT_PAGE_COPY.inputPlaceholder : CHAT_PAGE_COPY.loginPlaceholder}
                    className="min-h-[96px] resize-none rounded-[1.4rem] bg-background/68"
                    disabled={!user}
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
                      <Button type="button" variant="outline" className="rounded-full" disabled={!user} onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        {CHAT_PAGE_COPY.imageAction}
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full" disabled={!user} onClick={() => void handleRecordToggle()}>
                        {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {isRecording ? CHAT_PAGE_COPY.stopAudioAction : CHAT_PAGE_COPY.audioAction}
                      </Button>
                    </div>

                    <Button onClick={() => void handleSend()} disabled={!user || (!message.trim() && !imageDraft && !audioDraft)} className="rounded-full gradient-primary text-primary-foreground">
                      <Send className="mr-2 h-4 w-4" />
                      {CHAT_PAGE_COPY.sendAction}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
