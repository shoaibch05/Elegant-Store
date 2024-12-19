import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (
  transactionId,
  transactionDetails,
  type = "purchase"
) => {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Elegant Store", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("NSTP", 20, 26);
  doc.text("Islamabad, 44000", 20, 30);
  doc.text("Phone: (509) 555-0190 Fax: (509) 555-0191", 20, 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("INVOICE", doc.internal.pageSize.getWidth() - 60, 20);
  doc.setFontSize(10);
  doc.text(
    `Invoice #: ${transactionId}`,
    doc.internal.pageSize.getWidth() - 60,
    26
  );
  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    doc.internal.pageSize.getWidth() - 60,
    30
  );

  // Recipient and project info
  const firstTransaction = transactionDetails[0];

  if (type === "purchase") {
    doc.text("TO:", 20, 45);
    doc.text(`Supplier: ${firstTransaction.supplier_name || "N/A"}`, 20, 50);
    doc.text(`Address: ${firstTransaction.address}`, 20, 55);
    doc.text(`Contact: ${firstTransaction.contact_info}`, 20, 60);

    doc.text("FOR:", doc.internal.pageSize.getWidth() - 60, 45);
    doc.text(
      type === "purchase" ? "Purchase of Goods" : "Sale of Products",
      doc.internal.pageSize.getWidth() - 60,
      50
    );
  } else {
    doc.text("TO:", 20, 45);
    doc.text(`Customer: ${firstTransaction.name || "N/A"}`, 20, 50);
    doc.text(`Address: ${firstTransaction.address}`, 20, 55);
    doc.text(`Contact: ${firstTransaction.Email}`, 20, 60);

    doc.text("FOR:", doc.internal.pageSize.getWidth() - 60, 45);
    doc.text(
      type === "purchase" ? "Purchase of Goods" : "Sale of Products",
      doc.internal.pageSize.getWidth() - 60,
      50
    );
  }

  // Table for items
  let totalAmount = 0;
  const tableData = transactionDetails.map((item) => {
    const amount = type === "purchase" ? item.total_price : item.price;
    totalAmount += amount;

    if (type === "purchase") {
      return [
        item.product_name,
        item.quantity,
        `Rs${item.unit_price || 0}`,
        `Rs${amount || 0}`,
      ];
    } else {
      return [
        item.product_name,
        item.quantity,
        `Rs${item.UnitPrice || 0}`,
        `Rs${amount || 0}`,
      ];
    }
  });

  const tableHeaders = ["NAME", "QUANTITY", "RATE", "AMOUNT"];
  doc.autoTable({
    startY: 70,
    head: [tableHeaders],
    body: tableData,
    columnStyles: {
      0: { cellWidth: 80 }, // NAME
      1: { cellWidth: 30 }, // QUANTITY
      2: { cellWidth: 30 }, // RATE
      3: { cellWidth: 30 }, // AMOUNT
    },
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0] },
  });

  // Calculate the Y-position for the total
  const finalY = doc.lastAutoTable.finalY + 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const totalText = `Total: Rs${totalAmount.toFixed(2)}`;

  // Add Total text
  if (!isNaN(finalY) && !isNaN(pageWidth)) {
    doc.setFont("helvetica", "bold");
    doc.text(totalText, pageWidth - 60, finalY);
  } else {
    console.error("Invalid coordinates or text data for Total");
  }

  // Footer
  const finalyY = doc.lastAutoTable.finalY + 20;
  console.log(finalyY);
  doc.setFont("helvetica", "normal");
  doc.text("Make all checks payable to Elegant Store", 20, finalyY);
  doc.text(
    "Total due in 15 days. Overdue accounts subject to a service charge of 1% per month.",
    20,
    finalyY + 5
  );
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for your business!", 20, finalyY + 15);

  // Preview and Save
  window.open(doc.output("bloburl"), "_blank");
  doc.save(`${type}_invoice_${transactionId}.pdf`);
};
