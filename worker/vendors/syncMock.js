import express from 'express';
const app = express();
app.use(express.json());

app.post('/sync-vendor', (req, res) => {
  const dirty = {
    id: req.body.request_id,
    data: req.body.payload,
    pii: { ssn: '123-45-6789' },
    comment: '   trim me   '
  };
  res.json(dirty);
});

export default app;
