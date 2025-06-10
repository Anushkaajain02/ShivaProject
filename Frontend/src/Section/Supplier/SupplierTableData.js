/* eslint-disable react/prop-types */
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const SupplierTableData = (supplierList, navigate, handleDelete) => {
  const columns = [
    { name: "id", align: "center" },
    { name: "supplier name", align: "left" },
    { name: "contact", align: "center" },
    { name: "address", align: "center" },
    { name: "action", align: "center" },
  ];

  const rows = supplierList.map((supplier) => ({
    id: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {supplier.supplier_id}
      </SoftTypography>
    ),
    "supplier name": (
      <SoftBox
        sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}
      >
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {supplier.supplier_name}
        </SoftTypography>
      </SoftBox>
    ),
    contact: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {supplier.contact_info}
      </SoftTypography>
    ),
    address: (
      <SoftBox
        sx={{ maxWidth: 250, whiteSpace: "normal", wordBreak: "break-word" }}
      >
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {supplier.address}
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
          onClick={() => navigate(`/viewsupplier/${supplier.supplier_id}`)}
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
          onClick={() => navigate(`/editsupplier/${supplier.supplier_id}`)}
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
          onClick={() => handleDelete(supplier.supplier_id)}
        >
          <FaTrash />
        </SoftTypography>
      </SoftBox>
    ),
  }));

  return { columns, rows };
};

export default SupplierTableData;
