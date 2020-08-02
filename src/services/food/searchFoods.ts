import api from '../api';
import { FoodData } from '../models/food';

interface SearchFoodParams {
  category?: number;
  name?: string;
}

export const searchFoods = async ({
  category,
  name,
}: SearchFoodParams): Promise<FoodData[]> => {
  const response = await api.get<FoodData[]>('/foods', {
    params: { category_like: category, name_like: name },
  });
  return response.data;
};

export const findFoodById = async (id: number): Promise<FoodData> => {
  const response = await api.get<FoodData>(`/foods/${id}`);
  return response.data;
};
