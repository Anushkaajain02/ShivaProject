import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ExportDropdown from "../../Section/Reports/ExportDropdown";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

const CustomerReport = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    customer: "",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        let url = "http://localhost:3301/GetCustomerLedger";
        const params = new URLSearchParams();

        if (filters.startDate) {
          params.append("startDate", filters.startDate.toISOString().split("T")[0]);
        }
        if (filters.endDate) {
          params.append("endDate", filters.endDate.toISOString().split("T")[0]);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        const ledger = Array.isArray(data.data) ? data.data : [];
        setLedgerData(ledger);
        setFilteredData(ledger);
      } catch (error) {
        console.error("Error fetching customer ledger:", error);
        setLedgerData([]);
        setFilteredData([]);
      }
    };

    fetchLedgerData();
  }, [filters.startDate, filters.endDate]);

  // useEffect(() => {
  //   let filtered = [...ledgerData];
  //   if (filters.customer) {
  //     filtered = filtered.filter((item) =>
  //       (item.customer_name || "").toLowerCase().includes(filters.customer.toLowerCase())
  //     );
  //   }
  //   setFilteredData(filtered);
  // }, [filters.customer, ledgerData]);

  useEffect(() => {
  let filtered = [...ledgerData];
  const searchTerm = filters.customer?.toLowerCase() || "";

  if (searchTerm) {
    filtered = filtered.filter((item) =>
      (item.customer_name || "").toLowerCase().includes(searchTerm) ||
      item.total_orders?.toString().toLowerCase().includes(searchTerm) ||
      item.total_invoices?.toString().toLowerCase().includes(searchTerm) ||
      item.total_amount?.toString().toLowerCase().includes(searchTerm) ||
      (item.status || "").toLowerCase().includes(searchTerm) ||
      (item.order_date || "").toLowerCase().includes(searchTerm)
    );
  }

  setFilteredData(filtered);
}, [filters.customer, ledgerData]);


  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h4" fontWeight="bold" gutterBottom>
          Customer Ledger Report
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
          {/* Customer search */}
          <input
            type="text"
            placeholder="Search Customer"
            value={filters.customer}
            onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
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

          {/* Start Date */}
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => setFilters({ ...filters, startDate: date })}
            placeholderText="Start Date"
            className="custom-datepicker"
            style={{ flex: "0 1 160px" }}
            wrapperClassName="datepicker-wrapper"
          />

          {/* End Date */}
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => setFilters({ ...filters, endDate: date })}
            placeholderText="End Date"
            className="custom-datepicker"
            style={{ flex: "0 1 160px" }}
            wrapperClassName="datepicker-wrapper"
          />

          {/* Export button aligned right */}
          <SoftBox ml="auto" minWidth="140px">
            <ExportDropdown exportData={filteredData} />
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
              {["Customer", "Total Orders", "Total Invoices", "Total Amount", "Status"].map(
                (header) => (
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
                    <SoftTypography variant="body2" color="text" fontWeight="medium">
                      {header}
                    </SoftTypography>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((entry, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#fafafa" : "#fff")
                  }
                >
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {entry.customer_name}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {entry.total_orders}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {entry.total_invoices}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {formatCurrency(entry.total_amount)}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {entry.status}
                    </SoftTypography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "30px 12px",
                    color: "#888",
                    fontStyle: "italic",
                  }}
                >
                  <SoftTypography variant="caption" color="text">
                    No ledger entries found.
                  </SoftTypography>
                </td>
              </tr>
            )}
          </tbody>
        </SoftBox>
      </SoftBox>
      <Footer />

      {/* Additional styles for react-datepicker */}
      <style>
        {`
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
        `}
      </style>
    </DashboardLayout>
  );
};

export default CustomerReport;
