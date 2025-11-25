export interface Property {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  location: string;
  photos: string[];
  rating: number;
  reviews: number;
}

export interface NewProperty {
  location: string;
  type: string;
  description: string;
  price: number;
  ownerCi: string;
  contact: string;
  whatsapp: string;
  photos: string[];
}