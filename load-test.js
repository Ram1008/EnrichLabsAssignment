import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 200,         // virtual users
  duration: '60s',  
};

let requestIds = [];

export default function () {
  const shouldPost = Math.random() < 0.5;

  if (shouldPost || requestIds.length === 0) {
    // POST a new job
    const payload = JSON.stringify({ foo: "bar", use_async: Math.random() < 0.5 });

    const res = http.post('http://localhost:5000/jobs', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const json = res.json();
    if (json.request_id) {
      requestIds.push(json.request_id);
    }

    check(res, {
      'POST status 202': (r) => r.status === 202,
    });

  } else {
    // GET a random job status
    const id = requestIds[Math.floor(Math.random() * requestIds.length)];
    const res = http.get(`http://localhost:5000/jobs/${id}`);

    check(res, {
      'GET status 200': (r) => r.status === 200,
    });
  }

  sleep(0.1);
}
