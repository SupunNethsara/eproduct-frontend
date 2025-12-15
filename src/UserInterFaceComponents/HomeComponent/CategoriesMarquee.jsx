import React from "react";

const categories = [
    "Analog Camera",
    "IP Camera",
    "DVR System",
    "NVR System",
    "BNC Connectors",
    "Power Supply",
    "Access Control Terminal",
    "Smart Door Lock",
    "Door Lock",
    "Exit Switch",
    "Lock Bracket",
    "DC Power",
];

const CategoriesMarquee = () => {
    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group my-10">
            <div className="absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-white to-transparent" />

            <div className="flex animate-marquee group-hover:pause">
                {[
                    ...categories,
                    ...categories,
                    ...categories,
                    ...categories,
                    ...categories,
                ].map((category, index) => (
                    <div key={index} className="mx-2 flex-shrink-0">
                        <button className="px-6 py-3 bg-gray-100 rounded-lg text-gray-600 text-sm hover:bg-gray-600 hover:text-white transition-all duration-300 whitespace-nowrap">
                            {category}
                        </button>
                    </div>
                ))}
            </div>

            <div className="absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-white to-transparent" />

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default CategoriesMarquee;
