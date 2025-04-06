import { Request, Response, NextFunction } from 'express';
import {
  createUserService,
  isEmailInDatabase,
} from '../services/user-database-services';
import {
  isValidPassword,
  isValidEmail,
  sanitizeString,
} from '../utilities/validators';

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

    if (!isValidEmail(email)) {
      res.status(400).json({
        message: 'Email is not valid.',
      });
      return;
    }

    if (!isValidPassword(password)) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long and contains only alphanumeric characters.',
      });
      return;
    }

    // check if email already exists in database
    const emailExists = await isEmailInDatabase(sanitizeEmail);

    if (emailExists) {
      res.status(400).json({
        message: 'Email is already in use.',
      });
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
