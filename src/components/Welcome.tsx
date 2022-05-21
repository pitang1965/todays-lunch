import React from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import { Announcement } from './Announcement';

type Props = {
  isLogin: boolean;
};

export const Welcome: FC<Props> = ({ isLogin }) => {
  return (
    <>
      <Announcement />
      <p>
        いらっしゃいませ。
        {isLogin ? (
          <span>注文可能な時間帯は前日の15時から当日の9:59までです。</span>
        ) : (
          <span className='mt-4 font-bold text-red-600'>
            注文するには
            <Link href='/api/auth/login'>
              <a className='underline'>ログイン</a>
            </Link>
            してください。
          </span>
        )}
      </p>
    </>
  );
};
