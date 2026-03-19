import * as urlService from '../services/urlService.js';
import Click from '../models/Click.js';

/**
 * Create a shortened URL
 * POST /api/shorten
 */
export async function createUrl(req, res) {
  try {
    const { url, alias } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const shortened = await urlService.createShortUrl(url, alias || null);

    res.status(201).json({
      shortCode: shortened.shortCode,
      shortUrl: `${process.env.BASE_URL}/${shortened.shortCode}`,
      originalUrl: shortened.originalUrl,
      customAlias: shortened.customAlias,
      createdAt: shortened.createdAt
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Redirect to original URL
 * GET /:shortCode
 */
export async function redirectUrl(req, res) {
  try {
    const { shortCode } = req.params;

    const url = await urlService.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment click count
    await urlService.incrementClickCount(shortCode);

    // Log click analytics
    const click = new Click({
      shortCode,
      ip: req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip,
      userAgent: req.headers['user-agent']
    });
    await click.save();

    res.redirect(301, url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Get all URLs
 * GET /api/urls
 */
export async function getAllUrls(req, res) {
  try {
    const urls = await urlService.getAllUrls();

    const response = urls.map(url => ({
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      customAlias: url.customAlias,
      clickCount: url.clickCount,
      createdAt: url.createdAt
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Get analytics for a URL
 * GET /api/urls/:shortCode/analytics
 */
export async function getAnalytics(req, res) {
  try {
    const { shortCode } = req.params;

    const url = await urlService.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const clicks = await Click.find({ shortCode })
      .sort({ timestamp: -1 })
      .limit(100)
      .select('timestamp ip userAgent');

    res.json({
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      totalClicks: url.clickCount,
      createdAt: url.createdAt,
      recentClicks: clicks.map(click => ({
        timestamp: click.timestamp,
        ip: click.ip,
        userAgent: click.userAgent
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Delete a URL
 * DELETE /api/urls/:shortCode
 */
export async function deleteUrl(req, res) {
  try {
    const { shortCode } = req.params;

    const url = await urlService.deleteUrl(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Also delete associated clicks
    await Click.deleteMany({ shortCode });

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
