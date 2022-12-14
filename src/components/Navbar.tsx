import React, { useState, useEffect } from 'react';
import TopMenu from 'src/components/TopMenu';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { currentDate } from 'src/logic/nextLunch';
import { getStringFromDate } from 'src/lib/timeUtil';

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
          <Link href='/' passHref legacyBehavior>
            <p className=' text-lg font-bold text-red-600 sm:text-xl md:text-2xl'>
              今日のお弁当
            </p>
          </Link>
        </div>
        <div className='basis-1/3 text-right'>
          <Link href='/api/auth/logout'  legacyBehavior>
            <a
              onClick={() => {
                setIsLoggingOut(true);
                setMessage('ログアウト中です。お待ちください...');
              }}
              className={`rounded-full bg-red-600 py-2 px-4 text-sm text-white hover:bg-red-700 sm:text-base ${
                !user || isLoggingOut ? 'hidden' : ''
              }`}
            >
              ログアウト
            </a>
          </Link>
          <Link href='/api/auth/login' legacyBehavior>
            <a
              className={`rounded-full bg-red-600 py-2 px-4 text-sm text-white hover:bg-red-700 sm:text-base ${
                user || isLoggingOut ? 'hidden' : ''
              }`}
            >
              ログイン
            </a>
          </Link>
        </div>
      </div>
      <div className='mt-2 flex flex-row items-center justify-center gap-10'>
        {user && <p className='self-center'>{message}</p>}
        {isTestMode && (
          <p className='animate-pulse font-bold text-orange-600'>
            テスト:{testDateString}
          </p>
        )}
      </div>
    </div>
  );
}
