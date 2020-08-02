import api from '../api';
import { FoodData } from '../models/food';

interface SearchFoodParams {
  category?: number;
  name?: string;
}

export const searchFood = async ({
  category,
  name,
}: SearchFoodParams): Promise<FoodData[]> => {
  const response = await api.get<FoodData[]>('/foods', {
    params: { category_like: category, name_like: name },
  });
  return response.data;
};
