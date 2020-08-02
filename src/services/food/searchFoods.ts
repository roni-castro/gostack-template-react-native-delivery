import api from '../api';
import { FoodData, FoodDetailsData } from '../models/food';

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

export const findFoodById = async (id: number): Promise<FoodDetailsData> => {
  const response = await api.get<FoodData>(`/foods/${id}`);
  try {
    await api.get<FoodData>(`/favorites/${id}`);
    return {
      foodData: response.data,
      isFavoriteFood: true,
    };
  } catch (error) {
    if (error.response.status === 404) {
      return {
        foodData: response.data,
        isFavoriteFood: false,
      };
    }
    throw error;
  }
};
