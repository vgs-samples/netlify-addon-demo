// import stripeLib from "stripe";
import request from 'request-promise-native';

async function getReport(reportId) {
  const url = `https://api.checkr.com/v1/reports/${reportId}`;
  console.log('reportIdUrl', url);
  
  const response = await request({
    method: 'GET',
    url: url,
    headers: {
      Authorization: `Basic YjNlN2U3NmY4YTMxNjU2YjdmNTAzYmM0ZWEzNWNkNDMxOTlmZjcyYzo=`
    }
  });

  return JSON.parse(response);
}

exports.handler = async function(event, context, callback) {
  const reportId = event.queryStringParameters.reportId;
  console.log('reportId', reportId);

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
    
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(report),
    });
  } catch (e) {
    if(e.error) {
      console.log(e.error);
    } else {
      console.log(e);
    }
    
    callback(null, {
      statusCode: 200,
      body: 'error',
    });
  }
}