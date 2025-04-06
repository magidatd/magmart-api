import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import user, { default as UsersTable } from '../database/schema/user';
import db from '../database';
import { asc, desc, eq } from 'drizzle-orm';

interface PartialUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string | null;
}

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
 * get all users from the database
 *
 * @returns User[]
 */
export const getAllUsersService = async (
  sortOrder = 'asc',
): Promise<User[]> => {
  const users = await db.query.user.findMany({
    orderBy: [sortOrder === 'asc' ? asc(user.createdAt) : desc(user.createdAt)],
  });

  return users.map((user) => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    role: user.role ?? undefined,
  }));
};

/**
 * check if email already exists in database
 *
 * @param email
 * @returns boolean
 */
export const isEmailInDatabaseService = async (
  email: string,
): Promise<boolean> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  return !!userInDb;
};

/**
 * get user by id from database
 *
 * @param id
 * @returns User | null
 */
export const getUserByIdService = async (id: number): Promise<User | null> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.id, id),
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
 * get user by email from database
 *
 * @param email
 * @returns User | null
 */
export const getUserByEmailService = async (
  email: string,
): Promise<User | null> => {
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
 * update user in database
 *
 * @param id
 * @param partialData
 * @returns User | null
 */
export const updateUserService = async (
  id: number,
  partialData: Partial<PartialUserData>,
): Promise<User | null> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!userInDb) return null;

  const { name, email, password, role } = userInDb;

  const data = { name, email, password, role };

  const updateUserData = {
    ...data,
    ...partialData,
  };

  const updatedUser = await db
    .update(UsersTable)
    .set(updateUserData)
    .where(eq(user.id, id))
    .returning();

  return {
    ...updatedUser[0],
    role: updatedUser[0].role ?? undefined,
    createdAt: new Date(updatedUser[0].createdAt),
    updatedAt: updatedUser[0].updatedAt
      ? new Date(updatedUser[0].updatedAt)
      : undefined,
  };
};

/**
 * delete user from database
 *
 * @param id
 * @returns boolean
 */
export const deleteUserService = async (id: number): Promise<boolean> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!userInDb) return false;

  await db.delete(UsersTable).where(eq(user.id, id));

  return true;
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
