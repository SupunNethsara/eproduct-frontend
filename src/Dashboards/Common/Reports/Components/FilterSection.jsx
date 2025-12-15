import React from "react";
import { Calendar } from "lucide-react";

const FilterSection = ({
    dateRange,
    statusFilter,
    onDateRangeChange,
    onStatusFilterChange,
    onQuickDateRange,
}) => {
    const quickDateRanges = {
        Today: {
            start: new Date().toISOString().split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        "Last 7 Days": {
            start: new Date(new Date().setDate(new Date().getDate() - 7))
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        "Last 30 Days": {
            start: new Date(new Date().setDate(new Date().getDate() - 30))
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        "This Month": {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Report Filters
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Filter data by date range and status
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                onStatusFilterChange(e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.keys(quickDateRanges).map((range) => (
                            <button
                                key={range}
                                onClick={() =>
                                    onQuickDateRange(quickDateRanges[range])
                                }
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) =>
                                    onDateRangeChange("start", e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                max={dateRange.end}
                            />
                        </div>
                        <span className="text-gray-400">to</span>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) =>
                                    onDateRangeChange("end", e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min={dateRange.start}
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
