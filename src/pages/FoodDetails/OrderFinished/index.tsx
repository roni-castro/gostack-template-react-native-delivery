import React from 'react';
import { Image } from 'react-native';
import { Container, Title } from './styles';
import Like from '../../../assets/like.png';

const OrderFinished: React.SFC = () => {
  return (
    <Container>
      <Image source={Like} />
      <Title>Pedido Concluido</Title>
    </Container>
  );
};

export default OrderFinished;
