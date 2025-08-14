import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/db.js";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import newsPostRoutes from "./routes/newsPostRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import departmentAdminRoutes from "./routes/departmentAdminRoutes.js";
import User from "./models/User.js";
import uploadRoutes from './routes/uploadRoutes.js';

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

global.io = io; // Make io accessible globally for controllers

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  socket.on('login', async (userId) => {
    socket.join(userId);
    const activeStudents = await User.countDocuments({ isOnline: true, role: 'student' });
    io.emit('activeStudents', activeStudents); // Broadcast to all clients
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    const activeStudents = await User.countDocuments({ isOnline: true, role: 'student' });
    io.emit('activeStudents', activeStudents);
  });
});

app.use(
  cors({
    // origin: "https://umat-project-school.onrender.com",
    origin: "http://localhost:5173",
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
app.use("/api/courses", courseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/news", newsPostRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/department-admin", departmentAdminRoutes);

app.get("/", (req, res) => {
  res.send("api backend working");
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });