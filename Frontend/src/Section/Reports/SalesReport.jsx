import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ExportInvoiceDropdown from "./ExportInvoiceDropdown";

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    customer: "",
    product: "",
  });

  // Fetch sales data from Node.js backend
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("http://localhost:3301/GetOrderDetails");
        const result = await response.json();
        const data = result.data || []; // Extract only the data array
        setSalesData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  // Filter data based on filters
  useEffect(() => {
    let filtered = [...salesData];

    if (filters.startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.order_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (item) => new Date(item.order_date) <= filters.endDate
      );
    }

    if (filters.customer) {
      filtered = filtered.filter((item) =>
        item.customer_name
          .toLowerCase()
          .includes(filters.customer.toLowerCase())
      );
    }

    if (filters.product) {
      filtered = filtered.filter((item) =>
        item.product_name.toLowerCase().includes(filters.product.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, salesData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="medium" mb={3}>
          Sales Register
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
              }}
            />
          </SoftBox>
          <SoftBox flex="1" minWidth="160px">
            <input
              type="text"
              placeholder="Product"
              value={filters.product}
              onChange={(e) =>
                setFilters({ ...filters, product: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </SoftBox>
          <SoftBox ml="auto" minWidth="140px">
            <ExportInvoiceDropdown exportData={filteredData} />
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
          }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={idx}>
                  <td>{new Date(item.order_date).toLocaleDateString()}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.product_name}</td>
                  <td>{item.order_qty}</td>
                  <td>{formatCurrency(item.total_amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                  }}
                >
                  No sales data found.
                </td>
              </tr>
            )}
          </tbody>
        </SoftBox>

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

export default SalesReport;
