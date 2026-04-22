import * as React from 'react';
import FeatureAnimationRender from './HowItWorksAnimations';
import MobileLayout from './MobileLayout'; // <--- Import the new component

import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const items = [
  {
    icon: <ChatIcon className="w-6 h-6 text-blue-600" />,
    title: 'Planner Bot',
    description: `Your personal AI retirement advisor. Chat naturally about your goals while our bot builds a personalized retirement plan with smart insights and expert recommendations—planning made effortless.`,
    shortDescription: 'Your personal AI retirement advisor. Chat naturally about your goals while our bot creates personalized plans.',
  },
  {
    icon: <DashboardIcon className="w-6 h-6 text-green-600" />,
    title: 'My Plans',
    description: 'View, manage, and track all your retirement plans in one organized dashboard. Monitor your progress, compare different strategies, and make adjustments as your goals evolve—keeping your financial future on track.',
    shortDescription: 'View, manage, and track all your retirement plans in one organized dashboard.',
  },
  {
    icon: <FileDownloadIcon className="w-6 h-6 text-purple-600" />,
    title: 'Download Your Plan',
    description: 'Get your retirement plan as a downloadable PDF. Perfect for sharing with advisors, printing for records, or keeping offline copies of your financial strategy.',
    shortDescription: 'Get your retirement plan as a downloadable PDF for sharing with advisors or keeping records.',
  },
];

export default function HowItWorks() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => setSelectedItemIndex(index);
  const selectedFeature = items[selectedItemIndex];

  return (
    <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="max-w-4xl mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
          How It Works
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
          <strong>Retirement planning made simple!</strong> Discover how NestWise transforms 
          complex financial planning into an intuitive, personalized experience:
        </p>
      </div>

      <MobileLayout
        items={items} // <--- Pass items here downward
        selectedItemIndex={selectedItemIndex}
        handleItemClick={handleItemClick}
        selectedFeature={selectedFeature}
      />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col lg:flex-row-reverse gap-8 items-start">
        {/* Desktop Image Box */}
        <div className="w-full lg:w-2/3 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[60vh] min-h-[500px]">
            <FeatureAnimationRender index={selectedItemIndex} />
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="w-full lg:w-1/3 space-y-4">
          {items.map(({ icon, title, description }, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(index)}
              className={`w-full p-6 text-left rounded-xl transition-all duration-200 border-2 ${
                selectedItemIndex === index
                  ? 'bg-blue-50 border-blue-300 shadow-md transform scale-[1.02]'
                  : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xl font-bold mb-3 ${selectedItemIndex === index ? 'text-blue-900' : 'text-gray-900'}`}>
                    {title}
                  </h3>
                  <p className={`leading-relaxed ${selectedItemIndex === index ? 'text-blue-700' : 'text-gray-600'}`}>
                    {description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}