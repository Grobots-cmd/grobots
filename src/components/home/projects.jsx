import React, { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Airawat1 from "@/assets/Airawat1.jpg"
import Sharanga1 from "@/assets/Sharanga1.jpg"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

function Projects() {
  const projects = [
    {
      id: 1,
      title: "Airawat – Semi-Vertical Drum Combat Robot",
      imageUrl: Airawat1,
      description:
        "Lightweight yet durable Aluminium T6 alloy chassis with AR500 paneling. Semi-vertical drum weapon tuned for high-impact energy transfer. Optimized drive with Inginium P2 10 gearbox, H700 motor and Secure 120A ESC for torque–speed balance. Designed for endurance and striking power in combat competitions.",
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
        "Rugged Aluminium T6 chassis with AR500 paneling for maximum durability. Semi-vertical drum weapon engineered for precision hits and consistent damage. Inginium P219 gearbox with turbo motors provides superior acceleration and control. Collson wheels enhance grip and agility for battlebot tournaments.",
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

  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    adaptiveHeight: false,
    arrows: false,
    dots: true,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  return (
    <section className="w-full mt-8 sm:mt-12 md:mt-16 py-8 sm:py-12 md:py-16 lg:py-20 bg-black">
      <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-20">
        <header className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white mb-2 sm:mb-3">
            Featured Projects
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
            A snapshot of what we're building
          </p>
        </header>

        <div className="max-w-7xl mx-auto relative">
          <Slider ref={sliderRef} {...settings}>
            {projects.map((project) => (
              <ProjectSection key={project.id} project={project} />
            ))}
          </Slider>

          {/* Navigation Arrows */}
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="absolute left-2 sm:left-4 md:left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="absolute right-2 sm:right-4 md:right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectSection({ project }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] xl:min-h-[750px]">
      {/* Image Section */}
      <div className="w-full lg:w-2/3 h-64 sm:h-96 md:h-96 lg:h-auto overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 flex flex-col justify-center bg-black text-white">
        <div className="mb-4 sm:mb-5 md:mb-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full border border-white/30 bg-white/10 text-white transition-all duration-300 hover:bg-white/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            {project.title}
          </h3>
        </div>

        {/* Mobile & Tablet: Collapsible content */}
        <div className="lg:hidden">
          {!isExpanded ? (
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-5 mb-4">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {project.description}
              </p>

              {/* Materials */}
              {project.materials && (
                <div>
                  <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Materials Used</h4>
                  <div className="space-y-2">
                    {Object.entries(project.materials).map(([k, v]) => (
                      <div key={k} className="flex items-start gap-2 sm:gap-3">
                        <span className="w-2 h-2 rounded-full bg-white mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="text-sm sm:text-base text-gray-300">
                          <span className="font-medium">{k}:</span> {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weapon System */}
              {project.weaponSystem && (
                <div>
                  <h4 className="text-sm sm:text-base font-semibold mb-2">Weapon System</h4>
                  <p className="text-sm sm:text-base text-gray-300">{project.weaponSystem}</p>
                </div>
              )}

              {/* Drive System */}
              {project.driveSystem && project.driveSystem.length > 0 && (
                <div>
                  <h4 className="text-sm sm:text-base font-semibold mb-2">Drive System</h4>
                  <ul className="space-y-1 sm:space-y-2">
                    {project.driveSystem.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="w-2 h-2 rounded-full bg-white mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="text-sm sm:text-base text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h4 className="text-sm sm:text-base font-semibold mb-2">Key Highlights</h4>
                  <ul className="space-y-1 sm:space-y-2">
                    {project.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="w-2 h-2 rounded-full bg-white mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="text-sm sm:text-base text-gray-300">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm sm:text-base font-medium hover:text-gray-300 transition-colors duration-300 group"
          >
            {isExpanded ? "Show Less" : "Read More"}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-1 sm:ml-2 transition-transform duration-300 group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-y-0.5" />
            )}
          </button>
        </div>

        {/* Desktop & Large screens: Full layout */}
        <div className="hidden lg:block space-y-3 lg:space-y-4 xl:space-y-5">
          <p className="text-sm lg:text-base xl:text-lg text-gray-300 leading-relaxed">
            {project.description}
          </p>

          {/* Materials */}
          {project.materials && (
            <div>
              <h4 className="text-sm lg:text-base xl:text-lg font-semibold mb-2 lg:mb-3">Materials</h4>
              <div className="space-y-1 lg:space-y-2">
                {Object.entries(project.materials).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2 lg:gap-3">
                    <span className="w-2 h-2 rounded-full bg-white mt-1.5 lg:mt-2 flex-shrink-0"></span>
                    <span className="text-sm lg:text-base xl:text-lg text-gray-300">
                      <span className="font-medium">{k}:</span> {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weapon System */}
          {project.weaponSystem && (
            <div>
              <h4 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">Weapon System</h4>
              <p className="text-sm lg:text-base xl:text-lg text-gray-300">
                {project.weaponSystem}
              </p>
            </div>
          )}

          {/* Drive System */}
          {project.driveSystem && project.driveSystem.length > 0 && (
            <div>
              <h4 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">Drive System</h4>
              <div className="flex flex-wrap gap-x-3 lg:gap-x-4 gap-y-1 lg:gap-y-2">
                {project.driveSystem.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 lg:gap-2">
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white flex-shrink-0"></span>
                    <span className="text-sm lg:text-base xl:text-lg text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h4 className="text-sm lg:text-base xl:text-lg font-semibold mb-1 lg:mb-2">Key Highlights</h4>
              <div className="space-y-1 lg:space-y-2">
                {project.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 lg:gap-3">
                    <span className="w-2 h-2 rounded-full bg-white mt-1.5 lg:mt-2 flex-shrink-0"></span>
                    <span className="text-sm lg:text-base xl:text-lg text-gray-300">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
