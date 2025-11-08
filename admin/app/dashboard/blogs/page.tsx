'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await adminApi.getBlogs();
        setBlogs(response.data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await adminApi.deleteBlog(id);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blogs</h1>
          <p className="text-slate-400">Manage your blog posts</p>
        </div>
        <Link
          href="/dashboard/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Blog
        </Link>
      </div>

      <div className="bg-gray-700 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Blog
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {blog.title}
                      {blog.featured && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-yellow-100">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400">
                      {blog.excerpt}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-purple-100">
                    {blog.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    blog.status === 'published' 
                      ? 'bg-green-600 text-green-100' 
                      : 'bg-gray-600 text-gray-100'
                  }`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {blog.views} views
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/blogs/${blog._id}/edit`}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No blogs found.</p>
            <Link
              href="/dashboard/blogs/new"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Create your first blog post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}