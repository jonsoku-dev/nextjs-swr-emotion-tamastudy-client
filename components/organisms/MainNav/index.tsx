import React from 'react';

import { CLink } from '../../atoms/CLink';
import { FlexBox } from '../../atoms/FlexBox';
import { H4 } from '../../atoms/Typography';

interface Props {}

export const MainNav: React.FC<Props> = () => {
  return (
    <FlexBox el={'nav'}>
      <CLink href={'/'}>
        <H4>HOME</H4>
      </CLink>
      <CLink
        href={{
          pathname: '/board',
          query: {
            page: 0
          }
        }}>
        <H4>BOARD</H4>
      </CLink>
    </FlexBox>
  );
};
