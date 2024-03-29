const Airtable = require('airtable');
import type { OrderInfo } from './orderInfo';

export const createAirtableRecord = async (orderInfo: OrderInfo) => {
  console.table(orderInfo);

  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_TOKEN,
  });
  var base = Airtable.base(process.env.AIRTABLE_BASE_ID as string);

  const tableName =
    process.env.NEXT_PUBLIC_TEST_MODE === 'true'
      ? 'OrderTableForTest'
      : 'OrderTable';

  try {
    await base(tableName).create([
      {
        fields: {
          mailFrom: orderInfo.mailFrom,
          date: orderInfo.date,
          timeFrom: orderInfo.timeFrom,
          department: orderInfo.department,
          name: orderInfo.name,
          telephoneNumber: orderInfo.telephoneNumber,
          employeeNumber: orderInfo.employeeNumber,
          menu: orderInfo.menu,
          rice: orderInfo.rice,
          comment: orderInfo.comment,
        },
      },
    ]);
    return 'OK';
  } catch (error) {
    console.error(error);
    return 'NG';
  }
};
