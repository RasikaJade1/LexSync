require('dotenv').config();

const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./lib/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const caseRoutes = require("./routes/caseRoutes"); 
const taskRoutes = require("./routes/taskRoutes");
const documentRoutes = require("./routes/documentRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const cors = require("cors");

dbConnect();

const app = express();

//connect frontend and backend via diff ports
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// after other routes
app.use("/api/cases", caseRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/appointments", appointmentRoutes);

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});