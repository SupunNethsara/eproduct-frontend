const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const exportOrdersPDF = async (orders, dateRange, showSuccess, showError) => {
    try {
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at).toISOString().split('T')[0];
            return orderDate >= dateRange.start && orderDate <= dateRange.end;
        });

        if (filteredOrders.length === 0) {
            showError("No orders to export for the selected date range");
            return;
        }

        const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
        const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
        const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
        const contactedOrders = filteredOrders.filter(order => order.status === 'contacted').length;
        const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled').length;
        const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
        const completionRate = filteredOrders.length > 0 ? (completedOrders / filteredOrders.length) * 100 : 0;

        const pdfData = {
            title: 'Ecommerce Analytics Report',
            dateRange: `${formatDateForDisplay(dateRange.start)} to ${formatDateForDisplay(dateRange.end)}`,
            generatedOn: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            summary: {
                totalOrders: filteredOrders.length,
                totalRevenue: totalRevenue,
                averageOrderValue: averageOrderValue,
                completedOrders: completedOrders,
                pendingOrders: pendingOrders,
                contactedOrders: contactedOrders,
                cancelledOrders: cancelledOrders,
                completionRate: completionRate
            },
            orders: filteredOrders.map(order => ({
                orderCode: order.order_code,
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                customerPhone: order.customer_phone || 'N/A',
                date: new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
                time: new Date(order.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                amount: parseFloat(order.total_amount || 0),
                items: order.items_count || 1,
                status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'
            }))
        };

        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        doc.setProperties({
            title: `Ecommerce Report - ${pdfData.dateRange}`,
            subject: 'Sales and Order Analytics',
            author: 'Ecommerce System',
            keywords: 'ecommerce, sales, orders, analytics',
            creator: 'Ecommerce System'
        });

        doc.setFillColor(59, 130, 246);
        doc.rect(0, 0, 210, 30, 'F');

        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('ECOMMERCE ANALYTICS REPORT', 105, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.text('Comprehensive Sales and Order Analysis', 105, 22, { align: 'center' });

        let yPosition = 40;

        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORT DETAILS', 14, yPosition);

        yPosition += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);

        doc.text(`Date Range: ${pdfData.dateRange}`, 14, yPosition);
        doc.text(`Generated: ${pdfData.generatedOn}`, 105, yPosition);

        yPosition += 5;
        doc.text(`Total Records: ${pdfData.summary.totalOrders} orders`, 105, yPosition);

        yPosition += 15;
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text('PERFORMANCE SUMMARY', 14, yPosition);

        yPosition += 8;
        const summaryBoxWidth = 40;
        const summaryBoxHeight = 20;
        const summarySpacing = 10;

        doc.setFillColor(34, 197, 94);
        doc.roundedRect(14, yPosition, summaryBoxWidth, summaryBoxHeight, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('TOTAL REVENUE', 34, yPosition + 6, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs. ${pdfData.summary.totalRevenue.toLocaleString()}`, 34, yPosition + 12, { align: 'center' });

        doc.setFillColor(59, 130, 246);
        doc.roundedRect(14 + summaryBoxWidth + summarySpacing, yPosition, summaryBoxWidth, summaryBoxHeight, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('TOTAL ORDERS', 34 + summaryBoxWidth + summarySpacing, yPosition + 6, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(pdfData.summary.totalOrders.toString(), 34 + summaryBoxWidth + summarySpacing, yPosition + 12, { align: 'center' });

        doc.setFillColor(168, 85, 247);
        doc.roundedRect(14 + (summaryBoxWidth + summarySpacing) * 2, yPosition, summaryBoxWidth, summaryBoxHeight, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('AVG ORDER VALUE', 34 + (summaryBoxWidth + summarySpacing) * 2, yPosition + 6, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs. ${pdfData.summary.averageOrderValue.toFixed(2)}`, 34 + (summaryBoxWidth + summarySpacing) * 2, yPosition + 12, { align: 'center' });

        doc.setFillColor(234, 179, 8);
        doc.roundedRect(14 + (summaryBoxWidth + summarySpacing) * 3, yPosition, summaryBoxWidth, summaryBoxHeight, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('COMPLETION RATE', 34 + (summaryBoxWidth + summarySpacing) * 3, yPosition + 6, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${pdfData.summary.completionRate.toFixed(1)}%`, 34 + (summaryBoxWidth + summarySpacing) * 3, yPosition + 12, { align: 'center' });

        yPosition += summaryBoxHeight + 15;
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text('ORDER STATUS BREAKDOWN', 14, yPosition);

        yPosition += 8;
        const statusColors = {
            'Completed': [34, 197, 94],
            'Pending': [234, 179, 8],
            'Contacted': [59, 130, 246],
            'Cancelled': [239, 68, 68]
        };

        const statusData = [
            { status: 'Completed', count: pdfData.summary.completedOrders, color: statusColors.Completed },
            { status: 'Pending', count: pdfData.summary.pendingOrders, color: statusColors.Pending },
            { status: 'Contacted', count: pdfData.summary.contactedOrders, color: statusColors.Contacted },
            { status: 'Cancelled', count: pdfData.summary.cancelledOrders, color: statusColors.Cancelled }
        ];

        statusData.forEach((item, index) => {
            const xPos = 14 + (48 * index);

            doc.setFillColor(...item.color);
            doc.roundedRect(xPos, yPosition, 45, 15, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text(item.status.toUpperCase(), xPos + 22.5, yPosition + 6, { align: 'center' });
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(item.count.toString(), xPos + 22.5, yPosition + 12, { align: 'center' });
        });

        yPosition += 25;
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text('DETAILED ORDER BREAKDOWN', 14, yPosition);

        const tableHeaders = [
            ['Order Code', 'Customer', 'Date', 'Amount (Rs.)', 'Items', 'Status']
        ];

        const tableData = pdfData.orders.map(order => [
            order.orderCode,
            `${order.customerName}\n${order.customerEmail}`,
            `${order.date}\n${order.time}`,
            order.amount.toLocaleString(),
            order.items.toString(),
            order.status
        ]);

        autoTable(doc, {
            startY: yPosition + 5,
            head: tableHeaders,
            body: tableData,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
                textColor: [40, 40, 40]
            },
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 9,
                cellPadding: 4
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 25, fontStyle: 'bold' },
                1: { cellWidth: 40 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25, halign: 'right' },
                4: { cellWidth: 15, halign: 'center' },
                5: { cellWidth: 25, halign: 'center' }
            },
            margin: { top: yPosition + 5 },
            didDrawPage: function (data) {
                // Add page footer
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Page ${doc.internal.getNumberOfPages()} of ${doc.internal.getNumberOfPages()}`,
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
                doc.text(
                    `Generated by Ecommerce System - Confidential`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
                doc.text(
                    new Date().toLocaleString(),
                    doc.internal.pageSize.width - data.settings.margin.right,
                    doc.internal.pageSize.height - 10,
                    { align: 'right' }
                );
            }
        });

        const fileName = `ecommerce-report-${dateRange.start}-to-${dateRange.end}-${new Date().getTime()}.pdf`;
        doc.save(fileName);

        showSuccess('PDF report downloaded successfully!');

    } catch (error) {
        console.error('Error generating PDF:', error);
        showError('Failed to generate PDF report');
    }
};

export const exportOrdersExcel = async (orders, dateRange, showSuccess, showError) => {
    try {
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at).toISOString().split('T')[0];
            return orderDate >= dateRange.start && orderDate <= dateRange.end;
        });

        if (filteredOrders.length === 0) {
            showError("No orders to export for the selected date range");
            return;
        }

        const headers = ['Order Code', 'Customer Name', 'Email', 'Phone', 'Date', 'Time', 'Amount', 'Items', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                order.order_code,
                `"${order.customer_name}"`,
                order.customer_email,
                order.customer_phone || 'N/A',
                new Date(order.created_at).toLocaleDateString(),
                new Date(order.created_at).toLocaleTimeString(),
                parseFloat(order.total_amount || 0),
                order.items_count || 1,
                order.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `order-report-${dateRange.start}-to-${dateRange.end}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccess('Excel report downloaded successfully!');

    } catch (error) {
        console.error('Error generating Excel:', error);
        showError('Failed to generate Excel report');
    }
};
