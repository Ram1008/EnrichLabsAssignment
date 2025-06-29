import fetch from 'node-fetch';
import RateLimiter from '../lib/rateLimiter.js';

const rateLimiter = new RateLimiter(5); 

export async function callSyncVendor(job) {
  await rateLimiter.removeToken();

  const resp = await fetch(`${process.env.SYNC_VENDOR_URL}/sync-vendor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id: job.request_id, payload: job.payload })
  });
  if (!resp.ok) {
    throw new Error(`Vendor error ${resp.status}`);
  }
  return resp.json();
}
