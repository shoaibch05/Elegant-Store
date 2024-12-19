// app.js
const express = require("express");
const session = require("express-session");
const app = express();
const db = require("./db");
const productsRouter = require("./routes/Products");
const customersRouter = require("./routes/login");
const salesRouter = require("./routes/Sales");
const cartRoutes = require("./routes/cart");
const checkoutRoute = require("./routes/checkout");
const supplierRoute = require("./routes/supplier");
const purchaseRoute = require("./routes/purchase");
const adminlogin = require("./routes/AdminLogin");
const multipleAdresses = require("./routes/addresses");
const addproductRoute = require("./routes/addproduct")
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "Shoaib",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Routes
app.use("/products", productsRouter);
app.use("/login", customersRouter);
app.use("/sales", salesRouter);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoute);
app.use("/supplier", supplierRoute);
app.use("/purchase", purchaseRoute);
app.use("/admin", adminlogin);
app.use("/addresses", multipleAdresses);
app.use("/addproduct", addproductRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
