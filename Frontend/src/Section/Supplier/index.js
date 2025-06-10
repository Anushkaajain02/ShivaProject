import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// MUI components
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import SupplierTableData from "./SupplierTableData";

function Supplier() {
  const navigate = useNavigate();
  const [supplierList, setSupplierList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:3301/DeleteSupplier/${id}`);
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3301/GetSupplierDetails?page=1&limit=10"
      );
      const suppliers = response.data.data;
      setSupplierList(suppliers);
      setFilteredList(suppliers);
      setTableData(SupplierTableData(suppliers, navigate, handleDelete));
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = supplierList.filter(
      (supplier) =>
        supplier.supplier_name.toLowerCase().includes(term) ||
        supplier.contact_info.toLowerCase().includes(term)
    );
    setFilteredList(filtered);
    setTableData(SupplierTableData(filtered, navigate, handleDelete));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "suppliers");
    XLSX.writeFile(wb, "suppliers.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Contact", "Address", "Bank", "GST No"];
    const tableRows = filteredList.map((s) => [
      s.supplier_name,
      s.contact_info,
      s.address,
      s.bank_name,
      s.gst_no,
    ]);

    doc.text("Supplier List", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("suppliers.pdf");
  };

  useEffect(() => {
    fetchSuppliers();
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
              <SoftTypography variant="h6">Supplier Table</SoftTypography>

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
                onClick={() => navigate("/addsupplier")}
              >
                + Add Supplier
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
                  right: 20,
                  top: 60,
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

            <SoftBox px={3} pt={2}>
              <SoftBox display="flex" gap={50}>
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
              </SoftBox>
            </SoftBox>

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

export default Supplier;
