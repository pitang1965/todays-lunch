import React, { useState, useEffect } from 'react';
import TopMenu from '../components/TopMenu';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import { currentDate } from '../logic/nextLunch';
import { getStringFromDate } from '../lib/timeUtile';

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  const [message, setMessage] = useState('');

  // ログアウトボタンを押してログアウトするまでの間
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (error) {
      setMessage(`エラー：${error}`);
      setIsLoggingOut(false);
    } else if (isLoading) {
      setIsLoggingOut(true);
      setMessage(`読み込み中...`);
    } else if (user) {
      setMessage(`こんにちは、${user?.nickname || user?.name}さん。`);
      setIsLoggingOut(false);
    } else {
      setMessage(`未ログイン`);
      setIsLoggingOut(false);
    }
  }, [user, error, isLoading]);

  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  const testDateString = getStringFromDate(currentDate());

  return (
    <div className='flex flex-col'>
      <div className='flex items-center'>
        <div className='basis-1/3 text-left'>
          <TopMenu />
        </div>
        <div className='basis-2/5 text-center'>
          <Link href='/' passHref>
            <p className='text-2xl font-bold text-red-600'>今日のお弁当</p>
          </Link>
        </div>
        <div className='basis-1/3 text-right'>
          <Link href='/api/auth/logout'>
            <a
              onClick={() => {
                setIsLoggingOut(true);
                setMessage('ログアウト中です。お待ちください...');
              }}
              className={`rounded-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 ${
                !user || isLoggingOut ? 'hidden' : ''
              }`}
            >
              ログアウト
            </a>
          </Link>
          <Link href='/api/auth/login'>
            <a
              className={`rounded-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 ${
                user || isLoggingOut ? 'hidden' : ''
              }`}
            >
              ログイン
            </a>
          </Link>
        </div>
      </div>
      <div className='flex flex-row gap-10 justify-center items-center mt-2'>
        {user && <p className='self-center'>{message}</p>}
        {isTestMode && (
          <p className='font-bold text-orange-600 animate-pulse'>
            テスト:{testDateString}
          </p>
        )}
      </div>
    </div>
  );
}
