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

const ProductForm = () => {
  const [formData, setFormData] = useState({
    product_code: "",
    product_name: "",
    unit: "",
    category: "",
    price: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Fetch existing product data if ID is present
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_BASE =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:3301";
        const response = await axios.get(`${API_BASE}/GetProductById/${id}`);
        setFormData(response.data); // Assuming API returns a flat object
      } catch (error) {
        console.error("❌ Error fetching product data:", error);
        alert("Failed to load product data.");
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.product_code.trim())
      newErrors.product_code = "Product code is required.";

    if (!formData.product_name.trim())
      newErrors.product_name = "Product name is required.";

    if (!formData.unit.trim()) newErrors.unit = "Unit is required.";

    if (!formData.category.trim()) newErrors.category = "Category is required.";

    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
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
        await axios.put(`${API_BASE}/UpdateProduct/${id}`, formData);
        alert("✅ Product updated!");
        navigate("/product");
      } else {
        await axios.post(`${API_BASE}/AddProduct`, formData);
        alert("✅ Product added!");
        navigate("/product");
      }
    } catch (err) {
      alert("❌ Failed to save product data.");
      console.error("Error saving product:", err);
    }

    console.log("Submitted product Data:", formData);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 3, borderRadius: "xl", boxShadow: "lg" }}>
        <SoftBox mb={3}>
          <SoftTypography variant="h5" fontWeight="bold">
            Product Master Form
          </SoftTypography>
        </SoftBox>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { label: "Product Code", name: "product_code" },
              { label: "Product Name", name: "product_name" },
              { label: "Unit", name: "unit" },
              { label: "Category", name: "category" },
              { label: "Price", name: "price" },
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

export default ProductForm;
