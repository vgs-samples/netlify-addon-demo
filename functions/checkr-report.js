const request = require('request-promise-native')

const checkrKey = process.env.CHECKR_KEY;
const checkrKeyBase64 = Buffer.from(`${checkrKey}:`).toString('base64');

async function getReport(reportId) {
  const url = `https://api.checkr.com/v1/reports/${reportId}`;
  console.log('reportIdUrl', url);

  const response = await request({
    method: 'GET',
    url: url,
    headers: {
      Authorization: `Basic ${checkrKeyBase64}`
    }
  });

  return JSON.parse(response);
}

exports.handler = async function(event, context) {
  const reportId = event.queryStringParameters.reportId;
  console.log('reportId', reportId);

  if (!checkrKey) {
    return {
      statusCode: 200,
      body: '{"error":"no-key"}'
    }
  }

  try {
    let report;
    while(true) {
      report = await getReport(reportId);
      console.log('report.status', report.status);

      if(report.status !== 'pending') {
        break;
      }
    }

    console.log('report done');
    console.log(report);

    return {
      statusCode: 200,
      body: JSON.stringify(report),
    };
  } catch (e) {
    if(e.error) {
      console.log(e.error);
    } else {
      console.log(e);
    }

    return {
      statusCode: 200,
      body: 'error',
    };
  }
}