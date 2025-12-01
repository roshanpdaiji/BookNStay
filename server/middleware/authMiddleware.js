import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // CALL req.auth() first
    const auth = req.auth();  
    console.log("Auth data:", auth); // Debug

    const { userId } = auth;  // Now extract userId safely

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authenticated",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
