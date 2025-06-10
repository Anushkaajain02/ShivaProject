const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const dashboardcontroller = require("../Controller/DashboardController");
const logincontroller = require("../Controller/LoginController");
const companycontroller = require("../Controller/CompanyController");
const suppliercontroller = require("../Controller/SupplierController");
const customercontroller = require("../Controller/CustomerController");
const employeecontroller = require("../Controller/EmployeeController");
const productcontroller = require("../Controller/ProductController");
const ordercontroller = require("../Controller/OrderController");
const invoicecontroller = require("../Controller/InvoiceController");
const paymentcontroller = require("../Controller/PaymentController");
const usercontroller = require("../Controller/UserController");
const deliverycontroller = require("../Controller/DeliveryController");
//--------------------------DASHBOARD--------------------------

router.get("/DashboardDetails", dashboardcontroller.getDashboardStats);

//--------------------------LOGIN--------------------------

router.post("/UserRegister", logincontroller.register);
router.post("/UserLogin", logincontroller.login);
router.get(
  "/UserProfile",
  logincontroller.verifyToken,
  logincontroller.profile
);

//--------------------------USER--------------------------

router.get("/GetUserDetails", usercontroller.getuser);
router.put("/UpdateUserStatus/:id", usercontroller.updateuserstatus);
router.get("/GetUserByEmail/:email", usercontroller.GetUserByEmail);

//--------------------------COMPANY--------------------------

router.get("/home", companycontroller.home);
router.post("/AddCompany", companycontroller.addcompany);
router.get("/GetCompanyDetails", companycontroller.getcompany);
router.delete("/DeleteCompany/:id", companycontroller.deletecompany);
router.put("/UpdateCompany/:id", companycontroller.updatecompany);
router.get("/GetCompanyById/:id", companycontroller.GetCompanyById);

//--------------------------SUPPLIER--------------------------

router.post("/AddSupplier", suppliercontroller.addsupplier);
router.get("/GetSupplierDetails", suppliercontroller.getsupplier);
router.delete("/DeleteSupplier/:id", suppliercontroller.deletesupplier);
router.put("/UpdateSupplier/:id", suppliercontroller.updatesupplier);
router.get("/GetSupplierById/:id", suppliercontroller.GetSupplierById);

//--------------------------CUSTOMER--------------------------

router.post("/AddCustomer", customercontroller.addcustomer);
router.get("/GetCustomerDetails", customercontroller.getcustomer);
router.delete("/DeleteCustomer/:id", customercontroller.deletecustomer);
router.put("/UpdateCustomer/:id", customercontroller.updatecustomer);
router.get("/GetCustomerById/:id", customercontroller.GetCustomerById);
router.get("/GetCustomerLedger", customercontroller.getCustomerLedger);

//--------------------------EMPLOYEE--------------------------

router.post("/AddEmployee", employeecontroller.addemployee);
router.get("/GetEmployeeDetails", employeecontroller.getemployee);
router.delete("/DeleteEmployee/:id", employeecontroller.deleteemployee);
router.put("/UpdateEmployee/:id", employeecontroller.updateemployee);
router.get("/GetEmployeeById/:id", employeecontroller.GetEmployeeById);

//--------------------------PRODUCT--------------------------

router.post("/AddProduct", productcontroller.addproduct);
router.get("/GetProductDetails", productcontroller.getproduct);
router.delete("/DeleteProduct/:id", productcontroller.deleteproduct);
router.put("/UpdateProduct/:id", productcontroller.updateproduct);
router.get("/GetproductById/:id", productcontroller.GetproductById);

//--------------------------ORDER--------------------------

router.post("/AddOrder", ordercontroller.addorder);
router.get("/GetOrderDetails", ordercontroller.getorder);
router.delete("/DeleteOrder/:id", ordercontroller.deleteorder);
router.get("/GetOrderById/:id", ordercontroller.GetOrderById);
router.put("/UpdateOrder/:id", ordercontroller.updateorder);
router.get("/getNextOrderNumber", ordercontroller.getNextOrderNumberEndpoint);
router.get(
  "/GetOrderDetailsWithNames",
  ordercontroller.GetOrderDetailsWithNames
);

//--------------------------INVOICE--------------------------

router.post("/AddInvoice", invoicecontroller.addinvoice);
router.get("/GetInvoiceDetails", invoicecontroller.getinvoices);
router.delete("/DeleteInvoice/:id", invoicecontroller.deleteinvoice);
router.put("/UpdateInvoice/:bill_no", invoicecontroller.updateinvoiceandorder);
router.get(
  "/getNextInvoiceNumber",
  invoicecontroller.getNextInvoiceNumberEndpoint
);
router.get("/GetInvoiceById/:order_no", invoicecontroller.getinvoiceByOrderNo);
router.get("/GetOutstandingDetails", invoicecontroller.getOutstandingInvoices);
router.delete(
  "/DeleteInvoiceByOrderNo/:order_no",
  invoicecontroller.deleteinvoicebyorderno
);

//--------------------------PAYMENT--------------------------

router.post("/AddPayment", paymentcontroller.addpayment);
router.get(
  "/GetpaymentDetailsByBillNo/:bill_no",
  paymentcontroller.getpaymentByBillNo
);
router.get("/GetpaymentDetailsById/:id", paymentcontroller.getpaymentById);
router.get("/getPayments", paymentcontroller.getPayments);

//--------------------------DELIVERY--------------------------

router.get(
  "/getOrdersWithDeliveryStatus",
  deliverycontroller.getOrdersWithDeliveryStatus
);
router.get(
  "/getDeliveryHistory/:orderId",
  deliverycontroller.getDeliveryHistory
);
router.post("/recordDelivery", deliverycontroller.recordDelivery);
router.get("/getOrder/:orderId", deliverycontroller.getOrder);
router.get(
  "/getDeliveryDataByOrderNo/:order_no",
  deliverycontroller.getDeliveryDataByOrderNo
);

module.exports = router;
