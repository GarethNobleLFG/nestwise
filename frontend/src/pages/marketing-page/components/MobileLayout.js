import * as React from 'react';
import PropTypes from 'prop-types';
import FeatureAnimationRender from './HowItWorksAnimations';

export default function MobileLayout({ items, selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items || !items[selectedItemIndex]) return null;

  return (
    <div className="flex flex-col gap-6 md:hidden">
      {/* Mobile Tabs (Snap-scrolling carousel) */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1 -mx-1 snap-x">
        {items.map(({ title }, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            className={`snap-center flex-shrink-0 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 border whitespace-nowrap ${
              selectedItemIndex === index
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-transparent shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] transform scale-105'
                : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 shadow-sm'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Mobile Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col">
        
        {/* ANIMATION COMPONENT AREA */}
        <div className="w-full h-[320px] sm:h-[350px] relative bg-slate-50 border-b border-gray-100">
          <FeatureAnimationRender index={selectedItemIndex} />
        </div>

        {/* Text/Content Area */}
        <div className="p-6 sm:p-8 flex flex-col gap-4 bg-white">
          <div className="flex items-center gap-4">
            {/* Framed Icon Box */}
            <div className="bg-gray-50 p-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
              {selectedFeature.icon}
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {selectedFeature.title}
            </h3>
          </div>
          <p className="text-base text-gray-600 leading-relaxed font-medium">
            {items[selectedItemIndex].shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

MobileLayout.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      shortDescription: PropTypes.string,
    })
  ).isRequired,
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};