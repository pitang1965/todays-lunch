/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export function Instructions() {
  return (
    <div className='w-full pt-8'>
      <p className='font-bold'>使用上の注意等：</p>
      <div className='mx-auto mt-2 w-full bg-white'>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-full bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>注意その１：端末間の連携無し</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pb-2 pt-4 text-sm text-gray-500'>
                現在は注文情報を各端末で管理しています。
                <br />
                複数の端末から重複して注文しないようにご注意ください。
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='mt-4 flex w-full justify-between rounded-full bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>注意その２：メールによる確認</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pb-2 pt-4 text-sm text-gray-500'>
                [注文する]ボタンをクリックしたら、○○食堂のほうで確認できる注文データベースに書き込むとともにメールを○○食堂に送信します。
                このとき、Ccで注文者にメールが送られます。
                <br />
                念のためメール受信をご確認ください。
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='mt-4 flex w-full justify-between rounded-full bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>注文内容を変更したい場合は？</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pb-2 pt-4 text-sm text-gray-500'>
                ○○食堂にメールするなりして対応してください。
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='my-4 flex w-full justify-between rounded-full bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>どのようなメールが送られますか?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pb-2 pt-4 text-sm text-gray-500'>
                自分にメールはCcされますが、次のイメージです。
                <br />
                <br />
                ○○食堂 御中
                <br />
                予約日: 2021-02-26(土)
                <br />
                利用時間: 後半
                <br />
                部署名:製造部
                <br />
                名前:日本 太郎
                <br />
                電話番号:09099999999
                <br />
                社員番号:01000000
                <br />
                メニュー: 健康定食
                <br />
                ライス: 小（盛り）
                <br />
                <br />
                ※アプリ「今日のお弁当」(まきの作)から送信しています。
                <br />
                <a href='#!'>○○食堂用リンク</a>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
