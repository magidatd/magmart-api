import bcrypt from 'bcryptjs';
import { IntegratedUserData, PartialUserData, User } from '../models/user';
import { Address, PartialAddressData } from '../models/address';
import user, { default as UsersTable } from '../database/schema/user';
import address, { default as AddressTable } from '../database/schema/address';
import db from '../database';
import { asc, desc, eq } from 'drizzle-orm';

/**
 * create a new user in database
 *
 * @param user
 * @returns User
 */
export const createUserService = async (user: User): Promise<User> => {
  // extract user data from User object
  const { firstName, lastName, email, password } = user;

  // call createHashedPassword function to hash the password
  const hashedPassword = await createHashedPassword(password);

  const newUser = { firstName, lastName, email, password: hashedPassword };

  const [createdUser] = await db.insert(UsersTable).values(newUser).returning();

  return {
    ...createdUser,
    createdAt: createdUser.createdAt ? new Date(createdUser.createdAt) : undefined,
    updatedAt: createdUser.updatedAt ? new Date(createdUser.updatedAt) : undefined,
    role: createdUser.role ?? undefined,
    userImage: createdUser.userImage ?? undefined,
  };
};

/**
 * get all users from the database
 *
 * @returns User[]
 */
export const getAllUsersService = async (sortOrder = 'asc'): Promise<User[]> => {
  const users = await db.query.user.findMany({
    orderBy: [sortOrder === 'asc' ? asc(user.createdAt) : desc(user.createdAt)],
  });

  return users.map((user) => ({
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    role: user.role ?? undefined,
    userImage: user.userImage ?? undefined,
  }));
};

/**
 * check if email already exists in database
 *
 * @param email
 * @returns boolean
 */
export const isEmailInDatabaseService = async (email: string): Promise<boolean> => {
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
    createdAt: userInDb.createdAt ? new Date(userInDb.createdAt) : undefined,
    updatedAt: userInDb.updatedAt ? new Date(userInDb.updatedAt) : undefined,
    userImage: userInDb.userImage ?? undefined,
  };
};

/**
 * get user by email from database
 *
 * @param email
 * @returns User | null
 */
export const getUserByEmailService = async (email: string): Promise<User | null> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!userInDb) return null;

  return {
    ...userInDb,
    role: userInDb.role ?? undefined,
    createdAt: userInDb.createdAt ? new Date(userInDb.createdAt) : undefined,
    updatedAt: userInDb.updatedAt ? new Date(userInDb.updatedAt) : undefined,
    userImage: userInDb.userImage ?? undefined,
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

  const { firstName, lastName, userImage, email, password, role } = userInDb;

  const data = { firstName, lastName, userImage, email, password, role };

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
    createdAt: updatedUser[0].createdAt ? new Date(updatedUser[0].createdAt) : undefined,
    updatedAt: updatedUser[0].updatedAt ? new Date(updatedUser[0].updatedAt) : undefined,
    userImage: updatedUser[0].userImage ?? undefined,
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

/**
 * create a new user with address in satabase
 *
 * @param user
 * @param address
 * @returns IntegratedUserData
 */
export const createUserWithAddressService = async (
  user: User,
  address: Address,
): Promise<IntegratedUserData> => {
  const { firstName, lastName, email, password } = user;

  const hashedPassword = await createHashedPassword(password);

  const newUser = { firstName, lastName, email, password: hashedPassword };

  const { streetAddress, postalCode, city, phone, country } = address;

  const newAddress = { streetAddress, postalCode, city, phone, country };

  const createdUser: IntegratedUserData = await db.transaction(async (tx) => {
    const [createdUserTx] = await tx.insert(UsersTable).values(newUser).returning();

    const [createdAddressTx] = await tx
      .insert(AddressTable)
      .values({
        ...newAddress,
        userId: createdUserTx.id,
      })
      .returning();

    return {
      id: createdUserTx.id,
      userIdInAddress: createdAddressTx.userId,
      firstName: createdUserTx.firstName,
      lastName: createdUserTx.lastName,
      email: createdUserTx.email,
      password: createdUserTx.password,
      role: createdUserTx.role ?? null,
      streetAddress: createdAddressTx.streetAddress,
      postalCode: createdAddressTx.postalCode,
      city: createdAddressTx.city,
      phone: createdAddressTx.phone,
      country: createdAddressTx.country,
    };
  });

  return createdUser;
};

/**
 * get user with address by id from database
 *
 * @param id
 * @returns IntegratedUserData / null *
 */
export const getUserWithAddressByIdService = async (
  id: number,
): Promise<IntegratedUserData | null> => {
  const userInDb: IntegratedUserData | null = await db.transaction(async (tx) => {
    const userInDbTx = await tx.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!userInDbTx) {
      tx.rollback();
    }

    if (!userInDbTx) {
      tx.rollback();
      return null;
    }

    const userAddressTx = await tx.query.address.findFirst({
      where: eq(address.userId, userInDbTx.id),
    });

    if (!userAddressTx) {
      tx.rollback();
      return null;
    }

    return {
      id: userInDbTx.id,
      userIdInAddress: userAddressTx.userId,
      firstName: userInDbTx?.firstName ?? null,
      lastName: userInDbTx?.lastName ?? '',
      userImage: userInDbTx.userImage ?? undefined,
      email: userInDbTx.email,
      password: userInDbTx.password,
      role: userInDbTx.role ?? null,
      streetAddress: userAddressTx.streetAddress,
      postalCode: userAddressTx.postalCode,
      city: userAddressTx.city,
      phone: userAddressTx.phone,
      country: userAddressTx.country,
    };
  });

  return userInDb;
};

