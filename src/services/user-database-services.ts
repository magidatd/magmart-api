import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import user, { default as UsersTable } from '../database/schema/user';
import db from '../database';
import { eq } from 'drizzle-orm';

/**
 * create a new user in database
 *
 * @param user
 * @returns User
 */
export const createUserService = async (user: User): Promise<User> => {
  // extract user data from User object
  const { name, email, password } = user;

  // call createHashedPassword function to hash the password
  const hashedPassword = await createHashedPassword(password);

  const newUser = { name, email, password: hashedPassword };

  const [createdUser] = await db.insert(UsersTable).values(newUser).returning();

  return {
    ...createdUser,
    createdAt: new Date(createdUser.createdAt),
    updatedAt: createdUser.updatedAt
      ? new Date(createdUser.updatedAt)
      : undefined,
    role: createdUser.role ?? undefined,
  };
};

/**
 * check if email already exists in database
 *
 * @param email
 * @returns boolean
 */
export const isEmailInDatabase = async (email: string): Promise<boolean> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  return !!userInDb;
};

/**
 * get user by email from database
 *
 * @param email
 * @returns User | null
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!userInDb) return null;

  return {
    ...userInDb,
    role: userInDb.role ?? undefined,
    createdAt: new Date(userInDb.createdAt),
    updatedAt: userInDb.updatedAt ? new Date(userInDb.updatedAt) : undefined,
  };
};

/**
 * create a new hashed password using bcryptjs
 *
 * @param password
 * @returns string
 */
const createHashedPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

/**
 * check if given password is valid
 *
 * @param password
 * @param hashedPassword
 * @returns boolean
 */
export const isPasswordCorrect = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
