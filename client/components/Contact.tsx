"use client";

import { motion } from 'framer-motion';

export default function Contact() {
    return (
        <section id="contact" className="py-32 bg-zinc-950 text-white relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-50" />

            <div className="max-w-5xl mx-auto px-4 md:px-8 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-5xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
                        Let's Talk
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Have a project in mind? I'm currently open for new opportunities and collaborations.
                    </p>

                    <a href="mailto:hello@portfolio.com" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-lg">
                        hello@portfolio.com
                    </a>

                    <div className="mt-20 flex justify-center gap-8 text-gray-400 uppercase text-sm tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    </div>
                </motion.div>
            </div>

            <div className="w-full text-center mt-32 text-gray-600 text-sm">
                <p>&copy; 2024 Portfolio. Made with enthusiasm and coffee.</p>
            </div>
        </section>
    );
}
