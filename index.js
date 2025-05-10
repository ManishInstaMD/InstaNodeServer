const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config;
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const setupRoutes = require("./routes/index");
const http = require("http");
const { sequelize } = require("./config/database");
const defineAssociations = require("./config/associations");
const path = require("path");




const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: ["*"] },
  allowEIO3: true,
  credentials: true
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use("/processed", express.static(path.join(__dirname, "processed")));

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
setupRoutes(app);
defineAssociations();



// Basic Route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});




// Watch for database changes
setInterval(async () => {
  const [results] = await sequelize.query("SELECT * FROM pmt_master");
  io.emit("updateData", results); // Send new data to frontend
}, 5000);




// Socket.io setup
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



const port = process.env.PORT || 5000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server app listening at http://localhost:${port}`);
});





