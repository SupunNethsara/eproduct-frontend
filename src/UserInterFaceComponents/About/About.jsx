import React, { useEffect } from "react";
import {
    FiAward,
    FiUsers,
    FiShield,
    FiCheckCircle,
    FiShoppingBag,
    FiTruck,
    FiHeadphones,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const values = [
        {
            title: "Quality Products",
            description:
                "We source only the highest quality products from trusted suppliers and brands to ensure your complete satisfaction.",
            icon: <FiAward className="w-6 h-6" />,
        },
        {
            title: "Fast Delivery",
            description:
                "Quick and reliable shipping to get your favorite products to you as fast as possible, wherever you are.",
            icon: <FiCheckCircle className="w-6 h-6" />,
        },
        {
            title: "Secure Shopping",
            description:
                "Your data and payments are protected with advanced security measures for a worry-free shopping experience.",
            icon: <FiShield className="w-6 h-6" />,
        },
    ];

    const features = [
        {
            icon: <FiShoppingBag className="w-8 h-8" />,
            title: "Wide Selection",
            description:
                "Thousands of products across multiple categories to choose from, with new items added regularly",
        },
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: "Fast Shipping",
            description:
                "Quick delivery with multiple shipping options to get your orders to you when you need them",
        },
        {
            icon: <FiHeadphones className="w-8 h-8" />,
            title: "24/7 Support",
            description:
                "Our dedicated customer service team is always here to help with any questions or concerns",
        },
    ];
    const navigate = useNavigate();
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                            Our Story
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Your Trusted Shopping Partner Since 2018
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <p className="text-lg text-gray-600 mb-6">
                                    Founded in 2018, we started with a simple
                                    mission: to make quality products accessible
                                    to everyone at affordable prices. From our
                                    first online store to becoming a trusted
                                    shopping destination for thousands of
                                    customers worldwide.
                                </p>
                                <p className="text-lg text-gray-600">
                                    Our journey has been driven by innovation
                                    and a commitment to customer satisfaction.
                                    We continuously expand our product range and
                                    improve our services to provide the best
                                    possible shopping experience for our valued
                                    customers.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Our Mission
                                    </h3>
                                    <p className="text-gray-600">
                                        To provide exceptional value through
                                        quality products, outstanding customer
                                        service, and a seamless shopping
                                        experience that exceeds expectations.
                                    </p>
                                </div>
                                <div className="mt-6 bg-gray-50 p-6 rounded-2xl border-l-4 border-gray-400">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Our Vision
                                    </h3>
                                    <p className="text-gray-600">
                                        To become the most trusted and loved
                                        online shopping destination, known for
                                        our commitment to quality, value, and
                                        customer satisfaction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-blue-200 font-semibold tracking-wide uppercase">
                            Why Choose Us
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            The Best Shopping Experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="text-blue-600 mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                            Our Values
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            What We Stand For
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                            >
                                <div className="text-blue-600 mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-12 text-white"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust us
                            for their shopping needs. Experience the difference
                            today!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate("/shop")}
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                            >
                                Shop Now
                            </button>
                            <button
                                onClick={() => navigate("/contact")}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                            >
                                Contact Us
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
