const User = require("../models/User");
const login = async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

  // Check if user exists
  // const user = User.find((u) => u.email === email);
  // if (!user) return res.status(401).json({ message: "Invalid email or password" });

  // // Validate password
  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  // Generate JWT token
  // const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ success: true, message: "Login successful" });
};

module.exports = login;

// const myServices = require("../services/myServices");
// const db = require("../config/database"); // Correct path to sequelize instance

// // Create a new user
// exports.create = async (req, res) => {
//   try {
//     const userData = req.body;
//     const newUser = await myServices.create(db.models.User, userData);

//     if (!newUser.success) {
//       return res.status(400).json(newUser);
//     }

//     return res.status(200).json(newUser);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };
