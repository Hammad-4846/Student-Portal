// app.js
const express = require("express");
const morgan = require("morgan"); // Package for Logging
const cors = require("cors"); // Package for CORS
const authRoutes = require("./Routes/auth.router");
const userRoutes = require("./Routes/user.router");
const assignmentRoutes = require("./Routes/assignment.router");
const cookie = require("cookie-parser");//Parsing Cookies


const app = express();

// Middleware for parsing JSON,Cookies and other requests
app.use(express.json());
app.use(cookie());


// CORS configuration(optional only for Client)
const origin = process.env.ORIGIN;
app.use(cors({ credentials: true, origin }));

// Logging middleware
app.use(morgan("common"));


// Routes for handling requests
app.get("/", (req, res) => {
  return res.send(200).send("Welcome to GrowthX API SERVICE");
});
app.use("/api/v1", authRoutes);
app.use("/api/v1", assignmentRoutes);
app.use("/api/v1", userRoutes);

module.exports = app; // Export the app instance
