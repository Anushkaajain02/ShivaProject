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

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3301/GetProductById/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product:", err);
        alert("Failed to load product details.");
      });
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {!product ? (
          <SoftTypography variant="h6">Loading...</SoftTypography>
        ) : (
          <Card sx={{ borderRadius: "xl", p: 4, boxShadow: "lg" }}>
            <SoftBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <SoftTypography variant="h4" fontWeight="bold" color="info">
                Product Details
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
                  onClick={() => navigate("/product")}
                >
                  ⬅ Back
                </button>
              </SoftBox>
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Product Code:
                </SoftTypography>
                <SoftTypography variant="body2">{product.product_code}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Product Name:
                </SoftTypography>
                <SoftTypography variant="body2">{product.product_name}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Unit:
                </SoftTypography>
                <SoftTypography variant="body2">{product.unit}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Category:
                </SoftTypography>
                <SoftTypography variant="body2">{product.category}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Price:
                </SoftTypography>
                <SoftTypography variant="body2">{product.price}</SoftTypography>
              </Grid>
            </Grid>
          </Card>
        )}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ProductView;
