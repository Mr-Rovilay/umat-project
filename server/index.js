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
import User from "./models/User.js";

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Store online users
global.onlineUsers = [];

io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('department');
      if (user) {
        const departmentIds = user.department ? [user.department.toString()] : [];
        global.onlineUsers.push({ userId: decoded.userId, departmentIds });
        socket.userId = decoded.userId;
      }
    } catch (error) {
      console.error('Socket auth error:', error);
    }
  }

  socket.on('disconnect', () => {
    global.onlineUsers = global.onlineUsers.filter((u) => u.userId !== socket.userId);
  });
});

app.use(
  cors({
    origin: 'https://umat-project-school.onrender.com',
    // origin: "http://localhost:5173", // Adjust for production
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
app.use("/api/dashboard", adminDashboardRoutes);
app.use("/api/payments", paymentRoutes);

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
