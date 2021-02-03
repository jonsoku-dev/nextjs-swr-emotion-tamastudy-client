import * as React from 'react';
import { useEffect } from 'react';

import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { User } from '../interfaces';
import ListItem from './ListItem';

type Props = {
  items: User[];
};

const List = ({ items }: Props) => {
  useTypedSelector(({ cells: { order, data } }) => order.map((id) => data[id]));

  const { fetchCell2 } = useActions();

  useEffect(() => {
    fetchCell2();
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <ListItem data={item} />
        </li>
      ))}
    </ul>
  );
};

export default List;
