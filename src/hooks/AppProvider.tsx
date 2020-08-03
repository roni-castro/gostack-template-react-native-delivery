import React from 'react';
import { FavoriteFoodProvider } from './favorite-context';
import { OrderProvider } from './order-context';

const AppProvider: React.FC = ({ children }) => (
  <FavoriteFoodProvider>
    <OrderProvider>{children}</OrderProvider>
  </FavoriteFoodProvider>
);

export default AppProvider;
