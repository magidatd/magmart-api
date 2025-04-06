import { Request, Response, NextFunction } from 'express';
import {
  createUserService,
  isEmailInDatabaseService,
  getAllUsersService,
  getUserByIdService,
  getUserByEmailService,
  updateUserService,
} from '../services/user-database-services';
import {
  isValidPassword,
  isValidEmail,
  sanitizeString,
  isValidName,
  isValidRole,
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
    const { name, password, email } = req.body;

    // sanitize user data
    const sanitizeName = sanitizeString(name);
    const sanitizeEmail = sanitizeString(email);
    const sanitizePassword = sanitizeString(password);

    // validate user data
    if (!name || !password || !email) {
      res.status(400).json({
        message: 'All fields are required',
      });

      return;
    }

    if (name && !isValidName(sanitizeName)) {
      res.status(400).json({
        message: 'Name is not valid.',
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
      name: sanitizeName,
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

    const { name, email, password, role } = req.body;

    // check if id is a number
    if (isNaN(Number(id))) {
      res.status(500).json({
        message: 'Internal Server Error.',
      });

      exit(1);
    }

    const userId = parseInt(id, 10);

    // sanitize user data
    const sanitizeName = name ? sanitizeString(name) : undefined;
    const sanitizeEmail = email ? sanitizeString(email) : undefined;
    const sanitizePassword = password ? sanitizeString(password) : undefined;
    const sanitizeRole = role ? sanitizeString(role) : undefined;

    // validate user data
    if (!name && !email && !password && !role) {
      res.status(400).json({
        message: 'At least one field is required to update the user.',
      });

      return;
    }

    let userData: Record<string, any> = {};

    if (name && sanitizeName && !isValidName(sanitizeName)) {
      res.status(400).json({
        message: 'Name is not valid.',
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
    if (sanitizeName) {
      userData = {
        ...userData,
        name: sanitizeName,
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
