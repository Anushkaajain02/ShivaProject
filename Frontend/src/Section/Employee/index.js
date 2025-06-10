import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import


import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TextField from "@mui/material/TextField";
import { InputBase } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import IconButton from "@mui/material/IconButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


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
import EmployeeTableData from "./EmployeeTableData";

function Employee() {
    const calendarAnchorRef = useRef(null);
  const navigate = useNavigate();
  const [employeeList, setemployeeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterBy, setFilterBy] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);


    const handleFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setFilterBy(typeof value === "string" ? value.split(",") : value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:3301/DeleteEmployee/${id}`);
        fetchemployes();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const fetchemployes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3301/GetEmployeeDetails?page=1&limit=10"
      );
      const employes = response.data.data;
      setemployeeList(employes);
      setFilteredList(employes);
      setTableData(EmployeeTableData(employes, navigate, handleDelete));
    } catch (error) {
      console.error("Error fetching employes:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = employeeList.filter(
      (employee) => {
    return(
        (filterBy.includes("Employee") &&
          employee.employee_name?.toLowerCase().includes(term)) ||
        (filterBy.includes("Contact") &&
          employee.contact_info?.toLowerCase().includes(term)) ||
        (filterBy.includes("Designation") &&
          employee.designation?.toLowerCase().includes(term)) ||
        (filterBy.includes("Joining Date") &&
          employee.joining_date?.toLowerCase().includes(term)) 
    );
  });

    setFilteredList(filtered);
    setTableData(EmployeeTableData(filtered, navigate, handleDelete));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "employes");
    XLSX.writeFile(wb, "employes.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Contact", "Address", "GST No", "PAN"];
    const tableRows = filteredList.map((c) => [
      c.employee_name,
      c.contact_info,
      c.address,
      c.gst_no,
      c.pan_no,
    ]);

    doc.text("Employee List", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("employees.pdf");
  };

  useEffect(() => {
    fetchemployes();
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
              <SoftTypography variant="h6">Employee Table</SoftTypography>

              <button
                style={buttonStyle}
                onClick={() => navigate("/addemployee")}
              >
                + Add employee
              </button>

              <button
                style={buttonStyle}
                onClick={() => {
                  const menu = document.getElementById("exportDropdown");
                  menu.style.display =
                    menu.style.display === "block" ? "none" : "block";
                }}
              >
                Export ▼
              </button>

              <div id="exportDropdown" style={dropdownStyle}>
                <button
                  onClick={() => {
                    exportToExcel();
                    hideDropdown();
                  }}
                  style={dropdownItemStyle}
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    exportToPDF();
                    hideDropdown();
                  }}
                  style={dropdownItemStyle}
                >
                  PDF
                </button>
              </div>
            </SoftBox>

           {/* Search Input */}
            <SoftBox px={3} pt={2}>
              <SoftBox display="flex" alignItems="center" gap={5}>
                <SoftBox width="50%">
                  <InputBase
                    placeholder="🔍 Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{
                      width: "240px",
                      fontSize: "0.8rem",
                      padding: "6px 10px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      height: "36px",
                      marginBottom: "16px",
                      marginTop: "17px",
                    }}
                  />
                </SoftBox>

                {/* Calendar */}
                <SoftBox>
                  {selectedDate && (
                    <button
                      onClick={() => {
                        setSelectedDate(null);
                        setFilteredList(employeeList);
                        setTableData(
                          EmployeeTableData(employeeList, navigate, handleDelete)
                        );
                      }}
                      style={{
                        fontSize: "0.75rem",
                        border: "none",
                        background: "transparent",
                        color: "#1e88e5",
                        cursor: "pointer",
                      }}
                    >
                      Clear Filter
                    </button>
                  )}

                  <IconButton
                    ref={calendarAnchorRef}
                    onClick={() => setShowDatePicker(true)}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      height: "36px",
                      width: "36px",
                    }}
                  >
                    <CalendarTodayIcon />
                  </IconButton>
                </SoftBox>

                {/* FilterInput */}
                <SoftBox display="flex" alignItems="center" mt={2}>
                  <SoftTypography variant="button" fontWeight="medium" mr={1}>
                    Filter By:
                  </SoftTypography>
                  <FormControl
                    sx={{
                      minWidth: 200,
                      backgroundColor: "#f5f7fa",
                      borderRadius: 2,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    }}
                    size="small"
                  >
                    <Select
                      multiple
                      displayEmpty
                      value={filterBy}
                      onChange={handleFilterChange}
                      input={<OutlinedInput />}
                      renderValue={(selected) =>
                        selected.length === 0 ? (
                          <em>Select filters</em>
                        ) : (
                          selected.join(", ")
                        )
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            fontSize: "0.85rem",
                          },
                        },
                      }}
                      sx={{
                        py: 0.5,
                        px: 1,
                        fontSize: "0.85rem",
                        "& .MuiSelect-select": {
                          minHeight: "1.8rem",
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                    >
                      {[
                        { value: "Employee", label: "Employee" },
                        { value: "Designation", label: "Designation" },
                        { value: "contact_info", label: "contact_info" },
                        { value: "Joining Date", label: "Joining Date" },
                      ].map(({ value, label }) => (
                        <MenuItem
                          key={value}
                          value={value}
                          sx={{ fontSize: "0.85rem" }}
                        >
                          <Checkbox
                            checked={filterBy.includes(value)}
                            size="small"
                            sx={{ p: 0.5, mr: 1 }}
                          />
                          <ListItemText primary={label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </SoftBox>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newDate) => {
                      setSelectedDate(newDate);
                      setShowDatePicker(false);

                      const formatted = dayjs(newDate).format("YYYY-MM-DD");
                      const filtered = employeeList.filter(
                        (employee) => employee.joining_date === formatted
                      );

                      setFilteredList(filtered);
                      setTableData(
                        EmployeeTableData(filtered, navigate, handleDelete)
                      );
                    }}
                    open={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    PopperProps={{
                      anchorEl: calendarAnchorRef.current,
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 8],
                          },
                        },
                      ],
                      sx: {
                        "& .MuiPaper-root": {
                          minWidth: 280,
                          borderRadius: 3,
                          boxShadow:
                            "0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(0 0 0 / 40%)",
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{ display: "none" }}
                      />
                    )}
                  />
                </LocalizationProvider>
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

const buttonStyle = {
  backgroundColor: "#1e88e5",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const dropdownStyle = {
  display: "none",
  position: "absolute",
  right: 0,
  backgroundColor: "#fff",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "6px",
  zIndex: 10,
};

const dropdownItemStyle = {
  padding: "8px 12px",
  background: "none",
  border: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
};

const hideDropdown = () => {
  const menu = document.getElementById("exportDropdown");
  if (menu) menu.style.display = "none";
};

export default Employee;
