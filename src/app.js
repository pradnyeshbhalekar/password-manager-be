require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");  
const connectDB = require("./config/db");
const authRoutes = require("../src/routes/auth");
const passwordRoutes = require('../src/routes/passwordRoute')
const app = express();

// If deployed behind a proxy (like Render), enable this before session:
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.json());

// Allow only your frontend during dev and enable credentials
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// Ensure preflight responses are handled
app.options('*', cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    },
}));

connectDB();
app.use("/auth", authRoutes);
app.use('/api/passwords',passwordRoutes)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
