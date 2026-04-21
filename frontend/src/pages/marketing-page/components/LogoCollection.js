import * as React from 'react';

// Array of logo data
const logos = [
  {
    src: '/images/pfw.png',
    alt: 'Purdue University Fort Wayne',
    name: 'PFW'
  }
  // Add more logos here as needed
];

export default function LogoCollection() {
  return (
    <section className="!w-full !py-12 sm:!py-16">
      <div className="!max-w-6xl !mx-auto !px-4 sm:!px-6">
        {/* Header */}
        <div className="!text-center">
          <h3 className="!text-sm sm:!text-base !font-semibold !text-gray-500 !uppercase !tracking-wider">
            Trusted by
          </h3>
        </div>

        {/* Logo Grid */}
        <div className="!flex !flex-wrap !justify-center !items-center !gap-8 sm:!gap-12 lg:!gap-16">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="!flex !items-center !justify-center !transition-all !duration-300 hover:!scale-105"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="!h-[25vh] sm:!h-[30vh] lg:!h-[50vh] !w-auto !max-w-[180px] sm:!max-w-[220px] lg:!max-w-[280px] !object-contain !opacity-70 hover:!opacity-100 !transition-opacity !duration-300"
              />
            </div>
          ))}
        </div>

        {/* Add more logos call-to-action */}
        {logos.length === 1 && (
          <div className="!text-center !mt-8 sm:!mt-12">
            <p className="!text-xs sm:!text-sm !text-gray-400 !font-medium">
              Growing our network of trusted partners
            </p>
          </div>
        )}
      </div>
    </section>
  );
}