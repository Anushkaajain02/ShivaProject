/* eslint-disable react/prop-types */
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FaEye, FaTrash, FaEdit, FaFile } from "react-icons/fa";

const OrderTableData = (orderList, navigate, handleDelete) => {
  const columns = [
    { name: "order no", align: "center" },
    { name: "order date", align: "center" },
    { name: "customer name", align: "left" },
    { name: "supplier name", align: "left" },

    { name: "total amount", align: "left" },
    { name: "due amount", align: "left" },

    // { name: "Invoices", align: "center" },

    { name: "action", align: "center" },
  ];

  const rows = orderList.map((order) => ({
    "order no": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {order.order_no}
      </SoftTypography>
    ),

    "order date": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {order.order_date}
      </SoftTypography>
    ),

    "customer name": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {order.customer_name}
      </SoftTypography>
    ),

    "supplier name": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {order.supplier_name}
      </SoftTypography>
    ),
    "total amount": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {order.total_amount}
      </SoftTypography>
    ),

    "due amount": (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {order.due_amount}
      </SoftTypography>
    ),

    // Invoices: (
    //   <SoftBox display="flex" justifyContent="center" gap={1}>
    //     <SoftTypography
    //       component="a"
    //       href="#"
    //       title="View"
    //       color="secondary"
    //       fontSize="1rem"
    //       sx={{ cursor: "pointer", "&:hover": { color: "#1e88e5" } }}
    //       onClick={() => navigate(`/orderinvoice/${order.order_no}`)}
    //     >
    //       <FaEye />
    //     </SoftTypography>
    //     <SoftTypography
    //       component="a"
    //       href="#"
    //       title="Edit"
    //       color="secondary"
    //       fontSize="1rem"
    //       sx={{ cursor: "pointer", "&:hover": { color: "#ff9800" } }}
    //       onClick={() => navigate(`/paymentdetails/${order.order_no}`)}
    //     >
    //       <FaFile />
    //     </SoftTypography>
    //   </SoftBox>
    // ),

    action: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
        <SoftTypography
          component="a"
          href="#"
          title="View"
          color="secondary"
          fontSize="1rem"
          sx={{ cursor: "pointer", "&:hover": { color: "#1e88e5" } }}
          onClick={() => navigate(`/vieworder/${order.order_id}`)}
        >
          <FaEye />
        </SoftTypography>
        {/* <SoftTypography
          component="a"
          href="#"
          title="Edit"
          color="secondary"
          fontSize="1rem"
          sx={{ cursor: "pointer", "&:hover": { color: "#ff9800" } }}
          onClick={() => navigate(`/editorder/${order.order_id}`)}
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
          onClick={() => handleDelete(order.order_id)}
        >
          <FaTrash />
        </SoftTypography> */}
      </SoftBox>
    ),
  }));

  return { columns, rows };
};

export default OrderTableData;
