import axios from "axios";

export const handler = async (event, context) => {
  // Handle CORS preflight
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
  
  if (!key) {
    console.error('LLAMA_API_KEY not configured');
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
  
  console.log('Llama function called:', {
    method: event.httpMethod,
    path: path,
    hasBody: !!event.body,
    isBase64: event.isBase64Encoded
  });

  try {
    const requestConfig = {
      method: event.httpMethod,
      url: `https://api.cloud.llamaindex.ai${path}`,
      headers: {
        'Authorization': `Bearer ${key}`,
      },
      responseType: 'arraybuffer',
    };
    
    if (event.body) {
      requestConfig.headers['Content-Type'] = event.headers['content-type'] || 'application/json';
      requestConfig.data = event.isBase64Encoded 
        ? Buffer.from(event.body, 'base64')
        : event.body;
    }
    
    const upstream = await axios(requestConfig);

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
    console.error('Llama API Error:', {
      status: e.response?.status,
      statusText: e.response?.statusText,
      message: e.message,
      url: `https://api.cloud.llamaindex.ai${path}`
    });
    
    return {
      statusCode: e.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: e.response?.data?.toString() || e.message,
        status: e.response?.status 
      }),
    };
  }
};