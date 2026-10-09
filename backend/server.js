const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/database");

const authRoutes = require("./routes/authRoutes");
const promptRoutes = require("./routes/promptRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const usageRoutes = require("./routes/usageRoutes");
const aiRoutes = require("./routes/aiRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AI Prompt Library Backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is healthy",
  });
});

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});