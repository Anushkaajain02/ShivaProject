import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Grid, Divider, Icon } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";

function OrderView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [paymentData, setPaymentData] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3301/GetOrderById/${id}`).then((res) => {
        const order = res.data;
        setOrderData(order);

        axios
          .get(`http://localhost:3301/GetInvoiceById/${order.order_no}`)
          .then((invRes) => {
            const invoice = invRes.data?.invoices?.[0];
            setInvoiceData(invoice);

            if (invoice?.bill_no) {
              axios
                .get(
                  `http://localhost:3301/GetpaymentDetailsByBillNo/${invoice.bill_no}`
                )
                .then((payRes) => {
                  const payments = payRes.data?.result || [];
                  setPaymentData(payments);

                  const paidAmount = payments.reduce(
                    (sum, p) => sum + (parseFloat(p.amount_paid) || 0),
                    0
                  );
                  setTotalPaid(paidAmount);
                });
            }
          });
      });
    }
  }, [id]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        // Step 1: Get the order_no by ID
        const orderRes = await axios.get(
          `http://localhost:3301/GetOrderById/${id}`
        );
        const order_no = orderRes.data.order_no;
        console.log(order_no);

        await axios.delete(`http://localhost:3301/DeleteOrder/${id}`);

        // Step 2: Delete invoice(s) using order_no
        if (order_no) {
          await axios.delete(
            `http://localhost:3301/DeleteInvoiceByOrderNo/${order_no}`
          );
        }

        // Step 3: Delete the order

        navigate("/order");
      } catch (error) {
        console.log(error);
        console.error("Error deleting order and invoice:", error);
      }
    }
  };

  const remainingAmount =
    parseFloat(orderData.total_amount || 0) - parseFloat(totalPaid || 0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {/* Hero Banner */}
        <Card
          sx={{
            mb: 4,
            p: 4,
            background:
              "linear-gradient(90deg,rgb(112, 193, 204),rgb(147, 179, 233))",
            color: "#fff",
            borderRadius: "lg",
            height: "90px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <SoftTypography variant="h4" fontWeight="bold" color="white">
                Order #{orderData.order_no}
              </SoftTypography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent="flex-end"
              gap={2}
              mt={{ xs: 2, md: 0 }}
            >
              <SoftButton
                color="white"
                variant="outlined"
                size="small"
                onClick={() => navigate(`/editorder/${orderData.order_id}`)}
              >
                <Icon>edit</Icon>&nbsp;Edit
              </SoftButton>
              <SoftButton
                color="white"
                size="small"
                onClick={() => handleDelete(orderData.order_id)}
                variant="outlined"
              >
                <Icon>delete</Icon>&nbsp;Delete
              </SoftButton>
            </Grid>
          </Grid>
        </Card>

        {/* 3-Column Layout */}
        <Grid container spacing={3}>
          {/* Order Details */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <SoftTypography variant="h6" mb={2}>
                  📦 Order Details
                </SoftTypography>
                <Divider />
                <SoftBox mt={2}>
                  <SoftTypography variant="body2">
                    Order Date: {orderData.order_date}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Customer: {orderData.customer_name}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Supplier: {orderData.supplier_name}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Total: ₹{orderData.total_amount}
                  </SoftTypography>
                </SoftBox>
              </div>
              
                 <SoftBox mt={3} display="flex" justifyContent="space-between">
                <SoftButton
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() =>
                    navigate(`/orderdetails/${orderData.order_id}`)
                  }
                >
                  View
                </SoftButton>
                <SoftButton
                  size="small"
                  color="info"
                  variant="gradient"
                  onClick={() =>
                    navigate(`/ordersummary/${orderData.order_id}`)
                  }
                >
                  Order Summary
                </SoftButton>
              </SoftBox>
            </Card>
          </Grid>

          {/* Payment Details */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <SoftTypography variant="h6" mb={2}>
                  💳 Payment Details
                </SoftTypography>
                <Divider />
                <SoftBox mt={2}>
                  <SoftTypography variant="body2">
                    Total Amount: ₹{orderData.total_amount || "0.00"}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Amount Paid: ₹{totalPaid.toFixed(2)}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Due Amount: ₹{remainingAmount.toFixed(2)}
                  </SoftTypography>
                </SoftBox>
              </div>

              <SoftBox mt={3} display="flex" justifyContent="space-between">
                <SoftButton
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() =>
                    navigate(`/paymentdetails/${orderData.order_no}`)
                  }
                >
                  View
                </SoftButton>
                <SoftButton
                  size="small"
                  color="info"
                  variant="gradient"
                  onClick={() =>
                    navigate("/addpayment", {
                      state: {
                        bill_no: invoiceData.bill_no,
                        total_amount: invoiceData.amount,
                      },
                    })
                  }
                >
                  Make Payment
                </SoftButton>
              </SoftBox>
            </Card>
          </Grid>

          {/* Invoice Details */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <SoftTypography variant="h6" mb={2}>
                  🧾 Invoice Details
                </SoftTypography>
                <Divider />
                <SoftBox mt={2}>
                  <SoftTypography variant="body2">
                    Invoice No: {invoiceData.bill_no || "N/A"}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Date: {invoiceData.bill_date || "N/A"}
                  </SoftTypography>
                </SoftBox>
              </div>

              <SoftBox mt={3} display="flex" justifyContent="flex-end">
                <SoftButton
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() =>
                    navigate(`/orderinvoice/${orderData.order_no}`)
                  }
                >
                  View
                </SoftButton>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
        <SoftBox mt={4} display="flex" justifyContent="center">
  <SoftButton
    color="info"
    variant="gradient"
    onClick={() => navigate(`/addpartialdelivery/${orderData.order_id}`)}
  >
    <Icon>local_shipping</Icon>&nbsp;Add Partial Delivery
  </SoftButton>
</SoftBox>

      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default OrderView;
