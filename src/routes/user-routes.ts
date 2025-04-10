import { Router } from 'express';
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
  createUserWithAddressController,
  getUserWithAddressByIdController,
  updateUserWithAddressController,
  deleteUserWithAddressController,
  getAllUsersWithAddressController,
} from '../controllers/user-controller';

const router = Router();

router.post('/', createUserController); // create a new user
router.get('/', getAllUsersController); // get all users
router.get('/user/:id', getUserByIdController); // get a single user by id
router.get('/user/email/:email', getUserByEmailController); // get a single user by email
router.put('/user/:id', updateUserController); // update a user
router.delete('/user/:id', deleteUserController); // delete a user
router.post('/user', createUserWithAddressController); // create a user with address relation
router.get('/user/:id/address', getUserWithAddressByIdController); // get auser with address by id
router.put('/user/:id/address', updateUserWithAddressController); // update a user with address relation
router.delete('/user/:id/address', deleteUserWithAddressController); // delete a user with address relatioon
router.get('/user', getAllUsersWithAddressController); // get all users with address

export default router;
