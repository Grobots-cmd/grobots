import React from "react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import ScrollReveal from "../animations/scrollReveal";
import CardSwap, { Card } from "../../blocks/Components/CardSwap/CardSwap";

function About() {
  const { isMobile } = useIsMobile();
  const isDesktop = !isMobile;

  const cards = [
    {
      title: "Innovation",
      description: "Pioneering breakthrough technologies that reshape how we interact with machines and automation.",
      imageUrl: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg",
      gradient: "bg-gradient-to-br from-gray-800 to-zinc-950",
    },
    {
      title: "Design",
      description: "Creating intuitive and elegant robotic solutions that seamlessly integrate into daily life.",
      imageUrl: "https://images.pexels.com/photos/9029803/pexels-photo-9029803.jpeg",
      gradient: "bg-gradient-to-br from-slate-800 to-gray-950",
    },
    {
      title: "Future",
      description: "Building tomorrow's technology today with sustainable and scalable robotic ecosystems.",
      imageUrl: "https://images.pexels.com/photos/8566627/pexels-photo-8566627.jpeg",
      gradient: "bg-gradient-to-br from-zinc-800 to-slate-950",
    },
    {
      title: "Impact",
      description: "Empowering industries and communities through transformative robotic solutions.",
      imageUrl: "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg",
      gradient: "bg-gradient-to-br from-neutral-800 to-zinc-950",
    },
  ];

  return (
    <div className="relative min-h-[30vh] border-b border-gray-300 pb-12 sm:pb-14 md:pb-16 lg:pb-20">
      <div className="pt-10 sm:pt-14 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className={`flex flex-col ${isDesktop ? "lg:flex-row gap-6" : "gap-4"} items-start`}>
          {/* Left side - Text content */}
          <div className={`flex flex-col gap-4 ${isDesktop ? "lg:w-1/2" : "w-full"}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight self-start">
              About Us
            </h1>
            <div className="mt-2 text-white text-base sm:text-lg md:text-xl lg:text-2xl mx-1 sm:mx-0 leading-relaxed text-gray-700 dark:text-gray-300">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur={true}
                baseRotation={0}
                blurStrength={8}
                scrub={false}
                once={true}
              >
                  We are at the forefront of robotics innovation, creating cutting-edge solutions that bridge the gap between imagination and reality.
                  Our team of passionate engineers and designers work tirelessly to develop robots that enhance human capabilities and solve real-world challenges.
                  From autonomous systems to interactive companions, we're shaping the future of technology one innovation at a time.
              </ScrollReveal>
            </div>
          </div>

          {/* Right side - CardSwap component - Only show on desktop */}
          {isDesktop && (
            <div className="lg:w-1/2 w-full relative h-[300px] sm:h-[420px] md:h-[480px] lg:h-[500px] mr-12 mb-20">
              <CardSwap
                cardDistance={60}
                verticalDistance={70}
                delay={4000}
                pauseOnHover={true}
                width={550}
                height={450}
              >
                {cards.map((card, index) => (
                  <Card
                    key={index}
                    className={`${card.gradient} text-white p-6 flex flex-col justify-between items-start rounded-xl shadow-lg`}
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                      <p className="text-lg leading-relaxed text-left">
                        {card.description}
                      </p>
                    </div>
                    <div className="w-full flex justify-center mt-4 flex-1">
                      <div className="w-full h-[280px] bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden min-h-[80px]">
                        <img
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          src={card.imageUrl}
                          alt={card.title}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          )}
        </div>

        {/* Mobile: Stacked cards */}
        {!isDesktop && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${card.gradient} text-white p-4 sm:p-5 rounded-xl shadow-lg flex flex-col`}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{card.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed mb-4 flex-1">
                  {card.description}
                </p>
                <div className="w-full h-40 sm:h-48 bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={card.imageUrl}
                    alt={card.title}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
