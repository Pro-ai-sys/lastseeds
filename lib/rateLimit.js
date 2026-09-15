import { RateLimiterMemory } from "rate-limiter-flexible";

const limiters = {
  login: new RateLimiterMemory({ points: 5, duration: 60 * 15 }), // 5 pogingen per 15 min
  register: new RateLimiterMemory({ points: 3, duration: 60 * 60 }), // 3 per uur
  forgotPassword: new RateLimiterMemory({ points: 3, duration: 60 * 60 }), // 3 per uur
};

export async function checkRateLimit(type, key) {
  const limiter = limiters[type];
  if (!limiter) return { allowed: true };

  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (rejRes) {
    const retrySecs = Math.round(rejRes.msBeforeNext / 1000) || 60;
    return { allowed: false, retryAfter: retrySecs };
  }
}
