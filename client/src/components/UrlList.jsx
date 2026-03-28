import { useState, useEffect } from 'react';
import { getAllUrls, deleteUrl, getAnalytics } from '../services/api';
import Analytics from './Analytics';

export default function UrlList({ refreshTrigger }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const fetchUrls = async () => {
    try {
      const data = await getAllUrls();
      setUrls(data);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  const handleDelete = async (shortCode) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      await deleteUrl(shortCode);
      setUrls(urls.filter((u) => u.shortCode !== shortCode));
    } catch (err) {
      alert('Failed to delete URL: ' + err.message);
    }
  };

  const handleShowAnalytics = async (shortCode) => {
    try {
      const data = await getAnalytics(shortCode);
      setAnalytics(data);
      setSelectedUrl(shortCode);
    } catch (err) {
      alert('Failed to fetch analytics: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="url-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="url-list">
        <div className="url-list-header">
          <h2>Your Links</h2>
          {urls.length > 0 && <span className="count">{urls.length} link{urls.length !== 1 ? 's' : ''}</span>}
        </div>

        {urls.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔗</div>
            <p>No links yet. Create your first short URL above!</p>
          </div>
        ) : (
          urls.map((url) => (
            <div key={url.shortCode} className="url-item">
              <div className="url-item-main">
                <div className="url-info">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-url"
                  >
                    {url.shortUrl.replace('http://', '').replace('https://', '')}
                    <svg className="external-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  <div className="original-url" title={url.originalUrl}>
                    {url.originalUrl}
                  </div>
                  <div className="stats">
                    <span className="stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span className="stat-value">{url.clickCount}</span> clicks
                    </span>
                    <span className="stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {formatDate(url.createdAt)} at {formatTime(url.createdAt)}
                    </span>
                    {url.customAlias && <span className="badge">Custom</span>}
                  </div>
                </div>
                <div className="url-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleShowAnalytics(url.shortCode)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    Analytics
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(url.shortCode)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedUrl && analytics && (
        <Analytics
          analytics={analytics}
          onClose={() => {
            setSelectedUrl(null);
            setAnalytics(null);
          }}
        />
      )}
    </>
  );
}
