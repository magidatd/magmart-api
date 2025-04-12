export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  userImage?: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithRefreshToken extends User {
  refreshTokens: {
    id: number;
    hashedToken: string;
    revoked: boolean;
    createdAt: Date;
    updatedAt: Date;
    expireAt: Date;
  };
}

export interface UserWithAddress extends User {
  address: {
    id: number;
    streetAddress: string;
    postalCode: string;
    city: string;
    phone: string;
  };
}

export interface UserWithOrders extends User {
  orders: {
    id: number;
    estimatedDeliveryTime: string;
    actualDwliveryTime: string;
    items: number;
    price: number;
    discount: number;
    totalPrice: number;
  }[];
}

export interface PartialUserData {
  firstName?: string;
  lastName?: string;
  userImage?: string;
  email?: string;
  password?: string;
  role?: string | null;
}

export interface IntegratedUserData {
  id: number;
  userIdInAddress: number;
  firstName: string;
  lastName: string;
  userImage?: string;
  email: string;
  password?: string;
  role?: string | null;
  streetAddress: string;
  postalCode: string;
  city: string;
  phone: string;
  country: string;
}
