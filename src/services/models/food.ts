export interface FoodExtraData {
  id: number;
  name: string;
  value: number;
}

export interface FoodDetailsData {
  foodData: FoodData;
  isFavoriteFood: boolean;
}

export interface FoodData {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  image_url: string;
  extras: FoodExtraData[];
}
