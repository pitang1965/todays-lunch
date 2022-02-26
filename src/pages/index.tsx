/* eslint-disable @next/next/inline-script-id */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import type { GetStaticProps, NextPage } from 'next';
import { FieldSet } from 'airtable';
import Head from 'next/head';
import { MenuListBox } from '../components/MenuListBox';
import { RiceListBox } from '../components/RiceListBox';
import { useUser } from '@auth0/nextjs-auth0';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { Instructions } from '../components/Instructions';
import { StaggeredShift } from '../components/StaggeredShift';
import { getNextLunchDateString, canOrderNow } from '../logic/nextLunch';

const Home: NextPage<{
  menuData: FieldSet[] | undefined;
  riceData: FieldSet[] | undefined;
}> = ({ menuData, riceData }) => {
  // 最後のランチ注文
  const [lastOrderDateString, setLastOrderDateString] =
    useLocalStorage('lastOrderDate');
  const [lastOerderMenuString, setLastOrderMenuString] =
    useLocalStorage('lastOrderMenu');

  // いつのランチ注文をしようしているか。YYYY-MM-DD(曜日) と曜日を取得
  const [dateString, setDateString] = useState('');
  const [dayChar, setDayChar] = useState('');

  useEffect(() => {
    const [date, day] = getNextLunchDateString();
    setDateString(date);
    setDayChar(day);
  }, []);

  // ログイン中かどうか
  const { user, error, isLoading } = useUser();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (error) {
      setIsLogin(false);
    } else if (isLoading) {
      setIsLogin(false);
    } else if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user, error, isLoading]);

  // メニュー（食事）
  const [menuNameString, setMenuNameString] = useLocalStorage('menuName');
  const [menuDataSelected, setMenuDataSelected] = useState<
    FieldSet | undefined
  >();

  // ライスの量
  const [riceAmountString, setRiceAmountString] = useLocalStorage('riceAmount');
  const [riceAmountDataSelected, setRiceAmountDataSelected] = useState<
    FieldSet | undefined
  >();

  // 遅番かどうか
  const [isLateShiftString, setIsLateShiftString] =
    useLocalStorage('lateShift');
  const [isLateShift, setIsLateShift] = useState(true);
  const updateShift = (): void => setIsLateShift((prev: boolean) => !prev);

  // 職場、名前、社員番号、電話番号
  const [departmentString, setDepartmentString] = useLocalStorage('department');
  const [fullnameString, setFullnameString] = useLocalStorage('fullname');
  const [employeeNumberString, setEmployeeNumberString] =
    useLocalStorage('employeeNumber');
  const [telephoneNumberString, setTelephoneNumberString] =
    useLocalStorage('telephoneNumber');

  // localStorageの値からデータを設定
  useEffect(() => {
    if (menuNameString === '') {
      setMenuDataSelected(menuData && menuData[0]);
    } else {
      setMenuDataSelected(
        menuData &&
          menuData.find(function (record) {
            return (record.fields as any).Name === menuNameString;
          })
      );
    }

    if (riceAmountString === '') {
      setRiceAmountDataSelected(riceData && riceData[0]);
    } else {
      setRiceAmountDataSelected(
        riceData &&
          riceData.find(function (record) {
            return (record.fields as any).Name === riceAmountString;
          })
      );
    }

    if (isLateShiftString === '') {
      setIsLateShift(true);
    } else {
      setIsLateShift(isLateShiftString === 'true');
    }
  }, []);

  // メニュー又はライス選択結果をローカルストレージに保存
  useEffect(() => {
    if (menuDataSelected) {
      setMenuNameString((menuDataSelected?.fields as any).Name);
    }
    if (riceAmountDataSelected) {
      setRiceAmountString((riceAmountDataSelected?.fields as any).Name);
    }
    setIsLateShiftString(isLateShift ? 'true' : 'false');
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
    if (!isAvailableNow(data.menu)) {
      alert('本日、このメニューはご利用いただけません。');
      return;
    }

    if (canOrderNow()) {
      try {
        console.table(data);
        const res = fetch('/api/sendOrderMail', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        console.log('res: ', res);

        // 最後の注文を保存
        setLastOrderDateString(dateString);
        setLastOrderMenuString(data.menu);

        alert('注文が送信されました。');
      } catch (error) {
        console.error('Fetch error : ', error);
        alert(JSON.stringify(error));
      }
    } else {
      alert('注文できない時間帯です。');
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>今日のお弁当</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/obento.svg' />
        </Head>
        <main className='flex-col p-2 min-h-screen'>
          <h1 className='flex justify-center mb-4 text-4xl font-bold text-gray-600/80'>
            {dateString}の注文
          </h1>
          {lastOrderDateString === dateString ? (
            <>
              <p>ご注文ありがとうございました。</p>
              <p>注文内容：{lastOerderMenuString}</p>
            </>
          ) : (
            <>
              <p>いらっしゃいませ。</p>
              <MenuListBox
                label='メニュー：'
                menus={menuData}
                selected={menuDataSelected}
                setSelected={setMenuDataSelected}
                day={dayChar}
              />
              <RiceListBox
                label='ライス（ライス付きメニューの場合のみ有効）：'
                menus={riceData}
                selected={riceAmountDataSelected}
                setSelected={setRiceAmountDataSelected}
              />

              <StaggeredShift
                isLateShift={isLateShift}
                updateShift={updateShift}
              />
              {isLogin ? (
                <>
                  <p>注文可能な時間帯は前日の15時から当日の9:59までです。</p>
                  <button
                    className='flex py-2 px-4 m-auto mt-4 text-white bg-red-600 hover:bg-red-700 rounded-full'
                    onClick={() =>
                      orderMenu({
                        mailFrom: user?.email,
                        date: `${dateString}`,
                        timeFrom: isLateShift ? `12:20～` : `11:50～`,
                        department: departmentString,
                        name: fullnameString,
                        employeeNumber: employeeNumberString,
                        tel: telephoneNumberString,
                        menu: menuNameString,
                        rice: riceAmountString,
                      })
                    }
                  >
                    注文メールを送信
                  </button>
                </>
              ) : (
                <p className='mt-4 font-bold text-red-600'>
                  注文をするためにはログインしてください。
                </p>
              )}
            </>
          )}

          <form className='mt-8 w-full max-w-sm'>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  className='block pr-4 mb-1 font-bold text-gray-500 md:mb-0 md:text-right'
                  htmlFor='departmentText'
                >
                  職場名
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='py-2 px-4 w-full leading-tight text-gray-700 bg-gray-200 focus:bg-white rounded border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none'
                  id='departmentText'
                  type='text'
                  placeholder='例：ME品証'
                  value={departmentString}
                  onChange={(e) => setDepartmentString(e.target.value)}
                />
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  className='block pr-4 mb-1 font-bold text-gray-500 md:mb-0 md:text-right'
                  htmlFor='fullnameText'
                >
                  名前
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='py-2 px-4 w-full leading-tight text-gray-700 bg-gray-200 focus:bg-white rounded border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none'
                  id='fullnameText'
                  type='text'
                  placeholder='姓名を入れてください。'
                  value={fullnameString}
                  onChange={(e) => setFullnameString(e.target.value)}
                />
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  className='block pr-4 mb-1 font-bold text-gray-500 md:mb-0 md:text-right'
                  htmlFor='employeeNumber'
                >
                  社員番号
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='py-2 px-4 w-full leading-tight text-gray-700 bg-gray-200 focus:bg-white rounded border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none'
                  id='employeeNumber'
                  type='number'
                  placeholder='8桁数字のみ。'
                  value={employeeNumberString}
                  onChange={(e) => setEmployeeNumberString(e.target.value)}
                />
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  className='block pr-4 mb-1 font-bold text-gray-500 md:mb-0 md:text-right'
                  htmlFor='telephoneNumber'
                >
                  電話番号
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='py-2 px-4 w-full leading-tight text-gray-700 bg-gray-200 focus:bg-white rounded border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none'
                  id='telephoneNumber'
                  type='tel'
                  placeholder='連絡が付く電話番号。'
                  value={telephoneNumberString}
                  onChange={(e) => setTelephoneNumberString(e.target.value)}
                />
              </div>
            </div>
          </form>

          <Instructions />
        </main>
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
