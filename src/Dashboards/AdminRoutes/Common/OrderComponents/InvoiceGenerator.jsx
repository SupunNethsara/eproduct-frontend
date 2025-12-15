import React from "react";
import dayjs from "dayjs";

class InvoiceGenerator {
    static generatePDF(orderData) {
        if (typeof window === "undefined") return;

        try {
            import("jspdf")
                .then((jsPDFModule) => {
                    const { jsPDF } = jsPDFModule;
                    this.createPDF(jsPDF, orderData);
                })
                .catch((error) => {
                    console.error("Error loading jsPDF:", error);
                    this.fallbackDownload(orderData);
                });
        } catch (error) {
            console.error("PDF generation error:", error);
            this.fallbackDownload(orderData);
        }
    }

    static createPDF(jsPDF, orderData) {
        const { order, items, user, profile } = orderData;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = margin;

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 128);
        doc.text("TAX INVOICE", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("Company: Tech Solutions Ltd.", margin, yPosition);
        yPosition += 5;
        doc.text(
            "Address: 123 Business Street, Colombo 01, Sri Lanka",
            margin,
            yPosition,
        );
        yPosition += 5;
        doc.text(
            "Phone: +94 11 234 5678 | Email: accounts@techsolutions.lk",
            margin,
            yPosition,
        );
        yPosition += 5;
        doc.text(
            "VAT No: 123456789 | Business Reg: B123456789",
            margin,
            yPosition,
        );
        yPosition += 15;

        const detailsStart = pageWidth - 80;
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE DETAILS", detailsStart, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice No: ${order.order_code}`, detailsStart, yPosition);
        yPosition += 5;
        doc.text(
            `Date: ${dayjs(order.created_at).format("DD/MM/YYYY")}`,
            detailsStart,
            yPosition,
        );
        yPosition += 5;
        doc.text(
            `Time: ${dayjs(order.created_at).format("hh:mm A")}`,
            detailsStart,
            yPosition,
        );
        yPosition += 5;
        doc.text(
            `Status: ${order.status.toUpperCase()}`,
            detailsStart,
            yPosition,
        );
        yPosition += 15;

        doc.setFont("helvetica", "bold");
        doc.text("BILL TO:", margin, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        doc.text(
            `Customer: ${user?.name || "Walk-in Customer"}`,
            margin,
            yPosition,
        );
        yPosition += 5;
        doc.text(`Email: ${user?.email || "N/A"}`, margin, yPosition);
        yPosition += 5;
        doc.text(`Phone: ${profile?.phone || "N/A"}`, margin, yPosition);
        yPosition += 5;
        doc.text(`Address: ${profile?.address || "N/A"}`, margin, yPosition);
        yPosition += 5;
        doc.text(
            `City: ${profile?.city || "N/A"}, ${profile?.country || "N/A"}`,
            margin,
            yPosition,
        );
        yPosition += 5;
        doc.text(
            `Payment Method: ${order.payment_method?.replace(/_/g, " ") || "N/A"}`,
            margin,
            yPosition,
        );
        yPosition += 10;

        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        doc.text("#", margin + 5, yPosition + 5);
        doc.text("Item Description", margin + 15, yPosition + 5);
        doc.text("Qty", pageWidth - 60, yPosition + 5);
        doc.text("Unit Price", pageWidth - 45, yPosition + 5);
        doc.text("Amount", pageWidth - 20, yPosition + 5);
        yPosition += 12;

        doc.setFont("helvetica", "normal");
        let itemNumber = 1;

        items?.forEach((item) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }

            const itemName = item.product?.name || "Product";
            const model = item.product?.model || "";
            const itemCode = item.product?.item_code || "";
            const quantity = item.quantity;
            const price = parseFloat(item.price || 0);
            const total = price * quantity;

            doc.text(itemNumber.toString(), margin + 5, yPosition + 5);

            const description =
                model || itemCode
                    ? `${itemName} (${model}${itemCode ? ` - ${itemCode}` : ""})`
                    : itemName;
            doc.text(description.substring(0, 35), margin + 15, yPosition + 5);

            doc.text(quantity.toString(), pageWidth - 60, yPosition + 5);
            doc.text(
                `Rs. ${price.toLocaleString()}`,
                pageWidth - 45,
                yPosition + 5,
            );
            doc.text(
                `Rs. ${total.toLocaleString()}`,
                pageWidth - 20,
                yPosition + 5,
            );

            yPosition += 8;
            itemNumber++;
        });

        yPosition += 10;

        const subtotal =
            parseFloat(order.total_amount) -
            parseFloat(order.delivery_fee || 0);
        const deliveryFee = parseFloat(order.delivery_fee || 0);
        const totalAmount = parseFloat(order.total_amount || 0);

        doc.setFont("helvetica", "normal");
        doc.text(`Subtotal:`, pageWidth - 60, yPosition);
        doc.text(`Rs. ${subtotal.toLocaleString()}`, pageWidth - 20, yPosition);
        yPosition += 6;

        doc.text(`Delivery Fee:`, pageWidth - 60, yPosition);
        doc.text(
            `Rs. ${deliveryFee.toLocaleString()}`,
            pageWidth - 20,
            yPosition,
        );
        yPosition += 6;

