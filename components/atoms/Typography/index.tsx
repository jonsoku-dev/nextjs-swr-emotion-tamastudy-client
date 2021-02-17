import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

import { DynamicComponent, DynamicComponentProps } from '../DynamicComponent';

export const H1 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'h1', ...c }))`
  font-size: 2.6rem;
  font-weight: 800;
`;
export const H2 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'h2', ...c }))`
  font-size: 2.4rem;
  font-weight: 700;
`;
export const H3 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'h3', ...c }))`
  font-size: 2.2rem;
  font-weight: 700;
`;
export const H4 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'h4', ...c }))`
  font-size: 2rem;
  font-weight: 700;
`;
export const SubH1 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'p', ...c }))`
  font-size: 1.8rem;
  font-weight: 600;
`;
export const SubH2 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'p', ...c }))`
  font-size: 1.6rem;
  font-weight: 600;
`;
export const Body = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'p', ...c }))`
  font-size: 1.4rem;
  font-weight: 400;
`;
export const Body2 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'p', ...c }))`
  font-size: 1.2rem;
  font-weight: 400;
`;

export const Span = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'span', ...c }))`
  font-size: 1.4rem;
  font-weight: 400;
`;

export const Span2 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'span', ...c }))`
  font-size: 1.2rem;
  font-weight: 400;
`;

export const Span3 = styled((c: PropsWithChildren<DynamicComponentProps>) => DynamicComponent({ el: 'span', ...c }))`
  font-size: 1rem;
  font-weight: 400;
`;
