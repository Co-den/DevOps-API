import jwt from "jsonwebtoken";
import Logger from "#config/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const jwtSign = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      Logger.error("Failed to sign JWT", error);
      throw new Error("Failed to sign JWT");
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      Logger.error("Failed to authenticate token", error);
      throw new Error("Failed to authenticate token");
    }
  },
};
