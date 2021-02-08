import { css, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';

import { Body, Body2 } from '../../atoms/Typography';
import { InfoLabel } from '../../molecules';

interface Props {
  title: string;
  author: string;
  commentCount: number;
  url?: string;
}

export const BaseCard: React.FC<Props> = ({ title, author, commentCount, url }) => {
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
        background-color: #ffffff;
        margin: ${theme.space * 2}px 0;
        padding: ${theme.space * 3}px;
        border-radius: 12px;
        display: flex;
        cursor: pointer;
      `}
      onClick={onClickCard}
      onKeyDown={onClickCard}
      role="button"
      tabIndex={0}>
      {/* title, author */}
      <div
        css={css`
          flex: 9;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: ${theme.space * 2}px;
        `}>
        <Body css={css``}>{title}</Body>
        <InfoLabel label={'작성자'} value={author} />
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
