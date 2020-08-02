import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatValue from '../../utils/formatValue';
import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';
import { findFoodById } from '../../services/food/searchFoods';
import { FoodData } from '../../services/models/food';
import { createOrder } from '../../services/order/orders';
import copyDeep from '../../utils/copyDeep';
import { multDecimal, sumDecimal } from '../../utils/operations';
import {
  unmarkFavoriteFood,
  markFavoriteFood,
} from '../../services/food/favorite';
import OrderFinished from './OrderFinished';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  thumbnail_url: string;
  formattedPrice: string;
  extras: Extra[];
}

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [hasFinishedOrder, setHasFinishedOrder] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    function mapFoodDataToFood(foodData: FoodData): Food {
      return {
        ...foodData,
        formattedPrice: formatValue(foodData.price),
        extras: foodData.extras.map(foodExtra => ({
          ...foodExtra,
          quantity: 0,
        })),
      };
    }

    async function loadFood(): Promise<void> {
      const { id } = routeParams;
      const response = await findFoodById(id);
      const foodMapped = mapFoodDataToFood(response.foodData);
      const foodExtras = foodMapped.extras;
      setFood(foodMapped);
      setExtras(foodExtras);
      setIsFavorite(response.isFavoriteFood);
    }

    loadFood();
  }, [routeParams]);

  useEffect(() => {
    let timeoutCallback: NodeJS.Timeout;
    async function goBack(): Promise<void> {
      if (hasFinishedOrder) {
        timeoutCallback = setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    }
    goBack();

    return () => clearTimeout(timeoutCallback);
  }, [navigation, hasFinishedOrder]);

  function handleIncrementExtra(id: number): void {
    const foodExtraIndex = extras.findIndex(extra => extra.id === id);
    const extraFound = copyDeep<Extra>(extras[foodExtraIndex]);
    if (extraFound) {
      const extrasCopy = [...extras];
      extraFound.quantity += 1;
      extrasCopy.splice(foodExtraIndex, 1, extraFound);
      setExtras(extrasCopy);
    }
  }

  function handleDecrementExtra(id: number): void {
    const foodExtraIndex = extras.findIndex(extra => extra.id === id);
    const extraFound = copyDeep<Extra>(extras[foodExtraIndex]);
    if (extraFound && extraFound.quantity > 0) {
      const extrasCopy = [...extras];
      extraFound.quantity -= 1;
      extrasCopy.splice(foodExtraIndex, 1, extraFound);
      setExtras(extrasCopy);
    }
  }

  function handleIncrementFood(): void {
    setFoodQuantity(prevQuantity => prevQuantity + 1);
  }

  function handleDecrementFood(): void {
    if (foodQuantity > 1) {
      setFoodQuantity(prevQuantity => prevQuantity - 1);
    }
  }

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      unmarkFavoriteFood(food.id);
    } else {
      markFavoriteFood(food);
    }
    setIsFavorite(!isFavorite);
  }, [isFavorite, food]);

  const cartTotal = useMemo(() => {
    const totalExtra = extras
      .map(extra => multDecimal(extra.quantity, extra.value))
      .reduce((prevValue, curValue) => sumDecimal(prevValue, curValue), 0.0);
    const total = sumDecimal(multDecimal(foodQuantity, food.price), totalExtra);
    return formatValue(total);
  }, [extras, food, foodQuantity]);

  async function handleFinishOrder(): Promise<void> {
    const data = {
      ...food,
      id: undefined,
      quantity: foodQuantity,
      extras,
    };
    await createOrder(data);
    setHasFinishedOrder(true);
  }

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  return (
    <Container>
      {hasFinishedOrder && <OrderFinished />}
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdittionalItemText testID="food-quantity">
                {foodQuantity}
              </AdittionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
