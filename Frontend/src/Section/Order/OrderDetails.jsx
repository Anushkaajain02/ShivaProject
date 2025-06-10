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

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3301/GetOrderById/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        console.error("Error fetching Order:", err);
        alert("Failed to load Order details.");
      });
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {!Order ? (
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
                Order Details
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
                  onClick={() => navigate("/Order")}
                >
                  ⬅ Back
                </button>
              </SoftBox>
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Order No:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.order_no}</SoftTypography>
              </Grid>

              

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Order Date:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {new Date(Order.order_date).toLocaleDateString()}
                </SoftTypography>
              </Grid>

<Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Supplier Name:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.supplier_name}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Customer Name:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.customer_name}</SoftTypography>
              </Grid>

<Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Product Name:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.product_name}</SoftTypography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Consignee:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.consignee}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Place:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.place}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Quality Remark:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.quality_remark}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Order Quantity:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.order_qty}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Unit of Measurement:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.unit_of_measurement}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Rate:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.rate}</SoftTypography>
              </Grid>

              

              {/* <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Shipment Mode:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.shipment_mode}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  LR No:
                </SoftTypography>
                <SoftTypography variant="body2">{Order.lr_no}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  LR Date:
                </SoftTypography>
                <SoftTypography variant="body2">
                  {new Date(Order.lr_date).toLocaleDateString()}
                </SoftTypography>
              </Grid> */}

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Total Amount:
                </SoftTypography>
                <SoftTypography variant="body2">₹{Order.total_amount}</SoftTypography>
              </Grid>
            </Grid>
          </Card>
        )}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default OrderDetails;
