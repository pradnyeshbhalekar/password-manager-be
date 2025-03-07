require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");  
const connectDB = require("./config/db");
const authRoutes = require("../src/routes/auth");
const passwordRoutes = require('../src/routes/passwordRoute')
const app = express();

app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      maxAge: 24 * 60 * 60 * 1000, 
    },
}));

connectDB();
app.use("/auth", authRoutes);
app.use('/api/passwords',passwordRoutes)

module.exports = app;  
