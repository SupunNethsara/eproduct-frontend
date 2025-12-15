import React, { useState } from "react";
import {
    Camera,
    X,
    Eye,
    ToggleRight,
    ToggleLeft,
    Upload,
    AlertCircle,
    CheckCircle,
    Info,
} from "lucide-react";

const ProductRow = ({
    product,
    onImagesUpload,
    onViewDetails,
    onStatusToggle,
}) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleStatusToggle = async () => {
        if (isToggling) return;

        setIsToggling(true);
        try {
            await onStatusToggle(
                product.id,
                product.status === "active" ? "disabled" : "active",
            );
        } catch (error) {
            console.error("Failed to toggle status:", error);
        } finally {
            setIsToggling(false);
        }
    };
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 4) {
            alert("You can only upload up to 4 images!");
            event.target.value = "";
            return;
        }

        if (selectedFiles.length === 0 && files.length > 0) {
            setSelectedFiles(files);
            setShowInstructions(true);
        } else {
            setSelectedFiles(files);
            setShowImageModal(true);
        }
        event.target.value = "";
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one image!");
            return;
        }

        setUploading(true);
        try {
            await onImagesUpload(
                product.id,
                product.item_code,
                selectedFiles,
                mainImageIndex,
            );
            setShowImageModal(false);
            setShowInstructions(false);
            setSelectedFiles([]);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const startUploadProcess = () => {
        setShowInstructions(false);
        setShowImageModal(true);
    };

    const productImages = product.images
        ? typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images
        : product.image
          ? [product.image]
          : [];

    const mainImage =
        product.image || (productImages.length > 0 ? productImages[0] : null);

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                    )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex space-x-1">
                        {productImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} view ${index + 1}`}
                                className="h-6 w-6 sm:h-8 sm:w-8 object-cover rounded border border-gray-200"
                            />
                        ))}
                        {productImages.length === 0 && (
                            <span className="text-gray-400 text-xs flex items-center">
                                No images
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.item_code}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                        <span className="truncate max-w-[120px]">
                            {product.name}
                        </span>
                        <button
                            onClick={() => setShowProductDetails(true)}
                            className="sm:hidden p-1 hover:bg-gray-100 rounded transition-colors"
                            title="View details"
                        >
                            <Info className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {product.model}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    Rs:{product.price}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.availability > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {product.availability} in stock
                    </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-lg">
                        <Camera size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Add Images</span>
                        <span className="xs:hidden">Images</span>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </label>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                        onClick={handleStatusToggle}
                        disabled={isToggling}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            product.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={
                            product.status === "active"
                                ? "Deactivate Product"
                                : "Activate Product"
                        }
                    >
                        {isToggling ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                        ) : product.status === "active" ? (
                            <ToggleRight className="w-4 h-4 mr-1" />
                        ) : (
                            <ToggleLeft className="w-4 h-4 mr-1" />
                        )}
                        <span className="hidden sm:inline">
                            {product.status === "active"
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                        onClick={() => onViewDetails(product)}
                        className="cursor-pointer bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-lg"
                    >
                        <Eye size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">View Details</span>
                        <span className="xs:hidden">Details</span>
                    </button>
                </td>
            </tr>

            {showProductDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:hidden">
                    <div className="bg-white rounded-2xl w-full max-w-sm transform transition-all">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Product Details
                            </h3>
                            <button
                                onClick={() => setShowProductDetails(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Item Code
                                </label>
                                <p className="text-sm text-gray-900">
                                    {product.item_code}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Name
                                </label>
                                <p className="text-sm text-gray-900">
                                    {product.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Model
                                </label>
                                <p className="text-sm text-gray-900">
                                    {product.model || "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Description
                                </label>
                                <p className="text-sm text-gray-900">
                                    {product.description || "No description"}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Stock
                                </label>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        product.availability > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {product.availability} in stock
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 p-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowProductDetails(false)}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInstructions && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Image Upload Guide
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowInstructions(false);
                                    setSelectedFiles([]);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Recommended Image Types
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Front View
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Back View
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Side View
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Close-up Details
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                        Selected Images
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                        {selectedFiles.length}/4
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div className="absolute inset-0 bg-black/50 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">
                                                    Image {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-800">
                                        <strong>Maximum 4 images</strong>{" "}
                                        allowed per product. You can set one as
                                        the main display image.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowInstructions(false);
                                    setSelectedFiles([]);
                                }}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startUploadProcess}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Continue to Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md transform transition-all">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Upload className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Upload Product Images
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedFiles.length} of 4 images
                                        selected
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowImageModal(false);
                                    setSelectedFiles([]);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        Select Main Image
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Click "Set Main" on preferred image
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border-2 transition-all"
                                            />
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <button
                                                    onClick={() =>
                                                        setMainImageIndex(index)
                                                    }
                                                    className={`w-full py-1.5 text-xs font-medium rounded transition-colors ${
                                                        mainImageIndex === index
                                                            ? "bg-green-600 text-white shadow-lg"
                                                            : "bg-white text-gray-700 bg-opacity-90 hover:bg-opacity-100 shadow-md"
                                                    }`}
                                                >
                                                    {mainImageIndex === index
                                                        ? "✓ Main Image"
                                                        : "Set as Main"}
                                                </button>
                                            </div>
                                            {mainImageIndex === index && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                        Main
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>
                                        The <strong>main image</strong> will be
                                        displayed as the primary product photo.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowImageModal(false);
                                    setSelectedFiles([]);
                                }}
                                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={
                                    uploading || selectedFiles.length === 0
                                }
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload {selectedFiles.length} Image
                                        {selectedFiles.length !== 1 ? "s" : ""}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductRow;
