import type { ReactNode, FC } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = (props) => {
  return (
    <div className='container mx-auto grid min-h-screen max-w-xl grid-rows-[76px,auto,30px] p-2'>
      <Navbar />
      <div>{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
