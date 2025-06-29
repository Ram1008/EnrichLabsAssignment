import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { enqueueJob } from '../lib/rabbitmq.js';
import JobModel from '../models/job.js'; 

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const request_id = uuidv4();
    await JobModel.create({ request_id, payload: req.body, status: 'pending' });
    await enqueueJob({ request_id, payload: req.body });
    res.status(202).json({ request_id });
  } catch (err) {
    next(err);
  }
});

router.get('/:request_id', async (req, res, next) => {
  const { request_id } = req.params;

  if (!isUUID(request_id)) {
    return res.status(400).json({ error: 'Invalid request_id' });
  }

  try {
    const job = await JobModel.findOne({ request_id });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'complete') {
      return res.json({ status: 'complete', result: job.result });
    } else if (job.status === 'failed') {
      return res.json({ status: 'failed', error: job.error });
    } else {
      return res.json({ status: 'processing' });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
