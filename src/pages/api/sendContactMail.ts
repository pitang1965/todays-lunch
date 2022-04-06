const Recipient = require('mailersend').Recipient;
const EmailParams = require('mailersend').EmailParams;
const MailerSend = require('mailersend');
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  const recipients = [
    new Recipient(process.env.CONTACT_FORM_MAIL_TO, req.body.name),
  ];

  const emailParams = new EmailParams()
    .setFrom(process.env.MAIL_FROM)
    .setFromName('アプリ「今日のお弁当」')
    .setRecipients(recipients)
    .setSubject('今日のお弁当アプリからの問い合わせ')
    .setHtml(
      `
    <strong>${req.body.name}さんからの問い合わせ</strong>
    <p>職場：${req.body.department}</p>
    <p>${req.body.inquiry}</p>
  `
    )
    .setText(
      `
    ${req.body.name}さん（職場：${req.body.department}）からの問い合わせ: ${req.body.inquiry}
  `
    )
    .setReplyTo(req.body.mailFrom);

  console.log('req.body: ', req.body);

  try {
    await mailersend.send(emailParams);
    console.log('メール送信済！', emailParams);
    res.status(200).json('OK');
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}
