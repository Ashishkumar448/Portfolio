'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';

interface DashboardStats {
  totalViews: number;
  projectViews: number;
  blogViews: number;
  recentViews: number;
  topProjects: Array<{ _id: string; count: number }>;
  topBlogs: Array<{ _id: string; count: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Views</p>
              <p className="text-2xl font-semibold text-white">
                {stats?.totalViews || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Project Views</p>
              <p className="text-2xl font-semibold text-white">
                {stats?.projectViews || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Blog Views</p>
              <p className="text-2xl font-semibold text-white">
                {stats?.blogViews || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Recent Views (7d)</p>
              <p className="text-2xl font-semibold text-white">
                {stats?.recentViews || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/projects"
              className="flex items-center p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              <span className="text-xl mr-3">🚀</span>
              <span className="font-medium text-white">Manage Projects</span>
            </a>
            <a
              href="/dashboard/blogs"
              className="flex items-center p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              <span className="text-xl mr-3">📝</span>
              <span className="font-medium text-white">Write New Blog</span>
            </a>
            <a
              href="/dashboard/contacts"
              className="flex items-center p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              <span className="text-xl mr-3">📧</span>
              <span className="font-medium text-white">View Messages</span>
            </a>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Content</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-300 mb-2">Top Projects</h3>
              {stats?.topProjects?.slice(0, 3).map((project, index) => (
                <div key={project._id} className="flex justify-between text-sm">
                  <span className="text-slate-400">Project #{index + 1}</span>
                  <span className="font-medium text-white">{project.count} views</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-medium text-slate-300 mb-2">Top Blogs</h3>
              {stats?.topBlogs?.slice(0, 3).map((blog, index) => (
                <div key={blog._id} className="flex justify-between text-sm">
                  <span className="text-slate-400">Blog #{index + 1}</span>
                  <span className="font-medium text-white">{blog.count} views</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}