import React, { useState, useEffect } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    supplier_name: "",
    contact_info: "",
    address: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch: "",
    gst_no: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const API_BASE =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:3301";
        const response = await axios.get(`${API_BASE}/GetSupplierById/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.log(err);
        console.error("❌ Error fetching supplier data:", error);
        alert("Failed to load supplier data.");
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "gst_no" ? value.toUpperCase() : value;

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

    if (!formData.supplier_name.trim())
      newErrors.supplier_name = "Supplier Name is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

    if (!formData.contact_info.trim()) {
      newErrors.contact_info = "Contact Info is required.";
    } else if (!phoneRegex.test(formData.contact_info)) {
      newErrors.contact_info = "Enter a valid 10-digit phone number.";
    }

    if (!formData.gst_no.trim()) {
      newErrors.gst_no = "GST No. is required.";
    } else if (!gstRegex.test(formData.gst_no)) {
      newErrors.gst_no = "Enter a valid GST number.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const API_BASE =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3301";

    try {
      if (id) {
        await axios.put(`${API_BASE}/UpdateSupplier/${id}`, formData);
        alert("✅ Supplier updated!");
        navigate("/supplier");
      } else {
        await axios.post(`${API_BASE}/AddSupplier`, formData);
        alert("✅ Supplier added!");
        navigate("/supplier");
      }
    } catch (err) {
      alert("❌ Failed to save supplier data.");
      console.error("Error saving supplier:", err);
    }

    console.log("Submitted Supplier Data:", formData);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 3, borderRadius: "xl", boxShadow: "lg" }}>
        <SoftBox mb={3}>
          <SoftTypography variant="h5" fontWeight="bold">
            Supplier Master Form
          </SoftTypography>
        </SoftBox>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { label: "Supplier Name", name: "supplier_name" },
              { label: "Contact Info", name: "contact_info" },
              { label: "Address", name: "address" },
              { label: "Bank Name", name: "bank_name" },
              { label: "Account Number", name: "account_number" },
              { label: "IFSC Code", name: "ifsc_code" },
              { label: "Branch", name: "branch" },
              { label: "GST No.", name: "gst_no" },
            ].map(({ label, name }) => (
              <Grid item xs={12} sm={6} key={name}>
                <SoftBox mb={1}>
                  <SoftTypography variant="caption" fontWeight="bold">
                    {label}
                  </SoftTypography>
                  <SoftInput
                    name={name}
                    placeholder={`Enter ${label}`}
                    value={formData[name]}
                    onChange={handleChange}
                    error={Boolean(errors[name])}
                  />
                  {errors[name] && (
                    <SoftTypography variant="caption" color="error">
                      {errors[name]}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>
            ))}

            <Grid item xs={12}>
              <SoftButton
                type="submit"
                color="info"
                variant="gradient"
                fullWidth
              >
                {id ? "Update" : "Submit"}
              </SoftButton>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};

export default SupplierForm;
