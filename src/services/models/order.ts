export interface OrderExtraData {
  id: number;
  name: string;
  value: number;
}

export interface OrderData {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  image_url: string;
  extras: OrderExtraData[];
}
