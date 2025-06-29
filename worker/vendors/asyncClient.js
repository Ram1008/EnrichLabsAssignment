import fetch from 'node-fetch';
import RateLimiter from '../lib/rateLimiter.js';

const rateLimiter = new RateLimiter(3);

export async function callAsyncVendor(job) {
  await rateLimiter.removeToken();

  const resp = await fetch(`${process.env.ASYNC_VENDOR_URL}/async-vendor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      request_id: job.request_id,
      payload: job.payload,
      callback_url: process.env.WEBHOOK_CALLBACK_URL,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Async vendor error ${resp.status}`);
  }

  return resp.json();
}
