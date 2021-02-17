import { css, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';

import { FlexBox, InfoLabel } from '../../atoms';
import { Body2, H4 } from '../../atoms/Typography';

interface Props {
  id: number;
  title: string;
  author: string;
  createdAt: Date | string;
  commentCount: number;
  url?: string;
}

export const BaseCard: React.FC<Props> = ({ id, title, author, createdAt, commentCount, url }) => {
  const theme = useTheme();
  const router = useRouter();

  const onClickCard = useCallback(() => {
    if (url) {
      router.push(url);
    } else {
      return;
    }
  }, [url]);

  return (
    <div
      css={css`
        width: 100%;
        padding: ${theme.space * 4}px 0;
        display: flex;
        cursor: pointer;
        border-bottom: 1px solid #eaeaea;
      `}
      onClick={onClickCard}
      onKeyDown={onClickCard}
      role="button"
      tabIndex={id}>
      {/* title, author */}
      <div
        css={css`
          flex: 9;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: ${theme.space * 2}px;
        `}>
        <H4>{title}</H4>
        <FlexBox direction={'column'} gap={4}>
          <InfoLabel label={'작성자'} value={author} />
          <InfoLabel label={'작성일'} value={createdAt} />
        </FlexBox>
      </div>
      {/* icons */}
      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          gap: ${theme.space}px;
        `}>
        <div
          css={css`
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: ${theme.space / 2}px;
          `}>
          <AiOutlineHeart size={'2rem'} />
          <Body2 el={'span'}>{commentCount}</Body2>
        </div>
        <div
          css={css`
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: ${theme.space / 2}px;
          `}>
          <FaRegCommentDots size={'1.8rem'} />
          <Body2 el={'span'}>{commentCount}</Body2>
        </div>
      </div>
    </div>
  );
};
