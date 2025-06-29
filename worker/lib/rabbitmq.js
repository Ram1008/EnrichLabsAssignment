import amqplib from 'amqplib';

let channel;

export async function getChannel() {
  if (channel) return channel;
  const conn = await amqplib.connect(process.env.RABBIT_URL);
  channel = await conn.createChannel();
  await channel.assertQueue(process.env.JOB_QUEUE, { durable: true });
  return channel;
}

export async function consumeJobs(onMessage) {
  const ch = await getChannel();
  await ch.prefetch(1);
  ch.consume(process.env.JOB_QUEUE, msg => onMessage(msg, ch), { noAck: false });
}
