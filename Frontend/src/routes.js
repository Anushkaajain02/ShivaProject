/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
//import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import BusinessIcon from "@mui/icons-material/Business";

import Office from "examples/Icons/Office";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BadgeIcon from "@mui/icons-material/Badge";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';


import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import Company from "Section/Company";
import Employee from "Section/Employee";
import Product from "Section/Product";
import Supplier from "Section/Supplier";
import Customer from "Section/Customer";
import Order from "Section/Order";
import CompanyView from "Section/Company/CompanyView";
import CompanyForm from "Section/Company/CompanyForm";
import CustomerForm from "Section/Customer/CustomerForm";
import CustomerView from "Section/Customer/CustomerView";
import CustomerReport from "Section/Reports/CustomerReport";
import EmployeeForm from "Section/Employee/EmployeeForm";
import EmployeeView from "Section/Employee/EmployeeView";
import ProductView from "Section/Product/ProductView";
import ProductForm from "Section/Product/ProductForm";
import SupplierView from "Section/Supplier/SupplierView";
import SupplierForm from "Section/Supplier/SupplierForm";
import OrderView from "Section/Order/OrderView";
import OrderForm from "Section/Order/OrderForm";
import Invoice from "Section/Order/Invoice";
import AddPayment from "Section/Order/Addpayment";
import ViewPaymentReceipt from "Section/Order/ViewPaymentReceipt";
import PaymentDetails from "Section/Order/PaymentDetails";
import LoginForm from "Section/Login/LoginForm";
import LogoutRedirect from "Section/LogOutRedirect";
import InvoiceReport from "Section/Reports/InvoiceReport";
import OrderReport from "Section/Reports/OrderReport";
import OutstandingReport from "Section/Reports/OutstandingReports";
import RecentOrders from "layouts/dashboard/components/RecentOrders/RecentOrders";
import RegisterForm from "Section/Login/RegisterForm";
import OrderDetails from "Section/Order/OrderDetails";
import SalesReport from "Section/Reports/SalesReport";
import SalesSummary from "Section/Order/SalesSummary";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LogoutIcon from "@mui/icons-material/Logout";
import OrderSummary from "Section/Order/OrderSummary";
import RecordDelivery from "Section/PartialDelivery/RecordDelivery";
import PartialDelivery from "Section/PartialDelivery/PartialDelivery";
import CreateOrder from "Section/Order/CreateOrder";
import CustomerDashboard from "Section/Order/CustomerDashboard";
import OrderDashboard from "Section/Order/OrderDashboard";
import ProductSelectionPage from "Section/Order/ProductPage";
import AddProductModal from "Section/Order/AddProductModal";

