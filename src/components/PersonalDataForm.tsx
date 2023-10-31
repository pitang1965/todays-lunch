import React, { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocalStorage } from 'src/lib/useLocalStorage';
import { notifySuccess } from 'src/lib/notify';

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

  const buttonRef = useRef<null | HTMLButtonElement>(null);

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
        <fieldset className='mt-4 flex gap-2'>
          <label className='w-20 font-bold' htmlFor='commentText'>
            備考欄
          </label>

          <textarea
            {...register('comment', { required: false, maxLength: 400 })}
            className='grow border border-slate-300 p-1'
            id='commentText'
            placeholder='特別な注文があれば、都度記入してください。'
          />
        </fieldset>
      )}
      <button
        type='button'
        ref={buttonRef}
        onClick={() => {
          if (buttonRef.current) {
            buttonRef.current.disabled = true;
            handleSubmit(onSaveAndSubmit)();
          }
        }}
        className='m-auto mt-4 flex rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-red-300'
        disabled={alreadyOrdered || !isLogin}
      >
        注文する
      </button>

      <hr className='mt-4 border-2 border-dashed' />

      <fieldset className='mt-4 flex gap-2'>
        <label className='w-20 p-1 font-bold' htmlFor='departmentText'>
          職場名
        </label>
        <input
          {...register('department', { required: true, maxLength: 80 })}
          className='grow border border-slate-300 p-1'
          id='departmentText'
          type='text'
          placeholder='例：製造部'
        />
      </fieldset>
      {errors.department && (
        <p className='ml-[5.5rem] text-[#ff0000]'>職場名は必須です。</p>
      )}
      <fieldset className='mt-4 flex gap-2'>
        <label className='w-20 p-1 font-bold' htmlFor='nameText'>
          名前
        </label>
        <input
          {...register('name', { required: true, maxLength: 10 })}
          className='grow border border-slate-300 p-1'
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
      <fieldset className='mt-4 flex gap-2'>
        <label className='w-20 p-1 font-bold' htmlFor='telephoneNumber'>
          電話番号
        </label>
        <input
          {...register('telephoneNumber', {
            required: true,
            minLength: 10,
            maxLength: 11,
          })}
          className='grow border border-slate-300 p-1'
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
      <fieldset className='mt-4 flex gap-2'>
        <label className='w-20 p-1 font-bold' htmlFor='employeeNumber'>
          社員番号
        </label>
        <input
          {...register('employeeNumber', {
            required: false,
            minLength: 6,
            maxLength: 8,
          })}
          className='grow border border-slate-300 p-1'
          id='employeeNumber'
          type='number'
          placeholder='8桁数字のみ。'
        />
      </fieldset>
      <button
        type='button'
        onClick={() => handleSubmit(onSavePersonalData)()}
        className='m-auto mt-4 flex rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
      >
        個人データの保存のみ
      </button>
    </form>
  );
};
