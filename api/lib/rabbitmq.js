import amqplib from 'amqplib';

let channel;

export async function getChannel() {
  if (channel) return channel;
  const conn = await amqplib.connect(process.env.QUEUE_URL);
  channel = await conn.createChannel();
  await channel.assertQueue(process.env.JOB_QUEUE, { durable: true });
  return channel;
}

export async function enqueueJob(message) {
  const ch = await getChannel();
  const buffer = Buffer.from(JSON.stringify(message));
  ch.sendToQueue(process.env.JOB_QUEUE, buffer, { persistent: true });
}
