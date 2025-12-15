import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Nimal de silva",
            role: "Tech Enthusiast",
            image: "/profile.webp",
            content:
                "Amazing product quality and fast delivery! The customer support team was incredibly helpful throughout the process.",
            rating: 5,
        },
        {
            id: 2,
            name: "Predeep Gamage",
            role: "Business Owner",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            content:
                "I've been shopping here for over a year now. The product range and prices are unbeatable in the market.",
            rating: 5,
        },
        {
            id: 3,
            name: "Rasika Frenando",
            role: "Student",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            content:
                "Great deals for students! The laptop I bought works perfectly and the warranty gives me peace of mind.",
            rating: 4,
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it - hear from our
                        satisfied customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                        >
                            <Quote className="w-8 h-8 text-blue-600 opacity-50 mb-4" />

                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < testimonial.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
