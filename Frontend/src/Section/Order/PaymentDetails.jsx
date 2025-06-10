import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const PaymentDetails = () => {
  const { order_no } = useParams();
  const [billNo, setBillNo] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillAndPayments = async () => {
      try {
        const invoiceRes = await axios.get(
          `http://localhost:3301/GetInvoiceById/${order_no}`
        );
        const foundInvoice = invoiceRes.data.invoices[0];
        const bill_no = foundInvoice.bill_no;

        if (!bill_no) {
          throw new Error("No bill number found for the provided order.");
        }
        setBillNo(bill_no);
        const paymentRes = await axios.get(
          `http://localhost:3301/GetpaymentDetailsByBillNo/${bill_no}`
        );
        setPayments(paymentRes.data?.result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (order_no) {
      fetchBillAndPayments();
    }
  }, [order_no]);

  if (loading) return <p>Loading payments...</p>;

  if (!billNo) {
    return <p>No invoice found for Order No: {order_no}</p>;
  }

  if (payments.length === 0) {
    return <p>No payments found for Invoice: {billNo}</p>;
  }

  const handleViewReceipt = (paymentId) => {
    const id = paymentId;
    navigate(`/viewpaymentreceipt/${id}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          padding: 20,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#2c3e50" }}>
          Payments for Invoice: <span>{billNo}</span>
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 700,
              fontSize: 14,
            }}
            aria-label="Payment details table"
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#34495e",
                  color: "#fff",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <th style={{ padding: "12px 15px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Mode
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Date
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Amount Paid
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Status
                </th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>
                  Remarks
                </th>
                <th style={{ padding: "12px 15px", textAlign: "center" }}>
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr
                  key={p.payment_id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    borderBottom: "1px solid #ddd",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e8f0fe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#f9f9f9" : "#fff")
                  }
                >
                  <td style={{ padding: "10px 15px" }}>{p.payment_id}</td>
                  <td style={{ padding: "10px 15px" }}>
                    {p.payment_mode || "-"}
                  </td>
                  <td style={{ padding: "10px 15px" }}>
                    {new Date(p.payment_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px 15px" }}>₹{p.amount_paid}</td>
                  <td style={{ padding: "10px 15px" }}>{p.status || "-"}</td>
                  <td style={{ padding: "10px 15px" }}>{p.remarks || "-"}</td>
                  <td style={{ padding: "10px 15px", textAlign: "center" }}>
                    <button
                      onClick={() => handleViewReceipt(p.payment_id)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#2980b9",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1f6391")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2980b9")
                      }
                      aria-label={`View receipt for payment ID ${p.payment_id}`}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default PaymentDetails;
