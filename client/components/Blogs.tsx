"use client";

import { motion } from "framer-motion";

const blogs = [
    { id: 1, title: "The Future of Web Animation", date: "Dec 12, 2024", read: "5 min read", category: "Design", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "Mastering Next.js 15", date: "Nov 28, 2024", read: "8 min read", category: "Tech", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" },
    { id: 3, title: "3D in the Browser", date: "Nov 15, 2024", read: "6 min read", category: "3D", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800" },
];

export default function Blogs() {
    return (
        <section className="py-32 bg-zinc-950 relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-blue-500 font-medium tracking-widest text-sm uppercase mb-2">Thoughts & Insights</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white">Latest Articles</h3>
                    </div>
                    <a href="#" className="hidden md:block text-white border-b border-blue-500 pb-1 hover:text-blue-500 transition-colors">View all articles</a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group cursor-pointer"
                        >
                            <div className="overflow-hidden rounded-2xl mb-6 aspect-[4/3] border border-white/10 relative">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                                    {blog.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 uppercase tracking-wider">
                                <span>{blog.date}</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                <span>{blog.read}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                                {blog.title}
                            </h4>
                            <a href="#" className="text-white/60 text-sm group-hover:text-white transition-colors inline-flex items-center gap-2">
                                Read Article
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
