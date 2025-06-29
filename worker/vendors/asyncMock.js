import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/async-vendor', (req, res) => {
  const { request_id, callback_url, payload } = req.body;

  res.status(202).json({ status: 'accepted', id: request_id });

  setTimeout(() => {
    const finalResult = {
      request_id,
      result: {
        id: request_id,
        data: payload,
        comment: '  async result  ',
        pii: { email: 'test@example.com' },
      },
    };

    fetch(callback_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalResult),
    }).catch(err => console.error('Async callback failed:', err));
  }, 1000); 
});

export default app;
