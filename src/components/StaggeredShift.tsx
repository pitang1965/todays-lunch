import { VFC } from 'react';
import { Switch } from '@headlessui/react';

type Props = {
  isLateShift: boolean;
  updateShift: () => void;
};

export const StaggeredShift: VFC<Props> = (props) => {
  return (
    <div className='flex gap-x-4'>
      <p className='self-center'>11:50から食事</p>
      <div className='py-4'>
        <Switch
          checked={props.isLateShift}
          onChange={props.updateShift}
          className={`${props.isLateShift ? 'bg-red-700' : 'bg-red-500'}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className='sr-only'>Staggered shift</span>
          <span
            aria-hidden='true'
            className={`${props.isLateShift ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </div>
      <p className='self-center'>12:20から食事</p>
    </div>
  );
};
