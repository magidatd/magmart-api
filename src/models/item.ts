export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UpdatedItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt: Date;
}

export let items: Item[] = [];
