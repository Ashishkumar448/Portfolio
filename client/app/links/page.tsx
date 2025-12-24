"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const categories = [
    {
        title: "Coding Platforms",
        color: "text-blue-400",
        links: [
            { name: "LeetCode", url: "https://leetcode.com", icon: "💻" },
            { name: "HackerRank", url: "https://hackerrank.com", icon: "👨‍💻" },
            { name: "Codeforces", url: "https://codeforces.com", icon: "📊" },
            { name: "CodeChef", url: "https://codechef.com", icon: "🍳" },
            { name: "Codepen", url: "https://codepen.io", icon: "✒️" },
            { name: "GeeksforGeeks", url: "https://geeksforgeeks.org", icon: "🤓" },
            { name: "Exercism", url: "https://exercism.org", icon: "🧠" },
            { name: "Replit", url: "https://replit.com", icon: "⚡" },
            { name: "Buy me a Coffee", url: "https://buymeacoffee.com", icon: "☕" },
        ]
    },
    {
        title: "Dev Social",
        color: "text-green-400",
        links: [
            { name: "GitHub", url: "https://github.com", icon: "🐙" },
            { name: "GitLab", url: "https://gitlab.com", icon: "🦊" },
            { name: "Bitbucket", url: "https://bitbucket.org", icon: "🗑️" },
            { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "📚" },
            { name: "Hashnode", url: "https://hashnode.com", icon: "✍️" },
            { name: "Dev.to", url: "https://dev.to", icon: "👩‍💻" },
            { name: "Medium", url: "https://medium.com", icon: "📝" },
            { name: "Reddit", url: "https://reddit.com", icon: "🤖" },
            { name: "Quora", url: "https://quora.com", icon: "❓" },
        ]
    },
    {
        title: "Design & Creative",
        color: "text-pink-400",
        links: [
            { name: "Dribbble", url: "https://dribbble.com", icon: "🏀" },
            { name: "Behance", url: "https://behance.net", icon: "🎨" },
            { name: "Figma", url: "https://figma.com", icon: "🖌️" },
            { name: "Portfolio", url: "/", icon: "🌐" },
            { name: "Notion", url: "https://notion.so", icon: "📓" },
            { name: "Polywork", url: "https://polywork.com", icon: "🧱" },
            { name: "Gumroad", url: "https://gumroad.com", icon: "🛍️" },
            { name: "ProductHunt", url: "https://producthunt.com", icon: "🚀" },
        ]
    },
    {
        title: "Communication",
        color: "text-purple-400",
        links: [
            { name: "LinkedIn", url: "https://linkedin.com", icon: "👔" },
            { name: "Twitter (X)", url: "https://x.com", icon: "🐦" },
            { name: "Discord", url: "https://discord.com", icon: "💬" },
            { name: "Telegram", url: "https://t.me", icon: "✈️" },
            { name: "Email", url: "mailto:hello@portfolio.com", icon: "📧" },
        ]
    },
    {
        title: "Media",
        color: "text-red-400",
        links: [
            { name: "YouTube", url: "https://youtube.com", icon: "📺" },
            { name: "Instagram", url: "https://instagram.com", icon: "📸" },
            { name: "Twitch", url: "https://twitch.tv", icon: "🎮" },
        ]
    }
];

export default function LinkTree() {
    const [activeTab, setActiveTab] = useState("Coding Platforms");

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 relative overflow-y-auto">
            {/* Background Effects */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 relative z-10 pt-10"
            >
                <div className="w-24 h-24 rounded-full border-2 border-white/20 mx-auto mb-4 overflow-hidden shadow-2xl">
                    <img src="/profile.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-2xl font-bold mb-1">Ashish Kumar</h1>
                <p className="text-gray-400 text-sm">Everywhere on the Internet</p>
            </motion.div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl relative z-10">
                {categories.map((cat) => (
                    <button
                        key={cat.title}
                        onClick={() => setActiveTab(cat.title)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === cat.title
                                ? 'bg-white text-black scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-2xl relative z-10 pb-20">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                    {categories.find(c => c.title === activeTab)?.links.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target={link.url.startsWith("/") || link.url.startsWith("mailto") ? "_self" : "_blank"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                            <span className="font-medium text-gray-200 group-hover:text-white">{link.name}</span>
                            <svg className="w-4 h-4 ml-auto text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </motion.a>
                    ))}
                </motion.div>
            </div>

            <footer className="fixed bottom-4 text-gray-600 text-xs text-center w-full pointer-events-none">
                © 2024 Ashish Kumar
            </footer>
        </div>
    );
}
