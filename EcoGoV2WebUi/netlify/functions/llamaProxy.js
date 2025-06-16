const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'https://api.cloud.llamaindex.ai';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');
    const authHeader = event.headers.authorization;

    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Missing authorization header' }),
      };
    }

    let response;

    switch (action) {
      case 'upload':
        // For file uploads, we need to handle the base64 data
        const form = new FormData();
        const buffer = Buffer.from(data.fileData, 'base64');
        form.append('upload_file', buffer, data.fileName);

        response = await axios.post(`${BASE_URL}/api/v1/files`, form, {
          headers: {
            ...form.getHeaders(),
            'Authorization': authHeader,
          },
        });
        break;

      case 'createJob':
        response = await axios.post(`${BASE_URL}/api/v1/extraction/jobs`, data, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        });
        break;

      case 'getJobStatus':
        response = await axios.get(`${BASE_URL}/api/v1/extraction/jobs/${data.jobId}`, {
          headers: {
            'Authorization': authHeader,
          },
        });
        break;

      case 'getJobResult':
        response = await axios.get(`${BASE_URL}/api/v1/extraction/jobs/${data.jobId}/result`, {
          headers: {
            'Authorization': authHeader,
          },
        });
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data,
      }),
    };
  }
};
