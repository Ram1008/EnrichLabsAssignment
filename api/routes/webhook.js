import { Router } from 'express';
import Job from '../models/job.js';

const router = Router();

router.post('/vendor-webhook/:vendor', async (req, res, next) => {
  try {
    const { request_id, result } = req.body;

    const cleaned = {
      id: result.id.trim(),
      data: result.data,
    };

    const job = await Job.findOneAndUpdate(
      { request_id },
      { status: 'complete', result: cleaned }
    );

    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.status(200).json({ status: 'saved' });
  } catch (err) {
    next(err);
  }
});

export default router;