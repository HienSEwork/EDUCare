import { blogPosts } from '@/data/blogs';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Blog EDUcare</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Kiến thức bổ ích cho tuổi teen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/blog/${post.id}`}>
                <div className="gradient-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all h-full">
                  <span className="text-4xl">{post.emoji}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-lavender/30 text-lavender-foreground text-xs font-medium mt-3 mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-heading font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>📅 {post.date}</span>
                    <span>⏱️ {post.readTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
