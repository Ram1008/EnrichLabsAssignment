import Job from './models/job.js';
import { callSyncVendor } from './vendors/syncClient.js';
import { callAsyncVendor } from './vendors/asyncClient.js';

export async function processJob(msg, channel) {
  const raw = msg.content.toString();
  const { request_id } = JSON.parse(raw);

  const job = await Job.findOneAndUpdate({ request_id }, { status: 'processing' });

  try {
    const useAsync = job.payload.use_async === true; 
    if (useAsync) {
      await callAsyncVendor(job);
    } else {
      const vendorResp = await callSyncVendor(job);
      const cleaned = {
        id: vendorResp.id.trim(),
        data: vendorResp.data,
      };
      await Job.findOneAndUpdate({ request_id }, { status: 'complete', result: cleaned });
    }

    channel.ack(msg);
  } catch (err) {
    await Job.findOneAndUpdate({ request_id }, { status: 'failed', error: err.message });
    channel.nack(msg, false, false);
  }
}
