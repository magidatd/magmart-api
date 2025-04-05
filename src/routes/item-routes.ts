import { Router } from 'express';
import {
  createItemController as createItem,
  getAllItemsController as getAllItems,
  getItemByIdController as getItemById,
  getItemByNameController as getItemByName,
  updateItemController as updateItem,
  deleteItemController as deleteItem,
} from '../controllers/item-controller';

const router = Router();

router.post('/', createItem);
router.get('/', getAllItems);
router.get('/item/:id', getItemById);
router.get('/item/name/:name', getItemByName);
router.put('/item/:id', updateItem);
router.delete('/item/:id', deleteItem);

export default router;
