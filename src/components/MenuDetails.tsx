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
    <div className='px-4 w-full max-w-sm'>
      <Popover className='relative'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                text-white group bg-red-600 p-2 rounded-md inline-flex items-center hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span>詳細</span>
              <ChevronDownIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-red-300 group-hover:text-opacity-80 transition ease-in-out duration-150`}
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
              <Popover.Panel className='absolute left-1/2 z-10 px-4 mt-3 w-screen max-w-sm -translate-x-1/2 sm:px-0 lg:max-w-3xl'>
                <div className='overflow-hidden rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg'>
                  <div className='grid relative gap-8 p-7 bg-white lg:grid-cols-2'>
                    {menus?.map((menu) => {
                      return (
                        <pre
                          key={menu.id as Key}
                          className='flex items-center p-2  -m-3 whitespace-pre-wrap hover:bg-gray-50 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 transition duration-150 ease-in-out'
                        >
                          <div className='flex shrink-0 justify-center items-center w-10 h-10 text-white sm:w-12 sm:h-12'>
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
                  <div className='p-4 bg-gray-100'>
                    <a
                      href='##'
                      className='flow-root p-2 hover:bg-gray-100 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 transition duration-150 ease-in-out'
                    >
                      <span className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          更に詳しい情報
                        </span>
                      </span>
                      <span className='block text-sm text-gray-500'>
                        平田食堂のポスターをご覧ください。
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
