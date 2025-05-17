import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import env from "dotenv";

env.config();

const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(new ApiError(401, "Access Denied , No Token"));
  }

  const token = authHeader.split(" ")[1]; // Removes the Bearer and just gives the token

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Invalid Token"));
  }
};

export default verifyJwt;
