import { useSearchParams, Link } from "react-router-dom";
import { lessons } from "@/data/lessons";
import { blogPosts } from "@/data/blogs";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();

  const matchedLessons = lessons.filter((lesson) => lesson.title.toLowerCase().includes(q) || lesson.content.toLowerCase().includes(q));
  const matchedBlogs = blogPosts.filter((post) => post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-2 font-heading text-2xl font-bold">Kết quả tìm kiếm</h1>
        <p className="mb-8 text-muted-foreground">Từ khóa: "{params.get("q")}"</p>

        {matchedLessons.length === 0 && matchedBlogs.length === 0 ? (
          <p className="text-muted-foreground">Không tìm thấy kết quả nào.</p>
        ) : null}

        {matchedLessons.length > 0 ? (
          <div className="mb-8">
            <h2 className="mb-4 font-heading text-lg font-bold">Bài học ({matchedLessons.length})</h2>
            <div className="space-y-3">
              {matchedLessons.map((lesson) => (
                <motion.div key={lesson.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Link to={`/lesson/${lesson.id}`} className="block rounded-xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-hover">
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{lesson.content.slice(0, 100)}...</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        {matchedBlogs.length > 0 ? (
          <div>
            <h2 className="mb-4 font-heading text-lg font-bold">Bài viết ({matchedBlogs.length})</h2>
            <div className="space-y-3">
              {matchedBlogs.map((post) => (
                <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Link to={`/blog/${post.id}`} className="block rounded-xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-hover">
                    <h3 className="font-semibold">{post.emoji} {post.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
