import React, { useState, useEffect } from "react";
import axios from "axios";

function SystemSettings() {
    const [activeTab, setActiveTab] = useState("general");
    const [settings, setSettings] = useState({
        siteName: "",
        adminEmail: "",
        mobile: "",
        address: "",
        siteDescription: "",
        itemsPerPage: 24,
        logo: null,
        logoUrl: null,
        googleMapsEmbed: "",
        contactEmail: "",
        businessHours: "",
        socialLinks: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: ""
        }
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [removeLogoFlag, setRemoveLogoFlag] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings.siteName) {
            document.title = `${settings.siteName} - System Settings`;
        } else {
            document.title = "eCommerce - System Settings";
        }
    }, [settings.siteName]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://127.0.0.1:8000/api/system-settings",
            );
            const data = response.data;

            setSettings({
                siteName: data.site_name || "",
                adminEmail: data.admin_email || "",
                mobile: data.mobile || "",
                address: data.address || "",
                siteDescription: data.site_description || "",
                itemsPerPage: data.items_per_page || 24,
                logo: data.logo || null,
                logoUrl: data.logo_url || null,
                googleMapsEmbed: data.google_maps_embed || "",
                contactEmail: data.contact_email || "",
                businessHours: data.business_hours || "Mon - Fri: 9:00 AM - 6:00 PM",
                socialLinks: data.social_links || {
                    facebook: "",
                    instagram: "",
                    twitter: "",
                    linkedin: ""
                }
            });

            if (data.logo_url) {
                setLogoPreview(data.logo_url);
            } else {
                setLogoPreview(null);
            }

            setRemoveLogoFlag(false);
            setLogoFile(null);
        } catch (error) {
            console.error("Error fetching settings:", error);
            setMessage("Error loading settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSocialLinkChange = (platform, value) => {
        setSettings((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "image/png") {
                setMessage("Error: Only PNG files are allowed for logo");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setMessage("Error: Logo file size should be less than 2MB");
                return;
            }

            setLogoFile(file);
            setRemoveLogoFlag(false);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        setRemoveLogoFlag(true);

        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const saveSettings = async () => {
        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("siteName", settings.siteName);
            formData.append("adminEmail", settings.adminEmail);
            formData.append("mobile", settings.mobile || "");
            formData.append("address", settings.address || "");
            formData.append("siteDescription", settings.siteDescription || "");
            formData.append("itemsPerPage", settings.itemsPerPage.toString());
            formData.append("googleMapsEmbed", settings.googleMapsEmbed || "");
            formData.append("contactEmail", settings.contactEmail || "");
            formData.append("businessHours", settings.businessHours || "");
            formData.append("socialLinks", JSON.stringify(settings.socialLinks));

            if (removeLogoFlag) {
                formData.append("remove_logo", "true");
            }
            if (logoFile) {
                formData.append("logo", logoFile);
            }

            const response = await axios.post(
                "http://127.0.0.1:8000/api/system-settings",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            setMessage(response.data.message);

            const updatedData = response.data.data;
            setSettings({
                siteName: updatedData.site_name,
                adminEmail: updatedData.admin_email,
                mobile: updatedData.mobile,
                address: updatedData.address,
                siteDescription: updatedData.site_description,
                itemsPerPage: updatedData.items_per_page,
                logo: updatedData.logo,
                logoUrl: updatedData.logo_url,
                googleMapsEmbed: updatedData.google_maps_embed,
                contactEmail: updatedData.contact_email,
                businessHours: updatedData.business_hours,
                socialLinks: updatedData.social_links || {
                    facebook: "",
                    instagram: "",
                    twitter: "",
                    linkedin: ""
                }
            });

            if (updatedData.logo_url) {
                setLogoPreview(updatedData.logo_url);
            } else {
                setLogoPreview(null);
            }

            setLogoFile(null);
            setRemoveLogoFlag(false);
        } catch (error) {
            console.error("Error saving settings:", error);
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                setMessage(`Validation Error: ${errorMessages}`);
            } else if (error.response && error.response.data.message) {
                setMessage(`Error: ${error.response.data.message}`);
            } else {
                setMessage("Error saving settings");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetSettings = () => {
        if (
            confirm("Are you sure you want to reset all settings to default?")
        ) {
            setSettings({
                siteName: "My Ecommerce Store",
                adminEmail: "admin@store.com",
                mobile: "+94 71 123 4567",
                address: "123 Main Street, Colombo, Sri Lanka",
                siteDescription: "Best online shopping experience",
                itemsPerPage: 24,
                logo: null,
                logoUrl: null,
                googleMapsEmbed: "",
                contactEmail: "contact@store.com",
                businessHours: "Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed",
                socialLinks: {
                    facebook: "",
                    instagram: "",
                    twitter: "",
                    linkedin: ""
                }
            });
            setLogoPreview(null);
            setLogoFile(null);
            setRemoveLogoFlag(false);
        }
    };

    const getGoogleMapsEmbedCode = (address) => {
        if (!address) return "";
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.923935068942!2d79.86177441528766!3d6.914006295016287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnNTAuNCJOIDc5wrA1MSc0OS4xIkU!5e0!3m2!1sen!2slk!4v1645839197081!5m2!1sen!2slk`;
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        System Settings
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Configure {settings.siteName || "your ecommerce"}{" "}
                        platform settings
                    </p>
                </div>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg border-l-4 ${
                            message.includes("Error")
                                ? "bg-red-50 border-red-400 text-red-700"
                                : "bg-green-50 border-green-400 text-green-700"
                        }`}
                    >
                        <div className="flex items-center">
                            <span className="text-lg mr-2">
                                {message.includes("Error") ? "❌" : "✅"}
                            </span>
                            {message}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-64">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                System Settings
                            </h3>
                            <nav className="space-y-2">
                                {[
                                    {
                                        id: "general",
                                        label: "General Settings",
                                        icon: "⚙️",
                                    },
                                    {
                                        id: "contact",
                                        label: "Contact & Location",
                                        icon: "📍",
                                    },
                                    {
                                        id: "social",
                                        label: "Social Media",
                                        icon: "📱",
                                    },
                                    {
                                        id: "security",
                                        label: "Security & Access",
                                        icon: "🔒",
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? "bg-green-50 text-green-700 border border-green-200 shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <span className="text-xl">
                                            {tab.icon}
                                        </span>
                                        <span className="font-medium">
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            {activeTab === "general" && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            General Settings
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            Manage your site's basic information
                                            and preferences
                                        </p>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center items-center py-12">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                                            <span className="ml-3 text-gray-600">
                                                Loading settings...
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Site Logo (PNG only)
                                                    </label>
                                                    <div className="flex items-center space-x-6">
                                                        <div className="flex-shrink-0">
                                                            {logoPreview ? (
                                                                <img
                                                                    src={
                                                                        logoPreview
                                                                    }
                                                                    alt="Logo preview"
                                                                    className="w-20 h-20 object-contain border border-gray-200 rounded-lg"
                                                                />
                                                            ) : (
                                                                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                                                                    No Logo
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="file"
                                                                accept=".png,image/png"
                                                                onChange={
                                                                    handleLogoChange
                                                                }
                                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                PNG format only.
                                                                Maximum file
                                                                size: 2MB
                                                            </p>
                                                        </div>
                                                        {(logoPreview ||
                                                            settings.logoUrl) && (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    removeLogo
                                                                }
                                                                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    {(removeLogoFlag ||
                                                        logoFile) && (
                                                        <p className="text-sm text-blue-600">
                                                            {removeLogoFlag
                                                                ? "Logo will be removed when you save settings"
                                                                : "New logo will be uploaded when you save settings"}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Site Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            settings.siteName
                                                        }
                                                        onChange={(e) =>
                                                            handleSettingChange(
                                                                "siteName",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="Enter your site name"
                                                    />
                                                    <p className="text-xs text-gray-500">
                                                        This will be displayed
                                                        as your page title
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Admin Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={
                                                            settings.adminEmail
                                                        }
                                                        onChange={(e) =>
                                                            handleSettingChange(
                                                                "adminEmail",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="admin@example.com"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Mobile Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.mobile}
                                                        onChange={(e) =>
                                                            handleSettingChange(
                                                                "mobile",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="+94 71 123 4567"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Items Per Page
                                                    </label>
                                                    <select
                                                        value={
                                                            settings.itemsPerPage
                                                        }
                                                        onChange={(e) =>
                                                            handleSettingChange(
                                                                "itemsPerPage",
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                    >
                                                        <option value={12}>
                                                            12 items
                                                        </option>
                                                        <option value={24}>
                                                            24 items
                                                        </option>
                                                        <option value={48}>
                                                            48 items
                                                        </option>
                                                        <option value={96}>
                                                            96 items
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Address
                                                    </label>
                                                    <textarea
                                                        value={settings.address}
                                                        onChange={(e) =>
                                                            handleSettingChange(
                                                                "address",
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={2}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="Enter your business address"
                                                    />
                                                </div>

                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Site Description
                                                    </label>
                                                    <textarea
                                                        value={
                                                            settings.siteDescription
                                                        }
                                                        onChange={(e) =>
                                                            handleSettingChange(
                                                                "siteDescription",
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={3}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                        placeholder="Describe your ecommerce store"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                                                <button
                                                    onClick={saveSettings}
                                                    disabled={loading}
                                                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Saving...
                                                        </span>
                                                    ) : (
                                                        "Save Settings"
                                                    )}
                                                </button>
                                                <button
                                                    onClick={resetSettings}
                                                    disabled={loading}
                                                    className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Reset to Defaults
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === "contact" && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            Contact & Location
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            Configure your contact information and store location
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={settings.contactEmail}
                                                    onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                    placeholder="contact@example.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Business Hours
                                                </label>
                                                <textarea
                                                    value={settings.businessHours}
                                                    onChange={(e) => handleSettingChange("businessHours", e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200"
                                                    placeholder="Mon - Fri: 9:00 AM - 6:00 PM&#10;Sat: 10:00 AM - 4:00 PM&#10;Sun: Closed"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Google Maps Embed Code
                                                </label>
                                                <textarea
                                                    value={settings.googleMapsEmbed}
                                                    onChange={(e) => handleSettingChange("googleMapsEmbed", e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors duration-200 font-mono text-sm"
                                                    placeholder='&lt;iframe src="https://www.google.com/maps/embed?pb=..."&gt;&lt;/iframe&gt;'
                                                />
                                                <p className="text-xs text-gray-500">
                                                    Paste the embed code from Google Maps. Get it by clicking "Share" → "Embed a map" on Google Maps.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Location Preview</h3>
                                            <div className="bg-gray-100 rounded-2xl overflow-hidden h-80">
                                                {settings.googleMapsEmbed ? (
                                                    <div
                                                        className="w-full h-full"
                                                        dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        <div className="text-center">
                                                            <div className="text-4xl mb-2">📍</div>
                                                            <p>No map configured</p>
                                                            <p className="text-sm">Add a Google Maps embed code to preview your location</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                                        <button
                                            onClick={saveSettings}
                                            disabled={loading}
                                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </span>
                                            ) : (
                                                "Save Contact Settings"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "social" && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            Social Media Links
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            Add your social media profiles to connect with customers
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Facebook URL
                                            </label>
                                            <input
                                                type="url"
                                                value={settings.socialLinks.facebook}
                                                onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-200"
                                                placeholder="https://facebook.com/yourpage"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Instagram URL
                                            </label>
                                            <input
                                                type="url"
                                                value={settings.socialLinks.instagram}
                                                onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-colors duration-200"
                                                placeholder="https://instagram.com/yourprofile"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Twitter URL
                                            </label>
                                            <input
                                                type="url"
                                                value={settings.socialLinks.twitter}
                                                onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-colors duration-200"
                                                placeholder="https://twitter.com/yourhandle"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                LinkedIn URL
                                            </label>
                                            <input
                                                type="url"
                                                value={settings.socialLinks.linkedin}
                                                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 bg-white transition-colors duration-200"
                                                placeholder="https://linkedin.com/company/yourcompany"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                                        <button
                                            onClick={saveSettings}
                                            disabled={loading}
                                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </span>
                                            ) : (
                                                "Save Social Links"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="text-center py-16">
                                    <div className="text-gray-300 text-6xl mb-4">
                                        🔒
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                                        Security & Access
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Enhanced security features are coming
                                        soon. We're working on advanced access
                                        controls and security settings to keep
                                        your platform safe.
                                    </p>
                                    <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                        Coming Soon
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemSettings;
