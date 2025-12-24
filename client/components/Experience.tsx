"use client";

import { motion } from 'framer-motion';

const experiences = [
    {
        year: "2024",
        title: "Senior Full Stack Dev",
        company: "Tech Corp",
        description: "Leading development of scalable web applications using Next.js and Node.js."
    },
    {
        year: "2022",
        title: "Frontend Developer",
        company: "Creative Agency",
        description: "Built award-winning websites with heavy emphasis on animations and interactivity."
    },
    {
        year: "2020",
        title: "Freelance",
        company: "Self-Employed",
        description: "Worked with various clients to deliver custom digital solutions."
    }
];

export default function Experience() {
    return (
        <section className="py-32 bg-black text-white relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Experience</h2>

                <div className="max-w-3xl mx-auto">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group border-l-2 border-white/10 pl-8 pb-12 last:pb-0 relative"
                        >
                            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-blue-500 group-hover:bg-blue-500 transition-colors duration-300" />
                            <span className="text-sm text-blue-500 font-mono mb-2 block">{exp.year}</span>
                            <h3 className="text-2xl font-bold mb-1">{exp.title}</h3>
                            <p className="text-gray-400 mb-2">{exp.company}</p>
                            <p className="text-gray-500">{exp.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
