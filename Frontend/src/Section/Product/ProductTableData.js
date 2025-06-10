/* eslint-disable react/prop-types */
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const ProductTableData = (productList, navigate, handleDelete) => {
  const columns = [
    { name: "id", align: "center" },
    { name: "product name", align: "left" },
    { name: "product code", align: "center" },
    { name: "category", align: "center" },
    { name: "action", align: "center" },
  ];

  const rows = productList.map((product) => ({
    id: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {product.product_id}
      </SoftTypography>
    ),
    "product name": (
      <SoftBox
        sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}
      >
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {product.product_name}
        </SoftTypography>
      </SoftBox>
    ),
    "product code": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {product.product_code}
      </SoftTypography>
    ),
    category: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {product.category}
      </SoftTypography>
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
          onClick={() => navigate(`/viewproduct/${product.product_id}`)}
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
          onClick={() => navigate(`/editproduct/${product.product_id}`)}
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
          onClick={() => handleDelete(product.product_id)}
        >
          <FaTrash />
        </SoftTypography>
      </SoftBox>
    ),
  }));

  return { columns, rows };
};

export default ProductTableData;
