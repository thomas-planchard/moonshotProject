import axios from 'axios';

export default async (event) => {
  const key = process.env.LLAMA_API_KEY;          // set in Netlify dashboard
  const path = event.path.replace('/.netlify/functions/llama', '');

  try {
    const upstream = await axios({
      method: event.httpMethod,
      url: `https://api.cloud.llamaindex.ai${path}`,
      data: event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body,
      params: event.queryStringParameters,
      headers: {
        ...event.headers,                         // forward content-type, etc.
        authorization: `Bearer ${key}`,
      },
      responseType: 'arraybuffer',                // lets you forward files too
    });

    return {
      statusCode: upstream.status,
      headers: {
        'Access-Control-Allow-Origin': '*',       // let your front end consume it
        ...upstream.headers,
      },
      body: upstream.data.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};