export interface Address {
  id?: number;
  streetAddress: string;
  postalCode: string;
  userId?: number;
  city: string;
  phone: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PartialAddressData {
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  country?: string;
}
