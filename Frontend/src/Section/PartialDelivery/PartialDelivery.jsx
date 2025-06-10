import React, { useState, useEffect } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import "./PartialDelivery.css";

// API Configuration - Move to environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3301";

const PartialDelivery = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    orderNo: "",
    supplier: "",
    status: "",
    lrNo: "",
    lrDate: "",
    shipmentMode: "",
    customer: "",
  });

  // Add date formatting function
  const formatDate = (dateString) => {
    if (!dateString) {
      console.log("No date string provided");
      return "N/A";
    }

    try {
      // Convert MySQL datetime format to JavaScript Date
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.log("Invalid date string:", dateString);
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Add error handling utility
  const handleApiError = (error, customMessage) => {
    console.error(customMessage, error);
    let errorMessage = customMessage;

    if (error.response) {
      errorMessage = `Server error: ${error.response.status} - ${
        error.response.data?.error || error.response.statusText
      }`;
    } else if (error.request) {
      errorMessage =
        "No response from server. Please check if the server is running.";
    } else {
      errorMessage = error.message || customMessage;
    }

    setError(errorMessage);
    setLoading(false);
  };

  // Fetch orders with delivery status
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/getOrdersWithDeliveryStatus`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Raw API Response:", data); // Debug log

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Invalid data format received from server");
        }

        // For each order, fetch detailed delivery data
        const ordersWithStatus = await Promise.all(
          data.data.map(async (order) => {
            try {
              const deliveryResponse = await fetch(
                `${API_BASE_URL}/getDeliveryDataByOrderNo/${order.order_no}`
              );
              if (!deliveryResponse.ok) {
                console.error(
                  `Error fetching delivery data for order ${order.order_no}`
                );
                return order;
              }
              const deliveryData = await deliveryResponse.json();

              // Calculate total delivered quantity from delivery history
              const totalDelivered = deliveryData.data.delivery_history.reduce(
                (sum, delivery) =>
                  sum + parseFloat(delivery.delivered_qty || 0),
                0
              );

              // Update status based on total delivered vs order quantity
              const orderQty = parseFloat(order.total_qty);
              let status = order.status;

              if (totalDelivered >= orderQty) {
                status = "Delivered";
              } else if (totalDelivered === 0) {
                status = "Pending";
              } else {
                status = "Partially Delivered";
              }

              return {
                ...order,
                status,
                total_delivered: totalDelivered,
              };
            } catch (err) {
              console.error(`Error processing order ${order.order_no}:`, err);
              return order;
            }
          })
        );

        console.log("Processed Orders:", ordersWithStatus); // Debug log
        setOrders(ordersWithStatus);
        setFilteredOrders(ordersWithStatus); // Initialize filtered orders with all orders
      } catch (err) {
        handleApiError(err, "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters whenever filters or orders change
  useEffect(() => {
    const filtered = orders.filter((order) => {
      // Order No filter - case insensitive partial match
      const orderNoMatch =
        !filters.orderNo ||
        order.order_no
          .toString()
          .toLowerCase()
          .includes(filters.orderNo.toLowerCase().trim());

      // Supplier filter - strict matching
      let supplierMatch = true;
      if (filters.supplier) {
        const searchTerm = filters.supplier.toLowerCase();
        const supplierName = order.supplier_name.toLowerCase();

        // Check if search term ends with space
        if (searchTerm.endsWith(" ")) {
          // Remove trailing space and match exact word
          const searchWord = searchTerm.replace(/\s+$/, "");
          const supplierWords = supplierName.split(/\s+/);

          // Only match if the word exists as a complete word
          supplierMatch = supplierWords.some((word) => word === searchWord);
        } else {
          // No trailing space, match anywhere in the name
          supplierMatch = supplierName.includes(searchTerm);
        }
      }

      // Customer filter - strict matching
      let customerMatch = true;
      if (filters.customer) {
        const searchTerm = filters.customer.toLowerCase();
        const customerName = order.customer_name.toLowerCase();

        // Check if search term ends with space
        if (searchTerm.endsWith(" ")) {
          // Remove trailing space and match exact word
          const searchWord = searchTerm.replace(/\s+$/, "");
          const customerWords = customerName.split(/\s+/);

          // Only match if the word exists as a complete word
          customerMatch = customerWords.some((word) => word === searchWord);
        } else {
          // No trailing space, match anywhere in the name
          customerMatch = customerName.includes(searchTerm);
        }
      }

      // Status filter - exact match
      const statusMatch = !filters.status || order.status === filters.status;

      // LR No filter - case insensitive partial match
      const lrNoMatch =
        !filters.lrNo ||
        (order.lr_no &&
          order.lr_no
            .toLowerCase()
            .includes(filters.lrNo.toLowerCase().trim()));

      // LR Date filter - exact match with proper date formatting
      const lrDateMatch =
        !filters.lrDate ||
        (order.lr_date &&
          new Date(order.lr_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }) ===
            new Date(filters.lrDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }));

      // Shipment Mode filter - case insensitive partial match
      const shipmentModeMatch =
        !filters.shipmentMode ||
        (order.shipment_mode &&
          order.shipment_mode
            .toLowerCase()
            .includes(filters.shipmentMode.toLowerCase().trim()));

      return (
        orderNoMatch &&
        supplierMatch &&
        customerMatch &&
        statusMatch &&
        lrNoMatch &&
        lrDateMatch &&
        shipmentModeMatch
      );
    });

    setFilteredOrders(filtered);
  }, [filters, orders]);

  // Add filter handling function
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log("Filter input:", {
      name,
      value,
      hasTrailingSpace: value.endsWith(" "),
    });
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="partial-delivery-container">
        <h2>Partial Delivery Management</h2>

        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              name="orderNo"
              placeholder="Filter by Order No"
              value={filters.orderNo}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="text"
              name="supplier"
              placeholder="Filter by Supplier"
              value={filters.supplier}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="text"
              name="customer"
              placeholder="Filter by Customer"
              value={filters.customer}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Delivered">Delivered</option>
            </select>
            <input
              type="text"
              name="lrNo"
              placeholder="Filter by LR No"
              value={filters.lrNo}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="date"
              name="lrDate"
              value={filters.lrDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="text"
              name="shipmentMode"
              placeholder="Filter by Shipment Mode"
              value={filters.shipmentMode}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
        </div>

        <div className="orders-section">
          <h3>Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order No</th>
                <th>Supplier</th>
                <th>Customer</th>
                <th>Total Quantity</th>
                <th>PD Bale Quantity</th>
                <th>PD Quantity</th>
                <th>Delivery Date</th>
                <th>LR No</th>
                <th>LR Date</th>
                <th>Shipment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={`${order.order_no}-${order.order_id}-${index}`}>
                    <td>#{order.order_no}</td>
                    <td>{order.supplier_name}</td>
                    <td>{order.customer_name}</td>
                    <td>{Math.floor(order.total_qty)}</td>
                    <td>{order.pd_bale_quantity || "-"}</td>
                    <td>{order.delivered_qty}</td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>{order.lr_no || "-"}</td>
                    <td>{order.lr_date ? formatDate(order.lr_date) : "-"}</td>
                    <td>{order.shipment_mode || "-"}</td>
                    <td>
                      <span
                        className={`status ${(
                          order.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No orders to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="delivery-history-section">
            <h3>Delivery History for Order #{selectedOrder.order_no}</h3>
            <table className="delivery-history-table">
              <thead>
                <tr>
                  <th>Delivery Date</th>
                  <th>PD Bale Quantity</th>
                  <th>PD Quantity</th>
                  <th>Undelivered Quantity</th>
                  <th>LR No</th>
                  <th>LR Date</th>
                  <th>Shipment Mode</th>
                  <th>Remarks</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.length > 0 ? (
                  deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td>
                        {new Date(delivery.delivery_date).toLocaleDateString()}
                      </td>
                      <td>{delivery.pd_bale_quantity || "-"}</td>
                      <td>{delivery.delivered_qty}</td>
                      <td>{delivery.undelivered_qty}</td>
                      <td>{delivery.lr_no || "-"}</td>
                      <td>
                        {delivery.lr_date
                          ? new Date(delivery.lr_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{delivery.shipment_mode || "-"}</td>
                      <td>{delivery.remarks || "-"}</td>
                      <td>{new Date(delivery.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No delivery history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </DashboardLayout>
  );
};

export default PartialDelivery;
