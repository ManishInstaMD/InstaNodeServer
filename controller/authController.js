const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../config/database"); 
const emailService = require("../services/emailServices");
const userService = require("../services/myServices"); // Refactored to use your services
const otpService = require("../services/otpServices");
const moment = require("moment-timezone");
// const { use } = require("../routes/uploadRoutes");
const myServices = require("../services/myServices");

dotenv.config();

// Register new user
exports.register = async (req, res) => {
  try {
    const userData = req.body;
    const name = userData.name;

    // Check if email already exists
    const where = { email: userData.email };
    const existingUser = await userService.checkExist(db.models.User, where);

    if (existingUser.success) {
      const blockStatus = await otpService.checkBlockStatus(existingUser.data);
      if (blockStatus.isBlocked !== false) {
        return res.status(400).json({ data: blockStatus });
      }

      if (existingUser.data.is_verified !== true) {
        return res.status(400).json({
          success: false,
          isVerified: false,
          message:
            "Your account is not verified. Please check your email for the verification OTP.",
        });
      }

      return res.status(400).json({ message: "Email already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    userData.password = hashedPassword;

    const newUser = await userService.create(db.models.User, userData);

    const response = await sendVerificationOtp(newUser, "registration");
    if (!response.success) {
      return res.status(400).json(response);
    }

    if (!newUser.success) {
      return res.status(400).json(newUser);
    }

    res.status(200).json({
      message: "User registered successfully",
      user: newUser.data, // Send actual user data
      otp: response.otp,
      isVerified: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.password = async (req, res) => {
  try {
    const { password, confirm_password, id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "please provide valid id" });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // const userId = req.user.id;
    // Assuming userService.update function updates a user's data by user ID
    const user = await userService.update(db.models.User, id, {
      password: hashedPassword,
    });
    // Check if the user update was successful
    if (!user) {
      return res.status(400).json({ message: "Failed to update password" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.checkExist(db.models.User, { email: email });
    if (!user.success) {
      return res.status(400).json({ message: "User not found" });
    }
    const blockStatus = await otpService.checkBlockStatus(user.data);
    if (blockStatus.isBlocked !== false) {
      return res.status(400).json({ data: blockStatus });
    }

    const isMatch = await bcrypt.compare(password, user.data.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.data.id, role: user.data.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userId: user.data.id,
      name: user.data.name,
      userEmail: user.data.email,
      role: user.data.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.resetPasswordOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body; // Get email, OTP, and newPassword from request body
  try {
    // Verify OTP validity
    const response = await otpService.verifyOtp(db.models.User, email, otp);

    if (!response.success) {
      return res.status(400).json(response); // If OTP verification fails
    }

    // Update the user's password after successful OTP verification
    const update = await userService.updateByWhere(
      db.models.User,
      { email: email },
      { password: newPassword }
    );

    if (!update.success) {
      return res.status(400).json(update); // If password update fails
    }

    // Success response
    res.status(200).json({
      success: true,
      message:
        "Password has been changed successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while processing your reset password request. Please try again later.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userService.checkExist(db.models.User, { email: email });

    if (!user.success) {
      return res.status(400).json({ message: "Please Provide Registered Email" });
    }

    const blockStatus = await otpService.checkBlockStatus(user.data);

    if (blockStatus.isBlocked !== false) {
      return res.status(400).json({ data: blockStatus });
    }

    const response = await sendVerificationOtp(user, "forget");

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json({
      success: true,
      message:
        "A password reset OTP has been sent to your email. Please check your inbox to proceed.",
      response,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: error.message ||
          "An error occurred while processing your request. Please try again later.",
      });
  }
};

// Verify OTP via email
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("===========", req.body);

  try {
    const response = await otpService.verifyOtp(db.models.User, email, otp);

    if (!response.success) {
      return res.status(400).json(response);
    }

    const token = jwt.sign(
      { id: response.id, role: response.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to resend OTP
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.checkExist(db.models.User, { email: email });

    if (!user.success) {
      return res.status(400).json({ message: "User not found" });
    }

    const blockStatus = await otpService.checkBlockStatus(user.data);
    if (blockStatus.isBlocked !== false) {
      return res.status(400).json({ data: blockStatus });
    }

    const otpCooldown = await otpService.checkOtpCooldown(email);

    if (!otpCooldown.status) {
      return res.status(400).json({ message: otpCooldown.message });
    }

    const response = await sendVerificationOtp(user, "forget");

    if (!response.success) {
      return res.status(400).json(response);
    }

    res
      .status(200)
      .json({ message: "OTP has been sent successfully", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP", log: error });
  }
};

// Controller function to get user profile based on JWT token
exports.getUserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const result = await userService.read(db.models.User, id, null, {});
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};

// Logout user (Delete token on client side)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const userData = req.body;
  try {
    const user = await userService.checkExist(db.models.User, req.user.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the user's password after successful OTP verification
    const update = await userService.update(
      db.models.User,
      user.data.id,
      userData
    );

    if (!update.success) {
      return res.status(400).json(update); // If password update fails
    }

    res.status(200).json({ message: "Profile updated successfully", update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await userService.checkExist(db.models.User, req.user.id);
    if (!user.success) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.data.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    const update = await userService.update(db.models.User, user.data.id, {
      password: newPassword,
    });

    if (!update.success) {
      return res.status(400).json(update);
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing password" });
  }
};

// Helper function to generate 4-digit OTP
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit number
};

// send df gdsf
const sendVerificationOtp = async (newUser, type) => {
  try {
    const otp = generateOtp(); // Generate a 4-digit OTP
    // const name = user.data.name;
    console.log(newUser);
    const email = newUser.email || newUser.data?.email;
    console.log(email);
    if (!email) {
      throw new Error("Email is required for OTP generation.");
    }
    console.log("Email found:", email);
    // Store OTP in userOtp table
    const result = {
      email, // Ensure emailId is properly referenced
      otp: otp.toString(),
    };

    const newOtp = await userService.create(db.models.UserOtp, result);

    if (!newOtp.success) {
      return { success: false, message: "Failed to store OTP" };
    }

    console.log("OTP stored successfully:", result); // Log the result for confirmation

    // Send OTP to user via email using emailService
    const subject =
      type === "registration"
        ? "OTP For Registration"
        : "OTP For Password Reset";
    const html =
      type === "registration"
        ? "welcome-email-otp.html"
        : "reset-password-email.html";
    const text = "This is the plain text content for OTP";
    const replacements = { otp }; // Corrected replacement variable

    await emailService.sendEmailOTP(email, subject, text, replacements, html);

    console.log("OTP email sent successfully.");

    return { success: true, otp }; // Return OTP in case you want to send it in response or email
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Error generating OTP");
  }
};







// const login = async (req, res) => {
//   const { username, password } = req.body;

//   console.log(username, password);

  // Check if user exists
  // const user = User.find((u) => u.email === email);
  // if (!user) return res.status(401).json({ message: "Invalid email or password" });

  // // Validate password
  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  // Generate JWT token
  // const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

//   res.json({ success: true, message: "Login successful" });
// };

// module.exports = login;

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
