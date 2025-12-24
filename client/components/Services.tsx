"use client";

import { motion } from 'framer-motion';

const services = [
    {
        title: "Web Development",
        description: "Building scalable, high-performance web applications using modern technologies like Next.js, React, and Node.js.",
        icon: "💻"
    },
    {
        title: "Cloud & DevOps",
        description: "Deploying and managing scalable infrastructure on AWS/GCP with Docker, Kubernetes, and CI/CD pipelines.",
        icon: "☁️"
    },
    {
        title: "Web Pentesting",
        description: "Securing applications by identifying vulnerabilities and implementing robust security measures.",
        icon: "🛡️"
    },
    {
        title: "Gen AI Solutions",
        description: "Integrating LLMs and AI agents into applications for intelligent automation and enhanced user experiences.",
        icon: "🤖"
    },
    {
        title: "UI/UX Design",
        description: "Crafting intuitive and visually stunning user interfaces that provide seamless user experiences.",
        icon: "🎨"
    },
    {
        title: "3D Visuals",
        description: "Integrating immersive 3D elements and interactions using Spline and Three.js for unique web experiences.",
        icon: "🧊"
    }
];

export default function Services() {
    return (
        <section className="py-40 bg-zinc-950 relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <h2 className="text-sm text-blue-500 uppercase tracking-widest mb-4">What I Do</h2>
                    <h3 className="text-5xl md:text-7xl font-bold text-white mb-8">Capabilities</h3>
                    <div className="h-1 w-20 bg-blue-500"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300 origin-left">
                                {service.icon}
                            </div>
                            <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-blue-400 transition-colors">
                                {service.title}
                            </h4>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
