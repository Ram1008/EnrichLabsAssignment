# 🛠 Job Queue System with Async & Sync Vendor Support

A minimal distributed system using Node.js, RabbitMQ, and MongoDB to handle background jobs through rate-limited sync and async vendor integrations.


## Explore the workflow

1. Submit a payload to the job API and receive its request ID.
2. A RabbitMQ worker calls the selected synchronous or asynchronous vendor.
3. Inspect job status and completion data; the asynchronous path finishes through a vendor webhook.

**Engineering focus:** queue-based processing, per-vendor rate limiting and asynchronous completion. The example intentionally has no retry queue; see the tradeoffs below.


## Quick Start

```
# 1. Clone the repo
git clone https://github.com/Ram1008/EnrichLabsAssignment.git
cd EnrichLabsAssignment

# 2. Start everything
docker-compose up --build

```

## Architecture

  ![Architecture](https://github.com/user-attachments/assets/6fe55acd-da49-4e3a-af1e-5a4f1839a39a)


Queue: RabbitMQ   |   Sync Vendor: 202 immediate reply  
Async Vendor: Webhook callback → /vendor-webhook/:vendor

## Design Decisions & Trade-offs

RabbitMQ was chosen for mature support of reliable queues and manual ACKs.  
Node.js + ES Modules kept both API and worker lightweight and consistent.  
Rate Limiting is implemented using a simple token-bucket pattern per vendor.  
Vendor Mock Split allowed separate control of sync/async behavior and failures.  
Webhook-first async vendor allows non-blocking job processing.  
Docker Compose used to unify all components for easy testing and deployment.  
No retry queue for failed jobs to keep logic simple and predictable.  

## Apis
```
[
  {
    "name": "Create Job",
    "method": "POST",
    "url": "http://localhost:5000/jobs",
    "body": {
      "foo": "bar",
      "use_async": true
    },
    "description": "Creates a new job with any payload. Set use_async to true for async vendor."
  },
  {
    "name": "Get Job by ID",
    "method": "GET",
    "url": "http://localhost:5000/jobs/:request_id",
    "description": "Retrieves the job status and result for a given request_id."
  },
  {
    "name": "Vendor Webhook",
    "method": "POST",
    "url": "http://localhost:5000/vendor-webhook/async",
    "body": {
      "request_id": "e3a12abc-9d48-4b7a-9ef3-1234567890ab",
      "result": {
        "id": "  job-123  ",
        "data": {
          "field1": "value1"
        },
        "pii": {
          "email": "user@example.com"
        }
      }
    },
    "description": "Simulates an async vendor calling back with the final result."
  }
]
```

## Recorded load-test scenario (load-test.js and k6-output.txt)

The checked-in results describe a prior run, not a current performance guarantee. Re-run with your hardware and service configuration before comparing throughput.

Tool: k6  
200 virtual users, 60s duration  
POST & GET mix  
MongoDB indexed on request_id  
Vendor rate limit: 3–5/sec depending on type  
