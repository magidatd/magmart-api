import { Request, Response } from 'express';
import {
  getAllItemsController,
  getItemByIdController,
} from '../src/controllers/item-controller';
import { items, Item } from '../src/models/item';
import { json } from 'stream/consumers';

describe('Item Controller', () => {
  it('should return all items', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    items.length = 0;

    getAllItemsController(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Items fetched successfully',
      items: [],
    });
  });

  it('should return a single item ny id', () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    items.push({
      id: 1,
      name: 'Item 1',
      description: 'Item description',
      price: 1,
      quantity: 1,
      createdAt: new Date(),
    } as Item);

    getItemByIdController(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Items with id 1 fetched successfully',
      items: {
        id: 1,
        name: 'Item 1',
        description: 'Item description',
        price: 1,
        quantity: 1,
        createdAt: new Date(),
      },
    });
  });
});
