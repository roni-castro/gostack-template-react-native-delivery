import api from '../api';
import { OrderData, OrderExtraData } from '../models/order';

interface CreateOrderDTO {
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  image_url: string;
  extras: OrderExtraData[];
  quantity: number;
}

export const fetchOrders = async (): Promise<OrderData[]> => {
  const response = await api.get<OrderData[]>('/orders');
  return response.data;
};

export const createOrder = async (data: CreateOrderDTO): Promise<OrderData> => {
  const response = await api.post<OrderData>('/orders', data);
  return response.data;
};
