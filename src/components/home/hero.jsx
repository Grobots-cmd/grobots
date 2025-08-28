"use client";
import React, { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";

function Hero() {
  const splineWrapperRef = useRef(null);
  const { isMobile } = useIsMobile();
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  useEffect(() => {
    if (!isMobile && splineWrapperRef.current) {
      const canvas = splineWrapperRef.current.querySelector("canvas");
      if (canvas) {
        canvas.style.touchAction = "none";
        canvas.style.userSelect = "none";
        canvas.style.webkitUserSelect = "none";
        canvas.style.webkitTouchCallout = "none";
        canvas.style.pointerEvents = "auto";
      }
    }
  }, [isMobile, splineLoaded]);

  const handleSplineLoad = () => setSplineLoaded(true);
  const handleSplineError = () => setSplineError(true);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {!isMobile && !splineError && (
        <div
          ref={splineWrapperRef}
          className="absolute inset-0 z-10 spline-container mt-18 mx-2"
        >
          <Spline
            scene="https://prod.spline.design/H1bo-En2Ru5vpwQZ/scene.splinecode"
            style={{
              width: "100%",
              height: "100%",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            onLoad={handleSplineLoad}
            onError={handleSplineError}
          />
        </div>
      )}

      {(isMobile || splineError) && <MobileVantaBackground />}
      {(isMobile || splineError) && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.35)_30%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.6))]" />
      )}

      {isMobile && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pt-safe pb-safe">
          <div className="w-full max-w-xl text-white text-center">
            <div className="mx-auto rounded-2xl backdrop-blur-[2px] bg-white/0">
              <h1 className="text-5xl leading-none md:text-6xl font-extrabold tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                Robotics Club
              </h1>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                SRMCEM
              </h2>
              <p className="mt-5 text-base md:text-lg text-white/80 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                Join us to explore innovation, engineering marvels, and the limitless
                possibilities of robotics shaping our future.
              </p>

              <div className="mt-7 flex items-center justify-center gap-3">
                <a
                  href="#projects"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-yellow-400 text-black shadow-[0_10px_25px_-10px_rgba(250,204,21,0.9)] active:scale-95 transition-transform"
                >
                  Explore Projects
                </a>
                <a
                  href="/team"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/30 text-white/90 bg-white/0 backdrop-blur-[2px] active:scale-95 transition-transform"
                >
                  Meet the Team
                </a>
              </div>

              <p className="mt-4 text-xs text-white/60">
                Scroll to discover more
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function MobileVantaBackground() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = FOG({
        el: vantaRef.current,
        THREE,
        mouseControls: false,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        // Deep, readable palette matching site theme
        baseColor: 0x070713,       // near-black base
        lowlightColor: 0x120a3a,   // deep indigo
        midtoneColor: 0x5b2cd6,    // purple
        highlightColor: 0x58a6ff,  // soft blue accents
        blurFactor: 0.8,           // smoother fog
        speed: 1.4,                // gentle motion
        zoom: 0.75,                // slight depth
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      id="background-landing"
      className="absolute inset-0 z-0 w-full h-full"
    />
  );
}

export default Hero;