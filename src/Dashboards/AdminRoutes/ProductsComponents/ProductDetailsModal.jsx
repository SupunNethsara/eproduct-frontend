import { X, Star, Package, Tag, Calendar, Eye, TrendingUp, Shield, Download, Trash2, AlertTriangle } from "lucide-react";
import React, { useState } from "react";

export const ProductDetailsModal = ({ product, onClose, onDelete }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const parseImages = (imagesData) => {
        if (!imagesData) return [];
        try {
            if (typeof imagesData === 'string') {
                const cleanedString = imagesData.replace(/\\/g, '');
                return JSON.parse(cleanedString);
            } else if (Array.isArray(imagesData)) {
                return imagesData;
            }
        } catch (error) {
            console.error('Error parsing images:', error);
            return []
        }
        return [];
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(product.id, product.name);
            onClose();
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const openDeleteConfirm = () => {
        setShowDeleteConfirm(true);
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const productImages = parseImages(product.images);
    const mainImage = product.image || (productImages.length > 0 ? productImages[0] : null);
    const displayImage = selectedImage || mainImage;
    const allImages = [mainImage, ...productImages].filter(Boolean);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    const generatePDF = async () => {
        setGeneratingPDF(true);
        try {
            const { jsPDF } = await import('jspdf');

            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            let yPosition = margin;

            doc.setFillColor(59, 130, 246);
            doc.rect(0, 0, pageWidth, 25, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('E-SUPPORT STORE', margin, 12);

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Product Catalog Sheet', margin, 18);
            doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, pageWidth - margin, 18, { align: 'right' });

            yPosition = 35;

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            const productNameLines = doc.splitTextToSize(product.name, pageWidth - (2 * margin));
            doc.text(productNameLines, margin, yPosition);
            yPosition += productNameLines.length * 6 + 5;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Item Code: ${product.item_code}`, margin, yPosition);
            doc.text(`Model: ${product.model || 'N/A'}`, pageWidth / 2, yPosition);
            yPosition += 8;

            const statusColor = product.status === 'active' ? [34, 197, 94] : [156, 163, 175];
            const stockColor = product.availability > 0 ? [34, 197, 94] : [239, 68, 68];

            doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.text(`Status: ${product.status.toUpperCase()}`, margin, yPosition);

            doc.setTextColor(stockColor[0], stockColor[1], stockColor[2]);
            doc.text(`Stock: ${product.availability} units`, pageWidth / 2, yPosition);

            doc.setTextColor(0, 0, 0);
            yPosition += 10;

            doc.setFillColor(240, 253, 244);
            doc.roundedRect(margin, yPosition, pageWidth - (2 * margin), 25, 3, 3, 'F');

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('PRICING INFORMATION', margin + 5, yPosition + 8);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Regular Price:`, margin + 5, yPosition + 16);
            doc.text(`Rs. ${parseFloat(product.price).toLocaleString()}`, margin + 40, yPosition + 16);

            doc.setTextColor(22, 163, 74);
            doc.setFont('helvetica', 'bold');
            doc.text(`Buy Now Price:`, margin + 5, yPosition + 22);
            doc.text(`Rs. ${parseFloat(product.buy_now_price).toLocaleString()}`, margin + 45, yPosition + 22);

            const discount = product.price > 0 ? (((product.price - product.buy_now_price) / product.price) * 100).toFixed(1) : 0;
            if (discount > 0) {
                doc.setTextColor(239, 68, 68);
                doc.text(`You Save: ${discount}%`, pageWidth - margin - 5, yPosition + 22, { align: 'right' });
            }

            doc.setTextColor(0, 0, 0);
            yPosition += 35;

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('PRODUCT DETAILS', margin, yPosition);
            yPosition += 8;

            const details = [
                [`Category: ${product.category_1 || 'N/A'}`, `Brand: ${product.category_2 || 'N/A'}`],
                [`Type: ${product.category_3 || 'N/A'}`, `Warranty: ${product.warranty || 'No warranty'}`],
                [`Total Views: ${product.total_views || 0}`, `Rating: ${product.average_rating || 'N/A'}/5`]
            ];

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            details.forEach(row => {
                doc.text(row[0], margin + 5, yPosition);
                doc.text(row[1], pageWidth / 2, yPosition);
                yPosition += 5;
            });
            yPosition += 8;

            if (yPosition > 200) {
                doc.addPage();
                yPosition = margin;
            }

            if (product.hedding || product.description) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('DESCRIPTION', margin, yPosition);
                yPosition += 8;

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');

                if (product.hedding) {
                    doc.setFont('helvetica', 'bold');
                    const headingLines = doc.splitTextToSize(product.hedding, pageWidth - (2 * margin));
                    doc.text(headingLines, margin + 5, yPosition);
                    yPosition += headingLines.length * 4 + 3;
                }

                if (product.description) {
                    doc.setFont('helvetica', 'normal');
                    const descLines = doc.splitTextToSize(product.description, pageWidth - (2 * margin));
                    doc.text(descLines, margin + 5, yPosition);
                    yPosition += descLines.length * 4 + 8;
                }
            }

            if (yPosition > 200) {
                doc.addPage();
                yPosition = margin;
            }

            if (product.specification) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('SPECIFICATIONS', margin, yPosition);
                yPosition += 8;

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');

                const cleanSpec = product.specification
                    .replace(/[{}"\[\]]/g, '')
                    .replace(/,/g, ', ')
                    .replace(/:/g, ': ')
                    .replace(/\s+/g, ' ')
                    .trim();

                const specLines = doc.splitTextToSize(cleanSpec, pageWidth - (2 * margin));
                const maxLines = Math.min(specLines.length, 35);

                doc.text(specLines.slice(0, maxLines), margin + 5, yPosition);
                yPosition += maxLines * 3 + 5;

                if (specLines.length > maxLines) {
                    doc.setTextColor(59, 130, 246);
                    doc.text('[...specifications continue]', margin + 5, yPosition);
                    doc.setTextColor(0, 0, 0);
                    yPosition += 5;
                }
            }

            if (yPosition > 200) {
                doc.addPage();
                yPosition = margin;
            }

            if (product.tags && product.tags.trim()) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('PRODUCT TAGS', margin, yPosition);
                yPosition += 8;

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');

                const tags = product.tags.split(',').map(t => t.trim()).filter(Boolean);
                const tagsText = tags.join(' • ');
                const tagLines = doc.splitTextToSize(tagsText, pageWidth - (2 * margin));

                doc.text(tagLines, margin + 5, yPosition);
                yPosition += tagLines.length * 3 + 8;
            }

            // Rating Distribution (if available)
            if (product.rating_distribution && product.reviews_count > 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('RATING BREAKDOWN', margin, yPosition);
                yPosition += 8;

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');

                const ratingStartX = margin + 5;
                [5, 4, 3, 2, 1].forEach((star, index) => {
                    const count = product.rating_distribution[star] || 0;
                    const total = product.reviews_count || 1;
                    const percentage = (count / total) * 100;
                    const barWidth = 40;

                    doc.text(`${star}★:`, ratingStartX, yPosition + (index * 4));
                    doc.setFillColor(229, 231, 235); // Gray background
                    doc.rect(ratingStartX + 15, yPosition - 1.5 + (index * 4), barWidth, 2, 'F');
                    doc.setFillColor(251, 191, 36); // Yellow progress
                    doc.rect(ratingStartX + 15, yPosition - 1.5 + (index * 4), (barWidth * percentage) / 100, 2, 'F');
                    doc.text(`${count} (${percentage.toFixed(1)}%)`, ratingStartX + 60, yPosition + (index * 4));
                });
                yPosition += 25;
            }

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
                    align: 'center'
                });

                doc.text('CONFIDENTIAL - For Internal Use Only', margin, doc.internal.pageSize.getHeight() - 10);
                doc.text(`Product ID: ${product.id}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, {
                    align: 'right'
                });

                doc.setDrawColor(200, 200, 200);
                doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);
            }

            const fileName = `${product.item_code}_${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_product_sheet.pdf`;
            doc.save(fileName);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="pr-12">
                            <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
                                <Package className="w-4 h-4" />
                                <span>{product.item_code}</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
                            <p className="text-blue-100">{product.model}</p>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
                        <div className="p-6 lg:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    {displayImage ? (
                                        <>
                                            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 group">
                                                <img
                                                    src={displayImage}
                                                    alt={product.name}
                                                    className="w-full h-96 object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                                    }}
                                                />
                                            </div>
                                            {allImages.length > 1 && (
                                                <div className="grid grid-cols-5 gap-2">
                                                    {allImages.map((img, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedImage(img)}
                                                            className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                                                img === displayImage
                                                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                                                    : 'border-gray-200 hover:border-blue-300'
                                                            }`}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${product.name} ${index + 1}`}
                                                                className="w-full h-20 object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/100?text=Error';
                                                                }}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-96 flex flex-col items-center justify-center">
                                            <Package className="w-16 h-16 text-gray-400 mb-4" />
                                            <p className="text-gray-500 font-medium">No images available</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-3xl font-bold text-green-700">
                                                Rs. {parseFloat(product.buy_now_price).toLocaleString()}
                                            </span>
                                            <span className="text-lg text-gray-500 line-through">
                                                Rs. {parseFloat(product.price).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                                                product.availability > 0
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.availability > 0 ? '✓' : '✗'} {product.availability} in stock
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                                                product.status === 'active'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="text-4xl font-bold text-amber-600">
                                                {product.average_rating || 0}
                                            </div>
                                            <div>
                                                <div className="flex gap-1 mb-1">
                                                    {renderStars(product.average_rating || 0)}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {product.reviews_count || 0} reviews
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = product.rating_distribution?.[star] || 0;
                                                const total = product.reviews_count || 1;
                                                const percentage = (count / total) * 100;
                                                return (
                                                    <div key={star} className="flex items-center gap-2 text-sm">
                                                        <span className="w-12 text-gray-600">{star} star</span>
                                                        <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className="h-full bg-amber-400"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-12 text-right text-gray-600">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <Tag className="w-5 h-5 text-blue-600 mb-2" />
                                            <p className="text-xs text-blue-600 mb-1">Category</p>
                                            <p className="font-semibold text-blue-900">
                                                {product.category_1 || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <Tag className="w-5 h-5 text-blue-600 mb-2" />
                                            <p className="text-xs text-blue-600 mb-1">Brand</p>
                                            <p className="font-semibold text-blue-900">
                                                {product.category_2 || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                            <Package className="w-5 h-5 text-purple-600 mb-2" />
                                            <p className="text-xs text-purple-600 mb-1">Type</p>
                                            <p className="font-semibold text-purple-900">
                                                {product.category_3 || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 col-span-2">
                                            <Shield className="w-5 h-5 text-orange-600 mb-2" />
                                            <p className="text-xs text-orange-600 mb-1">Warranty</p>
                                            <p className="font-semibold text-orange-900">
                                                {product.warranty || 'No warranty'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {product.hedding && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Heading</h3>
                                        <p className="text-gray-700 leading-relaxed">{product.hedding}</p>
                                    </div>
                                )}

                                {product.description && (
                                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                    </div>
                                )}

                                {product.specification && (
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
                                            {product.specification}
                                        </pre>
                                    </div>
                                )}

                                {product.tags && product.tags.trim() && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.split(',').map((tag, index) => (
                                                tag.trim() && (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all"
                                                    >
                                                        <Tag className="w-3 h-3" />
                                                        {tag.trim()}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                        <Eye className="w-5 h-5 text-blue-600 mb-2" />
                                        <p className="text-xs text-gray-600 mb-1">Total Views</p>
                                        <p className="text-xl font-bold text-gray-900">{product.total_views}</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                        <Calendar className="w-5 h-5 text-green-600 mb-2" />
                                        <p className="text-xs text-gray-600 mb-1">Created</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                        <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
                                        <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(product.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-between gap-3">
                            <button
                                onClick={openDeleteConfirm}
                                disabled={deleting}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleting ? 'Deleting...' : 'Delete Product'}
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={generatePDF}
                                    disabled={generatingPDF}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    {generatingPDF ? 'Generating...' : 'Download PDF'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-700">
                                    Are you sure you want to delete <strong>"{product.name}"</strong>?
                                    This product will be moved to the trash and can be restored later.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-300 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete Product
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
