const express = require("express");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");

//Routes
const authRoutes = require("./routes/authRoutes");
const adminauthRoutes = require("./routes/adminRoutes");
dotenv.config();
connectDB();
const app = express();
app.use(express.json()); // to accept json data
app.use(cors());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API Running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/authadmin", adminauthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
