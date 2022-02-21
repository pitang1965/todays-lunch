/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

export default function Example() {
  return (
    <div className='pt-16 w-full'>
      <div className='mx-auto w-full bg-white'>
        <Disclosure>
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
                あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-full focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>特に注意していただきたいこと</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                本アプリで[注文メールを送信]ボタンをクリックしたら、文字通りメールを送るだけです。Ccで自分自身にもメールが送られますが、相手が確実に受け取るとは限りません。メール送信は、大手のメール配信サービスを無料枠で利用していますが、送信メールが迷惑メールとなってしまう可能性もあります。
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
