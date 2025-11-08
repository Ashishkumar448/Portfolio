'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../../lib/api';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    technologies: '',
    category: 'web',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'draft'
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await adminApi.request(`/projects/${params.id}`);
        const project = response.data;
        setFormData({
          title: project.title || '',
          description: project.description || '',
          shortDescription: project.shortDescription || '',
          technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
          category: project.category || 'web',
          liveUrl: project.liveUrl || '',
          githubUrl: project.githubUrl || '',
          featured: project.featured || false,
          status: project.status || 'draft'
        });
      } catch (error) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProject();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'technologies') {
          const techArray = value.split(',').map(tech => tech.trim()).filter(Boolean);
          formDataToSend.append('technologies', JSON.stringify(techArray));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      await adminApi.updateProject(params.id as string, formDataToSend);
      router.push('/dashboard/projects');
    } catch (error) {
      setError('Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Project</h1>
        <p className="text-gray-300">Update project information</p>
      </div>

      <div className="bg-gray-700 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="api">API</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label>
            <textarea name="shortDescription" required rows={3} value={formData.shortDescription} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea name="description" required rows={6} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Technologies *</label>
            <input type="text" name="technologies" required value={formData.technologies} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
              <input type="text" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-600" />
              <label className="ml-2 block text-sm text-gray-300">Featured Project</label>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {submitting ? 'Updating...' : 'Update Project'}
            </button>
            <button type="button" onClick={() => router.back()} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}