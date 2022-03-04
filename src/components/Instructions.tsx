/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

export function Instructions() {
  return (
    <div className='pt-8 w-full'>
      <p className='font-bold'>使用上の注意等：</p>
      <div className='mx-auto w-full bg-white'>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>注意その１</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
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
              <Disclosure.Button className='flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>注意その２</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                現在は[注文メールを送信]ボタンをクリックしたら、メールを送るだけです。相手が確実に受け取るとは限りません。
                <br />
                特に初回の注文では、平田食堂からの返信メールをご確認ください。
                <br />
                <br />
                これは改良する予定です。
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>注文内容を変更したい場合は？</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                平田食堂にメールするなりして対応してください。
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>どのようなメールが送られますか?</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                自分にメールはCcされますが、次のイメージです。
                <br />
                <br />
                平田食堂 御中
                <br />
                予約日: 2021-02-26(土)
                <br />
                利用時間: 後半
                <br />
                部署名:ME品証
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
                ※アプリ「今日のお弁当」(makino@jeol.co.jp作)から送信しています。
                <br />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
