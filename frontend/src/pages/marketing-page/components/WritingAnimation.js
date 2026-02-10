import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function WritingAnimation() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Check if user is logged in
  const checkTokenValidity = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const token = localStorage.getItem('token');
  const isLoggedIn = checkTokenValidity(token);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(progress + 1.5);
      }
    }, 40);
    return () => clearTimeout(timer);
  }, [progress]);

  // Enhanced data points
  const dataPoints = [
    { year: '25', value: 8, amount: '$50K' },
    { year: '35', value: 22, amount: '$200K' },
    { year: '45', value: 40, amount: '$500K' },
    { year: '55', value: 68, amount: '$850K' },
    { year: '65', value: 95, amount: '$1.2M' }
  ];

  return (
    <div className="!flex !flex-col !items-center !justify-center !py-16">
      {/* Enhanced Graph Container */}
      <motion.div
        className="!relative !w-[32rem] !h-80 !rounded-2xl !shadow-2xl !p-8 !border-0 !overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 50%, #fff5e6 100%)',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      >

        {/* Floating background elements */}
        <motion.div
          className="!absolute !top-4 !right-4 !w-3 !h-3 !rounded-full !opacity-20"
          style={{ backgroundColor: '#FFD700' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="!absolute !bottom-4 !left-4 !w-2 !h-2 !rounded-full !opacity-30"
          style={{ backgroundColor: '#c47c1eff' }}
          animate={{ scale: [1, 1.3, 1], y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />

        {/* Enhanced Title */}
        <motion.div
          className="!text-center !mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="!text-xl !font-bold !mb-1" style={{
            background: 'linear-gradient(45deg, #2c3e50, #34495e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Your Retirement Growth
          </h3>
          <p className="!text-sm !text-gray-500">Watch your wealth compound over time</p>
        </motion.div>

        {/* Enhanced Graph Area */}
        <div className="!relative !h-36 !bg-gradient-to-t !from-gray-50 !to-transparent !rounded-lg !p-4">

          {/* Enhanced Grid */}
          <svg className="!absolute !w-full !h-full !top-0 !left-0">
            {/* Animated grid lines */}
            {[...Array(4)].map((_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="8%"
                y1={`${20 + i * 20}%`}
                x2="92%"
                y2={`${20 + i * 20}%`}
                stroke="rgba(200,200,200,0.3)"
                strokeWidth="1"
                strokeDasharray="2,2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
              />
            ))}

            {/* Vertical grid lines */}
            {dataPoints.map((_, i) => (
              <motion.line
                key={`v-${i}`}
                x1={`${15 + i * 18}%`}
                y1="15%"
                x2={`${15 + i * 18}%`}
                y2="85%"
                stroke="rgba(200,200,200,0.2)"
                strokeWidth="1"
                strokeDasharray="1,3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 + 1 }}
              />
            ))}

            {/* Enhanced main growth curve */}
            <motion.path
              d={`M 15,${85 - dataPoints[0].value * 0.7} ${dataPoints.map((point, index) =>
                `Q ${15 + index * 18 + 9},${85 - point.value * 0.7 - 5} ${15 + (index + 1) * 18},${85 - (dataPoints[index + 1]?.value || point.value) * 0.7}`
              ).join(' ')}`}
              fill="none"
              stroke="url(#enhancedGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.05, ease: "easeOut" }}
            />

            {/* Enhanced gradients and filters */}
            <defs>
              <linearGradient id="enhancedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#c47c1eff" />
              </linearGradient>

              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c47c1eff" stopOpacity="0.1" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#FFD700" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Enhanced area under curve */}
            <motion.path
              d={`M 15,85 ${dataPoints.map((point, index) =>
                `L ${15 + index * 18},${85 - point.value * 0.7}`
              ).join(' ')} L 87,85 Z`}
              fill="url(#areaGradient)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.05 }}
            />

            {/* Enhanced data points with values */}
            {dataPoints.map((point, index) => (
              <g key={index}>
                <motion.circle
                  cx={`${15 + index * 18}%`}
                  cy={`${85 - point.value * 0.7}%`}
                  r="6"
                  fill="#ffffff"
                  stroke="#FFD700"
                  strokeWidth="3"
                  filter="url(#shadow)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: progress > index * 20 ? 1 : 0,
                    opacity: progress > index * 20 ? 1 : 0
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.3 + 1,
                    type: "spring",
                    bounce: 0.6
                  }}
                />

                {/* Value labels */}
                <motion.text
                  x={`${15 + index * 18}%`}
                  y={`${75 - point.value * 0.7}%`}
                  textAnchor="middle"
                  className="!text-xs !font-bold"
                  fill="#2c3e50"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: progress > index * 20 + 10 ? 1 : 0,
                    y: progress > index * 20 + 10 ? 0 : 5
                  }}
                  transition={{ duration: 0.3, delay: index * 0.3 + 1.5 }}
                >
                  {point.amount}
                </motion.text>
              </g>
            ))}
          </svg>

          {/* Age labels */}
          <div className="!absolute !bottom-0 !left-0 !right-0 !flex !justify-between !px-6 !py-2">
            {dataPoints.map((point, index) => (
              <motion.div
                key={index}
                className="!text-xs !font-medium !text-gray-600"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 2 }}
              >
                {point.year}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="!mt-6 !text-center">
          <motion.div
            className="!mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="!flex !justify-between !items-center !mb-2">
              <span className="!text-sm !text-gray-600">Building Your Future</span>
              <span className="!text-sm !font-bold" style={{ color: '#c47c1eff' }}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="!w-full !h-2 !bg-gray-200 !rounded-full !overflow-hidden">
              <motion.div
                className="!h-full !rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FFD700, #c47c1eff)',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {progress >= 100 && (
            <motion.button
              className="!px-8 !py-3 !text-white !font-bold !rounded-xl !border-none !cursor-pointer !text-base !shadow-xl !relative !overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #c47c1eff 100%)',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 30px rgba(255, 215, 0, 0.4)',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isLoggedIn ? "/planner-bot" : "/signup")}
            >
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🚀 Start Planning Today
              </motion.span>
            </motion.button>
          )}
        </div>

        {/* Success celebration */}
        {progress >= 100 && (
          <motion.div
            className="!absolute !top-2 !right-2 !text-2xl !font-bold !tracking-wide"
            style={{
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              textShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: 1,
              delay: 0.8,
              type: "spring",
              bounce: 0.5
            }}
          >
            <span style={{ color: '#FFD700' }}>N</span>
            <span style={{ color: '#c47c1eff' }}>W</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}