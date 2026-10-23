const User = require("../models/user");

// =====================================
// GET PROFILE
// =====================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
};

// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      course,
      semester,
      rollNo,
    } = req.body;

    if (!name || !email || !college) {
      return res.status(400).json({
        success: false,
        message: "Name, email and college are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : "",
        college: college.trim(),
        course: course ? course.trim() : "",
        semester: semester ? semester.trim() : "",
        rollNo: rollNo ? rollNo.trim() : "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};



module.exports = {
  getProfile,
  updateProfile,
};