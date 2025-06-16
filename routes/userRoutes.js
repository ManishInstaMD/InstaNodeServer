const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const checkSuperadmin = require("../middleware/checkSuperadmin");

// Protect all routes for superadmin only
router.use(verifyToken);
router.use(checkSuperadmin);

// Routes
router.post("/create", userController.createUser);
router.get("/list", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
