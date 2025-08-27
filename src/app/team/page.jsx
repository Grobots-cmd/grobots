"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ChromaGrid from "@/components/team/TeamGrid";
import { teamData } from "@/data/team/teamData";
import { Sparkles } from "lucide-react";

function Team() {
  const [sortBy, setSortBy] = useState("all");

  const gridItems = useMemo(() => {
    // Get all team members from the static data
    const allMembers = teamData.leadership.members;

    // Filter by position/role if needed
    let filteredMembers = allMembers;
    if (sortBy !== "all") {
      filteredMembers = allMembers.filter((member) => {
        const role = member.role?.toLowerCase() || "";
        switch (sortBy) {
          case "leads":
            return (
              role.includes("lead") ||
              role.includes("hod") ||
              role.includes("mentor")
            );
          case "coordinators":
            return role.includes("coordinator");
          case "current":
            return !member.isAlumni;
          case "alumni":
            return member.isAlumni;
          default:
            return true;
        }
      });
    }

    // Sort team members by role hierarchy, then by batch
    const sortedData = [...filteredMembers].sort((a, b) => {
      // Role hierarchy (higher priority first)
      const getRolePriority = (role) => {
        const r = role?.toLowerCase() || "";
        if (r.includes("ex hod") || r.includes("mentor")) return 1;
        if (r.includes("club lead") || r.includes("lead")) return 2;
        if (r.includes("coordinator")) return 3;
        return 4;
      };

      const priorityA = getRolePriority(a.role);
      const priorityB = getRolePriority(b.role);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same role priority, sort by batch (newest first)
      const batchA = parseInt(a.batch) || 0;
      const batchB = parseInt(b.batch) || 0;
      if (batchA !== batchB) {
        return batchB - batchA;
      }

      // If same batch, sort by ID (ascending)
      return (a.id || 0) - (b.id || 0);
    });

    return sortedData.map((m) => ({
      image: m.image || "",
      title: m.name || "Team Member",
      subtitle: m.department || "",
      handle: m.role || "",
      location: m.isAlumni ? `Alumni (${m.batch})` : `Current (${m.batch})`,
      url: m.social?.linkedin || m.social?.github || "",
      borderColor:
        m.role === "Ex HOD / Mentor"
          ? "#F59E0B"
          : m.role === "Club Lead"
          ? "#3B82F6"
          : "#64748B",
      gradient:
        m.role === "Ex HOD / Mentor"
          ? "linear-gradient(145deg,#F59E0B,#000)"
          : m.role === "Club Lead"
          ? "linear-gradient(210deg,#3B82F6,#000)"
          : "linear-gradient(165deg,#334155,#000)",
    }));
  }, [sortBy]);

  const sortOptions = [
    { value: "all", label: "All Members" },
    { value: "leads", label: "Club Leads" },
    { value: "coordinators", label: "Coordinators" },
    { value: "current", label: "Current Members" },
    { value: "alumni", label: "Alumni" },
  ];

  return (
    <main className="w-full min-h-screen bg-black">
      {/* Enhanced Header Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 md:py-32 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black"></div>

          {/* Animated geometric shapes */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-3xl"
          ></motion.div>

          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-white/3 to-white/8 rounded-full blur-2xl"
          ></motion.div>

          {/* Floating particles */}
          <motion.div
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"
          ></motion.div>

          <motion.div
            animate={{
              y: [20, -20, 20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/4 rounded-full blur-lg"
          ></motion.div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 md:mb-8"
            >
              <div className="inline-flex items-center gap-2 md:gap-3 mb-6 md:mb-8 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg bg-white/10 border border-white/20">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
                <span className="text-white font-semibold tracking-wide text-xs sm:text-sm md:text-base">
                  MEET OUR AMAZING TEAM
                </span>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative mb-6"
            >
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent relative">
                  Our Team
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 bg-clip-text text-transparent blur-sm -z-10"></div>
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-12"
            >
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Meet the brilliant minds and passionate engineers
                <br className="hidden md:block" />
                <span className="text-white font-medium">
                  {" "}
                  building the future of robotics
                </span>
              </p>
            </motion.div>

            {/* Sort Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 border backdrop-blur-sm ${
                    sortBy === option.value
                      ? "bg-white text-black border-white shadow-lg shadow-white/20"
                      : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {option.label}
                  <span className="ml-2 text-xs opacity-70">
                    {option.value === "all"
                      ? teamData.leadership.members.length
                      : option.value === "leads"
                      ? teamData.leadership.members.filter((m) => {
                          const role = m.role?.toLowerCase() || "";
                          return (
                            role.includes("lead") ||
                            role.includes("hod") ||
                            role.includes("mentor")
                          );
                        }).length
                      : option.value === "coordinators"
                      ? teamData.leadership.members.filter((m) => {
                          const role = m.role?.toLowerCase() || "";
                          return role.includes("coordinator");
                        }).length
                      : option.value === "current"
                      ? teamData.leadership.members.filter((m) => !m.isAlumni)
                          .length
                      : teamData.leadership.members.filter((m) => m.isAlumni)
                          .length}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              className="mt-8 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
            ></motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-12"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors duration-300"
              >
                <span className="text-xs font-medium tracking-wider uppercase">
                  Scroll to explore
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </motion.section>

      {/* Team Grid Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative py-16 px-6"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Team Grid */}
          <motion.div
            key={sortBy} // Force re-animation when filter changes
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            {/* Grid background overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px",
                }}
              ></div>
            </div>

            <ChromaGrid items={gridItems} />
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

export default Team;
