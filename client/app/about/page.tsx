"use client";

import { motion } from "framer-motion";
import SmoothScroll from "../../components/SmoothScroll";

export default function AboutPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-400 to-gray-600">
              About Me
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Full-stack developer passionate about crafting digital experiences that live on the edge of innovation.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-gray-300 leading-relaxed"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Hello, I'm a Developer</h2>
              <p>
                I'm a passionate full-stack developer with expertise in modern web technologies.
                I love creating efficient, scalable, and user-friendly applications that solve real-world problems.
              </p>
              <p>
                With experience in both frontend and backend development, I enjoy working on projects
                that challenge me to learn new technologies and improve my skills continuously.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source
                projects, or sharing my knowledge through blog posts and tutorials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 relative group">
                <img src="/profile.png" alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors" />
              </div>
            </motion.div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { icon: "🚀", title: "Frontend", desc: "React, Next.js, TypeScript, Tailwind" },
              { icon: "⚙️", title: "Backend", desc: "Node.js, Express, MongoDB, PostgreSQL" },
              { icon: "☁️", title: "Cloud & DevOps", desc: "AWS, Docker, CI/CD, Terraform" }
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{skill.title}</h3>
                <p className="text-gray-400">{skill.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Journey Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-16 text-center">My Journey</h2>
            <div className="space-y-12 relative border-l border-white/10 ml-4 md:ml-0 md:pl-0">
              {[
                { number: "01", title: "Started Learning", desc: "Began my journey with HTML, CSS, and clean code principles." },
                { number: "02", title: "Full-Stack Development", desc: "Expanded to backend technologies, databases, and API architecture." },
                { number: "03", title: "Professional Experience", desc: "Working on real-world projects, scaling applications, and solving complex problems." }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-8 md:ml-12 relative"
                >
                  <div className="absolute left-[-5px] md:left-[-53px] top-0 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-black" />
                  <span className="text-5xl font-black text-white/5 absolute -top-4 -left-4 select-none">{step.number}</span>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 max-w-xl">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}