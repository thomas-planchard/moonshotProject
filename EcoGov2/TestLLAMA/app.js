// File: app.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;
const LLAMA_API_KEY = process.env.LLAMA_CLOUD_API_KEY;
const AGENT_ID = '06282571-5b3c-4896-8cf7-53b1bce8c39a';

app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { buffer, mimetype, originalname } = req.file;

    // 1. Build multipart/form-data payload
    const form = new FormData();
    // field name must be upload_file per API docs
    form.append('upload_file', buffer, {
      filename: originalname,
      contentType: mimetype,
    });

    // 2. Upload the document
    const uploadResp = await axios.post('https://api.cloud.llamaindex.ai/api/v1/files', form, {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${LLAMA_API_KEY}` }
      });
      console.log('Upload response:', uploadResp.data);

      const uploadData = uploadResp.data;
      const fileId = uploadData.file_id ?? uploadData.id ?? uploadData.fileId;
      if (!fileId) {
        return res.status(500).json({ 
          error: 'Upload succeeded but no file_id returned',
          uploadData
        });
      }

      // now run the extraction job
      const jobResp = await axios.post(
        'https://api.cloud.llamaindex.ai/api/v1/extraction/jobs',
        { extraction_agent_id: AGENT_ID, file_id: fileId },
        { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
      );
      console.log('Extraction job response:', jobResp.data);

      // Use 'id' as jobId, fallback to job_id if present
      const jobId = jobResp.data.id ?? jobResp.data.job_id;
      if (!jobId) {
        return res.status(500).json({
          error: 'Extraction job creation failed or no job id returned',
          jobRespData: jobResp.data
        });
      }

    // 4. Poll until SUCCESS or FAIL
    let status;
    let pollCount = 0;
    do {
      await new Promise((r) => setTimeout(r, 2000));
      const statusResp = await axios.get(
        `https://api.cloud.llamaindex.ai/api/v1/extraction/jobs/${jobId}`,
        { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
      );
      status = statusResp.data.status;
      pollCount++;
      if (status === 'FAILED') throw new Error('Extraction job failed');
      if (pollCount > 30) throw new Error('Extraction job timed out');
    } while (status !== 'SUCCESS');

    // 5. Fetch results
    const resultResp = await axios.get(
      `https://api.cloud.llamaindex.ai/api/v1/extraction/jobs/${jobId}/result`,
      { headers: { Authorization: `Bearer ${LLAMA_API_KEY}` } }
    );
    res.json(resultResp.data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));