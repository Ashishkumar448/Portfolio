"use client";

import SmoothScroll from '../components/SmoothScroll';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Services from '../components/Services';
import TerminalSection from '../components/TerminalSection';
import BentoGallery from '../components/BentoGallery';
import Blogs from '../components/Blogs';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Contact from '../components/Contact';

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white overflow-hidden">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <TerminalSection />
        <BentoGallery />
        <Projects />
        <Skills />
        <Experience />
        <Blogs />
        <Contact />
      </main>
    </SmoothScroll>
  );
}