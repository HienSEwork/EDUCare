import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, Share2, Send, EyeOff, Eye, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Reply {
  id: string;
  author: string;
  authorId: string;
  content: string;
  anonymous: boolean;
  likes: number;
  likedBy: string[];
  createdAt: number;
}

interface Post {
  id: string;
  author: string;
  authorId: string;
  content: string;
  anonymous: boolean;
  likes: number;
  likedBy: string[];
  replies: Reply[];
  createdAt: number;
}

const POSTS_KEY = 'educare_community_posts';

function getPosts(): Post[] {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]'); } catch { return []; }
}
function savePosts(posts: Post[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(getPosts);
  const [newPost, setNewPost] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAnon, setReplyAnon] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const updatePosts = useCallback((newPosts: Post[]) => {
    setPosts(newPosts);
    savePosts(newPosts);
  }, []);

  const handlePost = () => {
    if (!user || !newPost.trim()) return;
    const post: Post = {
      id: crypto.randomUUID(),
      author: user.fullName,
      authorId: user.id,
      content: newPost.trim(),
      anonymous,
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: Date.now(),
    };
    updatePosts([post, ...posts]);
    setNewPost('');
    setAnonymous(false);
    toast.success('Đã đăng bài!');
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    updatePosts(posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(user.id);
      return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? p.likedBy.filter(id => id !== user.id) : [...p.likedBy, user.id] };
    }));
  };

  const handleReplyLike = (postId: string, replyId: string) => {
    if (!user) return;
    updatePosts(posts.map(p => {
      if (p.id !== postId) return p;
      return { ...p, replies: p.replies.map(r => {
        if (r.id !== replyId) return r;
        const liked = r.likedBy.includes(user.id);
        return { ...r, likes: liked ? r.likes - 1 : r.likes + 1, likedBy: liked ? r.likedBy.filter(id => id !== user.id) : [...r.likedBy, user.id] };
      })};
    }));
  };

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return;
    const reply: Reply = {
      id: crypto.randomUUID(),
      author: user.fullName,
      authorId: user.id,
      content: replyContent.trim(),
      anonymous: replyAnon,
      likes: 0,
      likedBy: [],
      createdAt: Date.now(),
    };
    updatePosts(posts.map(p => p.id === postId ? { ...p, replies: [...p.replies, reply] } : p));
    setReplyContent('');
    setReplyAnon(false);
    setReplyingTo(null);
    setExpandedReplies(prev => new Set(prev).add(postId));
    toast.success('Đã trả lời!');
  };

  const handleDelete = (postId: string) => {
    updatePosts(posts.filter(p => p.id !== postId));
    toast.success('Đã xóa bài viết');
  };

  const handleDeleteReply = (postId: string, replyId: string) => {
    updatePosts(posts.map(p => p.id === postId ? { ...p, replies: p.replies.filter(r => r.id !== replyId) } : p));
    toast.success('Đã xóa bình luận');
  };

  const handleShare = (post: Post) => {
    const text = `"${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}" - ${post.anonymous ? 'Ẩn danh' : post.author} trên EDUcare`;
    if (navigator.share) {
      navigator.share({ title: 'EDUcare Community', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Đã sao chép nội dung!');
    }
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal/20 text-teal-foreground text-sm font-medium mb-4">💬 Cộng đồng</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Cộng đồng <span className="text-gradient">EDUcare</span></h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Chia sẻ, hỏi đáp và kết nối với bạn bè cùng trang lứa. Hỗ trợ chế độ ẩn danh.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* New Post */}
          {user ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-card rounded-2xl p-6 shadow-card mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {anonymous ? '?' : user.fullName.charAt(0)}
                </div>
                <span className="font-medium text-sm">{anonymous ? 'Ẩn danh' : user.fullName}</span>
              </div>
              <Textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Chia sẻ suy nghĩ, đặt câu hỏi..."
                className="mb-3 resize-none bg-background/50"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setAnonymous(!anonymous)}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors ${anonymous ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {anonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {anonymous ? 'Ẩn danh' : 'Công khai'}
                </button>
                <Button onClick={handlePost} disabled={!newPost.trim()} size="sm" className="gradient-primary text-primary-foreground gap-2">
                  <Send className="w-4 h-4" /> Đăng
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="gradient-card rounded-2xl p-6 shadow-card mb-8 text-center">
              <p className="text-muted-foreground mb-3">Đăng nhập để tham gia cộng đồng</p>
              <Link to="/login"><Button size="sm" className="gradient-primary text-primary-foreground">Đăng nhập</Button></Link>
            </div>
          )}

          {/* Posts */}
          <AnimatePresence>
            {posts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
              </div>
            )}
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="gradient-card rounded-2xl p-6 shadow-card mb-4"
              >
                {/* Post header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lavender/30 flex items-center justify-center font-bold text-lavender-foreground text-sm">
                      {post.anonymous ? '?' : post.author.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{post.anonymous ? 'Ẩn danh' : post.author}</span>
                      <div className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</div>
                    </div>
                  </div>
                  {user && post.authorId === user.id && (
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Post content */}
                <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${user && post.likedBy.includes(user.id) ? 'text-pink-foreground' : 'hover:text-pink-foreground'}`}>
                    <Heart className={`w-4 h-4 ${user && post.likedBy.includes(user.id) ? 'fill-current' : ''}`} />
                    {post.likes > 0 && post.likes}
                  </button>
                  <button onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyContent(''); }} className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.replies.length > 0 && post.replies.length}
                  </button>
                  <button onClick={() => handleShare(post)} className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Replies toggle */}
                {post.replies.length > 0 && (
                  <button onClick={() => toggleReplies(post.id)} className="flex items-center gap-1 text-xs text-primary mt-3 hover:underline">
                    {expandedReplies.has(post.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {expandedReplies.has(post.id) ? 'Ẩn' : 'Xem'} {post.replies.length} bình luận
                  </button>
                )}

                {/* Replies list */}
                <AnimatePresence>
                  {expandedReplies.has(post.id) && post.replies.map(reply => (
                    <motion.div key={reply.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="ml-6 mt-3 pl-4 border-l-2 border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-mint/30 flex items-center justify-center text-xs font-bold text-mint-foreground">
                            {reply.anonymous ? '?' : reply.author.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold">{reply.anonymous ? 'Ẩn danh' : reply.author}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
                        </div>
                        {user && reply.authorId === user.id && (
                          <button onClick={() => handleDeleteReply(post.id, reply.id)} className="p-1 hover:text-destructive text-muted-foreground">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground ml-9 mb-1">{reply.content}</p>
                      <button onClick={() => handleReplyLike(post.id, reply.id)} className={`ml-9 flex items-center gap-1 text-xs transition-colors ${user && reply.likedBy.includes(user.id) ? 'text-pink-foreground' : 'text-muted-foreground hover:text-pink-foreground'}`}>
                        <Heart className={`w-3 h-3 ${user && reply.likedBy.includes(user.id) ? 'fill-current' : ''}`} />
                        {reply.likes > 0 && reply.likes}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Reply form */}
                <AnimatePresence>
                  {replyingTo === post.id && user && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 ml-6 pl-4 border-l-2 border-primary/20">
                      <Textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder="Viết bình luận..."
                        className="mb-2 resize-none text-sm bg-background/50"
                        rows={2}
                      />
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setReplyAnon(!replyAnon)}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${replyAnon ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}
                        >
                          {replyAnon ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {replyAnon ? 'Ẩn danh' : 'Công khai'}
                        </button>
                        <Button onClick={() => handleReply(post.id)} disabled={!replyContent.trim()} size="sm" variant="ghost" className="text-primary gap-1">
                          <Send className="w-3 h-3" /> Trả lời
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
