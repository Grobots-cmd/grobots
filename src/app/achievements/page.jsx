"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  MapPin,
  Award,
  Star,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react";

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch achievements
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

  // Helper functions for styling
  const getPositionIcon = (position) => {
    if (
      position.toLowerCase().includes("1st") ||
      position.toLowerCase().includes("first")
    ) {
      return <Crown className="w-5 h-5" />;
    } else if (
      position.toLowerCase().includes("2nd") ||
      position.toLowerCase().includes("second")
    ) {
      return <Medal className="w-5 h-5" />;
    } else if (
      position.toLowerCase().includes("3rd") ||
      position.toLowerCase().includes("third")
    ) {
      return <Award className="w-5 h-5" />;
    }
    return <Trophy className="w-5 h-5" />;
  };

  const getPositionColors = (position) => {
    if (
      position.toLowerCase().includes("1st") ||
      position.toLowerCase().includes("first")
    ) {
      return {
        bg: "bg-white text-black",
        border: "border-white",
      };
    } else if (
      position.toLowerCase().includes("2nd") ||
      position.toLowerCase().includes("second")
    ) {
      return {
        bg: "bg-gray-300 text-black",
        border: "border-gray-300",
      };
    } else if (
      position.toLowerCase().includes("3rd") ||
      position.toLowerCase().includes("third")
    ) {
      return {
        bg: "bg-gray-500 text-white",
        border: "border-gray-500",
      };
    }
    return {
      bg: "bg-white text-black",
      border: "border-white",
    };
  };

  const getCategoryBadge = (achievement) => {
    return {
      color: "bg-white text-black",
      label: achievement.location?.toLowerCase().includes("international")
        ? "International"
        : achievement.location?.toLowerCase().includes("national")
        ? "National"
        : achievement.nameOfEvent?.toLowerCase().includes("innovation")
        ? "Innovation"
        : "Competition",
    };
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!Array.isArray(achievements) || achievements.length === 0) {
      return { total: 0, firstPlace: 0, years: 0 };
    }
    const firstPlace = achievements.filter((a) => {
      const position = (a.winningPosition || "").toLowerCase();
      return position.includes("first") || position.includes("1st");
    }).length;
    const years = new Set();
    achievements.forEach((a) => {
      if (a.dateOfEvent) {
        try {
          const year = new Date(a.dateOfEvent).getFullYear();
          years.add(year);
        } catch (e) {
          console.warn("⚠️ Failed to parse date:", a.dateOfEvent);
        }
      }
    });
    return {
      total: achievements.length,
      firstPlace,
      years: years.size,
    };
  }, [achievements]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchAchievements();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          {/* Enhanced spinner with smoother animation */}
          <motion.div
            className="w-12 h-12 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
            }}
            aria-label="Loading achievements"
          />
  
          {/* Enhanced text with subtle animation */}
          <motion.p
            className="text-white text-sm md:text-lg font-medium"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            Loading achievements...
          </motion.p>
        </div>
      </div>
    );
  }
  

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-4xl md:text-6xl mb-4">⚠️</div>
          <h1 className="text-xl md:text-2xl font-semibold mb-2 text-white">
            Something went wrong
          </h1>
          <p className="text-gray-300 mb-4 text-sm md:text-base px-2">
            Unable to load achievements at the moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={handleRefresh}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm md:text-base"
            >
              Try again
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
            >
              Reload page
            </motion.button>
          </div>
          <div className="mt-4 p-3 bg-gray-800 border border-gray-600 rounded text-xs md:text-sm text-gray-300">
            <strong>Error details:</strong> {String(error)}
          </div>
        </div>
      </div>
    );
  }

  // Render achievements
  return (
    <div className="min-h-screen bg-black relative">
      <div className="relative">
        {/* Header */}
        <div className="pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 md:mb-8"
            >
              <div className="inline-flex items-center gap-2 md:gap-3 mb-6 md:mb-8 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg bg-white/10 border border-white/20">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
                <span className="text-white font-semibold tracking-wide text-xs sm:text-sm md:text-base">
                  HALL OF FAME
                </span>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative mb-6"
            >
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent relative">
                  Our Achievements
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 bg-clip-text text-transparent blur-sm -z-10"></div>
                </span>
              </span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-12"
            >
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Celebrating our Achievements on the path to excellence
                <br className="hidden md:block" />
                <span className="text-white font-medium"> one at a time</span>
              </p>
            </motion.div>
            {/* Stats */}
            <motion.div
              className="flex xs:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4 md:py-6 rounded-lg bg-white/5 border border-white/20 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center min-w-0 flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {stats.total}
                </div>
                <div className="text-xs sm:text-xs uppercase tracking-wide text-gray-400">
                  Total Wins
                </div>
              </div>
              <div className="text-center min-w-0 flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {stats.firstPlace}
                </div>
                <div className="text-xs sm:text-xs uppercase tracking-wide text-gray-400">
                  First Place
                </div>
              </div>
              <div className="text-center min-w-0 flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {stats.years}
                </div>
                <div className="text-xs sm:text-xs uppercase tracking-wide text-gray-400">
                  Years Active
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <div className="px-4 sm:px-6 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {achievements.map((achievement, index) => {
                  const positionColors = getPositionColors(achievement.winningPosition);
                  const categoryBadge = getCategoryBadge(achievement);
                  return (
                    <motion.div
                      key={achievement._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="group w-full"
                    >
                      {/* Bigger Card */}
                      <div className="bg-white/5 border border-white/20 rounded-xl p-5 sm:p-6 md:p-7 h-full hover:bg-white/10 transition-all duration-300">
                        {/* Header */}
                        <div className="mb-5 md:mb-6">
                          {/* Category Badge */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold mb-3 sm:mb-4 ${categoryBadge.color}`}
                          >
                            <Star className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{categoryBadge.label}</span>
                          </div>
                          {/* Event Title */}
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight mb-3 sm:mb-4 line-clamp-2 break-words">
                            {achievement.nameOfEvent}
                          </h3>
                          {/* Position Badge */}
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm ${positionColors.bg} max-w-full`}
                          >
                            <span className="flex-shrink-0">
                              {getPositionIcon(achievement.winningPosition)}
                            </span>
                            <span className="truncate">{achievement.winningPosition}</span>
                          </div>
                        </div>

                        {/* Bigger Image */}
                        {Array.isArray(achievement.images) && achievement.images[0] ? (
                          <div className="mb-4 sm:mb-5 rounded-lg overflow-hidden border border-white/20">
                            <img
                              src={achievement.images[0]}
                              alt={achievement.nameOfEvent}
                              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover object-center"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="mb-4 sm:mb-5 rounded-lg border border-white/20 bg-white/5 h-48 sm:h-56 md:h-64 lg:h-72 flex items-center justify-center">
                            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white/30" />
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                          {achievement.dateOfEvent && (
                            <div className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                              <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 mt-0.5" />
                              <span className="break-words">
                                {new Date(achievement.dateOfEvent).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          {achievement.location && (
                            <div className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                              <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 mt-0.5" />
                              <span className="break-words">{achievement.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {achievement.shortDescription && (
                          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 line-clamp-3 break-words">
                            {achievement.shortDescription}
                          </p>
                        )}

                        {/* Prize */}
                        {achievement.prizeWon && (
                          <div className="pt-4 sm:pt-5 border-t border-white/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white flex-shrink-0" />
                              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                Prize
                              </span>
                            </div>
                            <div className="text-sm sm:text-base text-white font-medium line-clamp-2 break-words">
                              {achievement.prizeWon}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-6 pb-12 md:pb-20">
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="py-12 md:py-16"
              >
                <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🏆</div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-gray-400 mb-6 text-sm sm:text-base px-4">
                  Our achievements will appear here soon.
                </p>
                <motion.button
                  onClick={handleRefresh}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm sm:text-base"
                >
                  Refresh Data
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Achievements;