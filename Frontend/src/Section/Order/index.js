import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";

// MUI components
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { InputBase } from "@mui/material";

// Soft UI components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Table data function
import OrderTableData from "./OrderTableData";

function Order() {
  const calendarAnchorRef = useRef(null);
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterBy, setFilterBy] = useState([]);

  const handleFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setFilterBy(typeof value === "string" ? value.split(",") : value);
  };

  const handleDelete = async (orderNo) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:3301/DeleteOrder/${orderNo}`);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3301/GetOrderDetails?page=1&limit=10"
      );
      const orders = response.data.data;
      setOrderList(orders);
      setFilteredList(orders);
      setTableData(OrderTableData(orders, navigate, handleDelete));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orderList.filter((order) => {
      return (
        (filterBy.includes("supplier") &&
          order.supplier_name?.toLowerCase().includes(term)) ||
        (filterBy.includes("customer") &&
          order.customer_name?.toLowerCase().includes(term)) ||
        (filterBy.includes("orderno") &&
          order.order_no?.toLowerCase().includes(term))
      );
    });

    setFilteredList(filtered);
    setTableData(OrderTableData(filtered, navigate, handleDelete));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Order No",
      "Order Date",
      "Customer",
      "Supplier",
      "Total Amount",
    ];
    const tableRows = filteredList.map((order) => [
      order.order_no || "-",
      order.order_date || "-",
      order.customer_name || "-",
      order.supplier_name || "-",
      order.total_amount != null ? order.total_amount : "-",
    ]);

    doc.setFontSize(14);
    doc.text("Order Report", 14, 15);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("orders.pdf");
  };

  useEffect(() => {
    fetchOrders();
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
              <SoftTypography variant="h6">Order Table</SoftTypography>

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
                  right: 24,
                  top: 80,
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

            {/* Search Input */}
            <SoftBox px={3} pt={2}>
              <SoftBox display="flex" alignItems="center" gap={1.5} mb={1}>
                <SoftBox width="20%">
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
                        setFilteredList(orderList);
                        setTableData(
                          OrderTableData(orderList, navigate, handleDelete)
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
                    <CalendarTodayIcon fontSize="small"/>
                  </IconButton>
                </SoftBox>

                {/* FilterInput */}
                <SoftBox display="flex" alignItems="center" mt={2} marginBottom= "0.9rem">
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
                        { value: "supplier", label: "Supplier" },
                        { value: "customer", label: "Customer" },
                        { value: "orderno", label: "Order No" },
                      ].map(({ value, label }) => (
                        <MenuItem
                          key={value}
                          value={value}
                          sx={{ fontSize: "0.5rem" }}
                        >
                          <Checkbox fontSize ="0.5rem"
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
                      const filtered = orderList.filter(
                        (order) => order.order_date === formatted
                      );

                      setFilteredList(filtered);
                      setTableData(
                        OrderTableData(filtered, navigate, handleDelete)
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

export default Order;
