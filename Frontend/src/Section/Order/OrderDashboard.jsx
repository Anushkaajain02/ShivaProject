import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, Modal, Box } from "@mui/material";
import { Minus, Plus } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import { maxHeight } from "@mui/system";

function OrderCreatePage() {
  const { id } = useParams();

  const [supplierslist, setSuppliersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  const [customer, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [generatedOrderNo, setGeneratedOrderNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Supplier search states
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tempDiscount, setTempDiscount] = useState(discountAmount);
  const [customerSearch, setCustomerSearch] = useState("");


  const STORAGE_KEY = `newProductDetail_${id}`;

  const location = useLocation();
  const [newProductDetail, setNewProduct] = useState(null);

  useEffect(() => {
    debugger;
    if (location.state?.newProduct) {
      setNewProduct(location.state.newProduct);
    }
  }, [location]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      items: [],
      totalItems: 0,
      totalAmount: "0.00",
    };

    if (location.state?.newProduct) {
      const incomingData = location.state.newProduct;

      incomingData.items.forEach((newItem) => {
        const existingIndex = savedData.items.findIndex(
          (item) => item.id === newItem.id
        );
        if (existingIndex !== -1) {
          savedData.items[existingIndex].quantity += newItem.quantity;
        } else {
          savedData.items.push(newItem);
        }
      });

      savedData.totalItems = savedData.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      savedData.totalAmount = savedData.items
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
      navigate(location.pathname, { replace: true });
    }

    setNewProduct(savedData);
  }, [location.state?.newProduct, id]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetCustomerDetails");
        setCustomersList(res.data.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch next order number
        const orderNoResponse = await axios.get(
          "http://localhost:3301/getNextOrderNumber"
        );
        if (orderNoResponse.data && orderNoResponse.data.order_no) {
          setGeneratedOrderNo(orderNoResponse.data.order_no);
          console.log(generatedOrderNo);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        alert("Error loading form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3301/GetCustomerById/${id}`
        );
        setCustomers(res.data || null);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    };

    if (id) {
      fetchCustomerById();
    }
  }, [id]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetSupplierDetails");
        setSuppliersList(res.data.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  // Filter suppliers based on search term
  useEffect(() => {
    if (supplierSearchTerm.trim() === "") {
      setFilteredSuppliers([]);
      setShowSupplierDropdown(false);
    } else {
      const filtered = supplierslist.filter(
        (supplier) =>
          supplier.supplier_name
            ?.toLowerCase()
            .includes(supplierSearchTerm.toLowerCase()) ||
          supplier.supplier_id?.toString().includes(supplierSearchTerm) ||
          supplier.contact_person
            ?.toLowerCase()
            .includes(supplierSearchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
      setShowSupplierDropdown(filtered.length > 0);
    }
  }, [supplierSearchTerm, supplierslist]);

  const handleAdd = (productId) => {
    if (!newProductDetail) return;

    const updatedItems = newProductDetail.items.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    const updatedCart = {
      ...newProductDetail,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, p) => sum + p.quantity, 0),
      totalAmount: updatedItems
        .reduce((sum, p) => sum + p.price * p.quantity, 0)
        .toFixed(2),
    };

    setNewProduct(updatedCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const handleDeleteAll = (productId) => {
    if (!newProductDetail) return;

    const updatedItems = newProductDetail.items.filter(
      (item) => item.id !== productId
    );

    const updatedCart = {
      ...newProductDetail,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, p) => sum + p.quantity, 0),
      totalAmount: updatedItems
        .reduce((sum, p) => sum + p.price * p.quantity, 0)
        .toFixed(2),
    };

    // ✅ Update state
    setNewProduct(updatedCart);

    // ✅ Sync to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const handleDelete = (productId) => {
    if (!newProductDetail) return;

    const updatedItems = newProductDetail.items
      .map((item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 }; // just decrease quantity
          } else {
            return null; // if quantity is 1, then remove
          }
        }
        return item; // keep other items unchanged
      })
      .filter((item) => item !== null); // remove nulls (only deleted items)

    const updatedCart = {
      ...newProductDetail,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, p) => sum + p.quantity, 0),
      totalAmount: updatedItems
        .reduce((sum, p) => sum + p.price * p.quantity, 0)
        .toFixed(2),
    };

    setNewProduct(updatedCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart));
  };

  // Handle supplier search input change
  const handleSupplierSearchChange = (e) => {
    const value = e.target.value;
    setSupplierSearchTerm(value);

    // If input is cleared, also clear selected supplier
    if (value === "") {
      setSelectedSupplier(null);
    }
  };

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearchTerm(supplier.supplier_name);
    setShowSupplierDropdown(false);
    setFilteredSuppliers([]);
  };

  // Handle input focus
  const handleSupplierInputFocus = () => {
    setFilteredSuppliers(supplierslist);
    setShowSupplierDropdown(true);
  };

  // Handle clicking outside to close dropdown
  const handleSupplierInputBlur = () => {
    // Delay hiding dropdown to allow clicking on options
    setTimeout(() => {
      setShowSupplierDropdown(false);
    }, 200);
  };

  const subtotal = parseFloat(newProductDetail?.totalAmount || 0);
  const taxAmount = +(subtotal * 0.18).toFixed(2);
  const totalPayable = +(subtotal + taxAmount - discountAmount).toFixed(2);
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox p={3}>
        {/* Header with Breadcrumb Style */}
        <SoftBox mb={4}>
          <SoftBox display="flex" alignItems="center" mb={2}>
            <ReceiptIcon sx={{ fontSize: 28, color: "#1976d2", mr: 1 }} />
            <SoftTypography variant="h4" fontWeight="bold" color="dark">
              Create New Order
            </SoftTypography>
            <Chip
              label={generatedOrderNo}
              color="primary"
              size="small"
              sx={{ ml: 2, fontWeight: "bold" }}
            />
          </SoftBox>
          <SoftTypography variant="body2" color="text">
            Fill in the details below to create a new order
          </SoftTypography>
        </SoftBox>

        <Grid container spacing={3}>
          {/* Left Column - Customer & Products */}
          <Grid item xs={12} lg={8}>
            {/* Customer Selection Card */}
            <Card
              sx={{
                mb: 3,
                borderLeft: "4px solid #1976d2",
                boxShadow: "0 2px 14px 0 rgba(0,0,0,0.08)",
              }}
            >
              <SoftBox p={3}>
                <SoftBox display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ fontSize: 24, color: "#1976d2", mr: 1 }} />
                  <SoftTypography variant="h6" fontWeight="medium">
                    Customer Information
                  </SoftTypography>
                </SoftBox>

                <Card
                  sx={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    borderRadius: "12px",
                  }}
                >
                  <SoftBox
                    p={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <SoftBox>
                      <SoftTypography
                        variant="h6"
                        color="dark"
                        fontWeight="bold"
                      >
                        {customer.customer_name || "Select Customer"}
                      </SoftTypography>
                      <SoftTypography variant="caption" color="text">
                        Customer ID: {customer.customer_id || "N/A"}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox display="flex" gap={1}>
                      <SoftButton
                        size="small"
                        color="info"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setShowCustomerDropdown((prev) => !prev)}
                      >
                        Change
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </Card>
              </SoftBox>
              {showCustomerDropdown && (
  <SoftBox mt={2}>
    <Card
      sx={{
        maxHeight: 250,
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        p: 1,
      }}
    >
      {/* Search Input */}
      <SoftBox mb={1} px={1}>
        <SoftInput
          placeholder="Search customer..."
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          fullWidth
        />
      </SoftBox>

      {/* Filtered List */}
      {Array.isArray(customersList) &&
      customersList.length > 0 ? (
        customersList
          .filter((cust) =>
            cust.customer_name
              .toLowerCase()
              .includes(customerSearch.toLowerCase())
          )
          .map((cust) => (
            <SoftBox
              key={cust.customer_id}
              p={1}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={() => {
                setCustomers(cust);
                setShowCustomerDropdown(false);
                navigate(`/orderdash/${cust.customer_id}`);
              }}
            >
              <SoftTypography variant="body2" fontWeight="medium">
                {cust.customer_name}
              </SoftTypography>
              
            </SoftBox>
          ))
      ) : (
        <SoftTypography variant="body2" color="text" p={1}>
          No customers found
        </SoftTypography>
      )}
    </Card>
  </SoftBox>
)}

            </Card>

            {/* Products Section */}
            <Card
              sx={{
                borderLeft: "4px solid #4caf50",
                boxShadow: "0 2px 14px 0 rgba(0,0,0,0.08)",
              }}
            >
              <SoftBox p={3}>
                <SoftBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                >
                  <SoftBox display="flex" alignItems="center">
                    <InventoryIcon
                      sx={{ fontSize: 24, color: "#4caf50", mr: 1 }}
                    />
                    <SoftTypography variant="h6" fontWeight="medium">
                      Product Selection
                    </SoftTypography>
                  </SoftBox>
                  <SoftButton
                    color="success"
                    variant="gradient"
                    size="medium"
                    onClick={() =>
                      navigate("/productpage", {
                        state: { returnTo: `/orderdash/${id}` },
                      })
                    }
                    sx={{
                      borderRadius: "10px",
                      px: 3,
                      boxShadow: "0 4px 12px rgba(9, 66, 11, 0.3)",
                    }}
                  >
                    + Add Product
                  </SoftButton>
                </SoftBox>

                {/* Product List */}
                <SoftBox
                  sx={{
                    // Adjust based on your card height
                    maxHeight: "210px",
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  {newProductDetail?.items?.map((item) => (
                    <Card
                      key={item.id}
                      sx={{
                        mb: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: "12px",

                        overflow: "hidden",
                        overflow: "hidden",
                        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
                      }}
                    >
                      <SoftBox p={2}>
                        <SoftBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <SoftBox display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={item.image}
                              alt={item.name}
                              variant="rounded"
                              sx={{ width: 56, height: 56 }}
                            />
                            <SoftBox>
                              <SoftTypography
                                variant="subtitle1"
                                fontWeight="medium"
                                color="dark"
                                fontSize="medium"
                              >
                                {item.name}
                              </SoftTypography>
                              <SoftBox
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <button
                                  className="quantity-btn remove"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Minus size={14} />
                                </button>

                                <SoftTypography
                                  variant="body2"
                                  fontWeight="medium"
                                >
                                  {item.quantity}
                                </SoftTypography>

                                <button
                                  className="quantity-btn add"
                                  onClick={() => handleAdd(item.id)}
                                >
                                  <Plus size={14} />
                                </button>
                              </SoftBox>
                            </SoftBox>
                          </SoftBox>

                          <SoftBox display="flex" alignItems="center" gap={2}>
                            <SoftTypography
                              variant="h6"
                              color="success"
                              fontWeight="bold"
                            >
                              ₹{parseFloat(item.price).toFixed(2)}
                            </SoftTypography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteAll(item.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    </Card>
                  ))}
                </SoftBox>
              </SoftBox>
            </Card>

            {/* Additional Details Section */}
            <Card
              sx={{
                mt: 3,
                borderLeft: "4px solid #ff9800",
                boxShadow: "0 2px 14px 0 rgba(0,0,0,0.08)",
              }}
            >
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium" mb={3}>
                  Additional Information
                </SoftTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SoftBox mb={2} position="relative">
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        mb={1}
                      >
                        Supplier Name
                      </SoftTypography>

                      <SoftBox position="relative">
                        <SoftInput
                          placeholder="Select supplier name..."
                          value={supplierSearchTerm}
                          onChange={handleSupplierSearchChange}
                          onFocus={handleSupplierInputFocus}
                          onBlur={handleSupplierInputBlur}
                          sx={{
                            backgroundColor: "#f8f9fa",
                            "& .MuiInputBase-root": {
                              paddingRight: selectedSupplier ? "40px" : "12px",
                            },
                          }}
                        />

                        {/* Supplier Dropdown */}
                        {showSupplierDropdown && (
                          <Card
                            sx={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 1000,
                              maxHeight: "200px",
                              overflowY: "auto",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              mt: 1,
                            }}
                          >
                            {filteredSuppliers.length > 0 ? (
                              filteredSuppliers.map((supplier, index) => (
                                <SoftBox
                                  key={supplier.supplier_id || index}
                                  p={2}
                                  sx={{
                                    cursor: "pointer",
                                    borderBottom:
                                      index < filteredSuppliers.length - 1
                                        ? "1px solid #f0f0f0"
                                        : "none",
                                    "&:hover": {
                                      backgroundColor: "#f8f9fa",
                                    },
                                  }}
                                  onClick={() => handleSupplierSelect(supplier)}
                                >
                                  <SoftTypography
                                    variant="body2"
                                    fontWeight="medium"
                                    color="dark"
                                  >
                                    {supplier.supplier_name ||
                                      "Unknown Supplier"}
                                  </SoftTypography>
                                  <SoftTypography
                                    variant="caption"
                                    color="text"
                                  >
                                     • Contact:{" "}
                                    {supplier.contact_info || "N/A"}
                                  </SoftTypography>
                                </SoftBox>
                              ))
                            ) : (
                              <SoftBox p={2}>
                                <SoftTypography
                                  variant="body2"
                                  color="text"
                                  textAlign="center"
                                >
                                  No suppliers found
                                </SoftTypography>
                              </SoftBox>
                            )}
                          </Card>
                        )}
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SoftBox mb={2}>
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        mb={1}
                      >
                        Bale
                      </SoftTypography>
                      <SoftInput
                        placeholder="Enter bale"
                        sx={{ backgroundColor: "#f8f9fa" }}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12}>
                    <SoftBox mb={2}>
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        mb={1}
                      >
                        Special Instructions
                      </SoftTypography>
                      <SoftInput
                        multiline
                        rows={3}
                        placeholder="Enter any special instructions or notes..."
                        sx={{ backgroundColor: "#f8f9fa" }}
                      />
                    </SoftBox>
                  </Grid>
                </Grid>
              </SoftBox>
            </Card>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                position: "sticky",
                top: 20,
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}
            >
              {/* Header with Gradient */}
              <SoftBox
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  p: 3,
                }}
              >
                <SoftTypography variant="h6" color="white" fontWeight="bold">
                  Order Summary
                </SoftTypography>
                <SoftTypography variant="caption" color="white" opacity={0.8}>
                  Order #{generatedOrderNo}
                </SoftTypography>
              </SoftBox>

              <SoftBox p={3}>
                {/* Order Details */}
                <SoftBox mb={3}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="button" fontWeight="medium" mb={1}>
                      Order Date
                    </SoftTypography>
                    <SoftInput
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      sx={{ backgroundColor: "#f8f9fa" }}
                    />
                  </SoftBox>

                  <SoftBox mb={2}>
                    <SoftTypography variant="button" fontWeight="medium" mb={1}>
                      Delivery Location
                    </SoftTypography>
                    <SoftInput
                      placeholder="Enter delivery place"
                      sx={{ backgroundColor: "#f8f9fa" }}
                    />
                  </SoftBox>
                </SoftBox>

                <Divider sx={{ my: 2 }} />

                {/* Price Breakdown */}
                <SoftBox mb={3}>
                  <SoftTypography variant="button" fontWeight="medium" mb={2}>
                    Price Breakdown
                  </SoftTypography>

                  <SoftBox display="flex" justifyContent="space-between" mb={1}>
                    <SoftTypography
                      variant="body2"
                      color="text"
                      fontSize="small"
                    >
                      Subtotal ({newProductDetail?.totalItems})
                    </SoftTypography>
                    <SoftTypography
                      variant="body2"
                      fontWeight="medium"
                      fontSize="small"
                    >
                      ₹{newProductDetail?.totalAmount || "0.00"}
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox display="flex" justifyContent="space-between" mb={1}>
                    <SoftTypography
                      variant="body2"
                      color="text"
                      fontSize="small"
                    >
                      Tax (GST 18%)
                    </SoftTypography>
                    <SoftTypography
                      variant="body2"
                      fontWeight="medium"
                      fontSize="small"
                    >
                      {taxAmount}
                    </SoftTypography>
                  </SoftBox>

                  {/* <SoftBox display="flex" justifyContent="space-between" mb={1}>
                    <SoftTypography
                      variant="body2"
                      color="text"
                      fontSize="small"
                    >
                      Shipping
                    </SoftTypography>
                    <SoftTypography
                      variant="body2"
                      fontWeight="medium"
                      color="success"
                      fontSize="small"
                    >
                      Free
                    </SoftTypography>
                  </SoftBox> */}

                  <SoftBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <SoftBox display="flex" alignItems="center" gap={1}>
                      <SoftTypography
                        variant="body2"
                        color="text"
                        fontSize="small"
                      >
                        Discount
                      </SoftTypography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setIsEditingDiscount(true);
                          setTempDiscount(discountAmount); // preload current value
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </SoftBox>

                    {isEditingDiscount ? (
                      <TextField
                        size="small"
                        type="number"
                        value={tempDiscount}
                        autoFocus
                        onChange={(e) =>
                          setTempDiscount(Number(e.target.value))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setDiscountAmount(tempDiscount); // Save
                            setIsEditingDiscount(false); // Exit edit mode
                          }
                        }}
                        sx={{ maxWidth: "80px" }}
                        inputProps={{ min: 0 }}
                      />
                    ) : (
                      <SoftTypography
                        variant="body2"
                        fontWeight="medium"
                        color="error"
                        fontSize="small"
                      >
                        -₹{parseFloat(discountAmount || 0).toFixed(2)}
                      </SoftTypography>
                    )}
                  </SoftBox>

                  <Divider />

                  <SoftBox display="flex" justifyContent="space-between" mt={2}>
                    <SoftTypography variant="h6" fontWeight="bold">
                      Total Amount
                    </SoftTypography>
                    <SoftTypography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      fontSize="small"
                    >
                      ₹{totalPayable}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>

                {/* Action Buttons */}
                <SoftBox display="flex" flexDirection="column" gap={2}>
                  <SoftButton
                    color="success"
                    variant="gradient"
                    fullWidth
                    size="large"
                    sx={{
                      borderRadius: "12px",
                      py: 1.5,
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      boxShadow: "0 6px 20px rgba(76, 175, 80, 0.3)",
                      "&:hover": {
                        boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)",
                      },
                    }}
                  >
                    Complete Order
                  </SoftButton>

                  {/* <SoftButton
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    sx={{
                      borderRadius: "12px",
                      py: 1.2,
                      fontWeight: "medium",
                    }}
                  >
                    Save as Draft
                  </SoftButton> */}

                  <SoftButton
                    color="error"
                    variant="text"
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: "12px",
                      py: 1,
                    }}
                  >
                    Cancel Order
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default OrderCreatePage;
