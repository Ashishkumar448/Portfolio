"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

interface Project {
    _id: string;
    title: string;
    technologies: string[];
    images: string[];
    category: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.getProjects({ limit: 4 }).then(res => {
            setProjects(res.data || []);
        });
    }, []);

    return (
        <section id="projects" className="py-32 bg-zinc-950 relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-sm text-blue-500 uppercase tracking-widest mb-4">Selected Works</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white">Recent Projects</h3>
                </motion.div>

                <div className="space-y-32">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-3/5 group cursor-pointer">
                                <div className="relative overflow-hidden rounded-2xl aspect-video border border-white/10 bg-white/5">
                                    {project.images[0] ? (
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>

                            {/* Text Side */}
                            <div className="w-full md:w-2/5">
                                <span className="text-blue-400 text-sm font-medium mb-4 block">{project.category}</span>
                                <h4 className="text-3xl font-bold text-white mb-6">{project.title}</h4>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.technologies.slice(0, 4).map(tech => (
                                        <span key={tech} className="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-400">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <a href={`/projects/${project._id}`} className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors group">
                                    View Case Study
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
