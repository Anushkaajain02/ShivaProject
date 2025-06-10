/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const authorsTableData = {
  columns: [
    { name: "id", align: "center" },
    { name: "company name", align: "left" },
    { name: "contact", align: "center" },
    { name: "address", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      id: (
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          1
        </SoftTypography>
      ),
      "company name": (
        <SoftBox sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}>
          <SoftTypography variant="caption" fontWeight="medium" color="text">
            ABC Pvt. Ltd. with a very long name that should wrap inside the cell
          </SoftTypography>
        </SoftBox>
      ),
      contact: (
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          +91 9876543210
        </SoftTypography>
      ),
      address: (
        <SoftBox sx={{ maxWidth: 250, whiteSpace: "normal", wordBreak: "break-word" }}>
          <SoftTypography variant="caption" fontWeight="medium" color="text">
            Mumbai, Maharashtra, very long address that should wrap properly when resized
          </SoftTypography>
        </SoftBox>
      ),
      action: (
        <SoftBox display="flex" justifyContent="center" gap={1}>
          <SoftTypography
            component="a"
            href="#"
            title="View"
            color="secondary"
            fontSize="1rem"
            sx={{ cursor: "pointer", "&:hover": { color: "#1e88e5" } }}
          >
            <FaEye />
          </SoftTypography>

          <SoftTypography
            component="a"
            href="#"
            title="Edit"
            color="secondary"
            fontSize="1rem"
            sx={{ cursor: "pointer", "&:hover": { color: "#ff9800" } }}
          >
            <FaEdit />
          </SoftTypography>

          <SoftTypography
            component="a"
            href="#"
            title="Delete"
            color="secondary"
            fontSize="1rem"
            sx={{ cursor: "pointer", "&:hover": { color: "#e53935" } }}
          >
            <FaTrash />
          </SoftTypography>
        </SoftBox>
      ),
    },
  ],
};


export default authorsTableData;
