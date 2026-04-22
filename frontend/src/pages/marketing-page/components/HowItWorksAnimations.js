import React from 'react';
import { motion } from 'framer-motion';

// 1. Planner Bot: Typing chat bubbles representing AI conversation
export const PlannerBotAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 p-4 sm:p-6 overflow-hidden relative">
      {/* Background decoration elements tied to your theme */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-amber-500/10 rounded-full blur-2xl"></div>
      
      <div className="w-full max-w-sm flex flex-col gap-4 z-10">
        {/* User Message */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white p-3 sm:p-4 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 self-start w-[85%] relative overflow-hidden"
        >
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            "I want to retire at <span className="text-amber-600 font-bold">65</span> with a comfortable lifestyle."
          </p>
        </motion.div>
        
        {/* AI Reply Message */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 sm:p-4 rounded-2xl rounded-tr-sm shadow-lg self-end w-[85%]"
        >
          <p className="text-xs sm:text-sm text-white font-medium drop-shadow-sm leading-relaxed">
            "Perfect! I've calculated a monthly savings target to reach that goal. Let's create your plan."
          </p>
        </motion.div>

        {/* Action Plan Generated Notification */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5, type: 'spring' }}
          className="bg-white p-3 sm:p-4 rounded-xl shadow-md border-l-4 border-amber-500 mt-2 flex items-center gap-3 self-center w-full"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
            ✓
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold text-gray-900">Plan Generated</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Ready for review</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 2. My Plans: Rising bar charts representing dashboards and tracking
export const MyPlansAnimation = () => {
  // Chart heights matching realistic fluctuations
  const chartHeights = [40, 65, 45, 80, 55, 100];
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-amber-700/10 to-yellow-500/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-sm bg-white p-5 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-56 sm:h-64 justify-between z-10">
        
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-gray-800">Retirement Growth</h4>
            <p className="text-[10px] sm:text-xs text-amber-600 font-medium">On Track • +12%</p>
          </div>
          <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold rounded-lg truncate">
            $850,000
          </div>
        </div>

        {/* Animated Bar Chart */}
        <div className="flex justify-between items-end h-32 gap-1.5 sm:gap-2">
          {chartHeights.map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.2 + (i * 0.15), duration: 0.8, type: "spring", bounce: 0.4 }}
              className={`flex-1 rounded-t-md opacity-95 transition-opacity ${
                i === chartHeights.length - 1 
                  ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Download Plan: A repeating "document printing/downloading" loop
export const DownloadAnimation = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-amber-600/10 rounded-full blur-2xl"></div>

      {/* Moving PDF Document */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: [ -100, 10, 10 ], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 3, times: [0, 0.5, 1], ease: "easeInOut" }}
        className="w-32 sm:w-40 h-44 sm:h-52 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col p-4 sm:p-5 absolute z-10"
      >
        {/* Document Header/Logo area */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 mb-4 shadow-sm flex items-center justify-center">
          <span className="text-white font-bold text-xs">PDF</span>
        </div>
        {/* Simulated Text Lines */}
        <div className="w-3/4 h-2.5 sm:h-3 bg-gray-200 rounded-full mb-3" />
        <div className="w-full h-2 sm:h-2 bg-gray-100 rounded-full mb-2" />
        <div className="w-5/6 h-2 sm:h-2 bg-gray-100 rounded-full mb-2" />
        <div className="w-1/2 h-2 sm:h-2 bg-gray-100 rounded-full mb-2" />
        
        {/* Highlighted section */}
        <div className="w-full h-6 sm:h-8 bg-amber-50 border border-amber-100 rounded mt-auto flex items-center px-2">
          <div className="w-2/3 h-1.5 sm:h-2 bg-amber-300 rounded-full"></div>
        </div>
      </motion.div>
      
      {/* Target Folder / Device */}
      <div className="w-40 sm:w-48 h-20 border-b-4 border-l-4 border-r-4 border-gray-800 rounded-b-2xl absolute bottom-[15%] z-20 bg-gradient-to-t from-gray-50/90 to-transparent flex items-end justify-center pb-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]">
        {/* Progress Bar inside the device slot */}
        <div className="w-24 sm:w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, times: [0, 0.5, 1], ease: "linear" }}
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
          />
        </div>
      </div>
    </div>
  );
};

// Controller to render the currently selected animation
export default function FeatureAnimationRender({ index }) {
  return (
    <div className="w-full h-full overflow-hidden rounded-xl sm:rounded-2xl">
      {index === 0 && <PlannerBotAnimation />}
      {index === 1 && <MyPlansAnimation />}
      {index === 2 && <DownloadAnimation />}
    </div>
  );
}