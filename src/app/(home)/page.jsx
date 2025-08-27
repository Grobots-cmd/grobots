"use client";

import React from "react";
import LightRays from "@/components/home/spotlight";
import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import Projects from "@/components/home/projects";
import AchievementsTimeline from "@/components/achievements/AchievementsTimeline";

function Home() {
  return (
    <>
      <div className="home relative w-full">
        <LightRays />
        <Hero/>
        <About />
        <Projects />
        <div className="w-full h-full rounded-2xl">
          <AchievementsTimeline />
        </div>
      </div>
    </>
  );
}

export default Home;