import React, { useState, useEffect } from "react";
import axios from "axios";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import { Card, Divider, Paper, List, ListItem, ListItemText } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function CreateOrder() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [customersList, setCustomersList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetCustomerDetails");
        setCustomersList(res.data.data || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers([]);
      setShowDropdown(false);
      return;
    }

    const results = customersList.filter((customer) =>
      [customer.customer_name, customer.address, customer.contact_info].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCustomers(results);
    setShowDropdown(true);
  }, [searchTerm, customersList]);

  const handleCustomerClick = (customer) => {debugger;
    
    setSearchTerm(customer.name);
    setShowDropdown(false);
navigate(`/customerdash/${customer.customer_id}`);  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={3}>
        {/* Header */}
        <SoftBox
          py={3}
          px={3}
          borderRadius="lg"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            background: "linear-gradient(90deg,rgb(49, 202, 248),rgb(53, 100, 255))",
            color: "white",
          }}
        >
          <SoftTypography variant="h5" color="white" display="flex" alignItems="center">
            <Icon sx={{ mr: 1, color: "white" }}>search</Icon>
            Customer Search
          </SoftTypography>

          <SoftButton
            variant="contained"
            color="white"
            onClick={() => navigate("/addcustomer")}
            sx={{
              color: "#1976d2",
              backgroundColor: "white",
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <Icon sx={{ mr: 1 }}>person_add</Icon>
            Add Customer
          </SoftButton>
        </SoftBox>

        {/* Search Input */}
        <SoftBox mt={3} display="flex" justifyContent="center" position="relative">
          <SoftBox
            display="flex"
            alignItems="center"
            width="100%"
            sx={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <SoftInput
              placeholder="Search by Name, Address, or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
              fullWidth
              sx={{
                px: 2,
                py: 1.5,
                fontSize: "16px",
                border: "none",
                "& input": { padding: "12px 14px" },
              }}
            />
            <SoftButton
              color="info"
              sx={{
                borderRadius: 0,
                height: "50px",
                px: 5,
                background: "linear-gradient(90deg,rgb(49, 202, 248),rgb(53, 100, 255))",
              }}
            >
              <SearchIcon color= "white" sx={{  fontSize: "20px" }} />
            </SoftButton>
          </SoftBox>

          {/* Dropdown Suggestions */}
          {showDropdown && filteredCustomers.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: 300,
                overflowY: "auto",
                width: "890px",
                fontSize: "small",

              }}
            >
              <List >
                {filteredCustomers.map((customer, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleCustomerClick(customer)}
                    sx={{ py: 1.5,
                      px: 2.5,
                      fontSize: "small",
                      "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <ListItemText 
                      primary={customer.customer_name}
                      secondary={`${customer.address} | ${customer.contact_info}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </SoftBox>
        
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CreateOrder;
