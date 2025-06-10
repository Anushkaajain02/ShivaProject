import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import ExportDropdown from "../../Section/Reports/ExportDropdown";

const OutstandingReport = () => {
  const [outstandings, setOutstandings] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    customer: "",
    supplier: "",
    invoiceStatus: "",
  });

  useEffect(() => {
    const fetchOutstandings = async () => {
      try {
        const query = new URLSearchParams();

        if (filters.customer) query.append("customer", filters.customer);
        if (filters.supplier) query.append("supplier", filters.supplier);

        if (filters.invoiceStatus)
          query.append("invoiceStatus", filters.invoiceStatus); // Log invoiceStatus here

        console.log(
          "Query String with invoiceStatus filter:",
          query.toString()
        );
        if (filters.startDate)
          query.append(
            "startDate",
            filters.startDate.toISOString().split("T")[0] // Format: yyyy-MM-dd
          );
        if (filters.endDate)
          query.append(
            "endDate",
            filters.endDate.toISOString().split("T")[0] // Format: yyyy-MM-dd
          );

        const response = await fetch(
          `http://localhost:3301/GetOutstandingDetails?${query.toString()}`
        );
        const data = await response.json();

        setOutstandings(
          Array.isArray(data.outstandings) ? data.outstandings : []
        );
      } catch (error) {
        console.error("Error fetching outstanding invoices:", error);
        setOutstandings([]);
      }
    };

    fetchOutstandings();
  }, [filters]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (date) => {
    if (!date) return "";
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "unpaid":
        return { color: "#dc3545" }; // Red
      case "partially paid":
        return { color: "#ffc107" }; // Yellow
      case "overdue":
        return { color: "#dc3545", fontWeight: "bold" }; // Red and bold
      default:
        return { color: "#28a745" }; // Green
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h4" fontWeight="bold" gutterBottom>
          Outstanding Report
        </SoftTypography>

        {/* Filters container */}
        <SoftBox
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap={2}
          mb={4}
          p={2}
          borderRadius="12px"
          boxShadow="0 2px 8px rgba(0,0,0,0.05)"
          bgcolor="#fff"
        >
          {/* Start Date */}
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => setFilters({ ...filters, startDate: date })}
            placeholderText="Start Date"
            className="custom-datepicker"
            wrapperClassName="datepicker-wrapper"
            dateFormat="dd/MM/yyyy" // Date format (Day/Month/Year)
            value={filters.startDate ? formatDate(filters.startDate) : ""} // Only show formatted date if selected
          />

          {/* End Date */}
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => setFilters({ ...filters, endDate: date })}
            placeholderText="End Date"
            className="custom-datepicker"
            wrapperClassName="datepicker-wrapper"
            dateFormat="dd/MM/yyyy" // Date format (Day/Month/Year)
            value={filters.endDate ? formatDate(filters.endDate) : ""} // Only show formatted date if selected
          />

          {/* Customer input */}
          <input
            type="text"
            placeholder="Customer"
            value={filters.customer}
            onChange={(e) =>
              setFilters({ ...filters, customer: e.target.value })
            }
            style={{
              flex: "1 1 220px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          {/* Supplier input */}
          <input
            type="text"
            placeholder="Supplier"
            value={filters.supplier}
            onChange={(e) =>
              setFilters({ ...filters, supplier: e.target.value })
            }
            style={{
              flex: "1 1 220px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />

          {/* Invoice Status select */}
          <select
            className="custom-select"
            value={filters.invoiceStatus}
            onChange={(e) =>
              setFilters({ ...filters, invoiceStatus: e.target.value })
            }
            style={{
              flex: "0 1 160px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          >
            <option value="">Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partially paid">Partially Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Export button aligned right */}
          <SoftBox ml="auto" minWidth="140px">
            <ExportDropdown
              onExportExcel={() => exportToExcel(outstandings)}
              onExportPDF={() => exportToPDF(outstandings)}
            />
          </SoftBox>
        </SoftBox>

        {/* Table */}
        <SoftBox
          component="table"
          width="100%"
          borderRadius="12px"
          boxShadow="0 4px 12px rgba(0,0,0,0.05)"
          bgcolor="#fff"
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              {[
                "Invoice No",
                "Bill Date",
                "Customer",
                "Supplier",
                "Total Amount",
                "Amount Due",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "14px 12px",
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#555",
                    borderBottom: "2px solid #e0e0e0",
                    userSelect: "none",
                  }}
                >
                  <SoftTypography
                    variant="body2"
                    color="text"
                    fontWeight="medium"
                  >
                    {header}
                  </SoftTypography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {outstandings.length > 0 ? (
              outstandings.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e3f2fd")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? "#fafafa" : "#fff")
                  }
                >
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {item.bill_no || item.invoice_id}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {item.bill_date
                        ? new Date(item.bill_date).toLocaleDateString()
                        : ""}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {item.customer_name}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {item.supplier_name}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {formatCurrency(item.total_amount)}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {formatCurrency(item.remaining_amount)}
                    </SoftTypography>
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      ...getStatusColor(item.invoice_status),
                    }}
                  >
                    <SoftTypography variant="caption" color="text">
                      {item.invoice_status}
                    </SoftTypography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "30px 12px",
                    color: "#888",
                    fontStyle: "italic",
                  }}
                >
                  <SoftTypography variant="caption" color="text">
                    No outstanding invoices found.
                  </SoftTypography>
                </td>
              </tr>
            )}
          </tbody>
        </SoftBox>
      </SoftBox>
      <Footer />

      {/* Additional styles for react-datepicker and select */}
      <style>{`
          .custom-datepicker {
            width: 160px;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid #ddd;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
          }
          .custom-datepicker:focus {
            border-color: #1e88e5;
            box-shadow: 0 0 5px rgba(30, 136, 229, 0.5);
          }
          .datepicker-wrapper {
            flex: 0 1 160px;
          }
      `}</style>
    </DashboardLayout>
  );
};

export default OutstandingReport;
