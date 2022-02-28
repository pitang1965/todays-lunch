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
          <p>これは平田食堂の次回のお弁当を簡単に注文するためのアプリです。</p>
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
            同僚に本アプリを勧める場合は、以下のバーコードをお使いください。
          </p>
          <figure className='flex flex-col mb-8'>
            <Image
              src={siteUrlBarcode}
              alt='https://todays-lunch.vercel.app/'
            />
            <figcaption className='m-auto'>
              本サイト「今日のお弁当」のURL
            </figcaption>
          </figure>
          <p>
            不具合や改善要望などありましたら
            <Link href='/contact' passHref>
              <a>お問い合わせ</a>
            </Link>
            よりお願いします。
          </p>
          <h2>関連アプリ</h2>
          <a
            href='https://j-bus-time-table.vercel.app/'
            target='_blank'
            rel='noopener noreferrer'
          >
            バス時刻表
            <span>
              <Image src='/bus.svg' alt='バス時刻表' width={128} height={128} className='animate-bounce'/>
            </span>
          </a>
        </article>
      </main>
    </Layout>
  );
};

export default about;
