import api from '../api';
import { CategoryData } from '../models/category';

export const fetchCategories = async (): Promise<CategoryData[]> => {
  const response = await api.get<CategoryData[]>('/categories');
  return response.data;
};
