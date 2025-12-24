"use client";

import { motion, Variants } from "framer-motion";

const marqueeVariants: Variants = {
    animate: {
        x: [0, -1000],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
            },
        },
    },
};

export default function Marquee() {
    return (
        <div className="relative flex overflow-hidden py-10 bg-blue-600 rotate-[-2deg] scale-110 border-y-4 border-black z-20 mix-blend-hard-light opacity-90 my-20">
            <div className="absolute inset-0 bg-blue-600/50 backdrop-blur-sm"></div>
            <motion.div
                className="flex whitespace-nowrap gap-10"
                variants={marqueeVariants}
                animate="animate"
            >
                {[...Array(10)].map((_, i) => (
                    <h1 key={i} className="text-8xl font-black text-transparent stroke-text uppercase italic tracking-tighter" style={{ WebkitTextStroke: "2px white" }}>
                        UI/UX DESIGN • FULL STACK DEV • CLOUD & DEVOPS • WEB PENTESTING • GEN AI SOLUTIONS •
                    </h1>
                ))}
            </motion.div>
        </div>
    );
}
