import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExportInvoiceDropdown from "./ExportInvoiceDropdown";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const InvoiceReport = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    customer: "",
    invoiceNo: "",
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`http://localhost:3301/GetInvoiceDetails`);
        const data = await response.json();
        const invoicesArray = Array.isArray(data.invoices) ? data.invoices : [];
        setAllInvoices(invoicesArray);
        setFilteredInvoices(invoicesArray);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setAllInvoices([]);
        setFilteredInvoices([]);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = [...allInvoices];

    if (filters.customer) {
      filtered = filtered.filter((inv) =>
        (inv.customer_name || "")
          .toLowerCase()
          .includes(filters.customer.toLowerCase())
      );
    }

    if (filters.invoiceNo) {
      filtered = filtered.filter((inv) =>
        String(inv.invoice_id || "")
          .toLowerCase()
          .includes(filters.invoiceNo.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (inv) => new Date(inv.bill_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (inv) => new Date(inv.bill_date) <= filters.endDate
      );
    }

    setFilteredInvoices(filtered);
  }, [filters, allInvoices]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          Invoice Report
        </SoftTypography>

        <SoftBox
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="center"
          mb={3}
        >
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => setFilters({ ...filters, startDate: date })}
            placeholderText="Start Date"
            className="custom-datepicker"
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => setFilters({ ...filters, endDate: date })}
            placeholderText="End Date"
            className="custom-datepicker"
          />
          <SoftBox flex="1" minWidth="180px">
            <input
              type="text"
              placeholder="Customer"
              value={filters.customer}
              onChange={(e) =>
                setFilters({ ...filters, customer: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
            />
          </SoftBox>
          <SoftBox flex="1" minWidth="140px">
            <input
              type="text"
              placeholder="Invoice No"
              value={filters.invoiceNo}
              onChange={(e) =>
                setFilters({ ...filters, invoiceNo: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
            />
          </SoftBox>

          <SoftBox ml="auto" minWidth="140px">
            <ExportInvoiceDropdown exportData={filteredInvoices} />
          </SoftBox>
        </SoftBox>

        <SoftBox
          component="table"
          width="100%"
          borderRadius="8px"
          bgcolor="#fff"
          boxShadow="0 0 10px rgba(0,0,0,0.05)"
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            "thead th": {
              padding: "12px 16px",
              backgroundColor: "#f9fafb",
              color: "#555",
              fontWeight: 600,
              textAlign: "left",
              fontSize: "14px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              userSelect: "none",
            },
            "tbody td": {
              padding: "12px 16px",
              fontSize: "14px",
              color: "#444",
              verticalAlign: "middle",
            },
            "tbody tr": {
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              transition: "background-color 0.3s",
              cursor: "default",
            },
            "tbody tr:hover": {
              backgroundColor: "#f1f5f9",
            },
            "tbody tr td:first-of-type": {
              fontWeight: "600",
              color: "#1e88e5",
            },
          }}
        >
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Bill Date</th>
              <th>Customer</th>
              <th>Transport Mode</th>
              <th>Amount</th>
              <th>LR No</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, idx) => (
                <tr key={idx}>
                  <td>{invoice.invoice_id}</td>
                  <td>{new Date(invoice.bill_date).toLocaleDateString()}</td>
                  <td>{invoice.customer_name || "N/A"}</td>
                  <td>{invoice.transport_mode || "N/A"}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.lr_no || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                  }}
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </SoftBox>

        {/* DatePicker custom styles */}
        <style>{`
        .custom-datepicker {
          border-radius: 8px !important;
          border: 1px solid #ddd !important;
          padding: 10px 14px !important;
          font-size: 14px !important;
          outline: none !important;
          transition: border-color 0.3s !important;
          width: 160px;
        }
        .custom-datepicker:focus {
          border-color: #1e88e5 !important;
          box-shadow: 0 0 5px rgba(30, 136, 229, 0.5) !important;
        }
      `}</style>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default InvoiceReport;
