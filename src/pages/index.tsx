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
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  department: string;
  fullname: string;
  employeeNumber: string;
  telephoneNumber: string;
};

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  // const { data, setData } = useState();
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

  const onSubmit:SubmitHandler<Inputs> = async (data) => {
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
    });
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
              <p className='font-bold'>
                注文内容：
                <span className='underline'>{lastOerderMenuString}</span>
              </p>
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
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='my-4 mx-2'>
            {isLogin ? (
              <>
                <p>注文可能な時間帯は前日の15時から当日の9:59まで。</p>
                {lastOrderDateString !== dateString && (
                  <button className='flex py-2 px-4 m-auto mt-4 text-white bg-red-600 hover:bg-red-700 rounded-full'>
                    注文メールを送信
                  </button>
                )}
              </>
            ) : (
              <p className='mt-4 font-bold text-red-600'>
                注文をするためにはログインしてください。
              </p>
            )}

            <fieldset className='flex gap-2 mt-4'>
              <label className='p-1 w-20 font-bold' htmlFor='departmentText'>
                職場名
              </label>
              <input
                {...register('department', { required: true, maxLength: 0 })}
                defaultValue={departmentString}
                className='grow p-1 border border-slate-300'
                id='departmentText'
                type='text'
                placeholder='例：ME品証'
                onChange={(e) => setDepartmentString(e.target.value)}
              />
            </fieldset>
            {errors.department && (
              <p className='ml-[5.5rem] text-[#ff0000]'>職場名は必須です。</p>
            )}
            <fieldset className='flex gap-2 mt-4'>
              <label className='p-1 w-20 font-bold' htmlFor='fullnameText'>
                名前
              </label>
              <input
                {...register('fullname', { required: true, maxLength: 10 })}
                defaultValue={fullnameString}
                className='grow p-1 border border-slate-300'
                id='fullnameText'
                type='text'
                placeholder='姓名を入れてください。'
                onChange={(e) => setFullnameString(e.target.value)}
              />
            </fieldset>
            {errors.fullname && (
              <p className='ml-[5.5rem] text-[#ff0000]'>名前は必須です。</p>
            )}
            <fieldset className='flex gap-2 mt-4'>
              <label className='p-1 w-20 font-bold' htmlFor='employeeNumber'>
                社員番号
              </label>
              <input
                {...register('employeeNumber', {
                  required: false,
                  minLength: 6,
                  maxLength: 8,
                })}
                defaultValue={employeeNumberString}
                className='grow p-1 border border-slate-300'
                id='employeeNumber'
                type='number'
                placeholder='8桁数字のみ。'
                onChange={(e) => setEmployeeNumberString(e.target.value)}
              />
            </fieldset>
            {errors.employeeNumber && (
              <p className='ml-[5.5rem] text-[#ff0000]'>
                社員番号は8桁までです
              </p>
            )}
            <fieldset className='flex gap-2 mt-4'>
              <label className='p-1 w-20 font-bold' htmlFor='telephoneNumber'>
                電話番号
              </label>
              <input
                {...register('telephoneNumber', {
                  required: true,
                  minLength: 10,
                  maxLength: 11,
                })}
                defaultValue={telephoneNumberString}
                className='grow p-1 border border-slate-300'
                id='telephoneNumber'
                type='tel'
                placeholder='連絡が付く電話番号。'
                onChange={(e) => setTelephoneNumberString(e.target.value)}
              />
            </fieldset>
            {errors.telephoneNumber && (
              <p className='ml-[5.5rem] text-[#ff0000]'>
                電話番号は10桁又は11桁でお願いします。
              </p>
            )}
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
