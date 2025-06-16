import axios from "axios";

export const handler = async (event, context) => {
  const key  = process.env.LLAMA_API_KEY;
  const path = event.path.replace('/.netlify/functions/llama', '');

  try {
    const upstream = await axios({
      method: event.httpMethod,
      url: `https://api.cloud.llamaindex.ai${path}`,
      data: event.isBase64Encoded
              ? Buffer.from(event.body, 'base64')
              : event.body,
      headers: {
        ...event.headers,
        authorization: `Bearer ${key}`,
      },
      responseType: 'arraybuffer',
    });

    return {
      statusCode: upstream.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        ...upstream.headers,
      },
      body: upstream.data.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (e) {
    return {
      statusCode: e.response?.status || 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};