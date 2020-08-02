import React from 'react';
import { FavoriteFoodProvider } from './favorite-context';

const AppProvider: React.FC = ({ children }) => (
  <FavoriteFoodProvider>{children}</FavoriteFoodProvider>
);

export default AppProvider;
