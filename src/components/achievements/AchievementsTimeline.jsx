import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AchievementItem = ({ achievement, isLeft, index }) => {
  const {
    nameOfEvent,
    location,
    dateOfEvent,
    winningPosition,
    shortDescription,
    longDescription,
  } = achievement;

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPositionIcon = (position) => {
    if (
      position.toLowerCase().includes("first") ||
      position.toLowerCase().includes("1st")
    ) {
      return "🥇";
    }
    if (
      position.toLowerCase().includes("second") ||
      position.toLowerCase().includes("2nd")
    ) {
      return "🥈";
    }
    if (
      position.toLowerCase().includes("third") ||
      position.toLowerCase().includes("3rd")
    ) {
      return "🥉";
    }
    return "🏆";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
      }}
      className={`mb-8 md:mb-12 flex justify-between ${
        isLeft
          ? "md:flex-row-reverse flex-col items-center w-full"
          : "flex-col md:flex-row items-center w-full"
      }`}
    >
      <div className="order-1 w-full md:w-5/12 hidden md:block"></div>
      <div
        className={`order-1 w-full md:w-5/12 px-4 md:px-6 py-4 md:py-6 ${
          isLeft ? "md:text-right text-left" : "text-left"
        }`}
      >
        {/* Organic card design */}
        <div className="relative group">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/20 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:border-purple-400/40 transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2">
            <p className="mb-3 md:mb-4 text-base md:text-lg text-gray-300 font-medium">
              {formatDate(dateOfEvent)}
            </p>
            <h4 className="mb-3 md:mb-4 font-bold text-xl md:text-2xl lg:text-3xl flex items-center gap-2 md:gap-3 text-white">
              <span className="text-2xl md:text-3xl">
                {getPositionIcon(winningPosition)}
              </span>
              <span className="leading-tight">{nameOfEvent}</span>
            </h4>
            <p className="mb-3 md:mb-4 text-sm md:text-base text-blue-300 font-medium">
              📍 {location}
            </p>
            <div className="mb-3 md:mb-4 inline-block">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm transform rotate-1 hover:rotate-0 transition-transform duration-300">
                {winningPosition}
              </div>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-gray-200">
              {longDescription || shortDescription}
            </p>
          </div>
          {/* Organic glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-20 rounded-2xl md:rounded-3xl blur-xl transition-opacity duration-500"></div>
        </div>
      </div>
    </motion.div>
  );
};

const AchievementsTimeline = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple function to fetch achievements
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/achievements");
      if (!response.ok) {
        throw new Error("Failed to fetch achievements");
      }

      const data = await response.json();
      setAchievements(data.achievements || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <section className="text-white py-8 md:py-16">
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-gray-200 text-lg">Loading our journey...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="text-white py-8 md:py-16">
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-400 text-2xl mb-4">
            💥 Something went wrong
          </div>
          <p className="text-gray-200 mb-6">{error}</p>
          <button
            onClick={fetchAchievements}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="text-white py-8 md:py-16">
      <div className="container mx-auto flex flex-col items-start lg:flex-row my-6 md:my-12 lg:my-24">
        {/* Header Section */}
        <div className="flex flex-col w-full lg:sticky lg:top-36 lg:w-1/3 mt-2 md:mt-12 px-4 md:px-8 mb-8 lg:mb-0">
          <p className="ml-2 text-gray-400 font-semibold uppercase tracking-loose mb-3 md:mb-4 text-sm md:text-base">
            Our Story
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-normal lg:leading-relaxed mb-4 md:mb-6 font-black text-white">
            Every Victory Tells a Story
          </h2>
          <p className="text-base md:text-lg text-gray-200 mb-6 md:mb-8 leading-relaxed">
            From our first competition to our latest triumph, each achievement
            represents countless hours of dedication, innovation, and teamwork.
          </p>
          <div className="space-y-2 md:space-y-3 text-gray-200">
            <p className="flex items-center">
              <span className="text-xl md:text-2xl mr-2 md:mr-3">📊</span>
              <span className="font-semibold text-sm md:text-base">
                Total Achievements:
              </span>
              <span className="text-gray-300 font-bold ml-2 text-sm md:text-base">
                {achievements.length}
              </span>
            </p>
            <p className="flex items-center">
              <span className="text-xl md:text-2xl mr-2 md:mr-3">🏆</span>
              <span className="font-semibold text-sm md:text-base">
                Latest Update:
              </span>
              <span className="text-gray-300 font-bold ml-2 text-sm md:text-base">
                {achievements.length > 0
                  ? new Date(achievements[0]?.dateOfEvent).getFullYear()
                  : "No data"}
              </span>
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="ml-0 lg:ml-12 lg:w-2/3 w-full">
          <div className="container mx-auto w-full h-full">
            <div className="relative wrap overflow-hidden p-4 md:p-10 h-full">
              {/* Organic timeline line - hidden on mobile, centered line on larger screens */}
              <div className="absolute h-full w-0.5 md:w-1 bg-yellow-500 left-4 md:left-1/2 transform md:-translate-x-1/2 rounded-full hidden md:block"></div>

              {/* Mobile timeline dots */}
              <div className="md:hidden">
                {achievements.map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-3 h-3 bg-yellow-500 rounded-full left-2.5"
                    style={{ top: `${index * 320 + 80}px` }}
                  ></div>
                ))}
              </div>

              {/* Achievements */}
              {achievements.map((achievement, index) => {
                return (
                  <AchievementItem
                    key={achievement._id || index}
                    achievement={achievement}
                    isLeft={index % 2 === 0}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Organic decoration */}
            <div className="text-center mt-6 md:mt-8">
              <div className="inline-block p-3 md:p-4 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <img
                  className="mx-auto -mt-24 md:-mt-36 w-16 md:w-auto"
                  src="https://user-images.githubusercontent.com/54521023/116968861-ef21a000-acd2-11eb-95ac-a34b5b490265.png"
                  alt="Timeline decoration"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsTimeline;
