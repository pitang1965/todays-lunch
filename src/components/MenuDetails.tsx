/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import type { Key, FC } from 'react';

type MenuDetailsProps = {
  menus: any[] | undefined;
  day: string;
};

export const MenuDetails: FC<MenuDetailsProps> = ({ menus, day }) => {
  return (
    <div className='w-full max-w-sm px-4'>
      <Popover className='relative'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-red-600 p-2 text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span>詳細</span>
              <ChevronDownIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-red-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden='true'
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 px-4 sm:px-0 lg:max-w-3xl'>
                <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                  <div className='relative grid gap-8 bg-white p-7 lg:grid-cols-2'>
                    {menus?.map((menu) => {
                      return (
                        <pre
                          key={menu.id as Key}
                          className='-m-3 flex items-center  whitespace-pre-wrap rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                        >
                          <div className='flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12'>
                            <Image
                              src='/obento.svg'
                              alt='お弁当'
                              width={48}
                              height={48}
                            />
                          </div>
                          <div className='ml-4'>
                            <p className='text-sm font-medium text-gray-900'>
                              {menu?.fields?.Name} (&yen;{menu?.fields?.Price})
                            </p>
                            <p className='text-sm text-gray-500'>
                              {menu?.fields?.Notes}
                            </p>
                          </div>
                        </pre>
                      );
                    })}
                  </div>
                  <div className='bg-gray-100 p-4'>
                    <a
                      href='##'
                      className='flow-root rounded-md p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                    >
                      <span className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          更に詳しい情報
                        </span>
                      </span>
                      <span className='block text-sm text-gray-500'>
                        ○○食堂のポスターをご覧ください。
                      </span>
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
