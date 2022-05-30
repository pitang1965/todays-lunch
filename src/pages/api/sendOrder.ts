import type { NextApiRequest, NextApiResponse } from 'next';
import type { OrderInfo } from './order/orderInfo';
import { sendOrderMail } from './order/sendOrderMail';
import { createAirtableRecord } from './order/createAirtableRecord';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const orderInfo: OrderInfo = {
    mailFrom: req.body.mailFrom,
    date: req.body.date,
    timeFrom: req.body.timeFrom,
    department: req.body.department,
    name: req.body.name,
    telephoneNumber: req.body.telephoneNumber,
    employeeNumber: req.body.employeeNumber,
    menu: req.body.menu,
    rice: req.body.rice,
    comment: req.body.comment,
  };

  // メール送信
  const ret1: any = await sendOrderMail(orderInfo);

  // Airtableに注文を記録
  const ret2 = await createAirtableRecord(orderInfo);

  console.log('ret2: ', ret2);

  // レスポンス
  if (ret1 === 'OK' && ret2 === 'OK') {
    res.status(200).json('OK');
  } else if (ret1 !== 'OK' && ret2 == 'OK') {
    res.status(500).json(ret1);
  } else if (ret1 === 'OK' && ret2 !== 'OK') {
    res.status(500).json(ret2);
  } else {
    res.status(500).json({ ret1, ret2 });
  }
}
