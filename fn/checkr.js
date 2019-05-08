import request from 'request-promise-native';

const vgsUser = process.env.VGS_USER;
const vgsPass = process.env.VGS_PASSWORD;
const vgsTenant = process.env.VGS_TENANT_ID;
const checkrKey = process.env.CHECKR_KEY;
const netlifyToken = process.env.NETLIFY_TOKEN;

const checkrKeyBase64 = Buffer.from(`${checkrKey}:`).toString('base64');
console.log('init', vgsUser, vgsPass, vgsTenant, checkrKey, netlifyToken, checkrKeyBase64);

const fwUrl = `http://${vgsUser}:${vgsPass}@${vgsTenant}.SANDBOX.verygoodproxy.io:8080`;

async function sendDataWithProxy(url, proxyUrl, data, contentType) {
  return await request({
    method: 'POST',
    url: url,
    proxy: proxyUrl,
    body: data,
    strictSSL: false,
    headers: {
      'content-type': contentType,
      Authorization: `Basic ${checkrKeyBase64}`
    }
  });
}

async function gerReportId(candidateId) {
  const url = `https://api.checkr.com/v1/reports`;
  const response = await request({
    method: 'POST',
    url: url,
    body: `package=driver_standard&candidate_id=${candidateId}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${checkrKeyBase64}`
    }
  });

  return JSON.parse(response).id;
}

async function getSubmitById(submitId) {
  console.log('getSubmitById', Buffer.from(`${checkrKey}:`).toString('base64') );
  
  const url = `http://api.netlify.com/api/v1/submissions?access_token=${netlifyToken}`;
  const response = await request(url);
  const data = JSON.parse(response);
    
  const submit = data.find(r => r.data.submit_id === submitId);
  console.log('submit', submit.data);

  return submit.data;
}


exports.handler = async function(event, context) {
  const submitId = event.queryStringParameters.submitId;
  console.log('submitId', submitId);
  console.log('env', process.env);
  
  if (!checkrKey) {
    return {
      statusCode: 200,
      body: '{"error":"no-key"}'
    }
  }

  try {
    const userData = await getSubmitById(submitId);
    console.log('userData', userData);
    
    const payload = `first_name=${userData.first_name}&last_name=${userData.last_name}&email=${userData.email_address}&ssn=${userData.ssn}&driver_license_number=${userData.driver_license}&driver_license_state=${userData.driver_license_state}&zipcode=90401&dob=${userData.birthdate}&no_middle_name=true&geo_ids[]=486bfc16a8fd6f33519b89af`
    console.log('payload', payload);
    
    let responseCheckr = await sendDataWithProxy(
      `https://api.checkr.com/v1/candidates`, fwUrl, payload, 'application/x-www-form-urlencoded'
    );
    const candidate = JSON.parse(responseCheckr);
    console.log('responseCheckr', candidate);

    const reportId = await gerReportId(candidate.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        reportId,
        submitData: userData,
      }),
    };
  } catch (e) {
    if(e.error) {
      console.log(e.error);
    } else {
      console.log(e);
    }

    return {
      statusCode: 200,
      body: 'error'
    };
  }
}