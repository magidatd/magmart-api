import { Router } from 'express';
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  getUserByEmailController,
  updateUserController,
} from '../controllers/user-controller';

const router = Router();

router.post('/', createUserController); // create a new user
router.get('/', getAllUsersController); // get all users
router.get('/user/:id', getUserByIdController); // get a single user by id
router.get('/user/email/:email', getUserByEmailController); // get a single user by email
router.put('/user/:id', updateUserController); // update a user

export default router;
