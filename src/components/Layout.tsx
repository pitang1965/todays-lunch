import type { ReactNode, FC } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = (props) => {
  return (
    <div className='container grid grid-rows-[76px,auto,30px] p-2 mx-auto max-w-xl min-h-screen'>
      <Navbar />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
