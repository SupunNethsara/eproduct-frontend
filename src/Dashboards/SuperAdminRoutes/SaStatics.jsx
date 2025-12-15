import React, { useState, useEffect } from "react";
import MetricsGrid from "../AdminRoutes/Common/StaticsComponents/MetricsGrid.jsx";
import ChartsGrid from "../AdminRoutes/Common/StaticsComponents/ChartsGrid.jsx";
import RecentActivity from "../AdminRoutes/Common/StaticsComponents/RecentActivity.jsx";

function SaStatics() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-full mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-6 shadow-sm"
                                >
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                <MetricsGrid />
                <ChartsGrid />
                <RecentActivity />
            </div>
        </div>
    );
}

export default SaStatics;
