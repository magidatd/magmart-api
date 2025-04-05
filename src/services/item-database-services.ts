import { items, Item, UpdatedItem } from "../models/item";

/**
 * create a new item in memory
 *
 * @param item
 * @returns Item
 */
export const createItemService = (item: Item): Item => {
  items.push(item);
  return item;
};

/**
 * get all items in memory
 *
 * @returns Item[]
 */
export const getItemsService = (): Item[] => {
  return items;
};

/**
 * get a single item in memory
 *
 * @param id
 * @returns Item | undefined
 */
export const getItemByIdService = (id: number): Item | undefined => {
  return items.find((item) => item.id === id);
};

/**
 * get a single item in memory by name
 *
 * @param name
 * @returns Item | undefined
 */
export const getItemByNameService = (name: string): Item | undefined => {
  return items.find((item) => item.name === name);
};

/**
 * update a single item in memory
 *
 * @param id
 * @param item
 * @returns Item | undefined
 */
export const updateItemService = (
  id: number,
  item: UpdatedItem,
): Item | undefined => {
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  items[index] = { ...items[index], ...item }; // spread item with index in array to merge with new item
  return items[index];
};

/**
 * delete a single item in memory
 *
 * @param id
 * @returns Item | undefined
 */
export const deleteItemService = (id: number): Item | undefined => {
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  const deletedItem = items[index];

  items.splice(index, 1); // remove item from memory array

  return deletedItem;
};
