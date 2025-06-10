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

function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setemployee] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3301/GetEmployeeById/${id}`)
      .then((res) => setemployee(res.data))
      .catch((err) => {
        console.error("Error fetching employee:", err);
        alert("Failed to load employee details.");
      });
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {!employee ? (
          <SoftTypography variant="h6">Loading...</SoftTypography>
        ) : (
          <Card sx={{ borderRadius: "xl", p: 4, boxShadow: "lg" }}>
            <SoftBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <SoftTypography variant="h4" fontWeight="bold" color="info">
                Employee Details
              </SoftTypography>

              {/* <SoftButton variant="gradient" color="dark" onClick={() => navigate("/employee")}>
                ⬅ Back to employee List
              </SoftButton> */}

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
                  onClick={() => navigate("/employee")}
                >
                  ⬅ Back
                </button>
              </SoftBox>
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Name:
                </SoftTypography>
                <SoftTypography variant="body2">{employee.employee_name}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Designation:
                </SoftTypography>
                <SoftTypography variant="body2">{employee.designation}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Contact:
                </SoftTypography>
                <SoftTypography variant="body2">{employee.contact}</SoftTypography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography variant="h6" color="text" fontWeight="medium">
                  Joining Date:
                </SoftTypography>
                <SoftTypography variant="body2">{employee.joining_date}</SoftTypography>
              </Grid>
            </Grid>
          </Card>
        )}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EmployeeView;
