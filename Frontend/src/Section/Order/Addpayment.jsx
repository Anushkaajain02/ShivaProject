import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const AddPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bill_no, total_amount } = location.state || {};

  // Ref to keep track of total amount paid previously
  const totalPaidSoFarRef = useRef(0);

  const [formData, setFormData] = useState({
    payment_mode: "",
    sent_amount: "",
    payment_date: "",
    remarks: "",
    bill_no: bill_no || "",
    discount: "",
    total_amount: total_amount || "",
    remaining_amount: "",
    amount_paid: "",
    status: "Paid",
  });

  // Fetch all payments for the bill_no and calculate sum of amount_paid
  useEffect(() => {
    if (bill_no) {
      axios
        .get(`http://localhost:3301/GetpaymentDetailsByBillNo/${bill_no}`)
        .then((res) => {
          const payments = res.data.result || [];
          const totalPaidSoFar = payments.reduce((sum, payment) => {
            return sum + parseFloat(payment.amount_paid || 0);
          }, 0);

          totalPaidSoFarRef.current = totalPaidSoFar;

          const total = parseFloat(total_amount) || 0;
          const remaining = (total - totalPaidSoFar).toFixed(2);

          setFormData((prev) => ({
            ...prev,
            amount_paid: "",
            remaining_amount: remaining,
          }));
        })
        .catch((err) => {
          console.error("Error fetching payments:", err);
        });
    }
  }, [bill_no, total_amount]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: value,
      };

      if (name === "amount_paid") {
        const total = parseFloat(updated.total_amount) || 0;
        const paidBefore = totalPaidSoFarRef.current || 0;
        const currentPaid = parseFloat(value) || 0;

        // Calculate remaining amount dynamically
        updated.remaining_amount = (total - paidBefore - currentPaid).toFixed(
          2
        );
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Add payment
      const result = await axios.post(
        "http://localhost:3301/AddPayment",
        formData
      );
      alert("✅ Payment Added");

      const id = result.data.paymentId;

      // Now fetch the full payment details using that ID
      //   const paymentDetails = await axios.get(http://localhost:3301/GetpaymentDetailsById/${id});
      // console.log(paymentDetails.data.result[0]);
      //   const { payment_date, remaining_amount, bill_no } = paymentDetails.data.result[0];

      // // Step 2: Prepare data without bill_no (since it's in the URL)
      // const updateInvoiceData = {
      //   updated_amount: remaining_amount,
      //   updated_date: payment_date,
      // };

      // // Step 3: Send bill_no in the URL
      // await axios.put(http://localhost:3301/UpdateInvoice/${bill_no}, updateInvoiceData);

      // Step 4: Navigate to receipt page and pass data
      navigate(`/viewpaymentreceipt/${id}`);
    } catch (err) {
      console.log(err);
      console.error("❌ Error:", err);
      alert("❌ Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.heading}>Add Payment</h2>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Bill No</label>
              <input
                type="text"
                name="bill_no"
                value={formData.bill_no}
                required
                style={styles.input}
                placeholder="Invoice Bill No"
                readOnly
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Mode</label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Mode</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Date</label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="Paid">Paid</option>
                <option value="Part Paid">Part Paid</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total Amount</label>
              <input
                type="number"
                name="total_amount"
                step="0.01"
                value={formData.total_amount}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Total Amount"
                readOnly
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount Paid</label>
              <input
                type="number"
                name="amount_paid"
                step="0.01"
                value={formData.amount_paid}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Amount Paid"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Remaining Amount</label>
              <input
                type="number"
                name="remaining_amount"
                step="0.01"
                value={formData.remaining_amount}
                style={styles.input}
                placeholder="Remaining Amount"
                readOnly
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Discount</label>
              <input
                type="number"
                name="discount"
                step="0.01"
                value={formData.discount}
                onChange={handleChange}
                style={styles.input}
                placeholder="Discount (if any)"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                style={styles.input}
                placeholder="Remarks (optional)"
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Submit Payment
          </button>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
  },
  form: {
    background: "#fff",
    padding: "32px 40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "700px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    color: "#222",
    fontWeight: "700",
  },
  row: {
    display: "flex",
    gap: "24px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  formGroup: {
    flex: "1 1 45%",
    display: "flex",
    flexDirection: "column",
  },
  formGroupFull: {
    flex: "1 1 100%",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1.8px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    marginTop: "30px",
    width: "100%",
    padding: "14px",
    backgroundColor: "#5a4fff",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.4)",
    transition: "background-color 0.3s ease",
  },
};

export default AddPayment;
