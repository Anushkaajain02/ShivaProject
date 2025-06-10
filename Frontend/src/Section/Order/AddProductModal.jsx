import React, { useState } from "react";
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

const GarmentSelectionModal = ({ open, onClose }) => {
  const [activeService, setActiveService] = useState("Dry Clean");
  const [activeCategory, setActiveCategory] = useState("Men");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState({});

  const garments = [
    { id: 1, name: "Shirt", price: 350.0, number: 1 },
    { id: 2, name: "Jeans", price: 440.0, number: 2 },
    { id: 3, name: "Steel Tumbler", price: 530.0, number: 3 },
    { id: 4, name: "Capri", price: 80.0, number: 4 },
    { id: 5, name: "Coat", price: 250.0, number: 5 },
    { id: 6, name: "Dhoti", price: 90.0, number: 6 },
    { id: 7, name: "Jacket Full Sleeves", price: 250.0, number: 7 },
    { id: 8, name: "Jacket Half Sleeves", price: 190.0, number: 8 },
    // { id: 9, name: "Jacket with Hood", price: 300.0, number: 9 },
    // { id: 10, name: "Jeans", price: 0, number: 10 },
  ];

  const handleQuantityChange = (itemId, change) => {
    setSelectedItems((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);

      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [itemId]: newQty };
    });
  };

  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce((total, qty) => total + qty, 0);
  };

  const filteredGarments = garments.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    dialog: {
      "& .MuiDialog-paper": {
        maxWidth: "95vw",
        width: "1200px",
        height: "90vh",
        margin: 0,
        borderRadius: "12px",
      },
    },
    header: {
      background: "linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)",
      color: "white",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "12px 12px 0 0",
    },
    actionButtons: {
      display: "flex",
      justifyContent: "space-between",
      padding: "16px",
    },
    serviceTab: {
      minWidth: "auto",
      padding: "8px 16px",
      margin: "0 4px",
      borderRadius: "20px",
      textTransform: "none",
      fontSize: "14px",
      fontWeight: 500,
    },
    activeServiceTab: {
      backgroundColor: "#2196F3",
      color: "white",
      "&:hover": {
        backgroundColor: "#1976D2",
      },
    },
    inactiveServiceTab: {
      backgroundColor: "#f5f5f5",
      color: "#666",
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    },
    searchField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      },
    },

    garmentCard: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      transition: "box-shadow 0.2s",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
    },
    numberBadge: {
      position: "absolute",
      top: "8px",
      left: "8px",
      backgroundColor: "#f5eeee",
      color: "white",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "bold",
    },
    garmentImage: {
      width: "60px",
      height: "60px",
      backgroundColor: "#FFE0B2",
      border: "2px solid #FF9800",
      borderRadius: "4px",
      margin: "16px auto 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    quantityButton: {
      minWidth: "20px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      padding: 0,
      fontSize: "16px",
      fontWeight: "bold",
    },
    quantityDisplay: {
      minWidth: "25px",
      height: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    sidebar: {
      backgroundColor: "#fafafa",
      borderLeft: "1px solid #e0e0e0",
      width: "320px",
      display: "flex",
      flexDirection: "column",
    },
    sidebarHeader: {
      padding: "16px",
      backgroundColor: "white",
      borderBottom: "1px solid #e0e0e0",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#666",
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} sx={styles.dialog}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Select Garments
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", height: "calc(100% - 80px)" }}>
        {/* Main Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Service Tabs */}

          {/* Search */}
          <Box sx={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
            <TextField
              fullWidth
              placeholder="Search for garment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#666" }} />
                  </InputAdornment>
                ),
              }}
              sx={styles.searchField}
            />
          </Box>

          {/* Category Tabs */}

          {/* Garments Grid */}
          <Box sx={{ flex: 1, overflow: "auto", padding: "16px" }}>
            <Grid container spacing={2}>
              {filteredGarments.map((item) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                  <Card sx={styles.garmentCard}>
                    <CardContent
                      sx={{
                        position: "relative",
                        textAlign: "center",
                        flexGrow: 1,
                      }}
                    >
                      {/* Number Badge */}
                      {/* <Box sx={styles.numberBadge}>{item.number}</Box> */}

                      {/* Image */}
                      {/* <Box sx={styles.garmentImage}>
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#FF8A65",
                            borderRadius: "4px",
                          }}
                        />
                      </Box> */}

                      {/* Item Info */}
                      <Typography
                        variant="body2"
                        sx={{
                          height: "48px",
                          overflow: "hidden", // Hide any overflowed text
                          textOverflow: "ellipsis", // If overflowed, add ellipsis (optional)
                          whiteSpace: "normal", // Allow wrapping of text
                          fontWeight: 600, // Bold font
                          fontSize: "14px", // Font size
                          color: "#333", // Text color
                          lineHeight: "1.4", // Adjust line spacing for readability
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#2196F3",
                          fontWeight: 600,
                          marginBottom: "12px",
                          fontSize: "13px",
                        }}
                      >
                        ₹{item.price.toFixed(2)}
                      </Typography>

                      {/* Quantity Controls */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <IconButton
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={!selectedItems[item.id]}
                          sx={{
                            ...styles.quantityButton,
                            border: "2px solid #f44336",
                            color: selectedItems[item.id] ? "#f44336" : "#ccc",
                            "&:hover": {
                              backgroundColor: selectedItems[item.id]
                                ? "#f44336"
                                : "transparent",
                              color: selectedItems[item.id] ? "white" : "#ccc",
                            },
                            "&:disabled": {
                              borderColor: "#ccc",
                              color: "#ccc",
                            },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Box sx={styles.quantityDisplay}>
                          {selectedItems[item.id] || 0}
                        </Box>

                        <IconButton
                          onClick={() => handleQuantityChange(item.id, 1)}
                          sx={{
                            ...styles.quantityButton,
                            border: "2px solid #4caf50",
                            color: "#4caf50",
                            "&:hover": {
                              backgroundColor: "#4caf50",
                              color: "white",
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Sidebar */}
        <Box sx={styles.sidebar}>
          <Box sx={styles.sidebarHeader}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShoppingBagIcon />
              Selected Items ({getTotalSelectedItems()})
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", padding: "16px" }}>
            {getTotalSelectedItems() === 0 ? (
              <Box sx={styles.emptyState}>
                <ShoppingBagIcon
                  sx={{ fontSize: 48, color: "#ccc", marginBottom: "16px" }}
                />
                <Typography variant="body2">No items selected</Typography>
              </Box>
            ) : (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {Object.entries(selectedItems).map(([itemId, quantity]) => {
                  const item = garments.find((g) => g.id === parseInt(itemId));
                  if (!item) return null;

                  return (
                    <Paper
                      key={itemId}
                      sx={{
                        padding: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          ₹{item.price.toFixed(2)} each
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Chip
                          label={quantity}
                          size="small"
                          sx={{
                            backgroundColor: "#E3F2FD",
                            color: "#1976D2",
                            fontWeight: 600,
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(parseInt(itemId), -quantity)
                          }
                          sx={{ color: "#f44336" }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>
          {/* Action Buttons (Add Products and Close) */}
          <Box sx={styles.actionButtons}>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
              onClick={onClose} // Close button functionality
            >
              Close
            </Button>
            <Button
              className="btn btn-primary"
              variant="contained"
              sx={{
                backgroundColor: "#2196F3",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1976D2",
                },
              }}
            >
              Add Products
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

GarmentSelectionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Demo Component
const AddProductModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: "24px", fontWeight: 600 }} 
        ></Typography>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{
            backgroundColor: "#2196F3",
            padding: "12px 24px",
            fontSize: "16px",
          }}
        >
          Select Product
        </Button>
      </Box>

      <GarmentSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default AddProductModal;
