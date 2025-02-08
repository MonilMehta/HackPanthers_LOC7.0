import { User } from "../models/user.models.js";

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password -refreshToken"); // Excluding sensitive fields
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export { getAllUsers }