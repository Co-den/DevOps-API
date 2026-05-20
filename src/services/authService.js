import logger from "#config/logger.js";
import bcrypt from "bcrypt";
import { db } from "#config/database.js";
import { eq } from "drizzle-orm";
import { users } from "#models/user.js";

// Hash the password before saving it to the database
export const hashpassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error("Hashing password error", error);
    throw new Error("Error hashing password");
  }
};

// Create a new user in the database
export const createUser = async ({ name, email, password, role = "user" }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) throw new Error("User already exist");

    const password_hashed = await hashpassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hashed, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (error) {
    logger.error(`Error creating the user:${error}`);
    throw new Error("Error creating the user");
  }
};
