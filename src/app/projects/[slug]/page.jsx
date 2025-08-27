"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Share2, Twitter, Linkedin, Link as LinkIcon, ArrowLeft, ArrowRight, Home } from 'lucide-react'

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-black/20">
      <div className="h-full bg-[#429da1] transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
};

const Header = ({ title, subtitle, cover }) => (
  <header className="reader-header">
    <div className="reader-container py-6 md:py-8">
      <nav className="text-sm text-themed-muted flex items-center gap-2">
        <Home size={16} />
        <span>/</span>
        <a href="/projects" className="hover:underline">Projects</a>
        <span>/</span>
        <span className="text-foreground/80">{title}</span>
      </nav>
      <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">{title}</h1>
      {subtitle && <p className="mt-3 text-lg text-themed-muted">{subtitle}</p>}
    </div>
    {cover && (
      <div className="w-full relative">
        <img src={cover} alt={title} className="w-full max-h-[60vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>
    )}
  </header>
);

const MetaBar = ({ tags = [], date, readTime }) => (
  <div className="reader-container py-4 text-sm text-themed-muted flex flex-wrap items-center gap-3">
    {date && <span>{date}</span>}
    {readTime && <span>• {readTime}</span>}
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="px-2 py-1 rounded-full border border-themed text-xs">{t}</span>
        ))}
      </div>
    )}
  </div>
);

const Content = ({ children }) => {
  const articleRef = useRef(null);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!articleRef.current) return;
    const headings = Array.from(articleRef.current.querySelectorAll('h2, h3'));
    const entries = headings.map((el) => {
      const id = el.textContent.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
      el.id = id;
      return { id, text: el.textContent, level: el.tagName.toLowerCase() };
    });
    setToc(entries);
  }, [children]);

  useEffect(() => {
    const onScroll = () => {
      const offsets = toc.map((t) => {
        const el = document.getElementById(t.id);
        if (!el) return { id: t.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: t.id, top: Math.abs(rect.top - 100) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets.length) setActiveId(offsets[0].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  const share = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = document.title;
    const map = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    const link = map[platform];
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Optional: toast
    } catch {}
  };

  return (
    <main className="reader-main">
      <div className="reader-container reader-grid py-10">
        <article ref={articleRef} className="reader-content p-6 md:p-10 prose prose-invert">
          {children}

          <hr className="my-10 border-themed" />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-sm text-themed-muted">
              <span>Share</span>
              <button aria-label="Share on Twitter" className="p-2 rounded-lg bg-themed-card border-themed border hover:opacity-90" onClick={() => share('twitter')}><Twitter size={16} /></button>
              <button aria-label="Share on LinkedIn" className="p-2 rounded-lg bg-themed-card border-themed border hover:opacity-90" onClick={() => share('linkedin')}><Linkedin size={16} /></button>
              <button aria-label="Copy link" className="p-2 rounded-lg bg-themed-card border-themed border hover:opacity-90" onClick={copyLink}><LinkIcon size={16} /></button>
        </div>
            <div className="flex items-center gap-3">
              <a href="/projects" className="btn-secondary px-3 py-2 rounded-xl flex items-center gap-2"><ArrowLeft size={16} />All Projects</a>
              </div>
            </div>

          <div className="mt-10 bg-themed-card border-themed border rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-700" />
              <div>
                <p className="font-semibold">Grobots Team</p>
                <p className="text-sm text-themed-muted">Building robotics products and tools.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <a className="btn-outline px-3 py-2 rounded-xl flex items-center gap-2" href="#"><ArrowLeft size={16} /> Previous</a>
            <a className="btn-primary px-3 py-2 rounded-xl flex items-center gap-2" href="#">Next <ArrowRight size={16} /></a>
                </div>
        </article>
        <aside className="reader-sidebar hidden lg:block">
          <div className="bg-themed-card border-themed border rounded-2xl p-4 sticky top-24">
            <h3 className="font-semibold mb-2">On this page</h3>
            {toc.length === 0 ? (
              <p className="text-sm text-themed-muted">Headings will appear here if added.</p>
            ) : (
              <nav className="text-sm">
                <ul className="space-y-1">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className={`${activeId === t.id ? 'text-foreground' : 'text-themed-muted'} hover:text-foreground transition-colors`} style={{ paddingLeft: t.level === 'h3' ? 12 : 0 }}>
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              )}
            </div>
        </aside>
                      </div>
    </main>
  );
};

function ProjectDoc({ params }) {
  const { slug } = params;

  const project = {
    title: "Autonomous Drone",
    subtitle: "AI-powered drone for surveillance and mapping.",
    cover: "/path/to/drone.jpg",
    date: "Aug 18, 2025",
    readTime: "6 min read",
    tags: ["Robotics", "AI", "Drones"],
  };

  return (
    <div className='relative min-h-screen pt-20'>
      <ProgressBar />
      <Header title={project.title} subtitle={project.subtitle} cover={project.cover} />
      <MetaBar tags={project.tags} date={project.date} readTime={project.readTime} />
      <Content>
        <h2>Overview</h2>
        <p>
          This project explores an autonomous UAV platform capable of waypoint navigation,
          real-time object detection, and map generation. The system integrates a lightweight
          perception stack, robust control, and telemetry.
        </p>
        <h3>Architecture</h3>
        <p>
          The platform is composed of modules for perception, planning, and control. An onboard
          companion computer runs inference and fuses sensor inputs to produce reliable state
          estimation.
        </p>
        <h3>Highlights</h3>
        <ul>
          <li>Real-time object detection at 30 FPS on embedded hardware</li>
          <li>Fail-safe RTL with geofencing</li>
          <li>Cloud-backed telemetry and mission logs</li>
        </ul>
        <h3>Tech Stack</h3>
        <p>PX4, MAVLink, ROS 2, TensorRT, OpenCV, WebRTC, TypeScript</p>
      </Content>
                </div>
  )
}

export default ProjectDoc