const routes = [
  {
    type: "", // This hides it from the sidebar
    key: "loginform",
    route: "/",
    component: <LoginForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "registerform",
    route: "/userregister",
    component: <RegisterForm />,
  },

  // SIDEBAR
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <DashboardIcon size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },

   {
    type: "collapse",
    name: "Orders",
    key: "orders",
    route: "/orderscreate",
    icon: <AddShoppingCartIcon size="12px" />,
    component: <CreateOrder />,
    noCollapse: true,
  },
{
    type: "",
    name: "CustomerDash",
    key: "CustomerDash",
    route: "/customerdash/:id",
    component: <CustomerDashboard />,
    noCollapse: true,
  },
  {
    type: "",
    name: "OrderDash",
    key: "OrderDash",
    route: "/orderdash/:id",
    component: <OrderDashboard />,
    noCollapse: true,
  },

  {
    type: "",
    name: "addproduct",
    key: "addproduct",
    route: "/addproduct",
    component: <AddProductModal />,
    noCollapse: true,
  },
  {
    type: "",
    name: "ProductPage",
    key: "ProductPage",
    route: "/productpage",
    component: <ProductSelectionPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Create Order",
    key: "createorder",
    route: "/addorder",
    icon: <AddShoppingCartIcon size="12px" />,
    component: <OrderForm />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manage Order",
    key: "order",
    route: "/order",
    icon: <AssignmentIcon size="12px" />,
    component: <Order />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Add Partial Delivery",
    key: "addpartial",
    route: "/addpartialdelivery/:orderId",
    icon: <AssignmentIcon size="12px" />,
    component: <RecordDelivery />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Partial Delivery",
    key: "partialdetails",
    route: "/partialdetails",
    icon: <MoveToInboxIcon size="12px" />,
    component: <PartialDelivery />,
    noCollapse: true,
  },

  {
    type: "",
    name: "Order Summary",
    key: "order-summary",
    route: "/ordersummary/:id",
    icon: <AssignmentIcon size="12px" />,
    component: <OrderSummary />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manage Customer",
    key: "customer",
    route: "/customer",
    icon: <PeopleIcon size="12px" />,
    component: <Customer />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manage Supplier",
    key: "supplier",
    route: "/supplier",
    icon: <LocalShippingIcon size="12px" />,
    component: <Supplier />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Sales Summary",
    key: "Sales-Summary",
    route: "/SalesSummary",
    icon: <BarChartIcon size="12px" />,
    component: <SalesSummary />,
    noCollapse: true,
  },

  {
    type: "",
    name: "Recent Orders",
    key: "recent-orders",
    route: "/recent-orders",
    component: <RecentOrders />,
  },

  // { type: "title", title: "Reports", key: "account-pages" },

  {
    type: "collapse",
    name: "Customer Report",
    key: "Customer-Report",
    route: "/CustomerReport",
    icon: <PeopleAltIcon size="12px" />,
    component: <CustomerReport />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Outstanding Report",
    key: "Outstanding-Report",
    route: "/OutstandingReport",
    icon: <ReportProblemIcon size="12px" />,
    component: <OutstandingReport />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Order Report",
    key: "Order-Report",
    route: "/OrderReport",
    icon: <ListAltIcon size="12px" />,
    component: <OrderReport />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Invoice Report",
    key: "Invoice-Report",
    route: "/InvoiceReport",
    icon: <ReceiptLongIcon size="12px" />,
    component: <InvoiceReport />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Sales Report",
    key: "Sales-Report",
    route: "/SalesReport",
    icon: <TrendingUpIcon size="12px" />,
    component: <SalesReport />,
    noCollapse: true,
  },

  { type: "title", title: "Others", key: "account-pages" },

  {
    type: "collapse",
    name: "Manage Company",
    key: "company",
    route: "/company",
    icon: <BusinessIcon size="12px" />,
    component: <Company />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manage Employee",
    key: "employee",
    route: "/employee",
    icon: <BadgeIcon size="12px" />,
    component: <Employee />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Manage Product",
    key: "product",
    route: "/product",
    icon: <Inventory2Icon size="12px" />,
    component: <Product />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    route: "/logout",
    icon: <LogoutIcon size="12px" />,
    component: <LogoutRedirect />, // ⬅️ a simple React component that runs logout logic
    noCollapse: true,
  },

  //COMPANY

  {
    type: "", // This hides it from the sidebar
    key: "companyview",
    route: "/viewcompany/:id",
    component: <CompanyView />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addcompany",
    route: "/addcompany",
    component: <CompanyForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "editcompany",
    route: "/editcompany/:id",
    component: <CompanyForm />,
  },

  //Customer

  {
    type: "", // This hides it from the sidebar
    key: "customerview",
    route: "/viewcustomer/:id",
    component: <CustomerView />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addcustomer",
    route: "/addcustomer",
    component: <CustomerForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "editcustomer",
    route: "/editcustomer/:id",
    component: <CustomerForm />,
  },

  //Employee

  {
    type: "", // This hides it from the sidebar
    key: "employeeview",
    route: "/viewemployee/:id",
    component: <EmployeeView />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addemployee",
    route: "/addemployee",
    component: <EmployeeForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "editcustomer",
    route: "/editemployee/:id",
    component: <EmployeeForm />,
  },

  //Product

  {
    type: "", // This hides it from the sidebar
    key: "productview",
    route: "/viewproduct/:id",
    component: <ProductView />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addproduct",
    route: "/addproduct",
    component: <ProductForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "editproduct",
    route: "/editproduct/:id",
    component: <ProductForm />,
  },

  //Supplier

  {
    type: "", // This hides it from the sidebar
    key: "supplierview",
    route: "/viewsupplier/:id",
    component: <SupplierView />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addsupplier",
    route: "/addsupplier",
    component: <SupplierForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "editsupplier",
    route: "/editsupplier/:id",
    component: <SupplierForm />,
  },

  //Supplier

  {
    type: "", // This hides it from the sidebar
    key: "orderview",
    route: "/vieworder/:id",
    component: <OrderView />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "orderdetails",
    route: "/orderdetails/:id",
    component: <OrderDetails />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addorder",
    route: "/addorder",
    component: <OrderForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "editorder",
    route: "/editorder/:id",
    component: <OrderForm />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "orderinvoice",
    route: "/orderinvoice/:order_no",
    component: <Invoice />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "addpayment",
    route: "/addpayment",
    component: <AddPayment />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "viewpaymentreceipt",
    route: "/viewpaymentreceipt/:id",
    component: <ViewPaymentReceipt />,
  },

  {
    type: "", // This hides it from the sidebar
    key: "paymentdetails",
    route: "/paymentdetails/:order_no",
    component: <PaymentDetails />,
  },
];

export default routes;
