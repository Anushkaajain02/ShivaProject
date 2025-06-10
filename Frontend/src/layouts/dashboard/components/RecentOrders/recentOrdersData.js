export default {
  columns: [
    { name: "orderId", align: "left" },
    { name: "customer", align: "left" },
    { name: "date", align: "center" },
    { name: "status", align: "center" },
    { name: "amount", align: "right" },
  ],

  rows: [
    {
      orderId: "#1234",
      customer: "John Doe",
      date: "24 May 2025",
      status: (
        <span style={{ color: "green", fontWeight: 500 }}>Delivered</span>
      ),
      amount: "₹15000",
    },
    {
      orderId: "#1235",
      customer: "Jane Smith",
      date: "23 May 2025",
      status: (
        <span style={{ color: "orange", fontWeight: 500 }}>Pending</span>
      ),
      amount: "₹8900",
    },
    {
      orderId: "#1236",
      customer: "Robert Martin",
      date: "22 May 2025",
      status: (
        <span style={{ color: "red", fontWeight: 500 }}>Cancelled</span>
      ),
      amount: "₹4900",
    },
    // Add more rows as needed
  ],
};