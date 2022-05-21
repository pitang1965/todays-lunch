import React, { useEffect } from 'react';
import type { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { notifySuccess } from '../lib/notify';

type PersonalDataProps = {
  isLogin: boolean;
  alreadyOrdered: boolean;
  onSubmit: SubmitHandler<PersonalDataInputs>;
};

export type PersonalDataInputs = {
  comment: string;
  department: string;
  name: string;
  telephoneNumber: string;
  employeeNumber: string;
};

export const PersonalDataForm: FC<PersonalDataProps> = ({
  isLogin,
  alreadyOrdered,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalDataInputs>();

  // 職場、名前、電話番号、社員番号
  const [departmentString, setDepartmentString] = useLocalStorage('department');
  const [nameString, setNameString] = useLocalStorage('name');
  const [telephoneNumberString, setTelephoneNumberString] =
    useLocalStorage('telephoneNumber');
  const [employeeNumberString, setEmployeeNumberString] =
    useLocalStorage('employeeNumber');

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
    reset,
  ]);

  // 職場名、名前、電話番号、社員番号をローカルストレージに保存
  // 注意：備考欄は保存しない。
  const savePersonData = (data: PersonalDataInputs): void => {
    console.log(data);
    setDepartmentString(data.department);
    setNameString(data.name);
    setTelephoneNumberString(data.telephoneNumber);
    setEmployeeNumberString(data.employeeNumber);
  };

  const onSaveAndSubmit: SubmitHandler<PersonalDataInputs> = async (
    data: PersonalDataInputs
  ) => {
    savePersonData(data);
    onSubmit(data);
  };

  async function onSavePersonalData(data: PersonalDataInputs) {
    savePersonData(data);
    notifySuccess('個人データをこの端末に保存しました。');
  }

  return (
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
          onClick={() => handleSubmit(onSaveAndSubmit)()}
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
        <p className='ml-[5.5rem] text-[#ff0000]'>社員番号は8桁までです</p>
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
  );
};
