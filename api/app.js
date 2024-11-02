const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const registerRoutes = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const priceRouter = require("./routes/price.route");
const { frontend_url } = require("./secret");
const adminRouter = require("./routes/admin.route");
const withdrawRouter = require("./routes/withdraw.route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle all OPTIONS requests across all routes
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No content
});

// Apply main CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", frontend_url],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);



app.use("/user", registerRoutes);
app.use("/auth", authRouter);
app.use("/price", priceRouter);
app.use("/admin", adminRouter);
app.use("/withdraw", withdrawRouter);
app.use("/health", (req, res) => {
  res.status(200).send({ message: "Server is up and running" });
});

const errorHandler = (err, req, res, next) => {
  // Handle different types of errors
  if (err.name === "SequelizeValidationError") {
    return res
      .status(400)
      .json({ msg: err.errors.map((error) => error.message) });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ msg: "User with this email already exists" });
  }

  // Handle 404 errors
  if (err.status === 404) {
    return res.status(404).json({ msg: "Not Found" });
  }

  // Generic server error
  return res
    .status(500)
    .json({ msg: "Internal Server Error", error: err.message });
};

app.use(errorHandler);

module.exports = app;
