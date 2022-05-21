import React from 'react';
import type { FC } from 'react';

type Props = {
  orderedMenu: string;
};

export const Thanks: FC<Props> = ({ orderedMenu }) => {
  return (
    <>
      <p>ご注文ありがとうございました。</p>
      <p className='mt-2 text-xl font-bold'>
        注文内容：
        <span className='underline'>{orderedMenu}</span>
      </p>
    </>
  );
};
