import React from 'react';
import Link from 'next/link';

export const Announcement = () => {
  return (
    <div className='py-3 px-4 mb-2 text-sm font-medium text-center text-white bg-red-600'>
      <p className='underline'>
        <Link href='/about'>
          同僚に本アプリを教える場合はQRコードをご使用ください。
        </Link>
      </p>
    </div>
  );
};
