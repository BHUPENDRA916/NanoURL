import crypto from 'crypto';
import Url from '../models/Url.js';

const MAX_RETRIES = 5;

/**
 * Generate a 6-character short code using SHA-256
 * @param {string} url - The original URL
 * @param {number} attempt - Retry attempt number for collision handling
 * @returns {string} - 6-character short code
 */
function generateShortCode(url, attempt = 0) {
  const input = url + Date.now() + attempt + crypto.randomBytes(4).toString('hex');
  const hash = crypto.createHash('sha256').update(input).digest('base64url');
  return hash.substring(0, 6);
}

/**
 * Validate custom alias format
 * @param {string} alias - Custom alias to validate
 * @returns {boolean}
 */
function isValidAlias(alias) {
  const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return aliasRegex.test(alias);
}

/**
 * Create a shortened URL with collision detection and retry logic
 * @param {string} originalUrl - The URL to shorten
 * @param {string|null} customAlias - Optional custom alias
 * @returns {Promise<Object>} - The created URL document
 */
export async function createShortUrl(originalUrl, customAlias = null) {
  // Handle custom alias
  if (customAlias) {
    if (!isValidAlias(customAlias)) {
      throw new Error('Invalid alias format. Use 3-20 alphanumeric characters, hyphens, or underscores.');
    }

    const existing = await Url.findOne({ shortCode: customAlias });
    if (existing) {
      throw new Error('This alias is already taken.');
    }

    const url = new Url({
      shortCode: customAlias,
      originalUrl,
      customAlias: true
    });

    return await url.save();
  }

  // Generate short code with collision detection
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const shortCode = generateShortCode(originalUrl, attempt);

    const existing = await Url.findOne({ shortCode });
    if (!existing) {
      const url = new Url({
        shortCode,
        originalUrl,
        customAlias: false
      });

      return await url.save();
    }
  }

  throw new Error('Failed to generate unique short code. Please try again.');
}

/**
 * Find URL by short code
 * @param {string} shortCode
 * @returns {Promise<Object|null>}
 */
export async function findByShortCode(shortCode) {
  return await Url.findOne({ shortCode });
}

/**
 * Increment click count
 * @param {string} shortCode
 * @returns {Promise<Object>}
 */
export async function incrementClickCount(shortCode) {
  return await Url.findOneAndUpdate(
    { shortCode },
    { $inc: { clickCount: 1 } },
    { new: true }
  );
}

/**
 * Get all URLs sorted by creation date
 * @returns {Promise<Array>}
 */
export async function getAllUrls() {
  return await Url.find().sort({ createdAt: -1 });
}

/**
 * Delete URL by short code
 * @param {string} shortCode
 * @returns {Promise<Object|null>}
 */
export async function deleteUrl(shortCode) {
  return await Url.findOneAndDelete({ shortCode });
}
