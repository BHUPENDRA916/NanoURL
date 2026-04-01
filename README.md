# NanoURL

A fast, reliable URL shortening service with click analytics, custom aliases, and rate limiting.

## Features

- **URL Shortening** - Generate 6-character short codes using SHA-256 hashing
- **Custom Aliases** - Create memorable links with custom aliases (3-20 characters)
- **Click Analytics** - Track clicks with IP, user agent, and timestamp data
- **Rate Limiting** - Sliding window rate limiter (100 requests/minute per IP)
- **Collision Detection** - Automatic retry logic for hash collisions

## Tech Stack

**Client:** React 18, Vite

**Server:** Node.js, Express, MongoDB (Mongoose)

## Project Structure

```
├── client/
│   └── src/
│       ├── components/
│       │   ├── UrlForm.jsx      # URL input form
│       │   ├── UrlList.jsx      # List of shortened URLs
│       │   └── Analytics.jsx    # Click analytics modal
│       ├── services/
│       │   └── api.js           # API client
│       └── App.jsx
└── server/
    └── src/
        ├── controllers/
        ├── models/
        │   ├── Url.js           # URL schema
        │   └── Click.js         # Click tracking schema
        ├── routes/
        ├── services/
        ├── middleware/
        │   └── rateLimiter.js   # Sliding window rate limiter
        └── app.js
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a shortened URL |
| GET | `/api/urls` | Get all URLs |
| GET | `/api/urls/:shortCode/analytics` | Get click analytics |
| DELETE | `/api/urls/:shortCode` | Delete a URL |
| GET | `/:shortCode` | Redirect to original URL |
| GET | `/health` | Health check |

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Server Setup

```bash
cd server
cp .env.example .env  # Configure your environment
npm install
npm run dev
```

### Client Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:5000
```

## License

MIT
