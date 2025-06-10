import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ExportOrderDropdown from "./ExportOrderDropdown";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

const OrderReport = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    supplier: "",
    customer: "",
    status: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3301/GetOrderDetailsWithNames"
        );
        const data = await response.json();
        const ordersArray = Array.isArray(data.data) ? data.data : [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];

    if (filters.startDate && filters.endDate) {
      data = data.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate >= filters.startDate && orderDate <= filters.endDate;
      });
    }

    if (filters.supplier) {
      data = data.filter((order) =>
        String(order.supplier_name || "")
          .toLowerCase()
          .includes(filters.supplier.toLowerCase())
      );
    }

    if (filters.customer) {
      data = data.filter((order) =>
        String(order.customer_name || "")
          .toLowerCase()
          .includes(filters.customer.toLowerCase())
      );
    }

    if (filters.status) {
      data = data.filter(
        (order) =>
          String(order.status || "").toLowerCase() ===
          filters.status.toLowerCase()
      );
    }

    setFilteredOrders(data);
  }, [orders, filters]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        <SoftTypography variant="h4" fontWeight="bold" gutterBottom>
          Order Summary Report
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

          {/* Status select */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{
              flex: "0 1 140px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s",
              cursor: "pointer",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Export button aligned right */}
          <SoftBox ml="auto" minWidth="140px">
            <ExportOrderDropdown exportData={filteredOrders} />
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
              {["Order No", "Supplier", "Customer", "Date", "Status"].map(
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
                    <SoftTypography
                      variant="body2"
                      color="text"
                      fontWeight="medium"
                    >
                      {header}
                    </SoftTypography>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
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
                      {order.order_no}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {order.supplier_name}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {order.customer_name}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {new Date(order.order_date).toLocaleDateString()}
                    </SoftTypography>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <SoftTypography variant="caption" color="text">
                      {order.status}
                    </SoftTypography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </SoftBox>
      </SoftBox>
      <Footer />

      {/* DatePicker custom styles same as CustomerReport */}
      <style>{`
        .custom-datepicker {
          border-radius: 8px !important;
          border: 1px solid #ddd !important;
          padding: 10px 14px !important;
          font-size: 14px !important;
          outline: none !important;
          transition: border-color 0.3s !important;
        }
        .custom-datepicker:focus {
          border-color: #1e88e5 !important;
          box-shadow: 0 0 5px rgba(30, 136, 229, 0.5) !important;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default OrderReport;
