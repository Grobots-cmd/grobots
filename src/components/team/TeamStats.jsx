import React from 'react';
import { motion } from 'framer-motion';

const TeamStats = ({ teamStats }) => {
  const stats = [
    { 
      value: teamStats.total, 
      label: "Total Members", 
      color: "text-primary",
      bgColor: "from-primary/20 to-primary/5"
    },
    { 
      value: teamStats.current, 
      label: "Current Members", 
      color: "text-green-400",
      bgColor: "from-green-400/20 to-green-400/5"
    },
    { 
      value: teamStats.alumni, 
      label: "Alumni", 
      color: "text-blue-400",
      bgColor: "from-blue-400/20 to-blue-400/5"
    },
    { 
      value: teamStats.leads, 
      label: "Leadership", 
      bgColor: "from-amber-400/20 to-amber-400/5"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="py-16 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300`}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + (0.1 * index), type: "spring" }}
                className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TeamStats;
