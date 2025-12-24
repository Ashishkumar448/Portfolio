"use client";

import { motion } from "framer-motion";

const works = [
    { id: 1, title: "Neon Dreams", type: "3D Art", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800", col: "col-span-1 md:col-span-2", row: "row-span-2" },
    { id: 2, title: "Abstract UI", type: "Interface", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", col: "col-span-1", row: "row-span-1" },
    { id: 3, title: "Cyberpunk City", type: "Concept", img: "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&q=80&w=800", col: "col-span-1", row: "row-span-1" },
    { id: 4, title: "Minimalist", type: "Web Design", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800", col: "col-span-1 md:col-span-2", row: "row-span-1" },
    { id: 5, title: "Dark Data", type: "Dashboard", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", col: "col-span-1", row: "row-span-2" },
    { id: 6, title: "Retro Future", type: "Illustration", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", col: "col-span-1 md:col-span-2", row: "row-span-1" },
    { id: 7, title: "Glassmorphism", type: "Experiment", img: "https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?auto=format&fit=crop&q=80&w=800", col: "col-span-1", row: "row-span-1" },
    { id: 8, title: "Holo Interface", type: "AR Concept", img: "https://images.unsplash.com/photo-1614851099511-773084f6911d?auto=format&fit=crop&q=80&w=800", col: "col-span-1", row: "row-span-1" },
    { id: 9, title: "AI Generation", type: "Tech Art", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800", col: "col-span-1", row: "row-span-1" },
];

export default function BentoGallery() {
    return (
        <section className="py-20 bg-black relative z-10 px-4 md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-sm text-purple-500 uppercase tracking-widest mb-2">Visual Playground</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white">Selected Works</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
                    {works.map((work, index) => (
                        <motion.div
                            key={work.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group rounded-3xl overflow-hidden border border-white/10 ${work.col} ${work.row}`}
                        >
                            <img src={work.img} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">{work.type}</span>
                                <h4 className="text-2xl font-bold text-white">{work.title}</h4>
                            </div>
                        </motion.div>
                    ))}

                    {/* Spotify Card injected into the grid */}
                    <div className="col-span-1 md:col-span-1 row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-[#1DB954] flex flex-col justify-between p-6">
                        <div className="absolute top-4 right-4">
                            <svg className="w-8 h-8 text-black animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-black/80 font-bold text-xs uppercase mb-1">Recently Played</p>
                            <div className="flex gap-1">
                                <span className="w-1 h-3 bg-black/60 animate-[music-bar_1s_ease-in-out_infinite]" />
                                <span className="w-1 h-5 bg-black/60 animate-[music-bar_1.2s_ease-in-out_infinite]" />
                                <span className="w-1 h-2 bg-black/60 animate-[music-bar_0.8s_ease-in-out_infinite]" />
                                <span className="w-1 h-4 bg-black/60 animate-[music-bar_1.1s_ease-in-out_infinite]" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-black font-black text-lg leading-tight">Midnight City</h4>
                            <p className="text-black/70 font-semibold text-sm">M83</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
