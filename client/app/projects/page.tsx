'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import SmoothScroll from '../../components/SmoothScroll';

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

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed top-20 left-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-20 right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6">
              My Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A curated collection of my work, side projects, and experiments.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
              <div className="w-full md:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-xl text-gray-500">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:-translate-y-2 group"
                >
                  {project.images[0] && (
                    <div className="relative h-56 overflow-hidden">
                      <Link href={`/projects/${project._id}`}>
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
                        {project.category}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                        <span>{project.views} views</span>
                      </div>
                      <button
                        onClick={() => handleLike(project._id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg className={`w-5 h-5 ${project.likes > 0 ? 'fill-red-500 text-red-500' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium">{project.likes}</span>
                      </button>
                    </div>

                    <Link href={`/projects/${project._id}`}>
                      <h3 className="text-2xl font-bold text-white mb-2 hover:text-blue-400 cursor-pointer transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-gray-400 mb-6 line-clamp-2 text-sm leading-relaxed">
                      {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-gray-500 text-xs py-1 px-2">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/5">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/10"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}