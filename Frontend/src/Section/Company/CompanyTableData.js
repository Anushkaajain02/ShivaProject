/* eslint-disable react/prop-types */
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const CompanyTableData = (companyList, navigate, handleDelete) => {
  const columns = [
    { name: "id", align: "center" },
    { name: "company name", align: "left" },
    { name: "contact", align: "center" },
    { name: "address", align: "center" },
    { name: "action", align: "center" },
  ];

  const rows = companyList.map((company) => ({
    id: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {company.company_id}
      </SoftTypography>
    ),
    "company name": (
      <SoftBox sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word" }}>
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {company.company_name}
        </SoftTypography>
      </SoftBox>
    ),
    contact: (
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {company.contact_info}
      </SoftTypography>
    ),
    address: (
      <SoftBox sx={{ maxWidth: 250, whiteSpace: "normal", wordBreak: "break-word" }}>
        <SoftTypography variant="caption" fontWeight="medium" color="text">
          {company.address}
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
          onClick={() => navigate(`/viewcompany/${company.company_id}`)}
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
          onClick={() => navigate(`/editcompany/${company.company_id}`)}

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
          onClick={() => handleDelete(company.company_id)} // ✅ Add this
        >
          <FaTrash />
        </SoftTypography>
      </SoftBox>
    ),
  }));

  return { columns, rows };
};

export default CompanyTableData;
