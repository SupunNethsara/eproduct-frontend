import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import ValidationResults from "./ValidationResults";
import UploadProgress from "./UploadProgress";
import UploadComplete from "./UploadComplete.jsx";

const UploadProducts = ({ onUploadComplete }) => {
    const [uploadStage, setUploadStage] = useState("validate");
    const [files, setFiles] = useState({
        details: null,
        pricing: null,
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileSelect = (type, file) => {
        setFiles((prev) => ({
            ...prev,
            [type]: file,
        }));
        setValidationResult(null);
    };

    const removeFile = (type) => {
        setFiles((prev) => ({
            ...prev,
            [type]: null,
        }));
    };

    const validateFiles = async () => {
        if (!files.details || !files.pricing) {
            alert("Please select both files");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("details_file", files.details);
        formData.append("pricing_file", files.pricing);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/products/validate",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            setValidationResult(response.data);
            if (response.data.status === "success") {
                setUploadStage("upload");
            }
        } catch (error) {
            if (error.response?.data) {
                setValidationResult(error.response.data);
            } else {
                alert("Validation failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const uploadProducts = async () => {
        if (!files.details || !files.pricing) {
            alert("Please select both files");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("details_file", files.details);
        formData.append("pricing_file", files.pricing);

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/products/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress =
                            (progressEvent.loaded / progressEvent.total) * 100;
                        setUploadProgress(progress);
                    },
                },
            );

            alert("Products uploaded successfully!");
            setUploadStage("complete");
            onUploadComplete();
        } catch (error) {
            if (error.response?.data) {
                alert("Upload failed: " + JSON.stringify(error.response.data));
            } else {
                alert("Upload failed");
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const resetUpload = () => {
        setFiles({ details: null, pricing: null });
        setSelectedCategory("");
        setValidationResult(null);
        setUploadStage("validate");
        setUploadProgress(0);
    };

    const handleBackToValidation = () => {
        setUploadStage("validate");
    };

    const handleDownloadTemplate = async (type) => {
        try {
            let endpoint = "";
            let filename = "";

            if (type === "details") {
                endpoint =
                    "http://127.0.0.1:8000/api/products/download/details-template";
                filename = "product_details_template.xlsx";
            } else if (type === "pricing") {
                endpoint =
                    "http://127.0.0.1:8000/api/products/download/pricing-template";
                filename = "product_pricing_template.xlsx";
            } else {
                console.error("Invalid template type");
                return;
            }

            const response = await axios.get(endpoint, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert(`Error downloading ${type} template: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            {uploadStage === "validate" && (
                <>
                    <FileUpload
                        files={files}
                        onFileSelect={handleFileSelect}
                        onRemoveFile={removeFile}
                        onDownloadTemplate={handleDownloadTemplate}
                    />

                    <ValidationResults validationResult={validationResult} />

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={resetUpload}
                            className="text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={validateFiles}
                            disabled={
                                loading || !files.details || !files.pricing
                            }
                            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Validating..." : "Validate Files"}
                        </button>
                    </div>
                </>
            )}

            {uploadStage === "upload" && (
                <UploadProgress
                    uploadProgress={uploadProgress}
                    loading={loading}
                    selectedCategory={selectedCategory}
                    onBack={handleBackToValidation}
                    onUpload={uploadProducts}
                />
            )}

            {uploadStage === "complete" && (
                <UploadComplete
                    onReset={resetUpload}
                    onViewProducts={() => onUploadComplete()}
                />
            )}
        </div>
    );
};

export default UploadProducts;
