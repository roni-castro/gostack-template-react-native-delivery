import api from '../api';
import { FoodData } from '../models/food';

interface SearchFoodParams {
  category?: number;
}

export const searchFood = async ({
  category,
}: SearchFoodParams): Promise<FoodData[]> => {
  const response = await api.get<FoodData[]>('/foods', {
    params: { category },
  });
  return response.data;
};
