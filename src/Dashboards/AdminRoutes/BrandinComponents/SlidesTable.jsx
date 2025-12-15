import React from "react";

function SlidesTable({ slides, onEdit, onDelete, onReorder, onToggleActive }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preview
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {slides
                        .sort((a, b) => a.order - b.order)
                        .map((slide, index) => (
                            <tr key={slide.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                index > 0 &&
                                                onReorder(index, index - 1)
                                            }
                                            disabled={index === 0}
                                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                        >
                                            ↑
                                        </button>
                                        <span className="text-sm text-gray-900">
                                            {slide.order}
                                        </span>
                                        <button
                                            onClick={() =>
                                                index < slides.length - 1 &&
                                                onReorder(index, index + 1)
                                            }
                                            disabled={
                                                index === slides.length - 1
                                            }
                                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                        >
                                            ↓
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {slide.title}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {slide.description}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {slide.price} | {slide.original_price}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleActive(slide.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            slide.is_active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {slide.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onEdit(slide)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(slide.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default SlidesTable;
