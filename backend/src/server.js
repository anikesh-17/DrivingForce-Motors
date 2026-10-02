const express = require("express");
const cors = require("cors");
require("dotenv").config();
const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DrivingForce Motors API is running",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`DrivingForce Motors API running on port ${PORT}`);
});
