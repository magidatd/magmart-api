import { Request, Response, NextFunction } from 'express';
import {
  createUserService,
  isEmailInDatabaseService,
  getAllUsersService,
  getUserByIdService,
  getUserByEmailService,
  updateUserService,
  deleteUserService,
  createUserWithAddressService,
  getUserWithAddressByIdService,
} from '../services/user-database-services';
import {
  isValidPassword,
  isValidEmail,
  sanitizeString,
  isValidName,
  isValidRole,
  isValidUrl,
  isValidPhone,
} from '../utilities/validators';
import { get } from 'http';
import { exit } from 'process';
import { user } from '../database/schema';

/**
 * create s new user
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // extract user data from request body
    const { firstName, lastName, password, email } = req.body;

    // sanitize user data
    const sanitizeFirstName = sanitizeString(firstName);
    const sanitizeLastName = sanitizeString(lastName);
    const sanitizeEmail = sanitizeString(email);
    const sanitizePassword = sanitizeString(password);

    // validate user data
    if (!firstName || !lastName || !password || !email) {
      res.status(400).json({
        message: 'All fields are required',
      });

      return;
    }

    if (firstName && !isValidName(sanitizeFirstName)) {
      res.status(400).json({
        message: 'First name is not valid.',
      });

      return;
    }

    if (lastName && !isValidName(sanitizeLastName)) {
      res.status(400).json({
        message: 'Last name is not valid.',
      });

      return;
    }

    if (email && !isValidEmail(sanitizeEmail)) {
      res.status(400).json({
        message: 'Email is not valid.',
      });

      return;
    }

    if (password && !isValidPassword(sanitizePassword)) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });

      return;
    }

    // check if email already exists in database
    const emailExists = await isEmailInDatabaseService(sanitizeEmail);

    if (emailExists) {
      res.status(400).json({
        message: 'Email is already in use.',
      });

      return;
    }

    // create user object
    const user = {
      firstName: sanitizeFirstName,
      lastName: sanitizeLastName,
      email: sanitizeEmail,
      password: sanitizePassword,
    };

    // call createUserService function to create user in database
    const createdUser = await createUserService(user);

    res
      .status(201)
      .json({ message: 'User created successfully', user: createdUser });
  } catch (error) {
    next(error);
  }
};

/**
 * get all users
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sortOrder } = req.query;

    let users = [];

    if (sortOrder && sortOrder !== 'asc' && sortOrder !== 'desc') {
      users = await getAllUsersService();
    } else if (!sortOrder) {
      users = await getAllUsersService();
    } else {
      users = await getAllUsersService(sortOrder as string);
    }

    res.status(200).json({
      message: 'Users retrieved successfully.',
      users: users.map((user) => ({
        ...user,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * get a single user by id
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      res.status(500).json({
        message: 'Internal Server Error.',
      });

      exit(1);
    }

    const userId = parseInt(id, 10);

    const user = await getUserByIdService(userId);

    if (!user) {
      res.status(404).json({
        message: `User with id ${userId} not found.`,
      });

      return;
    }

    res.status(200).json({
      message: `User with id ${userId} retrieved successfully.`,
      user: {
        ...user,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * get a single user by email
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const getUserByEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.params;

    // sanitize user data
    const sanitizeEmail = sanitizeString(email);

    if (!isValidEmail(sanitizeEmail)) {
      res.status(400).json({
        message: 'Email is not valid.',
      });

      return;
    }

    const user = await getUserByEmailService(sanitizeEmail);

    if (!user) {
      res.status(404).json({
        message: `User with email ${sanitizeEmail} not found.`,
      });

      return;
    }

    res.status(200).json({
      message: `User with email ${sanitizeEmail} retrieved successfully.`,
      user: {
        ...user,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * update user by id
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const { firstName, lastName, userImage, email, password, role } = req.body;

    // check if id is a number
    if (isNaN(Number(id))) {
      res.status(500).json({
        message: 'Internal Server Error.',
      });

      exit(1);
    }

    const userId = parseInt(id, 10);

    // sanitize user data
    const sanitizeFirstName = firstName ? sanitizeString(firstName) : undefined;
    const sanitizeLastName = lastName ? sanitizeString(lastName) : undefined;
    const sanitizeEmail = email ? sanitizeString(email) : undefined;
    const sanitizePassword = password ? sanitizeString(password) : undefined;
    const sanitizeRole = role ? sanitizeString(role) : undefined;

    // validate user data
    if (!firstName && !lastName && !userImage && !email && !password && !role) {
      res.status(400).json({
        message: 'At least one field is required to update the user.',
      });

      return;
    }

    let userData: Record<string, any> = {};

    if (firstName && sanitizeFirstName && !isValidName(sanitizeFirstName)) {
      res.status(400).json({
        message: 'First name is not valid.',
      });

      return;
    }

    if (lastName && sanitizeLastName && !isValidName(sanitizeLastName)) {
      res.status(400).json({
        message: 'Last name is not valid.',
      });

      return;
    }

    if (userImage && !isValidUrl(userImage)) {
      res.status(400).json({
        message: 'Image storage location not valid.',
      });

      return;
    }

    if (email && sanitizeEmail && !isValidEmail(sanitizeEmail)) {
      res.status(400).json({
        message: 'Email is not valid.',
      });

      return;
    }

    if (password && sanitizePassword && !isValidPassword(sanitizePassword)) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });

      return;
    }

    if (role && sanitizeRole && !isValidRole(sanitizeRole)) {
      res.status(400).json({
        message: 'Role can only be admin or customer.',
      });

      return;
    }

    // check if email already exists in database
    const emailExists = sanitizeEmail
      ? await isEmailInDatabaseService(sanitizeEmail)
      : false;

    if (emailExists) {
      res.status(400).json({
        message: 'Email is already in use.',
      });

      return;
    }

    // create user object
    if (sanitizeFirstName) {
      userData = {
        ...userData,
        firstName: sanitizeFirstName,
      };
    }

    if (sanitizeLastName) {
      userData = {
        ...userData,
        lastName: sanitizeLastName,
      };
    }

    if (userImage) {
      userData = {
        ...userData,
        userImage: userImage,
      };
    }

    if (sanitizeEmail) {
      userData = {
        ...userData,
        email: sanitizeEmail,
      };
    }

    if (sanitizePassword) {
      userData = {
        ...userData,
        password: sanitizePassword,
      };
    }

    if (sanitizeRole) {
      userData = {
        ...userData,
        role: sanitizeRole,
      };
    }

    // call updateUserService function to update user in database
    const updatedUser = await updateUserService(userId, userData);

    if (!updatedUser) {
      res.status(404).json({
        message: `User with id ${userId} not found.`,
      });

      return;
    }

    res.status(200).json({
      message: `User with id ${userId} updated successfully.`,
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt?.toISOString(),
        updatedAt: updatedUser.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * delete a single user by id
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    // check if id is a number
    if (isNaN(Number(id))) {
      res.status(500).json({
        message: 'Internal Server Error.',
      });

      exit(1);
    }

    const userId = parseInt(id, 10);

    // call deleteUserService function to delete user from database
    const deletedUser = await deleteUserService(userId);

    if (!deletedUser) {
      res.status(404).json({
        message: `User with id ${userId} not found.`,
      });

      return;
    }

    res.status(200).json({
      message: `User with id ${userId} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * create a new user with address in database
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const createUserWithAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // extract user data from request body
    const {
      firstName,
      lastName,
      password,
      email,
      streetAddress,
      postalCode,
      city,
      phone,
      country,
    } = req.body;

    // sanitize user data
    const sanitizeFirstName = sanitizeString(firstName);
    const sanitizeLastName = sanitizeString(lastName);
    const sanitizeEmail = sanitizeString(email);
    const sanitizePassword = sanitizeString(password);
    const sanitizeStreetAddress = sanitizeString(streetAddress);
    const sanitizePostalCode = sanitizeString(postalCode);
    const sanitizeCity = sanitizeString(city);
    const sanitizePhone = sanitizeString(phone);
    const sanitizeCountry = sanitizeString(country);

    // validate user data
    if (
      !firstName ||
      !lastName ||
      !password ||
      !email ||
      !streetAddress ||
      !postalCode ||
      !city ||
      !phone ||
      !country
    ) {
      res.status(400).json({
        message: 'All fields are required',
      });

      return;
    }

    if (firstName && !isValidName(sanitizeFirstName)) {
      res.status(400).json({
        message: 'First name is not valid.',
      });

      return;
    }

    if (lastName && !isValidName(sanitizeLastName)) {
      res.status(400).json({
        message: 'Last name is not valid.',
      });

      return;
    }

    if (email && !isValidEmail(sanitizeEmail)) {
      res.status(400).json({
        message: 'Email is not valid.',
      });

      return;
    }

    if (password && !isValidPassword(sanitizePassword)) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });

      return;
    }

    if (city && !isValidName(sanitizeCity)) {
      res.status(400).json({
        message: 'City name is not valid.',
      });

      return;
    }

    if (phone && !isValidPhone(sanitizePhone)) {
      res.status(400).json({
        message: 'Phone is not valid.',
      });

      return;
    }

    // check if email already exists in database
    const emailExists = await isEmailInDatabaseService(sanitizeEmail);

    if (emailExists) {
      res.status(400).json({
        message: 'Email is already in use.',
      });

      return;
    }

    // create user object
    const user = {
      firstName: sanitizeFirstName,
      lastName: sanitizeLastName,
      email: sanitizeEmail,
      password: sanitizePassword,
    };

    // create address object
    const address = {
      streetAddress: sanitizeStreetAddress,
      postalCode: sanitizePostalCode,
      city: sanitizeCity,
      phone: sanitizePhone,
      country: sanitizeCountry,
    };

    // call createUserWithAddressService function to create new user with address in database
    const createdUserWithAddress = await createUserWithAddressService(
      user,
      address,
    );

    res.status(201).json({
      message: 'User created successfully',
      user: createdUserWithAddress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * get a single user with address by id
 *
 * @param req
 * @param res
 * @param next
 * @returns Promise<void>
 */
export const getUserWithAddressByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    // check if id is a number
    if (isNaN(Number(id))) {
      res.status(500).json({
        message: 'Internal Server Error.',
      });

      exit(1);
    }

    const userId = parseInt(id, 10);

    // call getUserWithAddressByIdService function to get user with address
    const userWithAddress = await getUserWithAddressByIdService(userId);

    if (!userWithAddress) {
      res.status(404).json({
        message: `User with id ${userId} not found.`,
      });

      return;
    }

    res.status(200).json({
      message: `User with id ${userId} retrieved successfully.`,
      user: {
        ...userWithAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};
