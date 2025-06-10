import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useParams } from "react-router-dom";

function OrderSummary() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3301/GetOrderById/${id}`
        );
        const data = response.data;

        const transformed = {
          orderNo: data.order_no,
          date: data.order_date,
          place: data.place,
          transport: data.transport || "-",
          bale: data.bale || "-",
          customer: {
            name: data.customer_name,
            address: data.customer_address,
            gstin: data.customer_gstno || "-",
          },
          supplier: {
            name: data.supplier_name,
            address: data.supplier_address,
            gstin: data.supplier_gstno || "-",
          },
          goods: [
            {
              description: data.product_name,
              quantity: data.order_qty,
              per: data.unit_of_measurement,
              rate: parseFloat(data.rate),
            },
          ],
        };

        setOrder(transformed);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, []);

  if (!order) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox p={3}>
          <SoftTypography variant="h6">Loading...</SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.invoiceSheet}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <SoftTypography variant="h5" fontWeight="bold" color="dark">
                SHIVA AGENCIES
              </SoftTypography>
              <SoftTypography fontSize="12px">
                P.N. 875 SHIV NAGAR MURALIPUR ROAD, JAIPUR, 302039
              </SoftTypography>
              <SoftTypography fontSize="12px">
                H.O. - P.N. 13 ROAD NO 17, HOJIWALA INDUSTRIAL ESTATE, SURAT,
                394280
              </SoftTypography>
            </div>

            <Divider style={{ margin: "12px 0" }} />
            <SoftTypography
              variant="h6"
              color="info"
              fontWeight="bold"
              textAlign="center"
              mb={1}
            >
              ORDER FORM
            </SoftTypography>

            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid item xs={12} md={6}>
                <SoftBox p={2} border="1px solid #ccc" borderRadius="md" mb={2}>
                  <SoftTypography fontWeight="bold" fontSize="13px">
                    Customer Name:
                  </SoftTypography>
                  <SoftTypography fontSize="12px" mb={0.5}>
                    {order.customer.name}
                  </SoftTypography>

                  <SoftTypography fontWeight="bold" fontSize="13px">
                    Address:
                  </SoftTypography>
                  <SoftTypography fontSize="12px" mb={0.5}>
                    {order.customer.address}
                  </SoftTypography>

                  <SoftTypography fontWeight="bold" fontSize="13px">
                    GSTIN/UIN:
                  </SoftTypography>
                  <SoftTypography fontSize="12px">
                    {order.customer.gstin}
                  </SoftTypography>
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftBox p={2} border="1px solid #ccc" borderRadius="md" mb={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <SoftTypography fontWeight="bold" fontSize="13px">
                        Order No:
                      </SoftTypography>
                      <SoftTypography fontSize="12px" mb={0.5}>
                        {order.orderNo}
                      </SoftTypography>

                      <SoftTypography fontWeight="bold" fontSize="13px">
                        Place:
                      </SoftTypography>
                      <SoftTypography fontSize="12px" mb={0.5}>
                        {order.place}
                      </SoftTypography>

                      <SoftTypography fontWeight="bold" fontSize="13px">
                        Bale:
                      </SoftTypography>
                      <SoftTypography fontSize="12px">1</SoftTypography>
                    </Grid>

                    <Grid item xs={6}>
                      <SoftTypography fontWeight="bold" fontSize="13px">
                        Date:
                      </SoftTypography>
                      <SoftTypography fontSize="12px" mb={0.5}>
                        {order.date}
                      </SoftTypography>

                      <SoftTypography fontWeight="bold" fontSize="13px">
                        Transport:
                      </SoftTypography>
                      <SoftTypography fontSize="12px" mb={0.5}>
                        DRTC
                      </SoftTypography>
                    </Grid>
                  </Grid>
                </SoftBox>
              </Grid>
            </Grid>

            <Divider style={{ margin: "20px 0" }} />

            <SoftBox p={2} border="1px solid #ccc" borderRadius="md" mb={2}>
              <SoftTypography fontWeight="bold" fontSize="13px">
                Supplier Name:
              </SoftTypography>
              <SoftTypography fontSize="12px" mb={0.5}>
                {order.supplier.name}
              </SoftTypography>

              <SoftTypography fontWeight="bold" fontSize="13px">
                Address:
              </SoftTypography>
              <SoftTypography fontSize="12px" mb={0.5}>
                {order.supplier.address}
              </SoftTypography>

              <SoftTypography fontWeight="bold" fontSize="13px">
                GSTIN/UIN:
              </SoftTypography>
              <SoftTypography fontSize="12px">
                {order.supplier.gstin}
              </SoftTypography>
            </SoftBox>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Description of Goods</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>PER</th>
                  <th style={thStyle}>Rate</th>
                </tr>
              </thead>
              <tbody>
                {order.goods.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{item.description}</td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={tdStyle}>{item.per}</td>
                    <td style={tdStyle}>{item.rate.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Total Amount:
                  </td>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    ₹
                    {(
                      order.goods[0].rate * parseFloat(order.goods[0].quantity)
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: "right", marginTop: "30px" }}>
              <SoftButton variant="gradient" color="info" size="small">
                Export as PDF
              </SoftButton>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#eaeef3",
    padding: "20px",
  },
  container: {
    maxWidth: "850px",
    margin: "0 auto",
  },
  invoiceSheet: {
    background: "#fff",
    padding: "36px",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #dcdcdc",
  },
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  fontSize: "12px",
};

const thStyle = {
  border: "1px solid #b0b0b0",
  padding: "8px",
  backgroundColor: "#f7f9fc",
  fontWeight: "bold",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};

export default OrderSummary;
