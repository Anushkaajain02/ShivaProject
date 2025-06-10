import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportInvoiceDropdown = ({ exportData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePDFExport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Invoice No",
      "Bill Date",
      "Customer",
      "Transport Mode",
      "Amount",
      "LR No",
    ];

    const tableRows = exportData.map((item) => [
      item.invoice_id,
      new Date(item.bill_date).toLocaleDateString(),
      item.customer_name || "N/A",
      item.transport_mode,
      item.amount,
      item.lr_no,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("InvoiceReport.pdf");
    setIsOpen(false);
  };

  const csvHeaders = [
    { label: "Invoice No", key: "invoice_id" },
    { label: "Bill Date", key: "bill_date" },
    { label: "Customer", key: "customer_name" },
    { label: "Transport Mode", key: "transport_mode" },
    { label: "Amount", key: "amount" },
    { label: "LR No", key: "lr_no" },
  ];

  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#1e88e5",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Export ▾
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            zIndex: 1000,
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <CSVLink
            headers={csvHeaders}
            data={exportData}
            filename="InvoiceReport.csv"
            onClick={() => setIsOpen(false)}
            style={{
              padding: "10px 16px",
              display: "block",
              textDecoration: "none",
              color: "#000",
              fontSize: "14px",
              borderBottom: "1px solid #eee",
            }}
          >
            Export to CSV
          </CSVLink>
          <div
            onClick={handlePDFExport}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Export to PDF
          </div>
        </div>
      )}
    </div>
  );
};

ExportInvoiceDropdown.propTypes = {
  exportData: PropTypes.arrayOf(
    PropTypes.shape({
      invoice_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bill_date: PropTypes.string,
      customer_name: PropTypes.string,
      transport_mode: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lr_no: PropTypes.string,
    })
  ).isRequired,
};

export default ExportInvoiceDropdown;
