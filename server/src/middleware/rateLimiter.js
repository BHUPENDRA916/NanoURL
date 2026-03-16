/**
 * Sliding Window Rate Limiter
 * Tracks request timestamps per IP and enforces rate limits
 */

const WINDOW_SIZE_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 100;

// In-memory store for request timestamps per IP
const requestStore = new Map();

// Cleanup interval to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, timestamps] of requestStore.entries()) {
    const validTimestamps = timestamps.filter(ts => now - ts < WINDOW_SIZE_MS);
    if (validTimestamps.length === 0) {
      requestStore.delete(ip);
    } else {
      requestStore.set(ip, validTimestamps);
    }
  }
}

// Start cleanup interval
setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);

/**
 * Get client IP from request
 * @param {Object} req - Express request object
 * @returns {string} - Client IP address
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.ip ||
         'unknown';
}

/**
 * Sliding window rate limiter middleware
 */
export function rateLimiter(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE_MS;

  // Get existing timestamps for this IP
  let timestamps = requestStore.get(ip) || [];

  // Filter to only include timestamps within the current window
  timestamps = timestamps.filter(ts => ts > windowStart);

  // Check if limit exceeded
  if (timestamps.length >= MAX_REQUESTS) {
    const oldestTimestamp = timestamps[0];
    const retryAfter = Math.ceil((oldestTimestamp + WINDOW_SIZE_MS - now) / 1000);

    res.set('Retry-After', retryAfter);
    res.set('X-RateLimit-Limit', MAX_REQUESTS);
    res.set('X-RateLimit-Remaining', 0);
    res.set('X-RateLimit-Reset', new Date(oldestTimestamp + WINDOW_SIZE_MS).toISOString());

    return res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      retryAfter
    });
  }

  // Add current request timestamp
  timestamps.push(now);
  requestStore.set(ip, timestamps);

  // Set rate limit headers
  res.set('X-RateLimit-Limit', MAX_REQUESTS);
  res.set('X-RateLimit-Remaining', MAX_REQUESTS - timestamps.length);

  next();
}

export default rateLimiter;
