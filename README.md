# 🛠 Job Queue System with Async & Sync Vendor Support

A minimal distributed system using Node.js, RabbitMQ, and MongoDB to handle background jobs through rate-limited sync and async vendor integrations.

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Ram1008/EnrichLabsAssignment.git

# 2. Start everything
docker-compose up --build

```

## Architecture

                     +-------------+
   POST /jobs        |             |  MongoDB (Job status/result)
 +--------------->   |   API       |----------------------------+
 |                   |             |                            |
 |                   +------+------+\                           |
 |                          |       \                          \/
 |                          |        +--------------------> [Job DB]
 |                          |        
 |                          |     <------------------+
 |                          |                         \
 |                   +------v------+\                  \
 |                   |               |     POST        |
 |                   |  Worker       +----> sync-vendor|
 |                   |               |     async-vendor|
 |                   +---------------+                 |
 |                                                     |
 +-----------------------------------------------------+

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

POST /jobs – accepts any payload, returns request_id
GET /jobs/:id – returns status and result (if complete)
POST /vendor-webhook/:vendor – for async vendor to send final results

##  Load Tested (view k6-output.txt)

Tool: k6
200 virtual users, 60s duration
POST & GET mix
MongoDB indexed on request_id
Vendor rate limit: 3–5/sec depending on type
