import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MenuIcon } from '@heroicons/react/solid';

export default function TopMenu() {
  return (
    <div className='z-20'>
      <Menu as='div' className='relative z-30 inline-block'>
        <div>
          <Menu.Button
            aria-label='ポップアップメニュー'
            className='inline-flex w-full justify-center rounded-full bg-black/40 p-2 text-black hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'
          >
            <MenuIcon
              className='h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-75'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <Menu.Items className='absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
            <div className='p-1'>
              <Menu.Item>
                {({ active }) => (
                  <Link href='/' passHref>
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <HomeActiveIcon
                          className='mr-2 h-5 w-5'
                          aria-hidden='true'
                        />
                      ) : (
                        <HomeInactiveIcon
                          className='mr-2 h-5 w-5'
                          aria-hidden='true'
                        />
                      )}
                      ホーム
                    </button>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link href='/about' passHref>
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <AboutActiveIcon
                          className='mr-2 h-5 w-5'
                          aria-hidden='true'
                        />
                      ) : (
                        <AboutInactiveIcon
                          className='mr-2 h-5 w-5'
                          aria-hidden='true'
                        />
                      )}
                      本アプリについて
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className='p-1'>
              <Menu.Item>
                {({ active }) => (
                  <Link href='/contact' passHref>
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <ContactActiveIcon
                          className='mr-2 h-5 w-5'
                          aria-hidden='true'
                        />
                      ) : (
                        <ContactInactiveIcon
                          className='mr-2 h-5 w-5'
                          aria-hidden='true'
                        />
                      )}
                      お問い合わせ
                    </button>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className='p-1'></div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

function HomeInactiveIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      />
    </svg>
  );
}

function HomeActiveIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
    </svg>
  );
}

function AboutInactiveIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path
        fillRule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
        clipRule='evenodd'
      />
    </svg>
  );
}

function AboutActiveIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
      <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
    </svg>
  );
}

function ContactInactiveIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      />
    </svg>
  );
}

function ContactActiveIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  );
}
