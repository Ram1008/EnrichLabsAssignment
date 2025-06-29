import express from 'express';     
import { consumeJobs } from './lib/rabbitmq.js';
import { processJob } from './processor.js';
import syncMock from './vendors/syncMock.js';
import connectMongoDB  from './lib/connectMongodb.js';

connectMongoDB();

syncMock.listen(process.env.SYNC_VENDOR_PORT, () =>
  console.log(`Mock Sync Vendor ▶️ listening on ${process.env.SYNC_VENDOR_PORT}`)
);

consumeJobs(processJob)
  .then(() => console.log('Worker ▶️ consuming jobs'))
  .catch(err => console.error('Worker ▶️ failed to start', err));
