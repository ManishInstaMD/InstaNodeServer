const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config;
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const setupRoutes = require("./routes/index");
const http = require("http");
const { sequelize } = require("./config/database");
const defineAssociations = require("./config/associations");
const fileUpload = require('express-fileupload');

const path = require("path");

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    "https://events-apu7.onrender.com",
    "http://localhost:5173", 
    "https://dzpg95.csb.app",
    "https://instamd.in",
    "https://internal.instamd.in",
    "http://192.168.1.127:5173" ,
    "https://alkem.vercel.app",
    "https://alkem-mob.vercel.app",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
// app.use(fileUpload({ limits: { fileSize: 200 * 1024 * 1024 } })); // 200MB


// Static files
app.use("/processed", express.static(path.join(__dirname, "processed")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Socket.io setup with proper CORS
const io = socketIo(server, {
  cors: corsOptions,
  allowEIO3: true
});

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
setupRoutes(app);
defineAssociations();

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Watch for database changes
setInterval(async () => {
  const [results] = await sequelize.query("SELECT * FROM pmt_master");
  io.emit("updateData", results);
}, 5000);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server app listening at port ${port}`);
});