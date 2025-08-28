"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Airawat1 from "@/assets/Airawat1.jpg";
import Sharanga1 from "@/assets/Sharanga1.jpg";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";

function Projects() {
  const projects = [
    {
      id: 1,
      title: "Airawat – Semi-Vertical Drum Combat Robot",
      imageUrl: Airawat1,
      description:
        "Lightweight yet durable Aluminium T6 alloy chassis with AR500 paneling. Semi-vertical drum weapon tuned for high-impact energy transfer.",
      materials: {
        Chassis: "Aluminium T6 Alloy",
        Panels: "AR500",
        Wheels: "Collson Rubber Wheels",
      },
      weaponSystem: "Semi-Vertical Drum (high-impact, high-speed configuration)",
      driveSystem: ["Inginium P2 10 Gearbox", "H700 Motor", "Secure 120A ESC"],
      highlights: [
        "Aluminium T6 chassis for structural integrity",
        "AR500 panels resist heavy strikes",
        "Semi-vertical drum ensures high kinetic energy transfer",
        "Balanced torque and speed for competitive endurance",
      ],
      tags: ["Durable", "High-Impact", "Competitive"],
    },
    {
      id: 2,
      title: "Sharanga – Double-Disk Combat Robot",
      imageUrl: Sharanga1,
      description:
        "Rugged Aluminium T6 chassis with AR500 paneling for maximum durability. Semi-vertical drum weapon engineered for precision hits.",
      materials: {
        Chassis: "Aluminium T6 Alloy",
        Panels: "AR500",
        Wheels: "Collson Rubber Wheels",
      },
      weaponSystem: "Semi-Vertical Drum",
      driveSystem: ["Inginium P219 Gearbox", "Turbo Motors", "Secure 120A ESC"],
      highlights: [
        "AR500 paneling for high-impact durability",
        "Precision-tuned semi-vertical drum weapon",
        "P219 gearbox + turbo motors for rapid acceleration",
        "Enhanced grip and maneuverability with Collson wheels",
      ],
      tags: ["Rugged", "Precision", "Agile"],
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-black relative">
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12">
        <header className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
            Explore our cutting-edge combat robots, engineered for performance and durability.
          </p>
        </header>
        <ProjectStrip projects={projects} />
      </div>
    </section>
  );
}

function ProjectStrip({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevProject = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevProject();
      if (e.key === "ArrowRight") nextProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center">
      <div className="w-full max-w-[100vw]">
        <ProjectCard project={projects[currentIndex]} isActive />
      </div>
      <div className="flex justify-center gap-4 items-center w-full mt-4">
        <button
          onClick={prevProject}
          className="p-2 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextProject}
          className="p-2 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ project, isActive }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`w-full bg-black/30 rounded-lg border ${
        isActive ? "border-white/30" : "border-white/10"
      } transition-all flex flex-col md:flex-row`}
    >
      <div className="w-full md:w-1/3 flex items-center justify-center overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium rounded-full border border-white/30 bg-white/10 text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
          {project.title}
        </h3>
        <p className="text-sm md:text-base text-gray-300 mb-4">
          {project.description}
        </p>

        {/* Mobile: Toggle visibility */}
        <div className={`md:hidden ${expanded ? "block" : "hidden"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
            <div>
              <h4 className="text-base font-semibold mb-2 text-white">Materials</h4>
              {Object.entries(project.materials).map(([key, value]) => (
                <p key={key} className="text-gray-300 text-sm">
                  <span className="font-medium">{key}:</span> {value}
                </p>
              ))}
            </div>
            <div>
              <h4 className="text-base font-semibold mb-2 text-white">Weapon System</h4>
              <p className="text-sm text-gray-300">{project.weaponSystem}</p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-2 text-white">Drive System</h4>
              {project.driveSystem.map((item, idx) => (
                <p key={idx} className="text-sm text-gray-300">{item}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-2 text-white">Key Highlights</h4>
            <ul className="space-y-1">
              {project.highlights.map((highlight, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex gap-2">
                  • <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop: Always visible */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
            <div>
              <h4 className="text-base font-semibold mb-2 text-white">Materials</h4>
              {Object.entries(project.materials).map(([key, value]) => (
                <p key={key} className="text-gray-300 text-sm">
                  <span className="font-medium">{key}:</span> {value}
                </p>
              ))}
            </div>
            <div>
              <h4 className="text-base font-semibold mb-2 text-white">Weapon System</h4>
              <p className="text-sm text-gray-300">{project.weaponSystem}</p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-2 text-white">Drive System</h4>
              {project.driveSystem.map((item, idx) => (
                <p key={idx} className="text-sm text-gray-300">{item}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-2 text-white">Key Highlights</h4>
            <ul className="space-y-1">
              {project.highlights.map((highlight, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex gap-2">
                  • <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Read More Button (Mobile Only) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="md:hidden mt-4 p-2 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition flex items-center gap-2"
        >
          {expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="text-sm">{expanded ? "Show Less" : "Read More"}</span>
        </button>
      </div>
    </div>
  );
}

export default Projects;
