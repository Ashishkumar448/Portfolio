'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.getBlog(params.id as string);
        setBlog(response.data);
      } catch (error) {
        setError('Blog post not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <Link href="/blogs" className="text-blue-400 hover:text-blue-300">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blogs" className="text-blue-400 hover:text-blue-300 mb-6 sm:mb-8 inline-block">
          ← Back to Blog
        </Link>

        <article className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-purple-600 text-purple-100 text-sm font-medium rounded-full">
                  {blog.category}
                </span>
                {blog.featured && (
                  <span className="px-3 py-1 bg-yellow-600 text-yellow-100 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{blog.title}</h1>
            
            {blog.excerpt && (
              <p className="text-lg sm:text-xl text-gray-300 mb-8 italic">{blog.excerpt}</p>
            )}

            <div className="prose prose-invert max-w-none mb-8 text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm sm:text-base">{blog.views} views</span>
                  <span className="text-gray-400 text-sm sm:text-base">
                    Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Share
                  </button>
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    Bookmark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        <div className="mt-12">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Related Posts</h3>
          <div className="text-gray-400">
            Related blog posts will be displayed here based on category and tags.
          </div>
        </div>
      </div>
    </div>
  );
}