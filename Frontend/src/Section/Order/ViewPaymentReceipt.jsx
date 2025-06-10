import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPaymentReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3301/GetpaymentDetailsById/${id}`
        );
        if (res.data.result && res.data.result.length > 0) {
          setPayment(res.data.result[0]);
        } else {
          setError("No payment record found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching payment receipt.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (error) return <div style={styles.center}>{error}</div>;
  if (!payment) return <div style={styles.center}>No data available.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>PAYMENT RECEIPT</h2>
        <div style={styles.row}>
          <span style={styles.label}>Bill No:</span>
          <span>{payment.bill_no}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Payment Date:</span>
          <span>{payment.payment_date}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Payment Mode:</span>
          <span>{payment.payment_mode}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Amount Paid:</span>
          <span>₹{parseFloat(payment.amount_paid).toFixed(2)}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Remaining Amount:</span>
          <span>₹{parseFloat(payment.remaining_amount).toFixed(2)}</span>
        </div>
        <div style={styles.footer}>
          <p>Thank you for your payment!</p>
        </div>
        <div style={styles.actions}>
          <button onClick={() => window.print()} style={styles.print}>
            Print
          </button>
          <button onClick={() => navigate("/order")} style={styles.back}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  row: {
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    color: "#333",
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    color: "#888",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
  },
  print: {
    padding: "10px 20px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  back: {
    padding: "10px 20px",
    background: "#95a5a6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },
};

export default ViewPaymentReceipt;
