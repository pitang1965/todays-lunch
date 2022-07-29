const Recipient = require('mailersend').Recipient;
const EmailParams = require('mailersend').EmailParams;
const MailerSend = require('mailersend');
import type { OrderInfo } from './orderInfo';

const orderTableUrl = 'https://airtable.com/appKH21CjYJiML63M/tbl1IcM7cU9936xcR/viwnS2c4IYtTXZogk?blocks=hide';

export async function sendOrderMail(orderInfo: OrderInfo): Promise<any> {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  const recipients = [new Recipient(process.env.ORDER_MAIL_TO, '注文先')];
  const cc = [new Recipient(orderInfo.mailFrom, orderInfo.name)];

  const emailParams = new EmailParams()
    .setFrom(process.env.MAIL_FROM)
    .setFromName('アプリ「今日のお弁当」')
    .setRecipients(recipients)
    .setCc(cc)
    .setSubject('【重要】お弁当の注文サービスは終了しました')
    .setHtml(
      `
      <p>○○食堂 御中</p>
      <p></p>
      <p>予約日: ${orderInfo.date}</p>
      <p>利用時間: ${orderInfo.timeFrom}</p>
      <p>部署名:${orderInfo.department}</p>
      <p>名前: ${orderInfo.name}</p>
      <p>電話番号: ${orderInfo.telephoneNumber}</p>
      <p>社員番号: ${orderInfo.employeeNumber}</p>
      <p><strong>メニュー: ${orderInfo.menu}</strong></p>
      <p><strong>ライス: ${orderInfo.rice}</strong>
      <p>備考: ${orderInfo.comment}</p>
      <p></p>
      <p>※アプリ「今日のお弁当」(まきの作)から送信しています。</p>
      <p><a href=${orderTableUrl}>○○食堂用リンク</a></p>
    `
    )
    .setText(
      `
      ○○食堂 御中 担当者
      
      予約日: ${orderInfo.date}
      利用時間: ${orderInfo.timeFrom}
      部署名:${orderInfo.department}
      名前: ${orderInfo.name}
      電話番号: ${orderInfo.telephoneNumber}
      社員番号: ${orderInfo.employeeNumber}
      メニュー: ${orderInfo.menu}
      ライス: ${orderInfo.rice}
      備考: ${orderInfo.comment}
  
      ※アプリ「今日のお弁当」から送信しています。
      ○○食堂用リンク: ${orderTableUrl}
      `
    )
    .setReplyTo(orderInfo.mailFrom);

  if ((process.env.NEXT_PUBLIC_TEST_MODE as string) === 'true') {
    console.log('テストモード。メール送信します。');
  }
  try {
    await mailersend.send(emailParams);
    console.log('メール送信済！', emailParams);
    return 'OK';
  } catch (err) {
    console.error(err);
    return err;
  }
}
