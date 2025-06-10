/* eslint-disable react/prop-types */
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const CustomerTableData = (customerList, navigate, handleDelete) => {
  const columns = [
    { name: "id", align: "center" },
    { name: "customer name", align: "left" },
    { name: "contact", align: "center" },
    { name: "address", align: "center" },
    { name: "action", align: "center" },
  ];

  const rows = customerList.map((customer) => ({
    id: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {customer.customer_id}
      </SoftTypography>
    ),
    "customer name": (
      <SoftBox sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}>
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {customer.customer_name}
        </SoftTypography>
      </SoftBox>
    ),
    contact: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {customer.contact_info}
      </SoftTypography>
    ),
    address: (
      <SoftBox sx={{ maxWidth: 250, whiteSpace: "normal", wordBreak: "break-word" }}>
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {customer.address}
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
          onClick={() => navigate(`/viewcustomer/${customer.customer_id}`)}
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
          onClick={() => navigate(`/editcustomer/${customer.customer_id}`)}

          // Add edit logic here later
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
          onClick={() => handleDelete(customer.customer_id)} // ✅ Add this
        >
          <FaTrash />
        </SoftTypography>
      </SoftBox>
    ),
  }));

  return { columns, rows };
};

export default CustomerTableData;
