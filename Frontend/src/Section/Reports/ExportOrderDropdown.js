import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportOrderDropdown = ({ exportData }) => {
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
    const tableColumn = ["Order No", "Supplier", "Customer", "Date", "Status"];
    const tableRows = exportData.map((item) => [
      item.order_no,
      item.supplier_name,
      item.customer_name,
      new Date(item.order_date).toLocaleDateString(),
      item.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("OrderReport.pdf");
    setIsOpen(false);
  };

  const csvHeaders = [
    { label: "Order No", key: "order_no" },
    { label: "Supplier", key: "supplier_name" },
    { label: "Customer", key: "customer_name" },
    { label: "Date", key: "order_date" },
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
            filename="OrderReport.csv"
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

ExportOrderDropdown.propTypes = {
  exportData: PropTypes.arrayOf(
    PropTypes.shape({
      order_no: PropTypes.string,
      supplier_name: PropTypes.string,
      customer_name: PropTypes.string,
      order_date: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
};

export default ExportOrderDropdown;
