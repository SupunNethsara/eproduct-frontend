import React, { useState } from "react";

function SlideEditor({ slide, onSave, onCancel, isNew }) {
    const [formData, setFormData] = useState({
        title: slide.title || "",
        description: slide.description || "",
        price: slide.price || "",
        original_price: slide.original_price || "",
        image: slide.image || null,
        is_active: slide.is_active !== undefined ? slide.is_active : true,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(slide.image || null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...slide,
            ...formData,
            image: imageFile || formData.image,
            is_active: Boolean(formData.is_active),
        };

        onSave(submitData);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isNew ? "Add New Slide" : "Edit Slide"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Rs299.99"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Original Price *
                        </label>
                        <input
                            type="text"
                            name="original_price"
                            value={formData.original_price}
                            onChange={handleInputChange}
                            placeholder="Rs374.99"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Active Slide
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image *
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required={isNew}
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-32 object-cover rounded-lg border"
                            />
                        </div>
                    )}
                    {!imagePreview && slide.image && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">
                                Current Image:
                            </p>
                            <img
                                src={slide.image}
                                alt="Current"
                                className="h-32 object-cover rounded-lg border"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {isNew ? "Create Slide" : "Update Slide"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SlideEditor;
