import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// MUI components
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import CustomerTableData from "./CustomerTableData";

function Customer() {
  const navigate = useNavigate();
  const [customerList, setcustomerList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3301/DeleteCustomer/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3301/GetCustomerDetails?page=1&limit=10"
      );
      const customers = response.data.data;
      setcustomerList(customers);
      setFilteredList(customers);
      setTableData(CustomerTableData(customers, navigate, handleDelete));
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = customerList.filter(
      (customer) =>
        customer.customer_name.toLowerCase().includes(term) ||
        customer.contact_info.toLowerCase().includes(term) ||
        customer.address.toLowerCase().includes(term) ||
        customer.gst_no.toLowerCase().includes(term) ||
        customer.credit_limit.toString().toLowerCase().includes(term) // in case it's a number
    );
    setFilteredList(filtered);
    setTableData(CustomerTableData(filtered, navigate, handleDelete));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Contact", "Address", "GST No", "PAN"];
    const tableRows = filteredList.map((c) => [
      c.customer_name,
      c.contact_info,
      c.address,
      c.gst_no,
    ]);

    doc.text("Customer List", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("customers.pdf");
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox
              px={3}
              pt={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <SoftTypography variant="h6">Customer Table</SoftTypography>

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
                onClick={() => navigate("/addcustomer")}
              >
                + Add Customer
              </button>

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
                onClick={() => {
                  const menu = document.getElementById("exportDropdown");
                  menu.style.display =
                    menu.style.display === "block" ? "none" : "block";
                }}
              >
                Export ▼
              </button>

              <div
                id="exportDropdown"
                style={{
                  display: "none",
                  position: "absolute",
                  right: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "6px",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={() => {
                    exportToExcel();
                    document.getElementById("exportDropdown").style.display =
                      "none";
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    exportToPDF();
                    document.getElementById("exportDropdown").style.display =
                      "none";
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  PDF
                </button>
              </div>
            </SoftBox>

            {/* Search + Export Bar */}
            {/* Search + Export Bar */}
            <SoftBox px={3} pt={2}>
              <SoftBox
                display="flex"
                // alignItems="center"
                // justifyContent="space-between"
                gap={50} // Controls space between elements
              >
                {/* Compact Search Bar */}
                <Input
                  placeholder="🔍 Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  sx={{
                    width: "140px",
                    fontSize: "0.8rem",
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    height: "36px",
                  }}
                />

                {/* Add & Export Buttons Grouped */}
              </SoftBox>
            </SoftBox>

            {/* Table */}
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={tableData.columns} rows={tableData.rows} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Customer;
