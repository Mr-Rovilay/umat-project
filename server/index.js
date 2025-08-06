import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from './routes/courseRoutes.js';
import programRoutes from './routes/programRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';



const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.use("/api/auth", authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/program', programRoutes);
app.use('/api/department', departmentRoutes);

app.get("/", (req, res) => {
  res.send("api backend working");
});


// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });