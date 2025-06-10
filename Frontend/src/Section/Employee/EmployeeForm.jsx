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

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employee_name: "",
    designation: "",
    contact: "",
    joining_date: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Fetch existing employee data if ID is present
  useEffect(() => {
    const fetchemployee = async () => {
      try {
        const API_BASE =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:3301";
        const response = await axios.get(`${API_BASE}/GetEmployeeById/${id}`);
        setFormData(response.data); // Assuming API returns a flat object
      } catch (error) {
        console.error("❌ Error fetching employee data:", error);
        alert("Failed to load employee data.");
      }
    };

    if (id) {
      fetchemployee();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "gst_no" || name === "pan_no" ? value.toUpperCase() : value;

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.employee_name.trim())
      newErrors.employee_name = "employee Name is required.";

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact Info is required.";
    } else if (!phoneRegex.test(formData.contact)) {
      newErrors.contact = "Enter a valid 10-digit phone number.";
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
        await axios.put(`${API_BASE}/UpdateEmployee/${id}`, formData);
        alert("✅ employee updated!");
        navigate("/employee");
      } else {
        await axios.post(`${API_BASE}/AddEmployee`, formData);
        alert("✅ employee added!");
        navigate("/employee");
      }
    } catch (err) {
      alert("❌ Failed to save employee data.");
      console.error("Error saving employee:", err);
    }

    console.log("Submitted employee Data:", formData);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 3, borderRadius: "xl", boxShadow: "lg" }}>
        <SoftBox mb={3}>
          <SoftTypography variant="h5" fontWeight="bold">
            employee Master Form
          </SoftTypography>
        </SoftBox>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { label: "Employee Name", name: "employee_name" },
              { label: "Designation", name: "designation" },
              { label: "Contact", name: "contact" },
              { label: "Joining Date", name: "joining_date" },
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

export default EmployeeForm;
