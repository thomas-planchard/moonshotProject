import axios from "axios";

export const handler = async (event, context) => {
    
    if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  const key = process.env.LLAMA_API_KEY;
  
  // Check if API key exists
  if (!key) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'LLAMA_API_KEY not configured' }),
    };
  }

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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: e.message }),
    };
  }
};