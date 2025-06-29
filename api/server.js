import dotenv from 'dotenv';
import express from 'express';
import connectMongoDB from './lib/connectMongoDB.js';
import jobsRouter from './routes/jobs.js';
import webhookRoutes from './routes/webhook.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectMongoDB();

app.use('/', webhookRoutes);
app.use('/jobs', jobsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`▶️  API listening on http://localhost:${PORT}`);
});