'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../../lib/api';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    category: '',
    status: 'draft',
    featured: false
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await adminApi.request(`/blogs/${params.id}`);
        const blog = response.data;
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          category: blog.category || '',
          status: blog.status || 'draft',
          featured: blog.featured || false
        });
      } catch (error) {
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchBlog();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      await adminApi.updateBlog(params.id as string, blogData);
      router.push('/dashboard/blogs');
    } catch (error) {
      setError('Failed to update blog');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Blog Post</h1>
      
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows={15} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-600" />
            <label className="text-sm font-medium text-gray-300">Featured Post</label>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Updating...' : 'Update Blog Post'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500">Cancel</button>
        </div>
      </form>
    </div>
  );
}