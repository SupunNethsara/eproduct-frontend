import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Heart,
} from "lucide-react";

const Footer = () => {
    const [settings, setSettings] = useState({
        siteName: "GoCart",
        adminEmail: "",
        mobile: "",
        address: "",
        siteDescription: "",
        logoUrl: null,
        socialLinks: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: ""
        }
    });
    const [loading, setLoading] = useState(true);

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/system-settings",
            );
            const data = response.data;

            setSettings({
                siteName: data.site_name || "GoCart",
                adminEmail: data.admin_email || "",
                mobile: data.mobile || "",
                address: data.address || "",
                siteDescription: data.site_description || "",
                logoUrl: data.logo_url || null,
                socialLinks: data.social_links || {
                    facebook: "",
                    instagram: "",
                    twitter: "",
                    linkedin: ""
                }
            });
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const footerSections = [
        {
            title: "Shop",
            links: [
                { name: "All Products", href: "/shop" },
                { name: "New Arrivals", href: "/shop?filter=new" },
                { name: "Best Sellers", href: "/shop?filter=bestsellers" },
                { name: "Sale Items", href: "/shop?filter=sale" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Contact Us", href: "/contact" },
                { name: "Shipping Info", href: "" },
                { name: "Returns & Exchanges", href: "" },
                { name: "Size Guide", href: "" },
                { name: "FAQs", href: "" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "" },
                { name: "Privacy Policy", href: "" },
                { name: "Terms of Service", href: "" },
                { name: "Blog", href: "" },
            ],
        },
    ];

    const socialLinks = [
        {
            name: "Facebook",
            icon: <Facebook className="w-5 h-5" />,
            href: settings.socialLinks.facebook,
            color: "hover:text-blue-500 hover:border-blue-500"
        },
        {
            name: "Twitter",
            icon: <Twitter className="w-5 h-5" />,
            href: settings.socialLinks.twitter,
            color: "hover:text-blue-400 hover:border-blue-400"
        },
        {
            name: "Instagram",
            icon: <Instagram className="w-5 h-5" />,
            href: settings.socialLinks.instagram,
            color: "hover:text-pink-500 hover:border-pink-500"
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="w-5 h-5" />,
            href: settings.socialLinks.linkedin,
            color: "hover:text-blue-600 hover:border-blue-600"
        },
    ].filter(social => social.href);

    if (loading) {
        return (
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                    <div className="animate-pulse">Loading footer...</div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-4">
                            {settings.logoUrl ? (
                                <div className="flex items-center gap-1">
                                    <img
                                        src={settings.logoUrl}
                                        alt="Logo"
                                        className="h-18 w-auto object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="text-3xl font-semibold">
                                    <span className="text-blue-400">go</span>
                                    cart
                                    <span className="text-blue-400 text-4xl">
                                        .
                                    </span>
                                </div>
                            )}
                        </Link>

                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            {settings.siteDescription ||
                                "Your trusted partner for quality electronics and gadgets. We bring you the latest technology with unbeatable prices and exceptional customer service."}
                        </p>

                        <div className="space-y-3">
                            {settings.mobile && (
                                <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                                    <Phone className="w-4 h-4 text-blue-400" />
                                    <span>{settings.mobile}</span>
                                </div>
                            )}
                            {settings.adminEmail && (
                                <div className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    <span>{settings.adminEmail}</span>
                                </div>
                            )}
                            {settings.address && (
                                <div className="flex items-start gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-200">
                                    <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                    <span className="text-sm">
                                        {settings.address}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-lg mb-4 text-white">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 my-8"></div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm">
                            Follow us:
                        </span>
                        <div className="flex items-center gap-3">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-400 hover:bg-blue-900/50 transition-all duration-200 p-2 rounded-lg border border-gray-700 ${social.color}`}
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">
                                    No social links configured
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        Made with{" "}
                        <Heart className="w-4 h-4 text-red-500 fill-current" />{" "}
                        for our customers
                    </div>
                </div>

                <div className="border-t border-gray-700 my-6"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    <div className="text-gray-400 text-sm">
                        &copy; {currentYear} {settings.siteName}. All rights
                        reserved.
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <Link
                            to="/privacy"
                            className="hover:text-blue-400 transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link
                            to="/terms"
                            className="hover:text-blue-400 transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                        <span>•</span>
                        <Link
                            to="/cookies"
                            className="hover:text-blue-400 transition-colors duration-200"
                        >
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
