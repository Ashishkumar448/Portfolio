'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import SmoothScroll from '../../components/SmoothScroll';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'technology', 'tutorial', 'personal', 'news', 'other'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 50 };
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;

        const response = await api.getBlogs(params);
        setBlogs(response.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory, searchTerm]);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 mb-6">
              Insights & Thoughts
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Deep dives into code, technology, and the future of web development.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
              <div className="w-full md:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                        ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.5)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-xl text-gray-500">No interesting articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all hover:transform hover:-translate-y-2 group flex flex-col h-full"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">
                        {blog.category}
                      </span>
                      {blog.featured && (
                        <span className="bg-yellow-500/10 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20">
                          Featured
                        </span>
                      )}
                    </div>

                    <Link href={`/blogs/${blog._id}`}>
                      <h2 className="text-2xl font-bold text-white mb-4 hover:text-green-400 cursor-pointer transition-colors leading-tight">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                      {blog.excerpt}
                    </p>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-gray-500 text-xs font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4 mt-auto">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {blog.views} Reads
                      </span>
                      <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}