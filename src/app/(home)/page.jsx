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
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.2}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays mb-12"
      />        
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