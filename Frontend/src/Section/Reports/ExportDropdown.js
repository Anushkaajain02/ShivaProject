import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import the plugin as a function

const ExportDropdown = ({ exportData }) => {
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
    const tableColumn = ["Customer", "Orders", "Invoices", "Amount", "Status"];
    const tableRows = exportData.map((item) => [
      item.customer_name,
      item.total_orders,
      item.total_invoices,
      item.total_amount,
      item.status,
    ]);

    // Use autoTable as a function with doc as the first argument
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("CustomerReport.pdf");
    setIsOpen(false);
  };

  const csvHeaders = [
    { label: "Customer", key: "customer_name" },
    { label: "Orders", key: "total_orders" },
    { label: "Invoices", key: "total_invoices" },
    { label: "Amount", key: "total_amount" },
    { label: "Status", key: "status" },
  ];

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
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
            filename="CustomerReport.csv"
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
            style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px" }}
          >
            Export to PDF
          </div>
        </div>
      )}
    </div>
  );
};

ExportDropdown.propTypes = {
  exportData: PropTypes.arrayOf(
    PropTypes.shape({
      customer_name: PropTypes.string,
      total_orders: PropTypes.number,
      total_invoices: PropTypes.number,
      total_amount: PropTypes.number,
      status: PropTypes.string,
    })
  ).isRequired,
};

export default ExportDropdown;
