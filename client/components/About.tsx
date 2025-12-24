"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-32 md:py-48 bg-black relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div style={{ y, opacity }}>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                            More than just <br />
                            <span className="text-gray-500">code.</span>
                        </h2>
                    </motion.div>

                    <div className="text-gray-300 text-lg md:text-xl leading-relaxed space-y-6">
                        <motion.p
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            I am a passionate Full Stack Developer with a keen eye for design and detail.
                            My journey involves bridging the gap between engineering and aesthetics,
                            creating software that not only functions perfectly but feels intuitive and natural.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            From complex backend architectures to fluid frontend animations,
                            I handle the full spectrum of web development. I believe in the power of experimental
                            interfaces and pushing the boundaries of what's possible on the web.
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
}
