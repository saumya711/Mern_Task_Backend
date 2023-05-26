const dotenv = require("dotenv").config();
const express = require("express");
const { Logger } = require("mongodb");
const connectDB = require("./config/connectDB");
const Task = require("./models/taskModel");
const taskRoutes = require("./routes/taskRoute");

const productRoutes = require("./routes/productRoute")
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.use(cors({
  origin: [
  "http://localhost:3000", 
  "https://mern-task-app-2ql0.onrender.com" 
]
}));
// app.use(taskRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/products", productRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

const PORT = process.env.PORT || 5000;

const startServer = async (arg) => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
