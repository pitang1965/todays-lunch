const Airtable = require('airtable');
import type { OrderInfo } from './orderInfo';

export async function createAirtableRecord(orderInfo: OrderInfo): Promise<any> {
  console.table(orderInfo);

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );

  // 10レコードまで作成できるが1つだけ作成
  const tableName = process.env.NEXT_PUBLIC_TEST_MODE === 'true' ? 'OrderTableForTest' : 'OrderTable';
  base(tableName).create(
    [
      {
        fields: {
          'mailFrom': orderInfo.mailFrom,
          'date': orderInfo.date,
          'timeFrom': orderInfo.timeFrom,
          'department': orderInfo.department,
          'name': orderInfo.name,
          'telephoneNumber': orderInfo.telephoneNumber,
          'employeeNumber': orderInfo.employeeNumber,
          'menu': orderInfo.menu,
          'rice': orderInfo.rice,
          'comment': orderInfo.comment,
        },
      },
    ],
    function (err: any, records: any[]) {
      if (err) {
        console.error(err);
        return err;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );

  return 'OK';
}
