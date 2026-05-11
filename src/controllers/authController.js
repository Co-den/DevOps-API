import logger from "#config/logger.js";
import { signupSchema } from "#validations/auth.validation.js";
import { formatValidationError } from "#utils/format.js";
import { createUser } from "#services/authService.js";
import { jwtSign } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signup = async (req, res, next) => {
  try {
    const validationResult = await signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validationResult.error.issues,
        details: formatValidationError(validationResult.error),
      });
    }
    const { name, email, password, role } = validationResult.data;

    //AUTH SERVICE
    const user = await createUser({
      name,
      email,
      password,
      role,
    });

    const token = jwtSign.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.setCookie(res, "token", token);
    logger.info(`User ${email} signed up successfully`);
    res.status(201).json({
      message: "User signed up successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Signup error", error);
    if (error.message === "User already exists") {
      return res.status(409).json({ message: "User already exists" });
    }
    next(error);
  }
};
