// In-memory OTP storage for development
// In production, use Redis or database storage

class OTPStore {
  constructor() {
    this.store = new Map();
    this.startCleanup();
  }

  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (now - value.timestamp > 5 * 60 * 1000) { // 5 minutes expiry
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  set(phone, data) {
    this.store.set(phone, data);
  }

  get(phone) {
    return this.store.get(phone);
  }

  delete(phone) {
    return this.store.delete(phone);
  }

  has(phone) {
    return this.store.has(phone);
  }
}

module.exports = new OTPStore();