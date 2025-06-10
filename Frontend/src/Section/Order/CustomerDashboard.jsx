import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function CustomerDashboard() {
    const navigate = useNavigate();
     const [customer, setCustomers] = useState([]);
    const { id } = useParams();


    useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const res = await axios.get(`http://localhost:3301/GetCustomerById/${id}`);
        setCustomers(res.data || null);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    };

    if (id) {
      fetchCustomerById();
    }
  }, [id]);
  
  const statCards = [
    {
      icon: "hourglass_empty",
      label: "Pending",
      value: "18",
      color: "warning",
    },
    {
      icon: "currency_rupee",
      label: "Outstanding Balance",
      value: "₹14,462.90",
      color: "error",
    },
    {
      icon: "account_balance_wallet",
      label: "Package Details",
      value: "15000",
      color: "success",
    },
    {
      icon: "calendar_today",
      label: "Last Order Date",
      value: "02 Jun 2025",
      color: "info",
    },
  ];

  return (
      <DashboardLayout>
        <DashboardNavbar />
    <SoftBox p={3}>
      {/* Header */}
      <SoftBox
        py={2}
        px={3}
        mb={4}
        borderRadius="lg"
        bgColor="info"
        color="white"
      >
        <SoftTypography variant="h5" fontWeight="bold">
          Customer Dashboard
        </SoftTypography>
      </SoftBox>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 4, height: "100%" }}>
            <SoftBox display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
              <SoftTypography variant="h6" fontWeight="bold" gutterBottom>
                {customer.customer_name}
              </SoftTypography>

              <SoftBox display="flex" alignItems="center" mb={1}>
                <Icon fontSize="small" sx={{ mr: 1 }}>location_on</Icon>
                <SoftTypography variant="body2">{customer.address}</SoftTypography>
              </SoftBox>

              <SoftBox display="flex" alignItems="center" mb={1}>
                <Icon fontSize="small" sx={{ mr: 1 }}>phone</Icon>
                <SoftTypography variant="body2">{customer.contact_info}</SoftTypography>
              </SoftBox>

              {/* <SoftBox display="flex" alignItems="center" mb={1}>
                <Icon fontSize="small" sx={{ mr: 1 }}>email</Icon>
                <SoftTypography variant="body2">testing@gmail.com</SoftTypography>
              </SoftBox> */}

              <SoftBox mt={1} mb={2}>
                <Rating name="read-only" value={4} precision={0.5} readOnly />
              </SoftBox>

              <SoftButton 
                        onClick={() => navigate(`/editcustomer/${customer.customer_id}`)}

              color="info" size="small" sx={{ borderRadius: "lg" }}>
                Edit Details
              </SoftButton>
            </SoftBox>
          </Card>
        </Grid>

        {/* Stats and Buttons */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {statCards.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ p: 3, borderRadius: 4 }}>
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        backgroundColor: `${item.color}.main`,
                        color: "white",
                        mr: 2,
                      }}
                    >
                      <Icon>{item.icon}</Icon>
                    </SoftBox>
                    <SoftBox>
                      <SoftTypography variant="h6" fontWeight="bold">
                        {item.value}
                      </SoftTypography>
                      <SoftTypography variant="caption" color="text">
                        {item.label}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                </Card>
              </Grid> 
            ))}
          </Grid>

          {/* Buttons */}
          <SoftBox
            mt={4}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <SoftButton
              color="info"
              variant="gradient"
              startIcon={<Icon>add_circle</Icon>}
              fullWidth={true}
                          onClick={() => navigate(`/orderdash/${customer.customer_id}`)}

              sx={{ maxWidth: { xs: "100%", sm: "auto" } }}
            >
              Create New Order
            </SoftButton>
            {/* <SoftButton
              color="info"
              variant="gradient"
              startIcon={<Icon>add_circle</Icon>}
              fullWidth={true}
              sx={{ maxWidth: { xs: "100%", sm: "auto" } }}
            >
              Create New Order By Weight
            </SoftButton> */}
          </SoftBox>
        </Grid>
      </Grid>
    </SoftBox>
          <Footer />
        </DashboardLayout>
  );
}

export default CustomerDashboard;
