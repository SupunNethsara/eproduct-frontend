import React, { useState, useEffect } from "react";
import axios from "axios";
import SlidesTable from "./SlidesTable.jsx";
import SliderSectionPreview from "./SliderSectionPreview.jsx";
import SlideEditor from "./SlideEditor.jsx";

const API_BASE_URL = "http://localhost:8000/api";

function HomeBannerControl() {
    const [slides, setSlides] = useState([]);
    const [editingSlide, setEditingSlide] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/slides`);
            setSlides(response.data);
        } catch (error) {
            console.error("Error fetching slides:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSlide = () => {
        const newSlide = {
            title: "New Product",
            description: "Product description here...",
            price: "Rs299.99",
            original_price: "Rs374.99",
            image: null,
            is_active: true,
            order: slides.length + 1,
        };
        setEditingSlide(newSlide);
        setIsAddingNew(true);
    };

    const handleEditSlide = (slide) => {
        setEditingSlide(slide);
        setIsAddingNew(false);
    };

    const handleSaveSlide = async (updatedSlide) => {
        try {
            setIsLoading(true);
            const formData = new FormData();

            Object.keys(updatedSlide).forEach((key) => {
                if (key === "image" && updatedSlide[key] instanceof File) {
                    formData.append("image", updatedSlide[key]);
                } else if (key === "is_active") {
                    formData.append(key, updatedSlide[key] ? "1" : "0");
                } else if (
                    key !== "image" ||
                    (key === "image" && typeof updatedSlide[key] === "string")
                ) {
                    formData.append(key, updatedSlide[key]);
                }
            });

            if (isAddingNew) {
                const response = await axios.post(
                    `${API_BASE_URL}/slides`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Accept: "application/json",
                        },
                    },
                );
                setSlides((prev) => [...prev, response.data]);
            } else {
                const response = await axios.post(
                    `${API_BASE_URL}/slides/${updatedSlide.id}?_method=PUT`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Accept: "application/json",
                        },
                    },
                );
                setSlides((prev) =>
                    prev.map((slide) =>
                        slide.id === updatedSlide.id ? response.data : slide,
                    ),
                );
            }
            setEditingSlide(null);
            setIsAddingNew(false);
            fetchSlides();
        } catch (error) {
            console.error("Error saving slide:", error);
            console.error("Error response:", error.response?.data);
            alert(
                "Error saving slide: " +
                    (error.response?.data?.message || error.message),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSlide = async (slideId) => {
        if (!window.confirm("Are you sure you want to delete this slide?")) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/slides/${slideId}`);
            setSlides((prev) => prev.filter((slide) => slide.id !== slideId));
        } catch (error) {
            console.error("Error deleting slide:", error);
            alert("Error deleting slide");
        }
    };

    const handleReorder = async (fromIndex, toIndex) => {
        const updatedSlides = [...slides];
        const [movedSlide] = updatedSlides.splice(fromIndex, 1);
        updatedSlides.splice(toIndex, 0, movedSlide);

        const reorderedSlides = updatedSlides.map((slide, index) => ({
            ...slide,
            order: index + 1,
        }));

        setSlides(reorderedSlides);

        try {
            await axios.put(`${API_BASE_URL}/slides/order/update`, {
                slides: reorderedSlides.map((slide) => ({
                    id: slide.id,
                    order: slide.order,
                })),
            });
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const toggleSlideActive = async (slideId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/slides/${slideId}/toggle-status`,
            );
            setSlides((prev) =>
                prev.map((slide) =>
                    slide.id === slideId ? response.data : slide,
                ),
            );
        } catch (error) {
            console.error("Error toggling slide status:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Home Banner Slides
                </h2>
                <button
                    onClick={handleAddSlide}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Add New Slide
                </button>
            </div>

            {editingSlide ? (
                <SlideEditor
                    slide={editingSlide}
                    onSave={handleSaveSlide}
                    onCancel={() => {
                        setEditingSlide(null);
                        setIsAddingNew(false);
                    }}
                    isNew={isAddingNew}
                />
            ) : (
                <>
                    <SlidesTable
                        slides={slides}
                        onEdit={handleEditSlide}
                        onDelete={handleDeleteSlide}
                        onReorder={handleReorder}
                        onToggleActive={toggleSlideActive}
                    />

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Live Preview
                        </h3>
                        <div className="rounded-lg">
                            <SliderSectionPreview
                                slides={slides.filter(
                                    (slide) => slide.is_active,
                                )}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default HomeBannerControl;
