"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from 'next/link';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-green-400 selection:text-black"
        >
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center pt-20">

                {/* Intro Tag */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default"
                >
                    <span className="text-2xl animate-wave origin-bottom-right inline-block">👋</span>
                    <span className="text-sm font-medium text-gray-300">Hey, I'm a Full Stack Developer</span>
                </motion.div>

                {/* Massive Typography Name */}
                <div className="relative w-full flex justify-center items-center perspective-1000 mb-12">
                    {/* Background Text Layer (Parallax) */}
                    <motion.h1
                        style={{ y: y1 }}
                        className="text-[12vw] sm:text-[13vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap select-none pointer-events-none"
                    >
                        ASHISH KUMAR
                    </motion.h1>

                    {/* Main Text Content Wrapper */}
                    <div className="relative z-20 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <motion.h1
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mix-blend-difference"
                        >
                            ASHISH
                        </motion.h1>

                        {/* Profile Image (Centerpiece) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                            className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex-shrink-0"
                        >
                            <div className="absolute inset-0 bg-green-500 rounded-full blur-[50px] opacity-20 animate-pulse" />
                            <div className="w-full h-full rounded-full border-4 border-white/10 bg-zinc-900 overflow-hidden relative shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                                <img src="/profile.png" alt="Ashish Kumar" className="w-full h-full object-cover scale-110" />

                                {/* Status Indicator */}
                                <div className="absolute bottom-4 right-8 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-white">Open for work</span>
                                </div>

                                {/* Linktree Floating Pill */}
                                <Link href="/links" className="absolute top-8 left-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-all hover:scale-105 shadow-xl flex items-center gap-2 group/link">
                                    <span className="text-xs font-bold text-white group-hover/link:text-blue-400 transition-colors">/ linktree</span>
                                    <span className="text-xs text-white/50 group-hover/link:text-white transition-colors">↗</span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600"
                        >
                            KUMAR
                        </motion.h1>
                    </div>
                </div>

                {/* Bio Text (User Specific) */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl text-center leading-relaxed mb-12 font-light"
                >
                    I craft fast, scalable, and user-friendly web applications with modern JavaScript frameworks
                    —combining <span className="text-white font-semibold">React</span> on the frontend with robust server-side solutions using <span className="text-white font-semibold">Node.js</span>.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-6 items-center"
                >
                    <Link href="#contact">
                        <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-shadow">
                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Let's Connect</span>
                            <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        </button>
                    </Link>

                    <Link href="#projects">
                        <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2 group">
                            View Projects
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/30"
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            </motion.div>
        </section>
    );
}
