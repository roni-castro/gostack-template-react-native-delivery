import bigDecimal from 'js-big-decimal';

export const sumDecimal = (a: number, b: number): number =>
  +bigDecimal.add(a, b);

export const multDecimal = (a: number, b: number): number =>
  +bigDecimal.multiply(a, b);

export const divDecimal = (a: number, b: number): number =>
  +bigDecimal.divide(a, b, 2);

export const subDecimal = (a: number, b: number): number =>
  +bigDecimal.subtract(a, b);
