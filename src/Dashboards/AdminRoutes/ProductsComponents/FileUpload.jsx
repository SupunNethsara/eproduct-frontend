import React from "react";

const FileUpload = ({
    files,
    onFileSelect,
    onRemoveFile,
    onDownloadTemplate,
}) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FileUploadCard
                    type="details"
                    file={files.details}
                    title="Product Details File"
                    description="Upload product information, specifications, and descriptions"
                    onFileSelect={onFileSelect}
                    onRemoveFile={onRemoveFile}
                    onDownloadTemplate={onDownloadTemplate}
                />
                <FileUploadCard
                    type="pricing"
                    file={files.pricing}
                    title="Product Pricing File"
                    description="Upload pricing, availability, and buy-now prices"
                    onFileSelect={onFileSelect}
                    onRemoveFile={onRemoveFile}
                    onDownloadTemplate={onDownloadTemplate}
                />
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        File Structure Requirements
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-blue-800 font-semibold flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                Product Details File
                            </h4>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                12 fields
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "item_code",
                                "name",
                                "category_1",
                                "category_2",
                                "category_3",
                                "model",
                                "description",
                                "hedding",
                                "warranty",
                                "specification",
                                "tags",
                                "youtube_video_id",
                            ].map((field, index) => (
                                <div
                                    key={field}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                                    <code className="text-blue-700 text-xs font-medium">
                                        {field}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-green-800 font-semibold flex items-center gap-2">
                                <div
                                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                    style={{ animationDelay: "500ms" }}
                                ></div>
                                Pricing File
                            </h4>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                4 fields
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                "item_code",
                                "price",
                                "buy_now_price",
                                "availability",
                            ].map((field, index) => (
                                <div
                                    key={field}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                                    <code className="text-green-700 text-xs font-medium">
                                        {field}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        <div className="space-y-2">
                            <p className="text-amber-800 font-medium text-sm">
                                Important Notes:
                            </p>
                            <ul className="text-amber-700 text-sm space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                    First row must contain headers in both files
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                    Use the same{" "}
                                    <code className="bg-amber-100 px-1 rounded text-amber-800 font-mono text-xs">
                                        item_code
                                    </code>{" "}
                                    format for proper data matching
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                    Supported formats: .xlsx, .csv, .xls
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                                    Maximum file size: 10MB per file
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FileUploadCard = ({
    type,
    file,
    title,
    description,
    onFileSelect,
    onRemoveFile,
    onDownloadTemplate,
}) => {
    const getFileIcon = (fileName) => {
        if (!fileName) return "📄";
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (ext === "xlsx" || ext === "xls") return "📊";
        if (ext === "csv") return "📋";
        return "📄";
    };

    return (
        <div
            className={`relative rounded-2xl p-6 transition-all duration-300 ${
                file
                    ? "bg-green-50 border-2 border-green-300 shadow-sm"
                    : "bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:shadow-md"
            }`}
        >
            {/* Header */}
            <div className="text-center mb-4">
                <div className="text-4xl mb-3">
                    {file ? "✅" : getFileIcon(file?.name)}
                </div>
                <h3
                    className={`text-lg font-semibold ${
                        file ? "text-green-800" : "text-gray-800"
                    }`}
                >
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>

            {file ? (
                <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                    {getFileIcon(file.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemoveFile(type)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Remove file"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <label className="block w-full cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                            <svg
                                className="mx-auto h-8 w-8 text-gray-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Click to upload
                            </p>
                            <p className="text-xs text-gray-500">
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                .xlsx, .csv up to 10MB
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    onFileSelect(type, e.target.files[0]);
                                }
                            }}
                        />
                    </label>

                    <button
                        onClick={() => onDownloadTemplate(type)}
                        className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Download Template
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
