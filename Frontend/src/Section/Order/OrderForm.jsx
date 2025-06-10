import React, { useState, useEffect, useRef } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { List, ListItem, ListItemText } from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const OrderForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    order_no: "",
    supplier_id: "",
    order_date: "",
    customer_id: "",
    consignee: "",
    place: "",
    quality_remark: "",
    order_qty: "",
    unit_of_measurement: "",
    rate: "",
    bales: "",
    product_id: "",
    shipment_mode: "",
    lr_no: "",
    lr_date: "",
    total_amount: "",
  });

  const [supplierslist, setSuppliersList] = useState([]);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerslist, setCustomersList] = useState([]);
  const [productslist, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedOrderNo, setGeneratedOrderNo] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  // Fetch suppliers and customers for dropdowns

  // Auto-generate order_no for new form
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetCustomerDetails");
        setCustomersList(res.data.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetSupplierDetails");
        setSuppliersList(res.data.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetProductDetails");
        setProductsList(res.data.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch next order number
        const orderNoResponse = await axios.get(
          "http://localhost:3301/getNextOrderNumber"
        );
        if (orderNoResponse.data && orderNoResponse.data.order_no) {
          setGeneratedOrderNo(orderNoResponse.data.order_no);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        alert("Error loading form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    fetchSuppliers();
    fetchCustomers();
    fetchProduct();
  }, []);

  //customer search

  useEffect(() => {
    if (!searchTerm?.trim()) {
      setFilteredCustomers([]);
      setShowDropdown(false);
      return;
    }

    const results = customerslist.filter((customer) =>
      customer.customer_name?.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    setFilteredCustomers(results);
    setShowDropdown(true);
  }, [searchTerm, customerslist]);

  const handleCustomerClick = (customer) => {
    setSearchTerm(customer.customer_name);
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.customer_id,
    }));
    setShowDropdown(false);
  };

  //supplier search

  useEffect(() => {
    if (!supplierSearchTerm?.trim()) {
      setFilteredSuppliers([]);
      setShowSupplierDropdown(false);
      return;
    }

    const results = supplierslist.filter((supplier) =>
      supplier.supplier_name
        ?.toLowerCase()
        .startsWith(supplierSearchTerm.toLowerCase())
    );
    setFilteredSuppliers(results);
    setShowSupplierDropdown(true);
  }, [supplierSearchTerm, supplierslist]);

  const handleSupplierClick = (supplier) => {
    setSupplierSearchTerm(supplier.supplier_name);
    setFormData((prev) => ({
      ...prev,
      supplier_id: supplier.supplier_id,
    }));
    setShowSupplierDropdown(false);
  };

  useEffect(() => {
    if (id) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3301/GetOrderById/${id}`
          );
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching order details:", err);
        }
      };
      fetchOrderDetails();
    }
    nameInputRef.current?.focus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedForm = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // 🟡 Bale Calculation when order_qty changes
    if (name === "order_qty") {
      const orderQty = Number(value);
      const rate = Number(formData.rate);

      if (!isNaN(orderQty)) {
        updatedForm.bales = Math.max(1, Math.ceil(orderQty / 180));

        if (!isNaN(rate)) {
          updatedForm.total_amount = orderQty * rate;
        }
      }
    }

    // 🟡 Total calculation when rate changes
    if (name === "rate") {
      const rate = Number(value);
      const orderQty = Number(formData.order_qty);
      if (!isNaN(rate) && !isNaN(orderQty)) {
        updatedForm.total_amount = orderQty * rate;
      }
    }

    // 🟡 When product is selected, autofill rate and recalculate total
    if (name === "product_id") {
      const selectedProduct = productslist.find(
        (p) => p.product_id === Number(value)
      );
      if (selectedProduct) {
        const rate = Number(selectedProduct.price);
        updatedForm.rate = rate;

        const orderQty = Number(formData.order_qty);
        if (!isNaN(orderQty)) {
          updatedForm.total_amount = orderQty * rate;
        }
      }
    }

    setFormData(updatedForm);
  };

  // const validate = () => {
  //   const newErrors = {};
  //   if (!formData.order_no.trim())
  //     newErrors.order_no = "Order number is required.";
  //   if (!formData.order_date.trim())
  //     newErrors.order_date = "Order date is required.";
  //   if (!formData.total_amount || isNaN(formData.total_amount)) {
  //     newErrors.total_amount = "Total amount must be a valid number.";
  //   }
  //   return newErrors;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update order
        await axios.put(`http://localhost:3301/UpdateOrder/${id}`, formData);

        alert("Order updated successfully");
        navigate("/order");
      } else {
        // Add order
        const orderResponse = await axios.post(
          "http://localhost:3301/AddOrder",
          {
            ...formData,
            order_no: generatedOrderNo,
          }
        );

        const { order_no, order_date } = orderResponse.data;
        console.log(orderResponse.data);

        alert("Order added successfully");

        // After order added, generate invoice number from backend
        const invoiceRes = await axios.get(
          "http://localhost:3301/getNextInvoiceNumber"
        );

        const invoiceNumber = invoiceRes.data.bill_no; // e.g. "INV-0001"

        // Prepare invoice data (adjust as per your formData fields)
        const invoiceData = {
          order_no: generatedOrderNo, // link invoice to this order
          bill_no: invoiceNumber,
          bill_date: order_date, // today’s date in YYYY-MM-DD format
          amount: formData.total_amount, // or calculate total amount here
          transport_mode: formData.shipment_mode || "",
          lr_no: formData.lr_no || "",
          lr_date: formData.lr_date || null,
        };

        // Insert invoice record
        await axios.post("http://localhost:3301/AddInvoice", invoiceData);

        alert(`Invoice ${invoiceNumber} created successfully.`);
        navigate("/order");
      }

      navigate("/order");
    } catch (err) {
      alert("Failed to save the order or invoice");
      console.error(err);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 3, borderRadius: "xl", boxShadow: "lg" }}>
        <SoftBox mb={3}>
          <SoftTypography variant="h5" fontWeight="bold">
            Order Master Form
          </SoftTypography>
        </SoftBox>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Order No - readonly */}
            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Order No
                </SoftTypography>
                <SoftInput
                  name="order_no"
                  placeholder="Order No"
                  value={id ? formData.order_no : generatedOrderNo}
                  readOnly
                />
              </SoftBox>
            </Grid>

            {/* Customer dropdown */}

            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Customer
                </SoftTypography>
                <TextField
                  variant="outlined"
                  placeholder="Search customer name..."
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm && setShowDropdown(true)}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 150); // Delay to allow click
                  }}
                  //
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "41px",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    },
                  }}
                />

                {/* Dropdown Suggestions */}
                {showDropdown && filteredCustomers.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: "absolute",
                      zIndex: 10,

                      width: "475px",
                      maxHeight: 200,
                      overflowY: "auto",
                    }}
                  >
                    <List>
                      {filteredCustomers.map((customer, index) => (
                        <ListItem
                          button
                          key={index}
                          onClick={() => handleCustomerClick(customer)}
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
                                {customer.customer_name
                                  .charAt(0)
                                  .toUpperCase() +
                                  customer.customer_name.slice(1)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </SoftBox>
            </Grid>

            {/* Supplier dropdown */}
            <Grid item xs={12} sm={6}>
              <SoftBox mb={1} position="relative">
                <SoftTypography variant="caption" fontWeight="bold">
                  Supplier
                </SoftTypography>
                <TextField
                  variant="outlined"
                  placeholder="Search supplier name..."
                  fullWidth
                  value={supplierSearchTerm}
                  onChange={(e) => setSupplierSearchTerm(e.target.value)}
                  onFocus={() =>
                    supplierSearchTerm && setShowSupplierDropdown(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSupplierDropdown(false), 150)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "41px",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    },
                  }}
                />
                {showSupplierDropdown && filteredSuppliers.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: "absolute",
                      zIndex: 10,
                      width: "100%",
                      maxHeight: 300,
                      overflowY: "auto",
                    }}
                  >
                    <List>
                      {filteredSuppliers.map((supplier, index) => (
                        <ListItem
                          button
                          key={index}
                          onClick={() => handleSupplierClick(supplier)}
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
                                {supplier.supplier_name
                                  .charAt(0)
                                  .toUpperCase() +
                                  supplier.supplier_name.slice(1)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </SoftBox>
            </Grid>

            {/* Order Date */}
            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Order Date
                </SoftTypography>
                <SoftInput
                  name="order_date"
                  type="date"
                  value={formData.order_date || ""}
                  onChange={handleChange}
                  error={Boolean(errors.order_date)}
                />
                {errors.order_date && (
                  <SoftTypography variant="caption" color="error">
                    {errors.order_date}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid>

            {/* Customer dropdown */}

            {/* Rest of the inputs */}
            {[
              { label: "Consignee", name: "consignee" },
              { label: "Place", name: "place" },
              { label: "Quality Remark", name: "quality_remark" },
              { label: "Transport", name: "transport" },
            ].map(({ label, name, type = "text" }) => (
              <Grid item xs={12} sm={6} key={name}>
                <SoftBox mb={1}>
                  <SoftTypography variant="caption" fontWeight="bold">
                    {label}
                  </SoftTypography>
                  <SoftInput
                    name={name}
                    type={type}
                    placeholder={`Enter ${label}`}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    error={Boolean(errors[name])}
                  />
                  {errors[name] && (
                    <SoftTypography variant="caption" color="error">
                      {errors[name]}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Unit of Measurement
                </SoftTypography>
                <select
                  name="unit_of_measurement"
                  value={formData.unit_of_measurement}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "41px",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="">Select Unit</option>
                  <option value="piece">Piece</option>
                  <option value="Dozen">Dozen</option>
                  <option value="meter">Meter</option>
                  <option value="bale">Bale</option>
                </select>
              </SoftBox>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Bales
                </SoftTypography>
                <SoftInput
                  name="bales"
                  type="text"
                  value={formData.bales}
                  onChange={handleChange}
                  placeholder="Auto-calculated from quantity"
                />
              </SoftBox>
            </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  rate
                </SoftTypography>
                <SoftInput
                  name="total_amount"
                  placeholder="rate"
                  value={formData.rate || ""}
                  
                />
                {errors.rate && (
                  <SoftTypography variant="caption" color="error">
                    {errors.rate}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid> */}

            {/* Total Amount readonly */}
            {/* <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftTypography variant="caption" fontWeight="bold">
                  Total Amount
                </SoftTypography>
                <SoftInput
                  name="total_amount"
                  placeholder="Total Amount"
                  value={formData.total_amount || ""}
                  readOnly
                />
                {errors.total_amount && (
                  <SoftTypography variant="caption" color="error">
                    {errors.total_amount}
                  </SoftTypography>
                )}
              </SoftBox>
            </Grid> */}

            {/* Submit button */}
            <Grid item xs={12}>
              <SoftButton
                type="button"
                variant="gradient"
                color="dark"
                fullWidth
                onClick={() => setIsModalOpen(true)}
              >
                {id ? "Update Order" : "Add Order"}
              </SoftButton>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};

export default OrderForm;
