import api from '../api';
import { FoodData } from '../models/food';

export const fetchFavoriteFoods = async (): Promise<FoodData[]> => {
  const response = await api.get<FoodData[]>(`/favorites`);
  return response.data;
};
