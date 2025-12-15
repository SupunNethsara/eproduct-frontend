import React, { useState } from "react";
import HomeBannerControl from "./BrandinComponents/HomeBannerControl.jsx";
import TopProductControl from "./BrandinComponents/TopProductControl.jsx";

function Branding() {
    const [activeSection, setActiveSection] = useState("home");

    const sections = [
        { id: "home", label: "Home Banner", icon: "🏠" },
        { id: "products", label: "Top Products", icon: "⭐" },
        { id: "about", label: "About", icon: "ℹ️" },
        { id: "contact", label: "Contact", icon: "📞" },
    ];

    const handleRemoveBgClick = () => {
        window.open("https://www.remove.bg/", "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeSection === section.id
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <span>{section.icon}</span>
                                    {section.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleRemoveBgClick}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Remove Background
                        </button>
                    </div>
                </div>
            </div>

            {activeSection === "home" && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    <svg
                                        className="w-5 h-5 text-blue-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                        Image Format Recommendation
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        For best results, use <strong>PNG format</strong> images with transparent background.
                                        This ensures your banners look professional without white borders.
                                        JPG images with white background may not blend well with your site design.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 sm:flex-col sm:gap-1">
                                <button
                                    onClick={handleRemoveBgClick}
                                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                    Remove BG Tool
                                </button>
                                <a
                                    href="https://convertio.co/jpg-png/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-blue-600 border border-blue-300 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap text-center"
                                >
                                    Convert to PNG
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {activeSection === "home" && <HomeBannerControl />}
                {activeSection === "products" && <TopProductControl />}
                {/*{activeSection === 'about' && <AboutSection />}*/}
                {/*{activeSection === 'contact' && <ContactSection />}*/}
            </div>
        </div>
    );
}

export default Branding;