/**
 * update user with address in database
 *
 * @param id
 * @param PartialUserData
 * @param PartialAddressData
 * @returns IntegratedUserData | null
 */
export const updateUserWithAddressService = async (
  id: number,
  partialUserData: Partial<PartialUserData>,
  partialAddressData: Partial<PartialAddressData>,
): Promise<IntegratedUserData | null> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!userInDb) return null;

  const userAddress = await db.query.address.findFirst({
    where: eq(address.userId, userInDb.id),
  });

  if (!userAddress) return null;

  const { firstName, lastName, userImage, email, password, role } = userInDb;
  const { streetAddress, postalCode, city, phone, country } = userAddress;

  const userData = { firstName, lastName, userImage, email, password, role };
  const addressData = { streetAddress, postalCode, city, phone, country };

  const updateUserData = {
    ...userData,
    ...partialUserData,
  };

  const updateAddressData = {
    ...addressData,
    ...partialAddressData,
  };

  const userInDbUpdated: IntegratedUserData | null = await db.transaction(async (tx) => {
    const [updatedUserTx] = await tx
      .update(UsersTable)
      .set(updateUserData)
      .where(eq(user.id, id))
      .returning();

    if (!updatedUserTx) {
      tx.rollback();
      return null;
    }

    const [updatedAddressTx] = await tx
      .update(AddressTable)
      .set(updateAddressData)
      .where(eq(address.userId, updatedUserTx.id))
      .returning();

    if (!updatedAddressTx) {
      tx.rollback();
      return null;
    }

    return {
      id: updatedUserTx.id,
      userIdInAddress: updatedAddressTx.userId,
      firstName: updatedUserTx?.firstName ?? null,
      lastName: updatedUserTx?.lastName ?? '',
      userImage: updatedUserTx.userImage ?? undefined,
      email: updatedUserTx.email,
      password: updatedUserTx.password,
      role: updatedUserTx.role ?? null,
      streetAddress: updatedAddressTx.streetAddress,
      postalCode: updatedAddressTx.postalCode,
      city: updatedAddressTx.city,
      phone: updatedAddressTx.phone,
      country: updatedAddressTx.country,
    };
  });

  return userInDbUpdated;
};

/**
 * delete a user with address
 *
 * @param id
 * @returns boolean
 */
export const deleteUserWithAddressService = async (id: number): Promise<boolean> => {
  const userInDb = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!userInDb) return false;

  const userAddress = await db.query.address.findFirst({
    where: eq(address.userId, userInDb.id),
  });

  if (!userAddress) return false;

  const userInDbDeleted: boolean = await db.transaction(async (tx) => {
    const isAddressDeleted = await tx.delete(AddressTable).where(eq(address.userId, userInDb.id));

    if (!isAddressDeleted) {
      tx.rollback();
      return false;
    }

    const isUserDeleted = await tx.delete(UsersTable).where(eq(user.id, id)).returning();

    if (!isUserDeleted) {
      tx.rollback();
      return false;
    }

    return true;
  });

  return userInDbDeleted;
};

/**
 * get all users with address from the database
 *
 * @returns IntegratedUserData[]
 */
export const getAllUsersWithAddressService = async (): Promise<IntegratedUserData[]> => {
  const users = await db
    .select({
      id: user.id,
      userIdInAddress: address.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userImage: user.userImage,
      email: user.email,
      password: user.password,
      role: user.role,
      streetAddress: address.streetAddress,
      postalCode: address.postalCode,
      city: address.city,
      phone: address.phone,
      country: address.country,
    })
    .from(user)
    .leftJoin(address, eq(user.id, address.userId))
    .orderBy(asc(user.lastName));

  return users.map((user) => ({
    id: user.id,
    userIdInAddress: user.userIdInAddress ?? 0, // Ensure userIdInAddress is a number
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    userImage: user.userImage ?? undefined,
    email: user.email ?? '',
    password: user.password ?? '',
    role: user.role ?? null,
    streetAddress: user.streetAddress ?? '',
    postalCode: user.postalCode ?? '',
    city: user.city ?? '',
    phone: user.phone ?? '',
    country: user.country ?? '',
  }));
};
