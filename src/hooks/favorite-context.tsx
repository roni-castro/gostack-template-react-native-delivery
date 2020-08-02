import React, { useState, useCallback } from 'react';
import { FoodData } from '../services/models/food';
import formatValue from '../utils/formatValue';
import { fetchFavoriteFoods } from '../services/food/favorite';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

interface FavoriteFoodData {
  favoriteFoods: Food[];
  fetchFavorites(): Promise<void>;
  removeFavoriteFood(id: number): Promise<void>;
  addFavoriteFood(newFavoriteFood: Food): Promise<void>;
}

const defaultValue = {} as FavoriteFoodData;
const FavoriteFoodContext = React.createContext(defaultValue);

function useFavoriteFood(): FavoriteFoodData {
  const context = React.useContext(FavoriteFoodContext);
  if (!context) {
    throw new Error(
      `useFavoriteFood must be used within a FavoriteFoodProvider`,
    );
  }
  return context;
}

function FavoriteFoodProvider(props: any): JSX.Element {
  const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([]);

  function mapFoodsDataToFoods(foodsData: FoodData[]): Food[] {
    return foodsData.map(
      foodData =>
        ({
          ...foodData,
          formattedPrice: formatValue(foodData.price),
        } as Food),
    );
  }

  const fetchFavorites = useCallback(async (): Promise<void> => {
    const favoritesFoodData = await fetchFavoriteFoods();
    const favorites = mapFoodsDataToFoods(favoritesFoodData);
    setFavoriteFoods(favorites);
  }, []);

  const removeFavoriteFood = useCallback(async (id: number): Promise<void> => {
    setFavoriteFoods(prevFavoriteFoods =>
      prevFavoriteFoods.filter(favoriteFood => favoriteFood.id !== id),
    );
  }, []);

  const addFavoriteFood = useCallback(
    async (newFavoriteFood: Food): Promise<void> => {
      const foodFound = favoriteFoods.find(
        favoriteFood => favoriteFood.id === newFavoriteFood.id,
      );
      if (!foodFound) {
        setFavoriteFoods([...favoriteFoods, newFavoriteFood]);
      }
    },
    [favoriteFoods],
  );

  return (
    <FavoriteFoodContext.Provider
      value={{
        favoriteFoods,
        fetchFavorites,
        addFavoriteFood,
        removeFavoriteFood,
      }}
      {...props}
    />
  );
}

export { useFavoriteFood, FavoriteFoodProvider };
