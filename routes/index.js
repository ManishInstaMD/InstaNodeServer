const customerPanelRoutes = require("./customerPanelRoutes");
const zoomRoutes = require("./zoomRoutes");
const authRoutes = require("./authRoutes");
const genericRoutes = require("./genericRoutes");
const brandRoutes = require("./brandRoutes");
const estimateRoutes = require("./estimateRoutes");
const productRoutes = require("./productRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const stockistRoutes = require("./stockistRoutes");
const appoinmentRoutes = require("./appoinmentRoutes");
const followUpRoutes = require("./followUpRoutes");
const hospitalRoutes = require("./hospitalMasterRoutes");
const doctorRoutes = require("./doctorRoutes");
const chemistRoutes = require("./chemistRoutes");
const therapyRoutes = require("./therapyRoutes");
const sesRoutes = require("./sesMailRoutes");
const ffRoutes = require("./ffRoutes");
const registerRoute = require("./registerRoute")
const whatsAppRoute = require("./whatsAppRoutes")
const callRoutes = require("./callRoutes");
const userRoutes = require("./userRoutes")

module.exports = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api", customerPanelRoutes);
  app.use("/api/users", zoomRoutes);
  app.use("/api", genericRoutes);
  app.use("/api", brandRoutes);
  app.use("/api",estimateRoutes)
  app.use("/api", productRoutes);
  app.use("/api", invoiceRoutes);
  app.use("/api", stockistRoutes);
  app.use("/api", appoinmentRoutes);
  app.use("/api", followUpRoutes);
  app.use("/api", hospitalRoutes);
  app.use("/api", doctorRoutes);
  app.use("/api",chemistRoutes);
  app.use("/api", therapyRoutes);
  app.use('/api', sesRoutes);
  app.use('/api', ffRoutes);
  app.use('/api/register', registerRoute);
  app.use('/api', whatsAppRoute);
  app.use('/api', callRoutes);
  app.use("/api/users", userRoutes);
};
