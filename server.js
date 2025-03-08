const express = require("express");
const cors = require("cors"); // Import cors
const connectDB = require("./src/db");
const config = require("./src/config/env");
const { errorHandler } = require("./src/middlewares/errorMiddleware");

const app = express();

// Connect Database
connectDB();

// CORS Middleware Configuration
app.use(cors({
  origin: ["http://localhost:4200" , "https://studentmgmthub.vercel.app/"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // If using cookies or authentication
}));
  
// Middleware
app.use(express.json());

// Routes
app.use("/api", require("./src/routes/registerRoutes"));
app.use("/api", require("./src/routes/loginRoutes"));

// Error Handler
app.use(errorHandler);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
