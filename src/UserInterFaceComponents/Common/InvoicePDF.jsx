import jsPDF from "jspdf";

const InvoicePDF = {
    generate: async (orderData) => {
        const { order, user, orderSummary, items, deliveryOption } = orderData;

        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 15;
            let yPosition = margin;

            // Helper function to get product price (buy_now_price first, then price)
            const getProductPrice = (product) => {
                return parseFloat(
                    product?.buy_now_price || product?.price || 0,
                );
            };

            // Helper function to check if there's a discount
            const hasDiscount = (product) => {
                return (
                    product?.buy_now_price &&
                    product?.price &&
                    parseFloat(product.buy_now_price) <
                        parseFloat(product.price)
                );
            };

            // Helper function to calculate savings
            const getProductSavings = (product, quantity = 1) => {
                if (!hasDiscount(product)) return 0;
                const originalPrice = parseFloat(product.price);
                const discountedPrice = parseFloat(product.buy_now_price);
                return (originalPrice - discountedPrice) * quantity;
            };

            // Calculate total savings
            const totalSavings = items.reduce((total, item) => {
                return total + getProductSavings(item.product, item.quantity);
            }, 0);

            // Add header
            pdf.setFillColor(227, 37, 27);
            pdf.rect(0, 0, pageWidth, 25, "F");

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(18);
            pdf.setFont("helvetica", "bold");
            pdf.text("INVOICE", pageWidth / 2, 15, { align: "center" });

            yPosition = 35;

            // Company info and order details
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");

            // Left column - Company info
            pdf.text("Your Store", margin, yPosition);
            pdf.text("123 Business Street", margin, yPosition + 5);
            pdf.text("City, State 12345", margin, yPosition + 10);

            // Right column - Order details
            pdf.text(
                `Order #: ${order.order_code || order.id}`,
                pageWidth - margin,
                yPosition,
                { align: "right" },
            );
            pdf.text(
                `Date: ${InvoicePDF.formatDate(order.created_at)}`,
                pageWidth - margin,
                yPosition + 5,
                { align: "right" },
            );
            pdf.text(`Status: Confirmed`, pageWidth - margin, yPosition + 10, {
                align: "right",
            });

            yPosition += 20;

            // Customer information
            pdf.setFont("helvetica", "bold");
            pdf.text("Bill To:", margin, yPosition);
            pdf.setFont("helvetica", "normal");

            pdf.text(user.name, margin, yPosition + 5);
            pdf.text(user.email, margin, yPosition + 10);
            pdf.text(user.profile?.phone || "N/A", margin, yPosition + 15);

            const address = `${user.profile?.address || "Address not provided"}${user.profile?.city ? `, ${user.profile.city}` : ""}${user.profile?.postal_code ? `, ${user.profile.postal_code}` : ""}`;
            const addressLines = pdf.splitTextToSize(
                address,
                pageWidth - 2 * margin,
            );
            pdf.text(addressLines, margin, yPosition + 20);

            yPosition += 35;

            // Delivery information
            pdf.setFont("helvetica", "bold");
            pdf.text("Delivery:", margin, yPosition);
            pdf.setFont("helvetica", "normal");
            pdf.text(
                deliveryOption?.name || "Standard Delivery",
                margin + 20,
                yPosition,
            );

            yPosition += 10;

            // Table header
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F");

            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");

            const colWidth = (pageWidth - 2 * margin) / 4;
            pdf.text("Item", margin + 5, yPosition + 5);
            pdf.text("Qty", margin + colWidth * 2, yPosition + 5, {
                align: "center",
            });
            pdf.text("Unit Price", margin + colWidth * 2.5, yPosition + 5, {
                align: "right",
            });
            pdf.text("Total", pageWidth - margin - 5, yPosition + 5, {
                align: "right",
            });

            yPosition += 10;

            // Items
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);

            items.forEach((item, index) => {
                // Check for page break
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = margin;
                    // Add table header on new page
                    pdf.setFillColor(240, 240, 240);
                    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F");
                    pdf.setTextColor(0, 0, 0);
                    pdf.setFontSize(9);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Item", margin + 5, yPosition + 5);
                    pdf.text("Qty", margin + colWidth * 2, yPosition + 5, {
                        align: "center",
                    });
                    pdf.text(
                        "Unit Price",
                        margin + colWidth * 2.5,
                        yPosition + 5,
                        { align: "right" },
                    );
                    pdf.text("Total", pageWidth - margin - 5, yPosition + 5, {
                        align: "right",
                    });
                    yPosition += 10;
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(8);
                }

                const itemName = item.product?.name || "Product";
                const truncatedName =
                    itemName.length > 40
                        ? itemName.substring(0, 37) + "..."
                        : itemName;

                const productPrice = getProductPrice(item.product);
                const unitPrice = productPrice.toFixed(2);
                const total = (productPrice * item.quantity).toFixed(2);
                const productHasDiscount = hasDiscount(item.product);

                // Item name
                pdf.text(truncatedName, margin + 5, yPosition);

                // Quantity
                pdf.text(
                    item.quantity.toString(),
                    margin + colWidth * 2,
                    yPosition,
                    { align: "center" },
                );

                // Unit Price - show discounted price
                if (productHasDiscount) {
                    pdf.setTextColor(0, 128, 0); // Green for discounted price
                    pdf.setFont("helvetica", "bold");
                }
                pdf.text(
                    `Rs. ${unitPrice}`,
                    margin + colWidth * 2.5,
                    yPosition,
                    { align: "right" },
                );

                // Reset color for total
                pdf.setTextColor(0, 0, 0);
                pdf.setFont("helvetica", "normal");

                // Total
                pdf.text(`Rs. ${total}`, pageWidth - margin - 5, yPosition, {
                    align: "right",
                });

                // Add discount note if applicable
                if (productHasDiscount) {
                    yPosition += 3;
                    pdf.setFontSize(7);
                    pdf.setTextColor(128, 128, 128);
                    const originalPrice = parseFloat(
                        item.product.price,
                    ).toFixed(2);
                    const savings = getProductSavings(
                        item.product,
                        item.quantity,
                    ).toFixed(2);
                    pdf.text(
                        `(Original: Rs. ${originalPrice} - Saved: Rs. ${savings})`,
                        margin + 5,
                        yPosition,
                    );
                    pdf.setFontSize(8);
                    pdf.setTextColor(0, 0, 0);
                    yPosition += 2;
                }

                yPosition += 5;
            });

            yPosition += 10;

            // Summary
            const summaryX = pageWidth - margin - 80;

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");

            // Show total savings if any
            if (totalSavings > 0) {
                pdf.setTextColor(0, 128, 0); // Green for savings
                pdf.text("Total Savings:", summaryX, yPosition);
                pdf.text(
                    `-Rs. ${totalSavings.toFixed(2)}`,
                    pageWidth - margin - 5,
                    yPosition,
                    { align: "right" },
                );
                yPosition += 5;
                pdf.setTextColor(0, 0, 0); // Reset to black
            }

            pdf.text("Subtotal:", summaryX, yPosition);
            pdf.text(
                `Rs. ${orderSummary.itemsTotal.toFixed(2)}`,
                pageWidth - margin - 5,
                yPosition,
                { align: "right" },
            );

            pdf.text("Delivery Fee:", summaryX, yPosition + 5);
            pdf.text(
                `Rs. ${orderSummary.deliveryFee.toFixed(2)}`,
                pageWidth - margin - 5,
                yPosition + 5,
                { align: "right" },
            );

            yPosition += 12;

            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            pdf.text("Total Amount:", summaryX, yPosition);
            pdf.text(
                `Rs. ${orderSummary.total.toFixed(2)}`,
                pageWidth - margin - 5,
                yPosition,
                { align: "right" },
            );

            yPosition += 20;

            // Footer
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 100, 100);

            // Add savings note if applicable
            if (totalSavings > 0) {
                pdf.text(
                    `You saved Rs. ${totalSavings.toFixed(2)} on this order!`,
                    pageWidth / 2,
                    yPosition,
                    { align: "center" },
                );
                yPosition += 4;
            }

            pdf.text("Thank you for your business!", pageWidth / 2, yPosition, {
                align: "center",
            });
            pdf.text(
                "This is a computer-generated invoice.",
                pageWidth / 2,
                yPosition + 4,
                { align: "center" },
            );

            pdf.save(`invoice-${order.order_code || order.id}.pdf`);
            return true;
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw new Error("Failed to generate PDF invoice");
        }
    },

    formatDate: (dateString) => {
        const date = dateString ? new Date(dateString) : new Date();
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    },

    // Method to generate invoice for email or other purposes
    generateInvoiceHTML: (orderData) => {
        const { order, user, orderSummary, items, deliveryOption } = orderData;

        // Helper functions for HTML version
        const getProductPrice = (product) => {
            return parseFloat(product?.buy_now_price || product?.price || 0);
        };

        const hasDiscount = (product) => {
            return (
                product?.buy_now_price &&
                product?.price &&
                parseFloat(product.buy_now_price) < parseFloat(product.price)
            );
        };

        const getProductSavings = (product, quantity = 1) => {
            if (!hasDiscount(product)) return 0;
            const originalPrice = parseFloat(product.price);
            const discountedPrice = parseFloat(product.buy_now_price);
            return (originalPrice - discountedPrice) * quantity;
        };

        const totalSavings = items.reduce((total, item) => {
            return total + getProductSavings(item.product, item.quantity);
        }, 0);

        return `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: white;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 28px; font-weight: bold; color: #000; margin: 0 0 10px 0;">INVOICE</h1>
                        <p style="color: #666; margin: 5px 0;"><strong>Order #:</strong> ${order.order_code || order.id}</p>
                        <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${InvoicePDF.formatDate(order.created_at)}</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="font-size: 18px; font-weight: bold; color: #000; margin: 0 0 10px 0;">Your Store</h2>
                        <p style="color: #666; margin: 5px 0;">123 Business Street</p>
                        <p style="color: #666; margin: 5px 0;">City, State 12345</p>
                        <p style="color: #666; margin: 5px 0;">contact@yourstore.com</p>
                    </div>
                </div>

                <!-- Bill To Section -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
                    <div>
                        <h3 style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">Bill To:</h3>
                        <p style="color: #333; margin: 5px 0;">${user.name}</p>
                        <p style="color: #333; margin: 5px 0;">${user.email}</p>
                        <p style="color: #333; margin: 5px 0;">${user.profile?.phone || "N/A"}</p>
                        <p style="color: #333; margin: 5px 0;">
                            ${user.profile?.address || "Address not provided"}
                            ${user.profile?.city ? `, ${user.profile.city}` : ""}
                            ${user.profile?.postal_code ? `, ${user.profile.postal_code}` : ""}
                        </p>
                    </div>
                    <div>
                        <h3 style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">Order Details:</h3>
                        <p style="color: #333; margin: 5px 0;"><strong>Order Date:</strong> ${InvoicePDF.formatDate(order.created_at)}</p>
                        <p style="color: #333; margin: 5px 0;"><strong>Delivery:</strong> ${deliveryOption?.name || "Standard Delivery"}</p>
                        <p style="color: #333; margin: 5px 0;"><strong>Status:</strong> Confirmed</p>
                    </div>
                </div>

                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #ccc;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: left; font-weight: bold;">Item</th>
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: center; font-weight: bold;">Quantity</th>
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: right; font-weight: bold;">Unit Price</th>
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: right; font-weight: bold;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items
                            .map((item, index) => {
                                const productPrice = getProductPrice(
                                    item.product,
                                );
                                const productHasDiscount = hasDiscount(
                                    item.product,
                                );
                                const originalPrice = item.product?.price
                                    ? parseFloat(item.product.price).toFixed(2)
                                    : "0.00";
                                const savings = getProductSavings(
                                    item.product,
                                    item.quantity,
                                ).toFixed(2);

                                return `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 12px;">
                                        ${item.product?.name || "Product"}
                                        ${
                                            productHasDiscount
                                                ? `<br><small style="color: #666; font-size: 11px;">
                                                Original: Rs. ${originalPrice} - Saved: Rs. ${savings}
                                            </small>`
                                                : ""
                                        }
                                    </td>
                                    <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${item.quantity}</td>
                                    <td style="border: 1px solid #ccc; padding: 12px; text-align: right; ${productHasDiscount ? "color: #008000; font-weight: bold;" : ""}">
                                        Rs. ${productPrice.toFixed(2)}
                                    </td>
                                    <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">
                                        Rs. ${(productPrice * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            `;
                            })
                            .join("")}
                    </tbody>
                </table>

                <!-- Summary -->
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 250px;">
                        ${
                            totalSavings > 0
                                ? `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; background-color: #f0fff0; padding: 8px; border-radius: 4px;">
                                <span style="color: #008000; font-weight: bold;">Total Savings:</span>
                                <span style="color: #008000; font-weight: bold;">-Rs. ${totalSavings.toFixed(2)}</span>
                            </div>
                        `
                                : ""
                        }

                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #333;">Subtotal:</span>
                            <span style="color: #000;">Rs. ${orderSummary.itemsTotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #333;">Delivery Fee:</span>
                            <span style="color: #000;">Rs. ${orderSummary.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style="border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                                <span>Total:</span>
                                <span>Rs. ${orderSummary.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
                    ${
                        totalSavings > 0
                            ? `
                        <p style="color: #008000; font-weight: bold;">You saved Rs. ${totalSavings.toFixed(2)} on this order!</p>
                    `
                            : ""
                    }
                    <p>Thank you for your business!</p>
                    <p style="font-size: 12px; margin-top: 8px;">
                        If you have any questions about this invoice, please contact support@yourstore.com
                    </p>
                </div>
            </div>
        `;
    },
};

export default InvoicePDF;
