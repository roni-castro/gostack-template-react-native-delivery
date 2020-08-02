import api from '../api';
import { FoodData } from '../models/food';

export const fetchFavoriteFoods = async (): Promise<FoodData[]> => {
  const response = await api.get<FoodData[]>(`/favorites`);
  return response.data;
};

export const markFavoriteFood = async (food: FoodData): Promise<FoodData> => {
  const response = await api.post<FoodData>(`/favorites`, food);
  return response.data;
};

export const unmarkFavoriteFood = async (id: number): Promise<void> => {
  await api.delete<FoodData>(`/favorites/${id}`);
};

export const findFavoriteFood = async (foodId: number): Promise<FoodData> => {
  const response = await api.get<FoodData>(`/favorites${foodId}`);
  return response.data;
};
