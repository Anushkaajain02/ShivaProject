import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setcustomer] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3301/GetCustomerById/${id}`)
      .then((res) => setcustomer(res.data))
      .catch((err) => {
        console.error("Error fetching customer:", err);
        alert("Failed to load customer details.");
      });
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {!customer ? (
          <SoftTypography variant="h6">Loading...</SoftTypography>
        ) : (
          <Card sx={{ borderRadius: "xl", p: 4, boxShadow: "lg" }}>
            <SoftBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <SoftTypography variant="h4" fontWeight="bold" color="info">
                Customer Details
              </SoftTypography>

              {/* <SoftButton variant="gradient" color="dark" onClick={() => navigate("/customer")}>
                ⬅ Back to customer List
              </SoftButton> */}

              <SoftBox>
                <button
                  style={{
                    backgroundColor: "#1e88e5",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate("/customer")}
                >
                  ⬅ Back
                </button>
              </SoftBox>
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Name:
                </SoftTypography>
                <SoftTypography variant="body2">{customer.customer_name}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Contact:
                </SoftTypography>
                <SoftTypography variant="body2">{customer.contact_info}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Address:
                </SoftTypography>
                <SoftTypography variant="body2">{customer.address}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  GST No:
                </SoftTypography>
                <SoftTypography variant="body2">{customer.gst_no}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  credit_limit:
                </SoftTypography>
                <SoftTypography variant="body2">{customer.credit_limit}</SoftTypography>
              </Grid>
            </Grid>
          </Card>
        )}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CustomerView;
