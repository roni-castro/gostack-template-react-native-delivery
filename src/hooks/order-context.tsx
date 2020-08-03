import React, { useState, useCallback } from 'react';
import { fetchOrders, createOrder } from '../services/order/orders';
import formatValue from '../utils/formatValue';
import { OrderData, OrderExtraData } from '../services/models/order';

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

interface CreateOrderDTO {
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  image_url: string;
  extras: OrderExtraData[];
  quantity: number;
}

interface OrderContextData {
  orders: Order[];
  getOrders(): Promise<void>;
  createNewOrder(data: CreateOrderDTO): Promise<void>;
}

const OrderContext = React.createContext({} as OrderContextData);

function useOrder(): OrderContextData {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error(`useOrder must be used within a OrderProvider`);
  }
  return context;
}

function OrderProvider(props: any): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const mapOrderDataToFood = useCallback((orderData: OrderData): Order => {
    return {
      ...orderData,
      formattedPrice: formatValue(orderData.price),
    } as Order;
  }, []);

  const mapOrdersDataToFoods = useCallback(
    (ordersData: OrderData[]): Order[] => {
      return ordersData.map(orderData => mapOrderDataToFood(orderData));
    },
    [mapOrderDataToFood],
  );

  const getOrders = useCallback(async (): Promise<void> => {
    const ordersData = await fetchOrders();
    const foods = mapOrdersDataToFoods(ordersData);
    setOrders(foods);
  }, [mapOrdersDataToFoods]);

  const createNewOrder = useCallback(
    async (data: CreateOrderDTO): Promise<void> => {
      const newOrder = await createOrder(data);
      setOrders([...orders, mapOrderDataToFood(newOrder)]);
    },
    [orders, mapOrderDataToFood],
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrders,
        createNewOrder,
      }}
      {...props}
    />
  );
}

export { useOrder, OrderProvider };
