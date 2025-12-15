import React, { useState, useEffect } from "react";
import axios from "axios";

const TopProductControl = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        original_price: "",
        image: "",
        button_text: "",
        theme_color: "primary",
        is_active: true,
    });
    const [imageFile, setImageFile] = useState(null);

    const themeColors = {
        primary: "#0866ff",
        primaryHover: "#0759e0",
        secondary: "#e3251b",
        secondaryHover: "#c91f16",
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/top-products",
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();

            // Append all form data with proper boolean conversion
            Object.keys(formData).forEach((key) => {
                if (key === "is_active") {
                    // Convert boolean to string '1' or '0' for Laravel
                    submitData.append(key, formData[key] ? "1" : "0");
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            if (imageFile) {
                submitData.append("image", imageFile);
            }

            if (editingProduct) {
                // Use PUT method for updates instead of POST
                await axios.post(
                    `http://localhost:8000/api/top-products/${editingProduct.id}`,
                    submitData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "X-HTTP-Method-Override": "PUT",
                        },
                    },
                );
            } else {
                await axios.post(
                    "http://localhost:8000/api/top-products",
                    submitData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            // Show more detailed error information
            if (error.response) {
                console.error("Server response:", error.response.data);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "",
            price: "",
            original_price: "",
            image: "",
            button_text: "",
            theme_color: "primary",
            is_active: true,
        });
        setImageFile(null);
        setEditingProduct(null);
        setShowForm(false);
    };

    const editProduct = (product) => {
        setFormData({
            title: product.title,
            description: product.description || "",
            category: product.category,
            price: product.price,
            original_price: product.original_price || "",
            image: product.image,
            button_text: product.button_text,
            theme_color: product.theme_color,
            is_active: product.is_active,
        });
        setEditingProduct(product);
        setShowForm(true);
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(
                    `http://localhost:8000/api/top-products/${id}`,
                );
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const toggleStatus = async (product) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/top-products/${product.id}/toggle-status`,
            );
            fetchProducts();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const updateOrder = async (draggedId, targetId) => {
        const updatedProducts = [...products];
        const draggedIndex = updatedProducts.findIndex(
            (p) => p.id === draggedId,
        );
        const targetIndex = updatedProducts.findIndex((p) => p.id === targetId);

        const [draggedItem] = updatedProducts.splice(draggedIndex, 1);
        updatedProducts.splice(targetIndex, 0, draggedItem);

        const orderData = updatedProducts.map((product, index) => ({
            id: product.id,
            order: index,
        }));

        try {
            await axios.patch(
                "http://localhost:8000/api/top-products/update-order",
                {
                    products: orderData,
                },
            );
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">Loading products...</div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Top Products Management
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Product
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Price *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value,
                                        })
                                    }
                                    placeholder="Rs299.99"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Original Price
                                </label>
                                <input
                                    type="text"
                                    value={formData.original_price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            original_price: e.target.value,
                                        })
                                    }
                                    placeholder="Rs374.99"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows="2"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Button Text *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.button_text}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            button_text: e.target.value,
                                        })
                                    }
                                    placeholder="Secure Your Home"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Theme Color
                                </label>
                                <select
                                    value={formData.theme_color}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            theme_color: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="primary">
                                        Primary (Blue)
                                    </option>
                                    <option value="secondary">
                                        Secondary (Red)
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {editingProduct
                                        ? "Update Image"
                                        : "Image *"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImageFile(e.target.files[0])
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formData.image && !imageFile && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Current Image:
                                        </p>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="h-20 object-cover rounded"
                                        />
                                    </div>
                                )}
                                {imageFile && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-1">
                                            New Image:
                                        </p>
                                        <img
                                            src={URL.createObjectURL(imageFile)}
                                            alt="Preview"
                                            className="h-20 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        is_active: e.target.checked,
                                    })
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="is_active"
                                className="ml-2 text-sm text-gray-700"
                            >
                                Active Product
                            </label>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                {editingProduct
                                    ? "Update Product"
                                    : "Create Product"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {products.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">No products found</p>
                            <p className="text-sm">
                                Click "Add New Product" to create your first
                                product
                            </p>
                        </div>
                    ) : (
                        products.map((product, index) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col space-y-1">
                                        <button
                                            onClick={() =>
                                                index > 0 &&
                                                updateOrder(
                                                    product.id,
                                                    products[index - 1].id,
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            disabled={index === 0}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() =>
                                                index < products.length - 1 &&
                                                updateOrder(
                                                    product.id,
                                                    products[index + 1].id,
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            disabled={
                                                index === products.length - 1
                                            }
                                        >
                                            ↓
                                        </button>
                                    </div>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {product.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {product.category}
                                        </p>
                                        <p
                                            className="text-sm font-bold"
                                            style={{
                                                color:
                                                    product.theme_color ===
                                                    "primary"
                                                        ? themeColors.primary
                                                        : themeColors.secondary,
                                            }}
                                        >
                                            {product.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleStatus(product)}
                                        className={`px-3 py-1 rounded text-xs font-medium ${
                                            product.is_active
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : "bg-red-100 text-red-800 hover:bg-red-200"
                                        }`}
                                    >
                                        {product.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </button>
                                    <button
                                        onClick={() => editProduct(product)}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            deleteProduct(product.id)
                                        }
                                        className="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-medium hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="flex flex-col gap-4">
                    {products.filter((p) => p.is_active).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No active products to preview</p>
                        </div>
                    ) : (
                        products
                            .filter((p) => p.is_active)
                            .map((product) => (
                                <div
                                    key={product.id}
                                    className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] h-[200px]"
                                >
                                    <div
                                        className="w-1/2 flex items-center justify-center p-4"
                                        style={{
                                            backgroundColor:
                                                product.theme_color ===
                                                "primary"
                                                    ? `${themeColors.primary}10`
                                                    : `${themeColors.secondary}10`,
                                        }}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-contain drop-shadow-xl group-hover:scale-[1.1] transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col justify-center p-6 space-y-2">
                                        <p className="text-sm text-gray-500 font-medium">
                                            {product.category}
                                        </p>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {product.title}
                                        </h2>
                                        <p className="text-xs text-gray-600">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p
                                                className="text-xl font-extrabold leading-none"
                                                style={{
                                                    color:
                                                        product.theme_color ===
                                                        "primary"
                                                            ? themeColors.primary
                                                            : themeColors.secondary,
                                                }}
                                            >
                                                {product.price}
                                            </p>
                                            {product.original_price && (
                                                <p className="text-sm text-gray-400 line-through">
                                                    {product.original_price}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            className="mt-3 w-full text-sm font-semibold text-white py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                                            style={{
                                                backgroundColor:
                                                    product.theme_color ===
                                                    "primary"
                                                        ? themeColors.primary
                                                        : themeColors.secondary,
                                            }}
                                        >
                                            {product.button_text}
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopProductControl;
