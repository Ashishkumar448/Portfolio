'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../../lib/api';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiencyLevel: 1,
    icon: ''
  });

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await adminApi.request(`/skills/${params.id}`);
        const skill = response.data;
        setFormData({
          name: skill.name || '',
          category: skill.category || '',
          proficiencyLevel: skill.proficiencyLevel || 1,
          icon: skill.icon || ''
        });
      } catch (error) {
        setError('Failed to load skill');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchSkill();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiencyLevel' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await adminApi.updateSkill(params.id as string, formData);
      router.push('/dashboard/skills');
    } catch (error) {
      setError('Failed to update skill');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Skill</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Proficiency Level (1-10)</label>
          <input type="number" name="proficiencyLevel" value={formData.proficiencyLevel} onChange={handleChange} min="1" max="10" required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Icon (optional)</label>
          <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="Icon name or URL" className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Updating...' : 'Update Skill'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500">Cancel</button>
        </div>
      </form>
    </div>
  );
}