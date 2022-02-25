import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import siteUrlBarcode from '../../public/site-url.png';

const about = () => {
  return (
    <Layout>
      <main className='flex-col px-1'>
        <h1 className='flex justify-center text-4xl font-bold text-gray-700/80'>
          本アプリについて
        </h1>
        <article className='prose lg:prose-xl'>
          <h2>概要</h2>
          <p>ME品証のまきのSです。</p>
          <p>これは平田食堂の次のお弁当を簡単に注文するためのアプリです。</p>
          <p>前日の15時から当日の10時まで注文可能です。</p>
          <h2>お願い</h2>
          <p>
            本Webアプリは<abbr title='Progressive Web App'>PWA</abbr>
            なのでWindows, Android,
            iOSにインストール可能です。ぜひ、インストールしてお使いください（
            <strong>iOS</strong>は<strong>Safari</strong>の
            <strong>[ホーム画面に追加]</strong>より）。
          </p>
          <p>
            不具合や改善要望などありましたら
            <Link href='/contact' passHref>
              <a>お問い合わせ</a>
            </Link>
            問い合わせフォームよりお願いします。
          </p>

          <figure>
            <Image
              src={siteUrlBarcode}
              alt='https://j-bus-time-table.vercel.app/'
            />
            <figcaption>バス時刻表のサイトURL</figcaption>
          </figure>
        </article>
      </main>
    </Layout>
  );
};

export default about;
