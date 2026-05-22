import logger from "#utils/logger.js";
import { getAllUser } from "#services/userService.js";

export const getAllUsers = async (req, res, next) => {
  try {
    logger.info("Fetching all users");

    const allUsers = await getAllUser();
    res.status(200).json({
      message: "Users fetched successfully",
      user: allUsers,
    });
  } catch (error) {
    logger.error(`Error in getAllUsers controller: ${error.message}`);
    next(error);
  }
};
