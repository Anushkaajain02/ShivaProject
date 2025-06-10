import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
  Typography,
} from "@mui/material";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3301";

function RecordDelivery() {
  const navigate = useNavigate();

  const [deliveryFormData, setDeliveryFormData] = useState({
    order_id: "",
    order_no: "",
    customer_name: "",
    supplier_name: "",
    total_qty: "",
    pd_bale_quantity: "",
    new_delivery_qty: "",
    lr_no: "",
    lr_date: "",
    delivery_date: "",
    shipment_mode: "",
    comment: "",
  });

  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [deliveredQty, setDeliveredQty] = useState(null); // State to store delivered quantity

  const [selectedOrderNo, setSelectedOrderNo] = useState(""); // Track selected order_no

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/GetOrderDetails`);
        const data = await res.json();
        setOrderList(data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  //order search

  useEffect(() => {
    if (!searchTerm?.trim()) {
      setFilteredOrders([]);
      setShowDropdown(false);
      return;
    }

    const results = orderList.filter((order) =>
      order.order_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredOrders(results);
    setShowDropdown(true);
  }, [searchTerm, orderList]);

  const handleOrderNoChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value); // Update the search term as the user types

    if (value.trim() === "") {
      // If order_no is empty, reset other fields and clear deliveredQty
      setDeliveryFormData((prev) => ({
        ...prev,
        order_no: value, // Set order_no to empty
        total_qty: "", // Clear total_qty
        customer_name: "", // Clear customer_name
        supplier_name: "", // Clear supplier_name
      }));
      setDeliveredQty(""); // Clear the delivered quantity when no order is selected
      setShowDropdown(false); // Close the dropdown if no order is selected
    } else {
      // If order_no is not empty, filter and show the dropdown
      const filteredOrders = orderList.filter((order) =>
        order.order_no.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filteredOrders);
      setShowDropdown(true);
    }
  };

  const handleOrderClick = async (order) => {
    setSearchTerm(order.order_no);
    setSelectedOrderNo(order.order_no);
    setDeliveryFormData((prev) => ({
      ...prev,
      order_id: order.order_id,
      order_no: order.order_no,
    }));

    // If order_no is empty, clear total_qty, customer_name, supplier_name fields
    if (!order.order_no) {
      setDeliveryFormData((prev) => ({
        ...prev,
        total_qty: "",
        customer_name: "",
        supplier_name: "",
      }));
      setShowDropdown(false);
      // Close the dropdown if no order is selected
      return; // Exit the function early
    }

    if (order.order_id) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/GetOrderById/${order.order_id}`
        );
        const data = await res.json();

        setDeliveryFormData((prev) => ({
          ...prev,
          total_qty: data.order_qty || "",
          customer_name: data.customer_name || "",
          supplier_name: data.supplier_name || "",
        }));

        const deliveryDataRes = await fetch(
          `${API_BASE_URL}/getDeliveryDataByOrderNo/${order.order_no}`
        );
        const deliveryData = await deliveryDataRes.json();
        setDeliveredQty(deliveryData.data.total_delivered_qty || 0);
      } catch (err) {
        console.error("Error fetching order data", err);
      }
    }
    setShowDropdown(false);
  };

  const handleDeliveryFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "new_delivery_qty") {
      const maxDeliveryQty = deliveryFormData.total_qty - deliveredQty;

      // If value exceeds the max allowed value, set a custom validation message
      if (Number(value) > maxDeliveryQty) {
        e.target.setCustomValidity(
          `The maximum allowed quantity is ${maxDeliveryQty}.`
        );
      } else {
        // Reset validation message if the value is within the allowed range
        e.target.setCustomValidity("");
      }
    }

    if (name === "new_delivery_qty") {
      if (!value) {
        // Clear Bale Quantity if New PD Quantity is cleared
        setDeliveryFormData((prev) => ({
          ...prev,
          [name]: value,
          pd_bale_quantity: "", 
        }));
      } else {
        const newBaleQuantity = value <= 180 ? 1 : Math.ceil(value / 180); 
        setDeliveryFormData((prev) => ({
          ...prev,
          [name]: value,
          pd_bale_quantity: newBaleQuantity, 
        }));
      }
    }
    setDeliveryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleDeliverySubmit = async (e) => {
    e.preventDefault();

    // Ensure numeric fields are properly converted to numbers
    const formData = {
      ...deliveryFormData,
      new_delivery_qty: Number(deliveryFormData.new_delivery_qty),
      pd_bale_quantity: Number(deliveryFormData.pd_bale_quantity),
      total_qty: Number(deliveryFormData.total_qty),
    };

    console.log(formData); // Check the data before sending

    try {
      const res = await fetch(`${API_BASE_URL}/recordDelivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Parse the response to JSON
      const responseData = await res.json();

      // Check for success based on the response
      if (responseData.success) {
        alert("Delivery recorded successfully");
        navigate("/partial-delivery");
      } else {
        alert("Error recording delivery");
      }
    } catch (err) {
      console.error("Delivery submit error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={4} px={3} component="form" onSubmit={handleDeliverySubmit}>
        <SoftBox p={3} borderRadius="lg" shadow="md" bgColor="white">
          <SoftTypography variant="h5" mb={3}>
            Record Partial Delivery
          </SoftTypography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Order Number</SoftTypography>
              <TextField
                variant="outlined"
                placeholder="Search order number..."
                fullWidth
                value={searchTerm}
                onChange={handleOrderNoChange}
                onFocus={() => searchTerm && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "41px",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  },
                }}
              />

              {/* Order Number Dropdown */}
              {showDropdown && filteredOrders.length > 0 && (
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    zIndex: 10,
                    width: "455px",
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  <List dense>
                    {filteredOrders.map((order, index) => (
                      <ListItem
                        button
                        key={index}
                        onClick={() => handleOrderClick(order)}
                        sx={{
                          py: 0.5,
                          px: 2,
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {order.order_no}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Customer Name</SoftTypography>
              <SoftInput
                type="text"
                value={deliveryFormData.customer_name}
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Supplier Name</SoftTypography>
              <SoftInput
                type="text"
                value={deliveryFormData.supplier_name}
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Total Quantity</SoftTypography>
              <SoftInput
                type="number"
                value={deliveryFormData.total_qty}
                readOnly
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">
                Remaining Quantity
              </SoftTypography>
              <SoftInput
                type="number"
                value={
                  deliveryFormData.total_qty || deliveredQty
                    ? deliveryFormData.total_qty - deliveredQty
                    : ""
                }
                readOnly
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">New PD Quantity</SoftTypography>
              <SoftInput
                type="number"
                name="new_delivery_qty"
                value={deliveryFormData.new_delivery_qty}
                onChange={handleDeliveryFormChange}
                min="1"
                max={deliveryFormData.total_qty - deliveredQty}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Bale Quantity</SoftTypography>
              <SoftInput
                type="number"
                name="pd_bale_quantity"
                value={deliveryFormData.pd_bale_quantity}
                onChange={handleDeliveryFormChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">LR Number</SoftTypography>
              <SoftInput
                type="text"
                name="lr_no"
                value={deliveryFormData.lr_no}
                onChange={handleDeliveryFormChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">LR Date</SoftTypography>
              <SoftInput
                type="date"
                name="lr_date"
                value={deliveryFormData.lr_date}
                onChange={handleDeliveryFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Delivery Date</SoftTypography>
              <SoftInput
                type="date"
                name="delivery_date"
                value={deliveryFormData.delivery_date}
                onChange={handleDeliveryFormChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftTypography variant="caption">Shipment Mode</SoftTypography>
              <SoftInput
                type="text"
                name="shipment_mode"
                value={deliveryFormData.shipment_mode}
                onChange={handleDeliveryFormChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <SoftTypography variant="caption">Remark</SoftTypography>
              <SoftInput
                multiline
                rows={3}
                name="comment"
                value={deliveryFormData.comment}
                onChange={handleDeliveryFormChange}
                required
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <SoftButton
                type="button"
                color="secondary"
                onClick={() => navigate("/partial-delivery")}
              >
                Cancel
              </SoftButton>
              <SoftButton type="submit" color="success">
                Record Delivery
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default RecordDelivery;
