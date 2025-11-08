'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/api';

export default function NewProjectPage() {
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
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.shortDescription.length < 10 || formData.shortDescription.length > 200) {
      errors.shortDescription = 'Short description must be 10-200 characters';
    }
    
    const techArray = formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean);
    if (techArray.length < 1 || techArray.length > 20) {
      errors.technologies = '1-20 technologies required';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

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

      if (images) {
        Array.from(images).forEach(image => {
          formDataToSend.append('images', image);
        });
      }

      await adminApi.createProject(formDataToSend);
      router.push('/dashboard/projects');
    } catch (error) {
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Project</h1>
        <p className="text-gray-300">Create a new project for your portfolio</p>
      </div>

      <div className="bg-gray-700 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="api">API</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              required
              rows={3}
              value={formData.shortDescription}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-600 border text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.shortDescription ? 'border-red-500' : 'border-gray-500'
              }`}
            />
            {validationErrors.shortDescription && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.shortDescription}</p>
            )}
            <p className="text-gray-400 text-sm mt-1">{formData.shortDescription.length}/200 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies (comma-separated) *
            </label>
            <input
              type="text"
              name="technologies"
              required
              placeholder="React, Node.js, MongoDB"
              value={formData.technologies}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-600 border text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
                validationErrors.technologies ? 'border-red-500' : 'border-gray-500'
              }`}
            />
            {validationErrors.technologies && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.technologies}</p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              {formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean).length}/20 technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Live URL
              </label>
              <input
                type="text"
                name="liveUrl"
                placeholder="https://example.com"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="text"
                name="githubUrl"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <p className="text-sm text-gray-400 mt-1">Select multiple images for your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-600"
              />
              <label className="ml-2 block text-sm text-gray-300">
                Featured Project
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}