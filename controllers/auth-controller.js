import User from "../models/user-model.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

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
  const user = await User.insertOne({
    name: name,
    email: email,
    password: hashedPassword,
  });

  //   Generating JWt Token
  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user._id.toString(),
        name: name,
        email: email,
        token: token,
      },
      "User Created Successfully"
    )
  );
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
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id.toString(),
        name: user.name,
        email,
        token,
      },
      "Login Successful"
    )
  );
};

export { registerUser, loginUser };
