'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden border-t border-white/5">
      {/* Massive Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
        <h1 className="text-[20vw] font-black uppercase whitespace-nowrap">Portfolio</h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
              Let's work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">together.</span>
            </h2>
            <div className="flex gap-4">
              <a href="mailto:hello@ashish.dev" className="text-xl md:text-2xl border-b border-white hover:text-blue-400 hover:border-blue-400 transition-all pb-1">hello@ashish.dev</a>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Newsletter</h3>
              <p className="text-gray-400 mb-6">Stay updated with the latest in tech, design, and development.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@address.com"
                  className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {subscribed ? 'Joined!' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10 pt-16">
          <div>
            <h4 className="font-bold text-lg mb-6">Sitemap</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Insights</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Socials</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="https://twitter.com" target="_blank" className="hover:text-blue-400 transition-colors">Twitter / X</a></li>
              <li><a href="https://linkedin.com" target="_blank" className="hover:text-blue-600 transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://instagram.com" target="_blank" className="hover:text-pink-500 transition-colors">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Web Development</li>
              <li>App Development</li>
              <li>UI/UX Design</li>
              <li>Cloud Solutions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© 2024 Ashish Kumar. All rights reserved.</p>
          <p>Designed & Built with ❤️ using <span className="text-white">Next.js</span></p>
        </div>
      </div>
    </footer>
  );
}