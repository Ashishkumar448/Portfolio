'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  category: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.getProject(params.id as string);
        setProject(response.data);
      } catch (error) {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProject();
  }, [params.id]);

  const handleLike = async () => {
    try {
      await api.likeProject(params.id as string);
      if (project) {
        setProject({ ...project, likes: project.likes + 1 });
      }
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-blue-400 hover:text-blue-300">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="text-blue-400 hover:text-blue-300 mb-6 sm:mb-8 inline-block">
          ← Back to Projects
        </Link>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {project.images && project.images.length > 0 && (
            <div className="aspect-video bg-gray-200">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-600 text-blue-100 text-sm font-medium rounded-full">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 bg-yellow-600 text-yellow-100 text-sm font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{project.title}</h1>
            
            <p className="text-base sm:text-lg text-gray-300 mb-6">{project.shortDescription}</p>

            <div className="prose prose-invert max-w-none mb-8 text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: project.description }} />
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-700 pt-6 gap-4">
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 text-sm sm:text-base">{project.views} views</span>
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <span>❤️</span>
                  <span>{project.likes}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {project.images && project.images.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Project Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${project.title} screenshot ${index + 2}`}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}