require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("./notifications/cronJobs");

const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", expenseRoutes);
app.use("/api", userRoutes);

const notificationRoutes = require("./routes/notification");
app.use("/api", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Hello In CashLogix app");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
