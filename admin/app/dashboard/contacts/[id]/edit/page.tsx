'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../../lib/api';

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    status: 'unread'
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await adminApi.request(`/contact/${params.id}`);
        const contact = response.data;
        setFormData({
          name: contact.name || '',
          email: contact.email || '',
          subject: contact.subject || '',
          message: contact.message || '',
          status: contact.status || 'unread'
        });
      } catch (error) {
        setError('Failed to load contact');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchContact();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await adminApi.request(`/contact/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      router.push('/dashboard/contacts');
    } catch (error) {
      setError('Failed to update contact');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Contact</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} rows={6} required className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {submitting ? 'Updating...' : 'Update Contact'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500">Cancel</button>
        </div>
      </form>
    </div>
  );
}