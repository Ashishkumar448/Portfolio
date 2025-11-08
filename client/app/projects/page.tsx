'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  category: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  views: number;
  likes: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const categories = ['all', 'web', 'mobile', 'desktop', 'api', 'other'];

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 50 };
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        
        const response = await api.getProjects(params);
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCategory, searchTerm]);

  const handleLike = async (projectId: string) => {
    try {
      await api.likeProject(projectId);
      setProjects(projects.map(p => 
        p._id === projectId ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Projects
          </h1>
          <p className="text-xl text-gray-600">
            A collection of my work and side projects
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {project.images[0] && (
                  <Link href={`/projects/${project._id}`}>
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-48 object-cover hover:opacity-90 cursor-pointer transition-opacity"
                    />
                  </Link>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{project.views} views</span>
                      <button
                        onClick={() => handleLike(project._id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {project.likes}
                      </button>
                    </div>
                  </div>
                  
                  <Link href={`/projects/${project._id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4">
                    {project.shortDescription}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}