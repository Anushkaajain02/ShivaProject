import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const Invoice = () => {
  const { order_no } = useParams();
  const navigate = useNavigate();
  const [billNo, setBillNo] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedInvoiceNo, setGeneratedInvoiceNo] = useState("");
  const [error, setError] = useState(null);
  const totalPaidSoFarRef = useRef(0);
  const [remaining, setRemaining] = useState(0);
  const [totalpaid, setTotalPaid] = useState(0);
  const [supplierslist, setSuppliersList] = useState([]);
  const [customerslist, setCustomersList] = useState([]);
  const [productslist, setProductsList] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  // New state for editable invoice fields
  const [editableInvoice, setEditableInvoice] = useState({
    customer_id: "",
    supplier_id: "",
    product_id: "",
    customer_name: "",
    customer_address: "",
    supplier_name: "",
    supplier_address: "",
    product_name: "",
    product_id: "",
    order_no: "",
    order_qty: "",
    rate: "",
    amount: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetCustomerDetails");
        setCustomersList(res.data.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetSupplierDetails");
        setSuppliersList(res.data.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:3301/GetProductDetails");
        setProductsList(res.data.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
    fetchCustomers();
    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const invoiceRes = await axios.get(
          `http://localhost:3301/GetInvoiceById/${order_no}`
        );
        const foundInvoice = invoiceRes.data.invoices[0];
        const bill_no = foundInvoice.bill_no;

        if (bill_no) {
          setBillNo(bill_no);
          const res = await axios.get(
            `http://localhost:3301/GetpaymentDetailsByBillNo/${bill_no}`
          );

          console.log("📥 API response:", res.data); // Log the full API response

          const payments = res.data.result || [];

          console.log("📄 Payments array:", payments); // Check if it's an empty array or not

          const totalPaidSoFar = payments.reduce((sum, payment) => {
            const amount = parseFloat(payment.amount_paid || 0);
            console.log("➡️ Adding payment.amount_paid:", amount);
            return sum + amount;
          }, 0);

          console.log("💰 Total paid so far:", totalPaidSoFar);

          totalPaidSoFarRef.current = totalPaidSoFar;

          const total = parseFloat(foundInvoice.amount) || 0;
          console.log("🧾 Invoice total amount:", total);

          const remainingAmount = (total - totalPaidSoFar).toFixed(2);
          console.log("🧮 Remaining amount:", remainingAmount);

          setRemaining(remainingAmount);
          setTotalPaid(totalPaidSoFar);
        }
      } catch (err) {
        console.log(err);
        console.error("Error fetching payments or invoice:", err);
      }
    };

    if (order_no) {
      fetchPaymentDetails();
    }
  }, [order_no]);

  useEffect(() => {
    const fetchInvoiceByOrderNo = async () => {
      try {
        setLoading(true);
        const invoiceRes = await axios.get(
          `http://localhost:3301/GetInvoiceById/${order_no}`
        );
        const foundInvoice = invoiceRes.data.invoices[0];

        if (foundInvoice) {
          setInvoice(foundInvoice);
          setGeneratedInvoiceNo(foundInvoice.bill_no);
        } else {
          setInvoice(null);
          setError("No invoice found for this order number.");
        }
      } catch (err) {
        console.log(err);
        console.error("Error fetching invoice:", err);
        setError("Something went wrong while fetching the invoice.");
      } finally {
        setLoading(false);
      }
    };

    if (order_no) {
      fetchInvoiceByOrderNo();
    }
  }, [order_no]);

  const handleEditClick = () => {
    if (invoice) {
      setEditableInvoice({
        customer_name: invoice.customer_name || "",
        customer_address: invoice.customer_address || "",
        customer_id: invoice.customer_id || "",
        supplier_name: invoice.supplier_name || "",
        supplier_address: invoice.supplier_address || "",
        supplier_id: invoice.supplier_id || "",
        product_id: invoice.product_id || "",

        product_name: invoice.product_name || "",

        order_no: invoice.order_no || "",
        order_qty: invoice.order_qty || "",
        rate: invoice.rate || "",
        amount: invoice.amount || "",
      });
      setIsEditing(true);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "customer_name") {
      const selectedCustomer = customerslist.find(
        (customer) => customer.customer_name === value
      );
      const id = selectedCustomer ? selectedCustomer.customer_id : "";
      const address = selectedCustomer ? selectedCustomer.address : "";

      setEditableInvoice((prev) => ({
        ...prev,
        customer_name: value,
        customer_address: address,
        customer_id: id,
      }));
    } else if (field === "supplier_name") {
      const selectedSupplier = supplierslist.find(
        (supplier) => supplier.supplier_name === value
      );
      const address = selectedSupplier ? selectedSupplier.address : "";
      const id = selectedSupplier ? selectedSupplier.supplier_id : "";

      setEditableInvoice((prev) => ({
        ...prev,
        supplier_name: value,
        supplier_address: address,
        supplier_id: id,
      }));
    } else if (field === "product_name") {
      const selectedProduct = productslist.find(
        (product) => product.product_name === value
      );

      const rate = selectedProduct ? selectedProduct.price : "";
      const id = selectedProduct ? selectedProduct.product_id : "";

      setEditableInvoice((prev) => ({
        ...prev,
        product_name: value,
        rate: rate,
        product_id: id,
      }));
    } else if (field === "order_qty" || field === "rate") {
      setEditableInvoice((prev) => {
        const updated = {
          ...prev,
          [field]: value,
        };

        const qty =
          parseFloat(field === "order_qty" ? value : updated.order_qty) || 0;
        const rate = parseFloat(field === "rate" ? value : updated.rate) || 0;

        updated.amount = (qty * rate).toFixed(2);
        return updated;
      });
    } else {
      setEditableInvoice((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  //save button

  const handleSaveClick = async () => {
    console.log(editableInvoice);
    try {
      const response = await axios.put(
        `http://localhost:3301/UpdateInvoice/${invoice.bill_no}`,
        editableInvoice
      );

      if (response.status === 200) {
        alert("invoice updated");
        // setInvoice(editableInvoice); // Update local invoice
        setIsEditing(false);
        // alert("Invoice updated successfully!");
      } else {
        alert("Failed to update invoice.");
      }
    } catch (error) {
      console.log(error);
      console.error("Error updating invoice:", error);
      alert("An error occurred while saving.");
    }
  };

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loading}>Loading invoice...</p>
      </div>
    );
  if (error)
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  if (!invoice)
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.error}>No invoice found for this order.</p>
      </div>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.invoiceSheet}>
            <div style={styles.invoiceHeader}>
              <div style={styles.logoSection}>
                <h1 style={styles.companyName}>COMPANY NAME</h1>
                <p style={styles.companyInfo}>
                  123 Business Street, City, Country
                </p>
                <p style={styles.companyInfo}>
                  Tel: (123) 456-7890 | Email: info@company.com
                </p>
              </div>
              <div style={styles.invoiceTitle}>
                <h2 style={styles.invoiceText}>INVOICE</h2>
                <div style={styles.invoiceNumber}>
                  <div style={styles.invoiceNumberBox}>
                    <span style={styles.invoiceNumberLabel}>INVOICE No.</span>
                    <span style={styles.invoiceNumberValue}>
                      {invoice.bill_no}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.invoiceDetails}>
              <div style={styles.invoiceDetailSection}>
                <h3 style={styles.sectionTitle}>Invoice Details</h3>

                <div
                  style={{ display: "flex", gap: "40px", alignItems: "center" }}
                >
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Invoice Date:</span>

                    <span style={styles.detailValue}>{invoice.bill_date}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Order Number:</span>
                    <span style={styles.detailValue}>#{invoice.order_no}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.invoiceDetails}>
              <div style={styles.invoiceDetailSection}>
                <h3 style={styles.sectionTitle}>Customer Details</h3>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Name:</span>

                  {isEditing ? (
                    <select
                      style={inputStyle}
                      value={editableInvoice.customer_name || ""}
                      onChange={(e) =>
                        handleInputChange("customer_name", e.target.value)
                      }
                    >
                      <option value="">Select customer</option>
                      {customerslist.map((customer) => (
                        <option
                          key={customer.customer_name}
                          value={customer.customer_name}
                        >
                          {customer.customer_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={styles.detailValue}>
                      {editableInvoice.customer_name || invoice.customer_name}
                    </span>
                  )}
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Address:</span>
                  {isEditing ? (
                    <input
                      style={inputStyle}
                      type="text"
                      value={editableInvoice.customer_address}
                      onChange={(e) =>
                        handleInputChange("customer_address", e.target.value)
                      }
                      readOnly
                    />
                  ) : (
                    <span style={styles.detailValue}>
                      {editableInvoice.customer_address ||
                        invoice.customer_address}
                    </span>
                  )}
                </div>
              </div>

              <div style={styles.invoiceDetailSection}>
                <h3 style={styles.sectionTitle}>Supplier Details</h3>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Name:</span>
                  {isEditing ? (
                    <select
                      style={inputStyle}
                      value={
                        editableInvoice.supplier_name || invoice.supplier_name
                      }
                      onChange={(e) =>
                        handleInputChange("supplier_name", e.target.value)
                      }
                    >
                      <option value="">Select Supplier</option>
                      {supplierslist.map((supplier) => (
                        <option
                          key={supplier.supplier_name}
                          value={supplier.supplier_name}
                        >
                          {supplier.supplier_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={styles.detailValue}>
                      {editableInvoice.supplier_name || invoice.supplier_name}
                    </span>
                  )}
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Address:</span>
                  {isEditing ? (
                    <input
                      style={inputStyle}
                      type="text"
                      value={editableInvoice.supplier_address}
                      onChange={(e) =>
                        handleInputChange("supplier_address", e.target.value)
                      }
                      readOnly
                    />
                  ) : (
                    <span style={styles.detailValue}>
                      {editableInvoice.supplier_address ||
                        invoice.supplier_address}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <h3 style={{ ...styles.sectionTitle, marginLeft: "17px" }}>
              Items Details
            </h3>
            <div style={styles.invoiceTable}>
              <div style={styles.tableHeader}>
                <div style={styles.tableHeaderItem}>Description</div>
                <div style={styles.tableHeaderItem}>Quantity</div>
                <div style={styles.tableHeaderItem}>Rate</div>
                <div style={styles.tableHeaderItem}>Amount</div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableItem}>
                  {isEditing ? (
                    <select
                      style={inputStyle}
                      value={editableInvoice.product_name || ""}
                      onChange={(e) =>
                        handleInputChange("product_name", e.target.value)
                      }
                    >
                      <option value="">Select product</option>
                      {productslist.map((product) => (
                        <option
                          key={product.product_name}
                          value={product.product_name}
                        >
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>
                      {editableInvoice.product_name || invoice.product_name}
                    </span>
                  )}
                </div>
                <div style={styles.tableItem}>
                  {isEditing ? (
                    <input
                      type="number"
                      style={inputStyle}
                      value={editableInvoice.order_qty || ""}
                      onChange={(e) =>
                        handleInputChange("order_qty", e.target.value)
                      }
                      min="0"
                    />
                  ) : (
                    invoice.order_qty
                  )}
                </div>

                <div style={styles.tableItem}>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      style={inputStyle}
                      value={editableInvoice.rate || ""}
                      onChange={(e) =>
                        handleInputChange("rate", e.target.value)
                      }
                      readOnly
                      min="0"
                    />
                  ) : (
                    parseFloat(invoice.rate).toFixed(2)
                  )}
                </div>

                <div style={styles.tableItem}>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      style={inputStyle}
                      value={editableInvoice.amount || ""}
                      readOnly
                    />
                  ) : (
                    parseFloat(invoice.amount).toFixed(2)
                  )}
                </div>
              </div>
            </div>

            <div style={styles.invoiceSummary}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal:</span>
                <span style={styles.summaryValue}>
                  {parseFloat(invoice.amount).toFixed(2)}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Amount Paid:</span>
                <span style={styles.summaryValue}>
                  {parseFloat(totalpaid).toFixed(2)}
                </span>
              </div>
              <div style={styles.summaryTotal}>
                <span style={styles.totalLabel}>Total Amount Due:</span>
                <span style={styles.totalValue}>
                  {parseFloat(remaining).toFixed(2)}
                </span>
              </div>
              <div style={styles.buttonGroup}>
                {isEditing ? (
                  <button style={styles.backButton} onClick={handleSaveClick}>
                    Save
                  </button>
                ) : (
                  <button
                    style={{ ...styles.backButton, marginTop: "6px" }}
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div style={styles.invoiceFooter}>
              <p style={styles.footerText}>Thank you for your business!</p>
              <p style={styles.footerTerms}>
                Payment is due within 30 days. Please make payment to the
                account specified in your contract.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.navigationButtonContainer}>
          <button onClick={() => navigate("/order")} style={styles.backButton}>
            Back to Orders
          </button>
          <button style={styles.printButton} onClick={() => window.print()}>
            Print Invoice
          </button>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "20px",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  invoiceSheet: {
    background: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  invoiceHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "2px solid #eee",
    paddingBottom: "20px",
    marginBottom: "30px",
  },
  logoSection: {
    flex: "1",
  },
  companyName: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    color: "#333",
    fontWeight: "700",
  },
  companyInfo: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    color: "#666",
  },
  invoiceTitle: {
    textAlign: "right",
    flex: "1",
  },
  invoiceText: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2c3e50",
    margin: "0 0 15px 0",
  },
  invoiceNumber: {
    display: "flex",
    justifyContent: "flex-end",
  },
  invoiceNumberBox: {
    border: "1px solid #ddd",
    padding: "10px 15px",
    borderRadius: "4px",
    display: "inline-block",
  },
  invoiceNumberLabel: {
    display: "block",
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px",
  },
  invoiceNumberValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  invoiceDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  invoiceDetailSection: {
    flex: "1",
    padding: "0 15px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "15px",
    paddingBottom: "5px",
    borderBottom: "1px solid #eee",
  },
  detailItem: {
    marginBottom: "10px",
  },
  detailLabel: {
    display: "inline-block",
    width: "130px",
    fontSize: "14px",
    color: "#666",
  },
  detailValue: {
    fontSize: "14px",
    color: "#333",
  },
  invoiceTable: {
    borderTop: "2px solid #ddd",
    borderBottom: "2px solid #ddd",
    marginBottom: "30px",
  },
  tableHeader: {
    display: "flex",
    background: "#f8f8f8",
    padding: "10px 15px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#2c3e50",
  },
  tableHeaderItem: {
    flex: "1",
    textAlign: "left",
    paddingRight: "5px",
  },
  tableRow: {
    display: "flex",
    padding: "10px 15px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    color: "#333",
  },
  tableItem: {
    flex: "1",
    textAlign: "left",
  },
  invoiceSummary: {
    textAlign: "right",
    marginBottom: "30px",
  },
  summaryRow: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  summaryLabel: {
    marginRight: "10px",
    fontWeight: "600",
  },
  summaryValue: {
    minWidth: "80px",
    display: "inline-block",
  },
  summaryTotal: {
    fontSize: "18px",
    fontWeight: "700",
    marginTop: "15px",
  },
  totalLabel: {
    marginRight: "10px",
  },
  totalValue: {
    minWidth: "80px",
    display: "inline-block",
  },
  paymentButtonContainer: {
    marginTop: "20px",
  },
  paymentButton: {
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px 25px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  invoiceFooter: {
    textAlign: "center",
    borderTop: "2px solid #eee",
    paddingTop: "20px",
    fontSize: "12px",
    color: "#999",
  },
  footerText: {
    marginBottom: "5px",
  },
  footerTerms: {
    fontStyle: "italic",
  },
  navigationButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "800px",
    margin: "0 auto",
  },
  backButton: {
    backgroundColor: "#3498db",
    border: "none",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  printButton: {
    backgroundColor: "#95a5a6",
    border: "none",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  loading: {
    fontSize: "18px",
    color: "#666",
  },
  error: {
    fontSize: "18px",
    color: "red",
  },
};
const inputStyle = {
  width: "100%",
  padding: "4px 6px",
  fontSize: "14px",
  boxSizing: "border-box",
  borderRadius: "3px",
  border: "1px solid #ccc",
};

export default Invoice;
