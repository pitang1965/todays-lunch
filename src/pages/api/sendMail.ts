import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { EmailData } from '@sendgrid/helpers/classes/email-address';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const msg: MailDataRequired = {
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM as EmailData,
    subject: '今日のお弁当アプリからの問い合わせ',
    text: `${req.body.name}さん（職場：${req.body.department}）からの問い合わせ: ${req.body.inquiry}`,
    html: `
    <strong>${req.body.name}さんからの問い合わせ</strong>
    <p>職場：${req.body.department}</p>
    <p>${req.body.inquiry}</p>
    `,
  };

  console.log('req.body: ', req.body);

  try {
    await sgMail.send(msg);
    res.status(200).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}
