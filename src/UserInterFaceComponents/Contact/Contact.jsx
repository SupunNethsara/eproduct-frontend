import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiClock,
    FiSend,
    FiMessageSquare,
    FiShoppingBag,
    FiTruck,
    FiHeadphones,
    FiFacebook,
    FiInstagram,
    FiTwitter,
    FiLinkedin
} from "react-icons/fi";
import axios from "axios";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("");
    const [systemSettings, setSystemSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        fetchSystemSettings();
    }, []);

    const fetchSystemSettings = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/system-settings");
            setSystemSettings(response.data);
        } catch (error) {
            console.error("Error fetching system settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/send-contact-email",
                {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    inquiry_type: formData.subject,
                },
            );

            if (response.data.success) {
                setSubmitStatus("success");
                alert(
                    "Thank you for your message! We will contact you shortly.",
                );
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setSubmitStatus("error");
                alert(
                    "Sorry, there was an error sending your message. Please try again.",
                );
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setSubmitStatus("error");
            alert(
                "Sorry, there was an error sending your message. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    const getContactInfo = () => {
        if (!systemSettings) return {};

        return {
            address: systemSettings.address || "123 Shopping Plaza\nBusiness District, City 94107",
            email: systemSettings.contact_email || "hello@yourstore.com\nsupport@yourstore.com",
            phone: systemSettings.mobile || "+1 (555) 123-SHOP\nSupport: +1 (555) 123-HELP",
            businessHours: systemSettings.business_hours || "Monday - Friday: 9:00 - 20:00\nSaturday: 10:00 - 18:00\nSunday: 12:00 - 16:00",
            googleMapsEmbed: systemSettings.google_maps_embed,
            socialLinks: systemSettings.social_links || {}
        };
    };

    const contactInfo = getContactInfo();

    const contactItems = [
        {
            icon: <FiMapPin className="w-6 h-6" />,
            title: "Our Store",
            content: contactInfo.address,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            icon: <FiMail className="w-6 h-6" />,
            title: "Email Us",
            content: contactInfo.email,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            icon: <FiPhone className="w-6 h-6" />,
            title: "Call Us",
            content: contactInfo.phone,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            icon: <FiClock className="w-6 h-6" />,
            title: "Store Hours",
            content: contactInfo.businessHours,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    const storeServices = [
        {
            icon: <FiShoppingBag className="w-5 h-5" />,
            text: "Product Information & Availability",
        },
        {
            icon: <FiTruck className="w-5 h-5" />,
            text: "Shipping & Delivery Questions",
        },
        {
            icon: <FiHeadphones className="w-5 h-5" />,
            text: "Customer Support & Returns",
        },
    ];

    const socialIcons = {
        facebook: <FiFacebook className="w-5 h-5" />,
        instagram: <FiInstagram className="w-5 h-5" />,
        twitter: <FiTwitter className="w-5 h-5" />,
        linkedin: <FiLinkedin className="w-5 h-5" />
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get in touch with our team. We're here to help you with any questions about our products and services.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-200"
                    >
                        <div className="flex items-center mb-8">
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4">
                                <FiMessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Contact Our Team
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Fill out the form and we'll get back to you within 24 hours
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                How we can help:
                            </h3>
                            <div className="space-y-2">
                                {storeServices.map((service, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center text-sm text-gray-700"
                                    >
                                        <span className="text-blue-600 mr-2">
                                            {service.icon}
                                        </span>
                                        {service.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={item}>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        placeholder="John Doe"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </motion.div>
                                <motion.div variants={item}>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        placeholder="your@email.com"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </motion.div>
                            </div>

                            <motion.div variants={item}>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Inquiry Type *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">
                                        Select inquiry type
                                    </option>
                                    <option value="product-info">
                                        Product Information
                                    </option>
                                    <option value="order-status">
                                        Order Status
                                    </option>
                                    <option value="shipping">
                                        Shipping & Delivery
                                    </option>
                                    <option value="returns">
                                        Returns & Exchanges
                                    </option>
                                    <option value="technical">
                                        Technical Support
                                    </option>
                                    <option value="other">Other</option>
                                </select>
                            </motion.div>

                            <motion.div variants={item}>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Your Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                                    placeholder="Tell us how we can help you today..."
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
                                } text-white`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSend className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </motion.button>

                            {submitStatus === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-center"
                                >
                                    ✅ Message sent successfully! We'll get back to you soon.
                                </motion.div>
                            )}

                            {submitStatus === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center"
                                >
                                    ❌ Failed to send message. Please try again.
                                </motion.div>
                            )}

                            <p className="text-center text-sm text-gray-500">
                                We respect your privacy. Your information is secure with us.
                            </p>
                        </form>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate={isVisible ? "show" : "hidden"}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {contactItems.map((contact, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className={`p-6 rounded-2xl ${contact.bg} border border-gray-200 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl ${contact.bg} flex items-center justify-center mb-4 border ${contact.color.replace("text", "border")} border-opacity-20`}
                                    >
                                        <span className={contact.color}>
                                            {contact.icon}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {contact.title}
                                    </h3>
                                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                                        {contact.content}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {contactInfo.socialLinks && Object.values(contactInfo.socialLinks).some(link => link) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                    Follow Us
                                </h3>
                                <div className="flex justify-center space-x-4">
                                    {Object.entries(contactInfo.socialLinks).map(([platform, url]) => {
                                        if (!url) return null;
                                        return (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                                                title={`Follow us on ${platform}`}
                                            >
                                                {socialIcons[platform]}
                                            </a>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl text-center"
                        >
                            <div className="flex items-center justify-center mb-2">
                                <FiHeadphones className="w-6 h-6 mr-2" />
                                <h3 className="text-xl font-bold">
                                    Quick Support
                                </h3>
                            </div>
                            <p className="text-blue-100">
                                For immediate assistance with orders or products
                            </p>
                            <p className="text-2xl font-bold mt-2">
                                {systemSettings?.mobile || "+1 (555) 123-HELP"}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 transform hover:scale-[1.01] transition-all duration-500"
                        >
                            <div className="aspect-w-16 aspect-h-9 w-full">
                                {contactInfo.googleMapsEmbed ? (
                                    <div
                                        className="w-full h-80"
                                        dangerouslySetInnerHTML={{ __html: contactInfo.googleMapsEmbed }}
                                    />
                                ) : (
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0350758097005!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1645839197081!5m2!1sen!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        className="rounded-2xl h-80 w-full"
                                        title="Our Store Location"
                                    ></iframe>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
