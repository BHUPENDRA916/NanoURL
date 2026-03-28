export default function Analytics({ analytics, onClose }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="analytics-modal" onClick={onClose}>
      <div className="analytics-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h3>Analytics</h3>

        <div className="analytics-meta">
          <div className="analytics-meta-item">
            <span className="label">Short URL</span>
            <span className="value">/{analytics.shortCode}</span>
          </div>

          <div className="analytics-meta-item">
            <span className="label">Original URL</span>
            <span className="value">
              <a href={analytics.originalUrl} target="_blank" rel="noopener noreferrer">
                {analytics.originalUrl}
              </a>
            </span>
          </div>

          <div className="analytics-meta-item">
            <span className="label">Total Clicks</span>
            <span className="value large">{analytics.totalClicks}</span>
          </div>

          <div className="analytics-meta-item">
            <span className="label">Created</span>
            <span className="value">{formatDate(analytics.createdAt)}</span>
          </div>
        </div>

        <div className="click-list">
          <h4>Recent Click History</h4>

          {analytics.recentClicks.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>No clicks recorded yet</p>
            </div>
          ) : (
            analytics.recentClicks.map((click, index) => (
              <div key={index} className="click-item">
                <div className="timestamp">{formatDate(click.timestamp)}</div>
                <div className="details">
                  IP: {click.ip || 'Unknown'}
                  <br />
                  {click.userAgent || 'Unknown browser'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
