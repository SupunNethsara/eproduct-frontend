import React from "react";
import { ArrowUp } from "lucide-react";

const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    color = "blue",
    trend,
}) => {
    const colorClasses = {
        blue: { bg: "bg-blue-50", icon: "text-blue-600" },
        green: { bg: "bg-green-50", icon: "text-green-600" },
        yellow: { bg: "bg-yellow-50", icon: "text-yellow-600" },
        red: { bg: "bg-red-50", icon: "text-red-600" },
        gray: { bg: "bg-gray-50", icon: "text-gray-600" },
    };

    const { bg, icon } = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                            {value}
                        </p>
                        {trend && (
                            <span
                                className={`flex items-center text-xs font-medium ${
                                    trend > 0
                                        ? "text-green-600"
                                        : trend < 0
                                          ? "text-red-600"
                                          : "text-gray-500"
                                }`}
                            >
                                <ArrowUp
                                    className={`w-3 h-3 mr-1 ${trend < 0 ? "rotate-180" : ""}`}
                                />
                                {Math.abs(trend)}%
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-sm text-gray-500 mt-2">
                            {description}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`w-6 h-6 ${icon}`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
