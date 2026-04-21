import * as React from 'react';
import PropTypes from 'prop-types';

import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const items = [
  {
    icon: <ChatIcon className="!w-6 !h-6 !text-blue-600" />,
    title: 'Planner Bot',
    description:
      `Your personal AI retirement advisor. Chat naturally about your goals while our bot builds a personalized retirement plan 
      with smart insights and expert recommendations—planning made effortless.`,
    shortDescription: 'Your personal AI retirement advisor. Chat naturally about your goals while our bot creates personalized plans.',
    imageLight: `url("/images/planner-bot.png")`,
    imageDark: `url("/images/planner-bot.png")`,
  },
  {
    icon: <DashboardIcon className="!w-6 !h-6 !text-green-600" />,
    title: 'My Plans',
    description:
      'View, manage, and track all your retirement plans in one organized dashboard. Monitor your progress, compare different strategies, and make adjustments as your goals evolve—keeping your financial future on track.',
    shortDescription: 'View, manage, and track all your retirement plans in one organized dashboard.',
    imageLight: `url("/images/my-plans.png")`,
    imageDark: `url("/images/my-plans.png")`,
  },
  {
    icon: <FileDownloadIcon className="!w-6 !h-6 !text-purple-600" />,
    title: 'Download Your Plan',
    description:
      'Get your retirement plan as a downloadable PDF. Perfect for sharing with advisors, printing for records, or keeping offline copies of your financial strategy.',
    shortDescription: 'Get your retirement plan as a downloadable PDF for sharing with advisors or keeping records.',
    imageLight: `url("/images/download.png")`,
    imageDark: `url("/images/download.png")`,
  },
];

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <div className="!flex !flex-col !gap-3 md:!hidden">
      {/* Mobile Tabs */}
      <div className="!flex !gap-2 !overflow-x-auto !pb-2 !scrollbar-hide !px-1">
        {items.map(({ title }, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            className={`!flex-shrink-0 !px-3 !py-2 !rounded-full !text-xs !font-medium !transition-all !duration-200 !border !whitespace-nowrap ${
              selectedItemIndex === index
                ? '!bg-blue-600 !text-white !border-blue-600 !shadow-md'
                : '!bg-white !text-gray-700 !border-gray-300 hover:!border-blue-300 hover:!bg-blue-50'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Mobile Card */}
      <div className="!bg-white !rounded-xl !shadow-lg !border !border-gray-200 !overflow-hidden !max-h-[70vh]">
        <div
          className="!w-full !h-[25vh] !bg-cover !bg-center !bg-no-repeat !min-h-[180px] !max-h-[220px]"
          style={{
            backgroundImage: items[selectedItemIndex]?.imageLight || '',
          }}
        />
        <div className="!p-4 !max-h-[45vh] !overflow-y-auto">
          <div className="!flex !items-center !gap-3 !mb-3">
            {selectedFeature.icon}
            <h3 className="!text-lg !font-bold !text-gray-900 !leading-tight">
              {selectedFeature.title}
            </h3>
          </div>
          <p className="!text-sm !text-gray-600 !leading-relaxed">
            {items[selectedItemIndex].shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export default function HowItWorks() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <section
      id="how-it-works"
      className="!w-full !max-w-7xl !mx-auto !px-4 sm:!px-6 !py-12 sm:!py-20"
    >
      {/* Header */}
      <div className="!max-w-4xl !mb-8 md:!mb-12">
        <h2 className="!text-2xl sm:!text-4xl !font-bold !text-gray-900 !mb-4 md:!mb-6">
          How It Works
        </h2>
        <p className="!text-base md:!text-lg !text-gray-600 !leading-relaxed">
          <strong>Retirement planning made simple!</strong> Discover how NestWise transforms 
          complex financial planning into an intuitive, personalized experience:
        </p>
      </div>

      {/* Mobile Layout */}
      <MobileLayout
        selectedItemIndex={selectedItemIndex}
        handleItemClick={handleItemClick}
        selectedFeature={selectedFeature}
      />

      {/* Desktop Layout - UNCHANGED */}
      <div className="!hidden md:!flex !flex-col lg:!flex-row-reverse !gap-8 !items-start">
        {/* Desktop Image */}
        <div className="!w-full lg:!w-[60vw] !max-w-4xl">
          <div className="!bg-white !rounded-2xl !shadow-lg !border !border-gray-200 !overflow-hidden !h-[60vh] !min-h-[500px]">
            <div
              className="!w-full !h-full !bg-contain !bg-center !bg-no-repeat"
              style={{
                backgroundImage: selectedFeature?.imageLight || '',
              }}
            />
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="!w-full lg:!w-[35vw] !space-y-4">
          {items.map(({ icon, title, description }, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(index)}
              className={`!w-full !p-6 !text-left !rounded-xl !transition-all !duration-200 !border-2 ${
                selectedItemIndex === index
                  ? '!bg-blue-50 !border-blue-300 !shadow-md'
                  : '!bg-white !border-gray-200 hover:!border-blue-200 hover:!bg-gray-50'
              }`}
            >
              <div className="!flex !items-start !gap-4">
                <div className="!flex-shrink-0 !mt-1">
                  {icon}
                </div>
                <div className="!flex-1 !min-w-0">
                  <h3 className={`!text-xl !font-bold !mb-3 ${
                    selectedItemIndex === index ? '!text-blue-900' : '!text-gray-900'
                  }`}>
                    {title}
                  </h3>
                  <p className={`!leading-relaxed ${
                    selectedItemIndex === index ? '!text-blue-700' : '!text-gray-600'
                  }`}>
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