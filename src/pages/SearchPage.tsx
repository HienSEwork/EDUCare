import { useSearchParams } from 'react-router-dom';
import { lessons } from '@/data/lessons';
import { blogPosts } from '@/data/blogs';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();

  const matchedLessons = lessons.filter(l => l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q));
  const matchedBlogs = blogPosts.filter(b => b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading text-2xl font-bold mb-2">Kết quả tìm kiếm</h1>
        <p className="text-muted-foreground mb-8">Từ khóa: "{params.get('q')}"</p>

        {matchedLessons.length === 0 && matchedBlogs.length === 0 && (
          <p className="text-muted-foreground">Không tìm thấy kết quả nào.</p>
        )}

        {matchedLessons.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-lg mb-4">📖 Bài học ({matchedLessons.length})</h2>
            <div className="space-y-3">
              {matchedLessons.map(l => (
                <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Link to={`/lesson/${l.id}`} className="block p-4 rounded-xl bg-card border border-border shadow-soft hover:shadow-hover transition-shadow">
                    <h3 className="font-semibold">{l.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{l.content.slice(0, 100)}...</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {matchedBlogs.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-lg mb-4">📝 Blog ({matchedBlogs.length})</h2>
            <div className="space-y-3">
              {matchedBlogs.map(b => (
                <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Link to={`/blog/${b.id}`} className="block p-4 rounded-xl bg-card border border-border shadow-soft hover:shadow-hover transition-shadow">
                    <h3 className="font-semibold">{b.emoji} {b.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{b.excerpt}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
