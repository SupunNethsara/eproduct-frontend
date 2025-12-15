import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useRef } from "react";

function SliderSectionPreview({ slides }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRefs = useRef([]);
    const containerRef = useRef(null);

    const calculateDiscount = (price, originalPrice) => {
        const p = parseFloat(price.replace("Rs", "").replace(",", ""));
        const op = parseFloat(originalPrice.replace("Rs", "").replace(",", ""));
        if (op <= p) return 0;
        const discount = ((op - p) / op) * 100;
        return Math.round(discount);
    };

    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % slides.length;
        animateSlideChange(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        animateSlideChange(prevIndex);
    };

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        animateSlideChange(index);
    };

    const animateSlideChange = (newIndex) => {
        const currentSlideEl = slideRefs.current[currentSlide];
        const nextSlideEl = slideRefs.current[newIndex];

        if (currentSlideEl && nextSlideEl) {
            gsap.to(
                currentSlideEl.querySelectorAll(
                    ".text-content, .image-content",
                ),
                {
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    ease: "power2.inOut",
                },
            );

            setCurrentSlide(newIndex);

            gsap.fromTo(
                nextSlideEl.querySelector(".text-content"),
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.2,
                },
            );

            gsap.fromTo(
                nextSlideEl.querySelector(".image-content"),
                { scale: 0.9, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.4,
                },
            );
        }
    };

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [currentSlide, slides.length]);

    if (slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-100 rounded-lg">
                <div className="text-center">
                    <div className="text-lg font-medium mb-2">
                        No active slides to display
                    </div>
                    <div className="text-sm text-gray-400">
                        Add and activate slides to see preview
                    </div>
                </div>
            </div>
        );
    }

    const themeColors = {
        primary: "#0866ff",
        primaryHover: "#0759e0",
        secondary: "#e3251b",
        secondaryHover: "#c91f16",
        gradientFrom: "#e6f0ff",
        gradientVia: "#f0f7ff",
        gradientTo: "#e6f0ff",
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-6xl mx-auto aspect-[16/9] min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden shadow-lg"
        >
            {slides.map((slide, index) => {
                const discountPercent = calculateDiscount(
                    slide.price,
                    slide.original_price,
                );
                const isActive = index === currentSlide;

                return (
                    <div
                        key={slide.id}
                        ref={(el) => (slideRefs.current[index] = el)}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            isActive
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                        }`}
                        style={{
                            background: `linear-gradient(135deg, ${themeColors.gradientFrom}, ${themeColors.gradientVia}, ${themeColors.gradientTo})`,
                        }}
                    >
                        <div className="relative w-full h-full p-4 sm:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 items-center">
                            {/* Text Content */}
                            <div className="text-content space-y-3 sm:space-y-4 text-center md:text-left z-10">
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm"
                                    style={{
                                        backgroundColor: `${themeColors.primary}15`,
                                        color: themeColors.primary,
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Free Shipping Over Rs50
                                </div>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                                    {slide.title}
                                </h1>

                                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
                                    {slide.description}
                                </p>

                                <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
                                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        {slide.price}
                                    </span>
                                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                                        {slide.original_price}
                                    </span>
                                    {discountPercent > 0 && (
                                        <span
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-semibold rounded-full"
                                            style={{
                                                backgroundColor:
                                                    themeColors.secondary,
                                            }}
                                        >
                                            Save {discountPercent}%
                                        </span>
                                    )}
                                </div>

                                <button
                                    className="text-white text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 px-8 sm:px-12 mt-4 sm:mt-6 rounded-lg hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg"
                                    style={{
                                        backgroundColor: themeColors.primary,
                                    }}
                                    onMouseOver={(e) =>
                                        (e.target.style.backgroundColor =
                                            themeColors.primaryHover)
                                    }
                                    onMouseOut={(e) =>
                                        (e.target.style.backgroundColor =
                                            themeColors.primary)
                                    }
                                >
                                    Shop Now
                                </button>
                            </div>

                            {/* Image Content */}
                            <div className="image-content flex justify-center relative mt-4 md:mt-0">
                                <div
                                    className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 blur-2xl sm:blur-3xl rounded-full opacity-60"
                                    style={{
                                        background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.primary}05)`,
                                    }}
                                ></div>
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="relative z-10 w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 xl:w-96 xl:h-96 object-contain transform hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/400x400?text=Image+Not+Found";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30 backdrop-blur-sm border border-gray-200"
                        aria-label="Previous slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30 backdrop-blur-sm border border-gray-200"
                        aria-label="Next slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </>
            )}

            {slides.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? "bg-slate-800 w-6 sm:w-8 h-2 sm:h-2 shadow-lg"
                                    : "bg-slate-300 hover:bg-slate-400 w-2 h-2"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SliderSectionPreview;
