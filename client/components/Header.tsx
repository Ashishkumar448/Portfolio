'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            Portfolio
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/projects" className="text-gray-300 hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <Link href="/blogs" className="text-gray-300 hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-blue-400"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-blue-400 transition-colors">
                Projects
              </Link>
              <Link href="/blogs" className="text-gray-300 hover:text-blue-400 transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}