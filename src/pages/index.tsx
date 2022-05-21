/* eslint-disable @next/next/inline-script-id */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import type { GetStaticProps, NextPage } from 'next';
import { FieldSet } from 'airtable';
import Head from 'next/head';
import { Thanks } from '../components/Thanks';
import { MenuListBox } from '../components/MenuListBox';
import { RiceListBox } from '../components/RiceListBox';
import { useLoginState } from '../lib/hooks/useLoginState';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { Instructions } from '../components/Instructions';
import { StaggeredShift } from '../components/StaggeredShift';
import { getNextLunchDateString, canOrderNow } from '../logic/nextLunch';
import { SubmitHandler } from 'react-hook-form';
import {
  NotifyContainer,
  notifySuccess,
  notifyWarning,
  notifyError,
} from '../lib/notify';
import { Welcome } from '../components/Welcome';
import { PersonalDataForm } from '../components/PersonalDataForm';
import type { PersonalDataInputs } from '../components/PersonalDataForm';

const Home: NextPage<{
  menuData: FieldSet[] | undefined;
  riceData: FieldSet[] | undefined;
}> = ({ menuData, riceData }) => {
  // 最後のランチ注文
  const [lastOrderDateString, setLastOrderDateString] =
    useLocalStorage('lastOrderDate');
  const [lastOrderMenuString, setLastOrderMenuString] =
    useLocalStorage('lastOrderMenu');
  const [alreadyOrdered, setAlreadyOrdered] = useState(true);

  // いつのランチ注文をしようしているか。YYYY-MM-DD(曜日) と曜日を格納
  const [dateString, setDateString] = useState('');
  const [dayChar, setDayChar] = useState('');

  // メニュー（食事）
  const [menuNameString, setMenuNameString] = useLocalStorage('menuName');
  const [menuDataSelected, setMenuDataSelected] = useState<any>();

  // ライスの量
  const [riceAmountString, setRiceAmountString] = useLocalStorage('riceAmount');
  const [riceAmountDataSelected, setRiceAmountDataSelected] = useState<
    FieldSet | undefined
  >();

  // 遅番かどうか
  const [isLateShiftString, setIsLateShiftString] =
    useLocalStorage('lateShift');
  const [isLateShift, setIsLateShift] = useState(isLateShiftString === 'true');

  // 注文対象日を取得
  useEffect(() => {
    const [date, day] = getNextLunchDateString();
    setDateString(date); // 後で使うために格納。本ブロックでは使わない。
    setDayChar(day); // 後で使うために格納。本ブロックでは使わない。
  }, []);

  // 注文済かどうか
  useEffect(
    () => setAlreadyOrdered(lastOrderDateString === dateString),
    [lastOrderDateString, dateString]
  );

  // ログイン中かどうかとユーザー情報
  const [user, isLogin] = useLoginState();

  useEffect(() => {
    // localStorageの値からデータを設定
    if (menuNameString !== '') {
      // setMenuDataSelected(menuData && menuData[0]);
      setMenuDataSelected(
        menuData &&
          menuData.find(function (record) {
            return (record.fields as any).Name === menuNameString;
          })
      );
    }

    if (riceAmountString !== '') {
      // setRiceAmountDataSelected(riceData && riceData[0]);
      setRiceAmountDataSelected(
        riceData &&
          riceData.find(function (record) {
            return (record.fields as any).Name === riceAmountString;
          })
      );
    }

    if (isLateShiftString !== '') {
      setIsLateShift(isLateShiftString === 'true');
    }
  }, [menuNameString, riceAmountString, isLateShiftString]);

  // メニュー又はライス選択結果をローカルストレージに保存
  useEffect(() => {
    if (menuDataSelected) {
      setMenuNameString((menuDataSelected.fields as any).Name);
    }
    if (riceAmountDataSelected) {
      setRiceAmountString((riceAmountDataSelected?.fields as any).Name);
    }
    // メニューが設定されていないときは、食事開始時間も不定
    if (menuDataSelected) {
      setIsLateShiftString(isLateShift ? 'true' : 'false');
    }
  }, [menuDataSelected, riceAmountDataSelected, isLateShift]);

  // 指定のメニューは本日利用可能か？
  const isAvailableNow = (menu: string) => {
    if (!menuData) return;

    const menuRecord = menuData.find(
      (record) => (record.fields as any).Name === menu
    );
    const fields: any = menuRecord?.fields;
    const available = fields.Available.includes(dayChar); // 今日利用可能なメニューかどうか
    return available;
  };

  // 注文を実行
  const orderMenu = async (data: any) => {
    try {
      console.table(data);
      const res = await fetch('/api/sendOrderMail', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('res: ', res);

      setAlreadyOrdered(true);

      // 最後の注文を保存
      setLastOrderDateString(dateString);
      setLastOrderMenuString(data.menu);

      notifySuccess('注文が送信されました。');
    } catch (error) {
      console.error('Fetch error : ', error);
      notifyError(JSON.stringify(error));
    }
  };

  const onSubmit: SubmitHandler<PersonalDataInputs> = async (
    data: PersonalDataInputs
  ) => {
    if (menuNameString === '') {
      notifyWarning('メニューを選んでください。');
      return;
    }
    if (menuDataSelected && menuDataSelected?.fields?.Rice) {
      if (riceAmountDataSelected === undefined) {
        notifyWarning('ライスを選んでください。');
        return;
      }
    }

    if (!isAvailableNow(menuNameString)) {
      notifyWarning('本日、このメニューはご利用いただけません。');
      return;
    }

    if (!canOrderNow()) {
      notifyWarning('注文できない時間帯です。');
      return;
    }

    await orderMenu({
      mailFrom: user?.email,
      date: `${dateString}`,
      timeFrom: isLateShift ? `後半` : `前半`,
      menu: menuNameString,
      rice:
        menuDataSelected && menuDataSelected?.fields?.Rice
          ? riceAmountString
          : 'なし',
      ...data,
    });
  };

  return (
    <>
      <Layout>
        <Head>
          <title>今日のお弁当</title>
          <meta
            name='今日のお弁当'
            content='平田食堂のお弁当を注文するアプリ'
          />
          <link rel='icon' href='/obento.svg' />
        </Head>
        <main className='flex-col p-2 min-h-screen'>
          <h1 className='flex justify-center mb-4 text-[5vw] font-bold text-gray-600/80 sm:text-4xl'>
            {dateString}の注文
          </h1>
          {alreadyOrdered ? (
            <Thanks orderedMenu={lastOrderMenuString} />
          ) : (
            <>
              <Welcome isLogin={isLogin} />
              <MenuListBox
                label='メニュー：'
                menus={menuData}
                selected={menuDataSelected}
                setSelected={setMenuDataSelected}
                day={dayChar}
              />
              {menuDataSelected && menuDataSelected?.fields?.Rice && (
                <RiceListBox
                  label='ライス：'
                  menus={riceData}
                  selected={riceAmountDataSelected}
                  setSelected={setRiceAmountDataSelected}
                />
              )}
              <StaggeredShift
                isLateShift={isLateShift}
                setIsLateShift={setIsLateShift}
              />
            </>
          )}

          <PersonalDataForm
            isLogin={isLogin}
            alreadyOrdered={alreadyOrdered}
            onSubmit={onSubmit}
          />
          <Instructions />
        </main>
        <NotifyContainer />
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const origin = process.env.AUTH0_BASE_URL ?? 'http://localhost:3000';
    const res_menu = await fetch(`${origin}/api/getMenu`);
    const res_rice = await fetch(`${origin}/api/getRice`);
    return {
      props: {
        menuData: await res_menu.json(),
        riceData: await res_rice.json(),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        err: 'データ取得で問題が発生しました。',
      },
    };
  }
};

export default Home;
