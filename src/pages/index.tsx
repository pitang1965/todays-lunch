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
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  NotifyContainer,
  notifySuccess,
  notifyWarning,
  notifyError,
} from '../lib/notify';
import { Welcome } from '../components/Welcome';

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

  // 職場、名前、電話番号、社員番号
  const [departmentString, setDepartmentString] = useLocalStorage('department');
  const [nameString, setNameString] = useLocalStorage('name');
  const [telephoneNumberString, setTelephoneNumberString] =
    useLocalStorage('telephoneNumber');
  const [employeeNumberString, setEmployeeNumberString] =
    useLocalStorage('employeeNumber');

  // 注文対象日を取得
  useEffect(() => {
    const [date, day] = getNextLunchDateString();
    setDateString(date); // 後で使うために格納。本ブロックでは使わない。
    setDayChar(day); // 後で使うために格納。本ブロックでは使わない。
    return () => {
      console.log('終わりでーーーーーす');
    };
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

    reset({
      department: departmentString,
      name: nameString,
      telephoneNumber: telephoneNumberString,
      employeeNumber: employeeNumberString,
    });
  }, [
    menuNameString,
    riceAmountString,
    isLateShiftString,
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

          <form>
            {!alreadyOrdered && (
              <fieldset className='flex gap-2 mt-4'>
                <label className='w-20 font-bold' htmlFor='commentText'>
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
            {isLogin && !alreadyOrdered ? (
              <button
                type='button'
                onClick={() => handleSubmit(onSubmit)()}
                className='flex py-2 px-4 m-auto mt-4 text-white bg-red-600 hover:bg-red-700 rounded-full'
              >
                注文メールを送信
              </button>
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
