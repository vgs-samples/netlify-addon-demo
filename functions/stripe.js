const request = require('request-promise-native')

const vgsUser = process.env.VGS_USER;
const vgsPass = process.env.VGS_PASSWORD;
const vgsTenant = process.env.VGS_TENANT_ID;
const netlifyToken = process.env.NETLIFY_TOKEN;
const stripeSecret = process.env.STRIPE_SECRET;
const stripeSecretBase64 = Buffer.from(`${stripeSecret}:`).toString('base64');

const fwUrl = `http://${vgsUser}:${vgsPass}@${vgsTenant}.SANDBOX.verygoodproxy.io:8080`;

async function getSubmitById(submitId) {
  const url = `http://api.netlify.com/api/v1/submissions?access_token=${netlifyToken}`;
  const response = await request(url);
  const data = JSON.parse(response);

  const submit = data.find(r => r.data.submit_id === submitId);
  console.log('submit', submit.data);

  return submit.data;
}

async function sendDataWithProxy(url, proxyUrl, data, contentType) {
  return await request({
    method: 'POST',
    url: url,
    proxy: proxyUrl,
    body: data,
    strictSSL: false,
    headers: {
      'content-type': contentType,
      Authorization: `Bearer ${stripeSecret}`
    }
  });
}

async function charge(cardToken, amount) {
  const url = `https://api.stripe.com/v1/charges`;
  const response = await request({
    method: 'POST',
    url: url,
    body: `amount=${amount}&currency=usd&source=${cardToken}&description=test_charge`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${stripeSecretBase64}`
    }
  });

  return JSON.parse(response);
}

exports.handler = async function(event, context) {
  const submitId = event.queryStringParameters.submitId;
  console.log('submitId', submitId);

  const userData = await getSubmitById(submitId);

  const payload = `card[number]=${userData.card}&card[exp_month]=${userData.month}&card[exp_year]=${userData.year}&card[cvc]=${userData.cvv}`
  console.log('payload', payload);

  try {
    let response = await sendDataWithProxy(
      'https://api.stripe.com/v1/tokens', fwUrl, payload, 'application/x-www-form-urlencoded'
    );
    const token = JSON.parse(response).id;
    console.log('token', token);

    const chargeResponse = await charge(token, 100);

    console.log('chargeResponse', chargeResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        chargeResponse,
        userData,
      }),
    };
  } catch (e) {
    console.log('err');
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
