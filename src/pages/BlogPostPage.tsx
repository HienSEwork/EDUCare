import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from '@/data/blogs';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  if (!post) return <div className="min-h-screen flex items-center justify-center"><p>Không tìm thấy bài viết.</p></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Quay lại Blog
        </button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-5xl">{post.emoji}</span>
          <div className="flex items-center gap-3 mt-4 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-lavender/30 text-lavender-foreground text-xs font-medium">{post.category}</span>
            <span className="text-xs text-muted-foreground">📅 {post.date}</span>
            <span className="text-xs text-muted-foreground">⏱️ {post.readTime}</span>
          </div>
          <h1 className="font-heading text-3xl font-bold mb-6">{post.title}</h1>
          <div className="prose prose-sm max-w-none">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed mb-3">{line}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