        doc.setFont("helvetica", "bold");
        doc.text(`Total Amount:`, pageWidth - 60, yPosition);
        doc.text(
            `Rs. ${totalAmount.toLocaleString()}`,
            pageWidth - 20,
            yPosition,
        );
        yPosition += 10;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for your business!", pageWidth / 2, yPosition, {
            align: "center",
        });
        yPosition += 4;
        doc.text(
            "This is a computer-generated invoice. No signature required.",
            pageWidth / 2,
            yPosition,
            { align: "center" },
        );
        yPosition += 4;
        doc.text(
            "For queries, contact accounts@techsolutions.lk or call +94 11 234 5678",
            pageWidth / 2,
            yPosition,
            { align: "center" },
        );

        doc.save(
            `invoice-${order.order_code}-${dayjs().format("YYYY-MM-DD")}.pdf`,
        );
    }

    static fallbackDownload(orderData) {
        const { order, items, user, profile } = orderData;

        let invoiceText = `TAX INVOICE\n`;
        invoiceText += `Company: Tech Solutions Ltd.\n`;
        invoiceText += `Invoice No: ${order.order_code}\n`;
        invoiceText += `Date: ${dayjs(order.created_at).format("DD/MM/YYYY hh:mm A")}\n`;
        invoiceText += `Status: ${order.status}\n\n`;
        invoiceText += `BILL TO:\n`;
        invoiceText += `Customer: ${user?.name || "Walk-in Customer"}\n`;
        invoiceText += `Email: ${user?.email || "N/A"}\n`;
        invoiceText += `Phone: ${profile?.phone || "N/A"}\n`;
        invoiceText += `Address: ${profile?.address || "N/A"}\n`;
        invoiceText += `Payment: ${order.payment_method?.replace(/_/g, " ") || "N/A"}\n\n`;
        invoiceText += `ITEMS:\n`;

        items?.forEach((item, index) => {
            const total = parseFloat(item.price || 0) * item.quantity;
            const itemName = item.product?.name || "Product";
            const model = item.product?.model || "";
            const itemCode = item.product?.item_code || "";

            const description =
                model || itemCode
                    ? `${itemName} (${model}${itemCode ? ` - ${itemCode}` : ""})`
                    : itemName;

            invoiceText += `${index + 1}. ${description} - Qty: ${item.quantity} - Rs. ${total.toLocaleString()}\n`;
        });

        invoiceText += `\nSubtotal: Rs. ${(parseFloat(order.total_amount) - parseFloat(order.delivery_fee || 0)).toLocaleString()}\n`;
        invoiceText += `Delivery Fee: Rs. ${parseFloat(order.delivery_fee || 0).toLocaleString()}\n`;
        invoiceText += `TOTAL: Rs. ${parseFloat(order.total_amount || 0).toLocaleString()}\n\n`;
        invoiceText += `Thank you for your business!`;

        const blob = new Blob([invoiceText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${order.order_code}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    }

    static printInvoice(orderData) {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("Please allow popups to print invoice");
            return;
        }

        const printContent = this.generatePrintHTML(orderData);
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    static generatePrintHTML(orderData) {
        const { order, items, user, profile } = orderData;
        const subtotal =
            parseFloat(order.total_amount) -
            parseFloat(order.delivery_fee || 0);
        const deliveryFee = parseFloat(order.delivery_fee || 0);
        const totalAmount = parseFloat(order.total_amount || 0);

        return `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${order.order_code}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #000080; }
        .invoice-details { float: right; text-align: right; }
        .section { margin: 15px 0; clear: both; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th { background-color: #f0f0f0; padding: 8px; text-align: left; border: 1px solid #ddd; }
        .table td { padding: 8px; border: 1px solid #ddd; }
        .summary { float: right; text-align: right; margin-top: 20px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; clear: both; }
        .customer-info { float: left; width: 60%; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">TAX INVOICE</div>
        <div>Tech Solutions Ltd.</div>
        <div>123 Business Street, Colombo 01, Sri Lanka</div>
        <div>Phone: +94 11 234 5678 | Email: accounts@techsolutions.lk</div>
    </div>

    <div class="invoice-details">
        <strong>INVOICE DETAILS</strong><br>
        Invoice No: ${order.order_code}<br>
        Date: ${dayjs(order.created_at).format("DD/MM/YYYY")}<br>
        Time: ${dayjs(order.created_at).format("hh:mm A")}<br>
        Status: ${order.status.toUpperCase()}
    </div>

    <div class="section">
        <div class="customer-info">
            <strong>BILL TO:</strong><br>
            Customer: ${user?.name || "Walk-in Customer"}<br>
            Email: ${user?.email || "N/A"}<br>
            Phone: ${profile?.phone || "N/A"}<br>
            Address: ${profile?.address || "N/A"}<br>
            City: ${profile?.city || "N/A"}, ${profile?.country || "N/A"}<br>
            Payment: ${order.payment_method?.replace(/_/g, " ") || "N/A"}
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            ${items
                ?.map((item, index) => {
                    const total = parseFloat(item.price || 0) * item.quantity;
                    const itemName = item.product?.name || "Product";
                    const model = item.product?.model || "";
                    const itemCode = item.product?.item_code || "";

                    const description =
                        model || itemCode
                            ? `${itemName} (${model}${itemCode ? ` - ${itemCode}` : ""})`
                            : itemName;

                    return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${description}</td>
                    <td>${item.quantity}</td>
                    <td>Rs. ${parseFloat(item.price || 0).toLocaleString()}</td>
                    <td>Rs. ${total.toLocaleString()}</td>
                </tr>`;
                })
                .join("")}
        </tbody>
    </table>

    <div class="summary">
        <strong>AMOUNT SUMMARY</strong><br>
        Subtotal: Rs. ${subtotal.toLocaleString()}<br>
        Delivery Fee: Rs. ${deliveryFee.toLocaleString()}<br>
        <strong>Total: Rs. ${totalAmount.toLocaleString()}</strong>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice. No signature required.</p>
        <p>For queries, contact accounts@techsolutions.lk or call +94 11 234 5678</p>
    </div>
</body>
</html>`;
    }
}

export default InvoiceGenerator;
