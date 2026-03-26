import { useState } from 'react';
import { shortenUrl } from '../services/api';

export default function UrlForm({ onUrlCreated }) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await shortenUrl(url, alias);
      setResult(data);
      setUrl('');
      setAlias('');
      onUrlCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.shortUrl);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Paste your long URL</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="alias">Custom alias (optional)</label>
          <input
            type="text"
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="my-custom-link"
            pattern="^[a-zA-Z0-9_-]{3,20}$"
          />
          <p className="hint">3-20 characters: letters, numbers, hyphens, underscores</p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16, margin: 0, borderWidth: 2 }}></span>
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>

        {error && (
          <p className="error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </p>
        )}

        {result && (
          <div className="success">
            <p>Your shortened URL is ready:</p>
            <p>
              <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">
                {result.shortUrl}
              </a>
              <button type="button" className="copy-btn" onClick={copyToClipboard}>
                Copy
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
