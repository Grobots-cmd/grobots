import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  const data = items?.length
    ? items
    : [
        {
          image: "https://i.pravatar.cc/300?img=60",
          title: "Tyler Rodriguez",
          subtitle: "Cloud Architect",
          handle: "@tylerrod",
          borderColor: "#06B6D4",
          gradient: "linear-gradient(135deg,#06B6D4,#000)",
          url: "https://aws.amazon.com/",
        }
      ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Adjust breakpoint as needed
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 sm:gap-4 md:gap-6 ${className}`}
      style={{
        "--r": `${radius}px`,
        "--x": "50%",
        "--y": "50%",
      }}
    >
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          className={`group relative flex flex-col rounded-[24px] overflow-hidden border-2 border-white/20 backdrop-blur-sm transition-all duration-500 cursor-pointer hover:border-white/40 hover:bg-black/60 hover:shadow-white/10
            w-[calc(100vw-2rem)] 
            xs:w-[calc(50vw-1.5rem)] 
            sm:w-[280px] 
            md:w-[300px] 
            lg:w-[320px] 
            xl:w-[340px]
            h-[400px] 
            sm:h-[420px] 
            md:h-[440px] 
            lg:h-[460px]`}
          style={{
            "--card-border": c.borderColor || "rgba(255,255,255,0.2)",
            background: `linear-gradient(145deg, ${
              c.borderColor || "#333"
            }15, rgba(0,0,0,0.95))`,
            "--spotlight-color": "rgba(255,255,255,0.15)",
          }}
        >
          {/* Enhanced spotlight effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 60%)",
            }}
          />

          {/* Image container with improved sizing */}
          <div className="relative z-10 flex-1 p-3 sm:p-4 box-border">
            <div className="relative w-full h-[240px] sm:h-[260px] md:h-[280px] lg:h-[300px] rounded-[16px] overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors duration-300">
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 object-center"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/340x300/1f2937/ffffff?text=Team+Member";
                }}
              />
            </div>
          </div>

          {/* Enhanced footer with better typography */}
          <footer className="relative z-10 p-4 sm:p-5 text-white font-sans bg-black/60 backdrop-blur-sm border-t border-white/10">
            <div className="space-y-2">
              {/* Name and handle row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-bold leading-tight text-white group-hover:text-gray-100 transition-colors duration-300 flex-1 min-w-0">
                  {c.title}
                </h3>
                {c.handle && (
                  <span className="text-xs sm:text-sm text-gray-400 font-medium shrink-0 max-w-[40%] truncate">
                    {c.handle}
                  </span>
                )}
              </div>

              {/* Subtitle and location row */}
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm sm:text-base text-gray-300 leading-tight flex-1 min-w-0 truncate">
                  {c.subtitle}
                </p>
                {c.location && (
                  <span className="text-xs text-gray-500 font-medium shrink-0 max-w-[40%] truncate">
                    {c.location}
                  </span>
                )}
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </footer>

          {/* Enhanced border glow effect */}
          <div
            className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(145deg, transparent, ${
                c.borderColor || "#fff"
              }20, transparent)`,
              padding: "1px",
            }}
          >
            <div className="w-full h-full rounded-[23px] bg-transparent"></div>
          </div>
        </article>
      ))}

      {/* Enhanced grayscale overlay for desktop only */}
      {isDesktop && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              backdropFilter: "grayscale(0.7) brightness(0.8) contrast(1.1)",
              WebkitBackdropFilter:
                "grayscale(0.7) brightness(0.8) contrast(1.1)",
              background: "rgba(0,0,0,0.001)",
              maskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 10%,rgba(0,0,0,0.05) 25%,rgba(0,0,0,0.15) 40%,rgba(0,0,0,0.30) 55%,rgba(0,0,0,0.50) 70%,rgba(0,0,0,0.70) 85%,white 100%)",
              WebkitMaskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 10%,rgba(0,0,0,0.05) 25%,rgba(0,0,0,0.15) 40%,rgba(0,0,0,0.30) 55%,rgba(0,0,0,0.50) 70%,rgba(0,0,0,0.70) 85%,white 100%)",
            }}
          />
          <div
            ref={fadeRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-[300ms] z-40"
            style={{
              backdropFilter: "grayscale(0.7) brightness(0.8) contrast(1.1)",
              WebkitBackdropFilter:
                "grayscale(0.7) brightness(0.8) contrast(1.1)",
              background: "rgba(0,0,0,0.001)",
              maskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 10%,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.85) 40%,rgba(255,255,255,0.70) 55%,rgba(255,255,255,0.50) 70%,rgba(255,255,255,0.30) 85%,transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 10%,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.85) 40%,rgba(255,255,255,0.70) 55%,rgba(255,255,255,0.50) 70%,rgba(255,255,255,0.30) 85%,transparent 100%)",
              opacity: 1,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ChromaGrid;
