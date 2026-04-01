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

### Server (Render)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
BASE_URL=https://your-api.onrender.com
CORS_ORIGIN=https://your-app.vercel.app
```

### Client (Vercel)
```
VITE_API_URL=https://your-api.onrender.com/api
```

## Deployment

### Server on Render
1. Create a new Web Service
2. Connect your GitHub repo
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

### Client on Vercel
1. Import your GitHub repo
2. Set root directory to `client`
3. Framework preset: Vite
4. Add `VITE_API_URL` environment variable

## License

MIT
