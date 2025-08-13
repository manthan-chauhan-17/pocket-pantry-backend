import User from "../models/user-model.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, fcmToken } = req.body;

    // All fields are required
    if (!name || !email || !password) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    // Finding if user exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json(new ApiError(400, "User Already Exists"));
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //   Storing in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      fcmToken,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            id: user._id.toString(),
            name: name,
            email: email,
          },
        },
        "User Created Successfully"
      )
    );
  } catch (error) {
    console.error("[Register Error]", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // All Fileds are required
  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  // Finding user
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist"));
  }

  // Comparing passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, "Incorrect Password"));
  }

  // Generating token
  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: email,
    },
    process.env.JWT_SECRET
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: { id: user._id.toString(), name: user.name, email, token },
      },
      "Login Successful"
    )
  );
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // From jwt
  const userEmail = req.user.email;

  // finding user from db
  const user = await User.findOne({ email: userEmail });

  // checking for missing fields
  if (!oldPassword || !newPassword) {
    return res.status(400).json(new ApiError(400, "All Field are required"));
  }

  // comparison of old and new password
  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json(new ApiError(400, "New password can not be same as old password"));
  }

  // token validation
  if (!userEmail) {
    return res.status(400).json(new ApiError(400, "Invalid Token"));
  }

  // user exists or not
  if (!user) {
    return res.status(404).json(new ApiError(404, "No user found"));
  }

  // old password is valid or not
  let isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isOldPasswordValid) {
    return res
      .status(401)
      .json(new ApiError(401, "Your old password is wrong"));
  }

  // hasing new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // changing password in db
  const passwordChange = await User.findByIdAndUpdate(
    user.id,
    { password: hashedNewPassword },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Password changed successfully"));
};

export { registerUser, loginUser, changePassword };
