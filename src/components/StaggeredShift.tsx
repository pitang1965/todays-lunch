import { FC } from 'react';
import { Switch } from '@headlessui/react';

type Props = {
  isLateShift: boolean;
  setIsLateShift: (value: boolean) => void;
};

export const StaggeredShift: FC<Props> = (props) => {
  return (
    <div className='flex gap-x-4'>
      <p className='self-center font-bold'>食事開始時間：11:50</p>
      <div className='py-4'>
        <Switch
          checked={props.isLateShift}
          onChange={props.setIsLateShift}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={`${props.isLateShift ? 'bg-red-700' : 'bg-red-500'}
          focus-visible:ring-opacity/75 relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none  focus-visible:ring-2 focus-visible:ring-white`}
        >
          <span className='sr-only'>Staggered shift</span>
          <span
            aria-hidden='true'
            className={`${props.isLateShift ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
      <p className='self-center font-bold'>12:20</p>
    </div>
  );
};
