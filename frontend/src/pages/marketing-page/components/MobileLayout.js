import * as React from 'react';
import PropTypes from 'prop-types';
import FeatureAnimationRender from './HowItWorksAnimations';

export default function MobileLayout({ items, selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items || !items[selectedItemIndex]) return null;

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {/* Mobile Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        {items.map(({ title }, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
              selectedItemIndex === index
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Mobile Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[70vh]">
        
        {/* ANIMATION COMPONENT */}
        <div className="w-full h-[25vh] min-h-[180px] max-h-[220px]">
          <FeatureAnimationRender index={selectedItemIndex} />
        </div>

        <div className="p-4 max-h-[45vh] overflow-y-auto">
          <div className="flex items-center gap-3 mb-3">
            {selectedFeature.icon}
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {selectedFeature.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
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