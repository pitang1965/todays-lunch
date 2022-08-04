import React, { Fragment } from 'react';
import type { Key, FC } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import type { FieldSet } from 'airtable';

type MenuListBoxProps = {
  label: string;
  menus: FieldSet[] | undefined;
  selected: FieldSet | undefined;
  setSelected: React.Dispatch<React.SetStateAction<FieldSet | undefined>>;
};

export const RiceListBox: FC<MenuListBoxProps> = ({
  label,
  menus,
  selected,
  setSelected,
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative mt-4'>
        <Listbox.Label className='font-bold'>{label}</Listbox.Label>
        <Listbox.Button className='relative z-0 mt-2 w-full cursor-default rounded-full bg-gradient-to-r from-red-100 to-yellow-100 py-2  pr-10 pl-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
          <span className='block truncate'>
            {(selected?.fields as any)?.Name}
          </span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <SelectorIcon
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute z-10 mt-1 max-h-[10rem] w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
            {menus &&
              menus.map((menu) => (
                <Listbox.Option
                  key={menu.id as Key}
                  className={({ active }) => `${
                    active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                  }
                  cursor-default select-none relative py-2 pl-10 pr-4`}
                  value={menu}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {(menu?.fields as any).Name}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? 'text-amber-600' : 'text-amber-600'
                          }
                      absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
