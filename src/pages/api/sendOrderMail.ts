import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const emailTo = process.env.NEXT_PUBLIC_TEST_MODE
    ? process.env.ORDER_MAIL_TO_FOR_TEST
    : process.env.ORDER_MAIL_TO;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const msg: MailDataRequired = {
    to: emailTo,
    from: req.body.mailFrom,
    cc: req.body.mailFrom,
    subject: 'お弁当の注文(JEOL)',
    text: `
    平田食堂 御中 担当者
    
    予約日: ${req.body.date}
    利用時間: ${req.body.timeFrom}～
    部署名:${req.body.department}
    名前: ${req.body.name}
    従業員番号: ${req.body.employeeNumber}
    電話番号: ${req.body.tel}

    メニュー: ${req.body.menu}
    ライス: ${req.body.menu} // ライス付きメニューの場合

    ※アプリ「今日のお弁当」(makino@jeol.co.jp作)から送信しています。
    `,
    html: `
    <p>平田食堂 御中</p>
    <p></p>
    <p>予約日: ${req.body.date}</p>
    <p>利用時間: ${req.body.timeFrom}</p>
    <p>部署名:${req.body.department}</p>
    <p>名前: ${req.body.name}</p>
    <p>従業員番号: ${req.body.employeeNumber}</p>
    <p>電話番号: ${req.body.tel}</p>
    <p><strong>メニュー: ${req.body.menu}</strong></p>
    <p><strong>ライス: ${req.body.rice}</strong>  // ライス付きメニューの場合</p>
    <p>備考: ${req.body.comment}</p>
    <p></p>
    <p>※アプリ「今日のお弁当」(makino@jeol.co.jp作)から送信しています。</p>
    `,
  };

  if ((process.env.NEXT_PUBLIC_TEST_MODE as string) === 'true') {
    console.log('テストモード。メール送信しません。');
    console.log('req.body: ', req.body);
  } else {
    console.log('本番モード');
    try {
      await sgMail.send(msg);
      res.status(200).json(msg);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
}
