export default class RateLimiter {
  constructor(callsPerSec) {
    this.tokens = callsPerSec;
    this.capacity = callsPerSec;
    setInterval(() => { this.tokens = this.capacity; }, 1000);
  }

  async removeToken() {
    while (this.tokens <= 0) {
      await new Promise(r => setTimeout(r, 100));
    }
    this.tokens -= 1;
  }
}
