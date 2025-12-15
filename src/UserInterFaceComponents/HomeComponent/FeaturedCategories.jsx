import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedCategories = () => {
    const categories = [
        {
            id: 1,
            name: "DVR & NVR Systems",
            image: "/dvr.jpg",
            count: "120+ Products",
        },
        {
            id: 2,
            name: "Access Control",
            image: "/accesscontroller.jpg",
            count: "85+ Products",
        },
        {
            id: 3,
            name: "Network Solutions",
            image: "/nvr.jpg",
            count: "45+ Products",
        },
        {
            id: 4,
            name: "Security Cameras",
            image: "/dvr2.jpg",
            count: "200+ Products",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Security Solutions Categories
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our comprehensive range of security systems and
                        solutions
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/shop?category=${category.name.toLowerCase()}`}
                            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-xl font-bold mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-sm opacity-90">
                                    {category.count}
                                </p>
                            </div>

                            <div className="absolute top-4 right-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <ArrowRight className="w-4 h-4 text-gray-900" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
