/* eslint-disable @next/next/inline-script-id */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import {
  NotifyContainer,
  notifySuccess,
  notifyWarning,
  notifyError,
} from '../lib/notify';

const Announcement = () => (
  <div className='py-3 px-4 mb-2 text-white bg-red-600'>
    <p className='text-sm font-medium text-center'>
      不具合に注意！メニュー、ライス、食事開始時間が保存されなくなっています。
    </p>
  </div>
);

const Home: NextPage<{
  menuData: FieldSet[] | undefined;
  riceData: FieldSet[] | undefined;
}> = ({ menuData, riceData }) => {
  // フォーム
  type Inputs = {
    comment: string;
    department: string;
    name: string;
    telephoneNumber: string;
    employeeNumber: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

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
  const updateShift = (): void => setIsLateShift((prev: boolean) => !prev);

  // 職場、名前、電話番号、社員番号
  const [departmentString, setDepartmentString] = useLocalStorage('department');
  const [nameString, setNameString] = useLocalStorage('name');
  const [telephoneNumberString, setTelephoneNumberString] =
    useLocalStorage('telephoneNumber');
  const [employeeNumberString, setEmployeeNumberString] =
    useLocalStorage('employeeNumber');

  // 注文対象日と注文内容を取得
  useEffect(() => {
    const [date, day] = getNextLunchDateString();
    setDateString(date); // 後で使うために格納。本ブロックでは使わない。
    setDayChar(day); // 後で使うために格納。本ブロックでは使わない。

    // localStorageの値からデータを設定
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

    return () => {
      console.log('終わりでーーーーーす');
    };
  }, []);

  // 注文済かどうか
  useEffect(
    () => setAlreadyOrdered(lastOrderDateString === dateString),
    [lastOrderDateString, dateString]
  );

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

  useEffect(() => {
    reset({
      department: departmentString,
      name: nameString,
      telephoneNumber: telephoneNumberString,
      employeeNumber: employeeNumberString,
    });
  }, [
    departmentString,
    nameString,
    telephoneNumberString,
    employeeNumberString,
  ]);

  // メニュー又はライス選択結果をローカルストレージに保存
  useEffect(() => {
    if (menuDataSelected) {
      setMenuNameString((menuDataSelected.fields as any).Name);
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
      notifyWarning('本日、このメニューはご利用いただけません。');
      return;
    }

    if (!canOrderNow()) {
      notifyWarning('注文できない時間帯です。');
      return;
    }

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

  // 職場名、名前、電話番号、社員番号をローカルストレージに保存
  const savePersonData = (data: Inputs): void => {
    console.log(data);
    setDepartmentString(data.department);
    setNameString(data.name);
    setTelephoneNumberString(data.telephoneNumber);
    setEmployeeNumberString(data.employeeNumber);
  };

  const onSavePersonalData: SubmitHandler<Inputs> = async (data: Inputs) => {
    savePersonData(data);
    notifySuccess('個人データをこの端末に保存しました。');
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    savePersonData(data);
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
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/obento.svg' />
        </Head>
        <main className='flex-col p-2 min-h-screen'>
          <h1 className='flex justify-center mb-4 text-[5vw] font-bold text-gray-600/80 sm:text-4xl'>
            {dateString}の注文
          </h1>
          {alreadyOrdered ? (
            <>
              <p>ご注文ありがとうございました。</p>
              <p className='mt-2 text-xl font-bold'>
                注文内容：
                <span className='underline'>{lastOrderMenuString}</span>
              </p>
            </>
          ) : (
            <>
              <Announcement />
              <p>
                いらっしゃいませ。
                {isLogin ? (
                  <span>
                    注文可能な時間帯は前日の15時から当日の9:59までです。
                  </span>
                ) : (
                  <span className='mt-4 font-bold text-red-600'>
                    注文するには
                    <Link href='/api/auth/login'>
                      <a className='underline'>ログイン</a>
                    </Link>
                    してください。
                  </span>
                )}
              </p>
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
                updateShift={updateShift}
              />
            </>
          )}

          <form>
            {!alreadyOrdered && (
              <fieldset className='flex gap-2 mt-4'>
                <label className='p-1 w-20 font-bold' htmlFor='commentText'>
                  備考欄
                </label>

                <textarea
                  {...register('comment', { required: false, maxLength: 400 })}
                  className='grow p-1 border border-slate-300'
                  id='commentText'
                  placeholder='特別な注文があれば、都度記入してください。'
                />
              </fieldset>
            )}
            {isLogin ? (
              <>
                {!alreadyOrdered && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleSubmit(onSubmit)()}
                      className='flex py-2 px-4 m-auto mt-4 text-white bg-red-600 hover:bg-red-700 rounded-full'
                    >
                      注文メールを送信
                    </button>
                  </>
                )}
              </>
            ) : null}

            <hr className='mt-4 border-2 border-dashed' />

            <fieldset className='flex gap-2 mt-4'>
              <label className='p-1 w-20 font-bold' htmlFor='departmentText'>
                職場名
              </label>
              <input
                {...register('department', { required: true, maxLength: 80 })}
                className='grow p-1 border border-slate-300'
                id='departmentText'
                type='text'
                placeholder='例：ME品証'
              />
            </fieldset>
            {errors.department && (
              <p className='ml-[5.5rem] text-[#ff0000]'>職場名は必須です。</p>
            )}
            <fieldset className='flex gap-2 mt-4'>
              <label className='p-1 w-20 font-bold' htmlFor='nameText'>
                名前
              </label>
              <input
                {...register('name', { required: true, maxLength: 10 })}
                className='grow p-1 border border-slate-300'
                id='nameText'
                type='text'
                placeholder='姓名を入れてください。'
              />
            </fieldset>
            {errors.name && (
              <p className='ml-[5.5rem] text-[#ff0000]'>名前は必須です。</p>
            )}
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
                className='grow p-1 border border-slate-300'
                id='telephoneNumber'
                type='tel'
                placeholder='連絡が付く電話番号。'
              />
            </fieldset>
            {errors.telephoneNumber && (
              <p className='ml-[5.5rem] text-[#ff0000]'>
                電話番号は10桁又は11桁でお願いします。
              </p>
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
                className='grow p-1 border border-slate-300'
                id='employeeNumber'
                type='number'
                placeholder='8桁数字のみ。'
              />
            </fieldset>
            <button
              type='button'
              onClick={() => handleSubmit(onSavePersonalData)()}
              className='flex py-2 px-4 m-auto mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-full'
            >
              個人データの保存のみ
            </button>
          </form>
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
