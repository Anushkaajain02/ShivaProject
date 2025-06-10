import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function SupplierView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const API_BASE =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3301";
    axios
      .get(`${API_BASE}/GetSupplierById/${id}`)
      .then((res) => setSupplier(res.data))
      .catch((err) => {
        console.error("Error fetching supplier:", err);
        alert("Failed to load supplier details.");
      });
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {!supplier ? (
          <SoftTypography variant="h6">Loading...</SoftTypography>
        ) : (
          <Card sx={{ borderRadius: "xl", p: 4, boxShadow: "lg" }}>
            <SoftBox
              mb={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <SoftTypography variant="h4" fontWeight="bold" color="info">
                Supplier Details
              </SoftTypography>

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
                  onClick={() => navigate("/supplier")}
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
                <SoftTypography variant="body2">
                  {supplier.supplier_name}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Contact Info:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.contact_info}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Address:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.address}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Bank Name:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.bank_name}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Account Number:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.account_number}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  IFSC Code:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.ifsc_code}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Branch:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.branch}
                </SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  GST No:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {supplier.gst_no}
                </SoftTypography>
              </Grid>
            </Grid>
          </Card>
        )}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SupplierView;
