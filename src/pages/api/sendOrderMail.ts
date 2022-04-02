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

  const recipients = [new Recipient(process.env.ORDER_MAIL_TO, '注文先')];
  const cc = [new Recipient(req.body.mailFrom, req.body.name)];

  const emailParams = new EmailParams()
    .setFrom(process.env.MAIL_FROM)
    .setFromName('アプリ「今日のお弁当」')
    .setRecipients(recipients)
    .setCc(cc)
    .setSubject('お弁当の注文(JEOL)').setHtml(`
      <p>平田食堂 御中</p>
      <p></p>
      <p>予約日: ${req.body.date}</p>
      <p>利用時間: ${req.body.timeFrom}</p>
      <p>部署名:${req.body.department}</p>
      <p>名前: ${req.body.name}</p>
      <p>電話番号: ${req.body.telephoneNumber}</p>
      <p>社員番号: ${req.body.employeeNumber}</p>
      <p><strong>メニュー: ${req.body.menu}</strong></p>
      <p><strong>ライス: ${req.body.rice}</strong>
      <p>備考: ${req.body.comment}</p>
      <p></p>
      <p>※アプリ「今日のお弁当」(makino@jeol.co.jp作)から送信しています。</p>
    `).setText(`
      平田食堂 御中 担当者
      
      予約日: ${req.body.date}
      利用時間: ${req.body.timeFrom}
      部署名:${req.body.department}
      名前: ${req.body.name}
      電話番号: ${req.body.telephoneNumber}
      社員番号: ${req.body.employeeNumber}
      メニュー: ${req.body.menu}
      ライス: ${req.body.rice}
      備考: ${req.body.comment}
  
      ※アプリ「今日のお弁当」(makino@jeol.co.jp作)から送信しています。
      `);

  if ((process.env.NEXT_PUBLIC_TEST_MODE as string) === 'true') {
    console.log('テストモード。メール送信します。');
    console.log('req.body: ', req.body);
  }
  try {
    await mailersend.send(emailParams);
    console.log('メール送信済！', emailParams);
    res.status(200).json('OK');
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}
