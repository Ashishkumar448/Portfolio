"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

interface Skill {
    _id: string;
    name: string;
    proficiency: number;
    icon?: string;
}

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        api.getSkills().then(res => {
            setSkills(res.data || []);
        });
    }, []);

    return (
        <section className="py-20 bg-zinc-900 overflow-hidden relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">Technical Arsenal</h2>
                    <p className="text-gray-400">Tools and technologies I use to bring ideas to life.</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5"
                        >
                            <div className="text-4xl mb-4 text-gray-200">
                                {skill.icon || "⚡"}
                            </div>
                            <span className="text-gray-300 font-medium">{skill.name}</span>
                            <div className="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.proficiency}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="bg-blue-500 h-full"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
