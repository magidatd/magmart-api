import { Request, Response, NextFunction } from "express";
import {
  createItemService as createItem,
  getItemByIdService as getItemById,
  getItemByNameService as getItemByName,
  updateItemService as updateItem,
  deleteItemService as deleteItem,
  getItemsService as getItems,
} from "../services/item-database-services";

/**
 * create a new item
 *
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export const createItemController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { name, description, price, quantity } = req.body;
    const item = createItem({
      id: Date.now(),
      name,
      description,
      price,
      quantity,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Item created successfully", item: item });
  } catch (error) {
    next(error);
  }
};

/**
 * get all items
 *
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export const getAllItemsController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const items = getItems();

    res
      .status(200)
      .json({ message: "Items fetched successfully", items: items });
  } catch (error) {
    next(error);
  }
};

/**
 * get a single item by id
 *
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export const getItemByIdController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;
    const item = getItemById(Number(id));

    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: `Item with id ${id} fetched successfully`, item: item });
  } catch (error) {
    next(error);
  }
};

/**
 * get  single item by name
 *
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export const getItemByNameController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { name } = req.params;
    const item = getItemByName(name);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: `Item ${name} fetched successfully`,
      item: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * update a single item
 *
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export const updateItemController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    const item = updateItem(Number(id), {
      name,
      description,
      price,
      quantity,
      updatedAt: new Date(),
    });

    if (!item) {
      res.status(404).json({ message: "Item not found." });
    }

    res
      .status(200)
      .json({ message: `Item with id ${id} updated successfully`, item: item });
  } catch (error) {
    next(error);
  }
};

/**
 * delete a single item
 *
 * @param req
 * @param res
 * @param next
 * @returns void
 */
export const deleteItemController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { id } = req.params;

    const item = deleteItem(Number(id));

    if (!item) {
      res.status(404).json({ message: "Item not found." });
    }

    res
      .status(200)
      .json({ message: `Item with id ${id} deleted successfully`, item: item });
  } catch (error) {
    next(error);
  }
};
