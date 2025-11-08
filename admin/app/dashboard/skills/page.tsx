'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/api';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiencyLevel: number;
  icon?: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await adminApi.getSkills();
        setSkills(response.data || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await adminApi.deleteSkill(id);
        setSkills(skills.filter(s => s._id !== id));
      } catch (error) {
        console.error('Error deleting skill:', error);
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
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-slate-400">Manage your skills and expertise</p>
        </div>
        <Link
          href="/dashboard/skills/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Skill
        </Link>
      </div>

      <div className="bg-gray-700 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Skill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Proficiency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {skills.map((skill) => (
              <tr key={skill._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {skill.icon && (
                      <span className="text-2xl mr-3">{skill.icon}</span>
                    )}
                    <div className="text-sm font-medium text-white">
                      {skill.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-green-100">
                    {skill.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${skill.proficiencyLevel * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-400">{skill.proficiencyLevel}/10</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/skills/${skill._id}/edit`}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No skills found.</p>
            <Link
              href="/dashboard/skills/new"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Add your first skill
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}