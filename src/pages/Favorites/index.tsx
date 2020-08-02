import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { fetchFavoriteFoods } from '../../services/food/favorite';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';
import { FoodData } from '../../services/models/food';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);

  useEffect(() => {
    function mapFoodsDataToFoods(foodsData: FoodData[]): Food[] {
      return foodsData.map(
        foodData =>
          ({
            ...foodData,
            formattedPrice: formatValue(foodData.price),
          } as Food),
      );
    }
    async function loadFavorites(): Promise<void> {
      const favoritesFoodData = await fetchFavoriteFoods();
      const favoritesFood = mapFoodsDataToFoods(favoritesFoodData);
      setFavorites(favoritesFood);
    }

    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
