"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const commands = [
    { cmd: "whoami", output: "root@ashish-dev-server" },
    { cmd: "cat skills.txt | grep 'Cloud'", output: "> AWS \n> Docker \n> Kubernetes \n> Terraform" },
    { cmd: "./pentest.sh --target website", output: "[*] Scanning for vulnerabilities...\n[+] SQL Injection: Clean\n[+] XSS: Clean\n[+] CSRF: Protected\n[!] Security Score: A+" },
    { cmd: "python3 ai_agent.py", output: "Initializing Neural Network...\nLoading LLM weights...\nGen AI Module Active.\nReady to assist." },
];

export default function TerminalSection() {
    const [lineIndex, setLineIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLineIndex((prev) => (prev + 1) % commands.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-sm text-green-500 uppercase tracking-widest mb-4 font-mono">System Status: Online</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Beyond the <br />
                            <span className="text-green-500">Frontend_</span>
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            My expertise extends deep into the server infrastructure and security layers.
                            I architect secure cloud environments, automate deployment pipelines, and build intelligent AI solutions.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md font-mono text-sm">
                                $ _Cloud_Native
                            </div>
                            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md font-mono text-sm">
                                $ _SecOps
                            </div>
                            <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md font-mono text-sm">
                                $ _Gen_AI
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10 font-mono text-sm md:text-base">
                            <div className="bg-[#2d2d2d] px-4 py-2 flex gap-2 items-center border-b border-black/50">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-gray-400 text-xs">ashish@dev-terminal</span>
                            </div>
                            <div className="p-6 h-[300px] flex flex-col justify-end text-green-400">
                                {commands.map((command, idx) => (
                                    <div
                                        key={idx}
                                        className={`mb-4 transition-opacity duration-500 ${idx === lineIndex ? 'opacity-100' : 'opacity-30'}`}
                                        style={{ display: idx <= lineIndex ? 'block' : 'none' }}
                                    >
                                        <div className="flex gap-2">
                                            <span className="text-blue-400">➜</span>
                                            <span className="text-white">~</span>
                                            <span>{command.cmd}</span>
                                        </div>
                                        <div className="text-gray-400 mt-1 whitespace-pre-wrap pl-6 border-l-2 border-white/10 ml-1">
                                            {command.output}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-2 animate-pulse">
                                    <span className="text-blue-400">➜</span>
                                    <span className="text-white">~</span>
                                    <span className="w-2 h-5 bg-white block"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
