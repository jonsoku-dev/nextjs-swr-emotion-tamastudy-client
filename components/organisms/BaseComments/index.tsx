import React from 'react';

import { IComment } from '../../../shared/apis/comment';
import { FlexBox } from '../../atoms/FlexBox';
import { BaseComment } from '../../molecules/BaseComment';

interface ICommentV2 extends IComment {
  show: boolean;
}

interface Props {
  items?: ICommentV2[];
  onClickEdit?: any;
  onClickDelete?: any;
}

export const BaseComments: React.FC<Props> = ({ items, ...rest }) => {
  if (!items) return null;
  return (
    <FlexBox direction={'column'} gap={16}>
      {items.map((comment) => (
        <BaseComment key={comment.commentId} comment={comment} show={comment.show} {...rest} />
      ))}
    </FlexBox>
  );
};
