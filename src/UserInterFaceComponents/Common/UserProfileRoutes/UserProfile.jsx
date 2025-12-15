import React, { useState } from "react";
import {
    User,
    Settings,
    ShoppingBag,
    Heart,
    MapPin,
    CreditCard,
    Bell,
} from "lucide-react";
import PersonalDetails from "./PersonalDetails.jsx";
import RecentOrders from "./RecentOrders.jsx";
import Wishlist from "./Wishlist.jsx";

function UserProfile() {
    const [activeTab, setActiveTab] = useState("profile");

    const navigationItems = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "orders", label: "Recent Orders", icon: ShoppingBag },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "payments", label: "Payment Methods", icon: CreditCard },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <PersonalDetails />;
            case "orders":
                return <RecentOrders />;
            case "wishlist":
                return <Wishlist />;
            case "payments":
                return (
                    <div className="p-8 text-center">
                        <div className="max-w-md mx-auto py-12">
                            <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Payment Methods
                            </h3>
                            <p className="text-gray-500">
                                Manage your payment methods and billing information
                            </p>
                        </div>
                    </div>
                );
            case "notifications":
                return (
                    <div className="p-8 text-center">
                        <div className="max-w-md mx-auto py-12">
                            <Bell size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Notifications
                            </h3>
                            <p className="text-gray-500">
                                Configure your notification preferences
                            </p>
                        </div>
                    </div>
                );
            default:
                return <PersonalDetails />;
        }
    };

    return (
        <div className="min-h-auto pt-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-64 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Account Settings
                                </h2>
                                <nav className="space-y-1">
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() =>
                                                    setActiveTab(item.id)
                                                }
                                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    activeTab === item.id
                                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                }`}
                                            >
                                                <Icon
                                                    size={18}
                                                    className="mr-3"
                                                />
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[600px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
