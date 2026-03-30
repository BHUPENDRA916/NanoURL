import { useState } from 'react';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">Nano<span>Url</span></div>
          </div>
          <h1>Make Every Link <span className="highlight">Shorter</span></h1>
          <p className="tagline">
            Transform long URLs into clean, trackable short links. Fast, reliable, and built for scale.
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Custom Aliases</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Click Analytics</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Instant Redirects</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <UrlForm onUrlCreated={handleUrlCreated} />
        <UrlList refreshTrigger={refreshTrigger} />
      </main>
    </>
  );
}
