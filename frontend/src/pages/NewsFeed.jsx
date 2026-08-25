import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/newsfeed.css';
import { 
  Newspaper, Search, Loader2, ExternalLink, 
  ArrowLeft, Clock, Globe, TrendingUp, Sparkles
} from 'lucide-react';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('crypto');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/crypto/news/${query}`);
      setNews(res.data);
    } catch (err) {
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchNews();
  };

  return (
    <div className="newsfeed-container">
      {/* Animated Background */}
      <div className="newsfeed-background">
        <div className="newsfeed-orb orb-1"></div>
        <div className="newsfeed-orb orb-2"></div>
        <div className="newsfeed-orb orb-3"></div>
      </div>

      <div className="newsfeed-wrapper">
        {/* Header */}
        <header className="newsfeed-header">
          <div className="header-left">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft className="back-link-icon" size={16} />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="header-title-section">
              <div className="header-icon-wrapper">
                <div className="header-icon-glow"></div>
                <Newspaper className="header-icon" size={32} />
              </div>
              <div>
                <h1 className="page-title">
                  <span className="title-main">Global</span>
                  <span className="title-accent">NewsFeed</span>
                </h1>
                <div className="header-badge">
                  <Sparkles className="badge-icon" size={12} />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-glow"></div>
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Search news (e.g. Ethereum, Fed)..."
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>
            <button onClick={fetchNews} className="search-button">
              <TrendingUp size={18} />
              <span>Search</span>
            </button>
          </div>
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner-wrapper">
                <div className="loading-spinner-glow"></div>
                <Loader2 className="loading-spinner" size={48} />
              </div>
              <p className="loading-text">Scanning global headlines...</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-value">{news.length}</span>
                <span className="stat-label">Articles Found</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{query}</span>
                <span className="stat-label">Search Topic</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="live-indicator"></div>
                <span className="stat-label">Live Feed</span>
              </div>
            </div>

            {/* News Grid */}
            <div className="news-grid">
              {news.length > 0 ? (
                news.map((item, index) => (
                  <article 
                    key={index} 
                    className="news-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="news-card-glow"></div>
                    <div className="news-card-content">
                      {/* Card Header */}
                      <div className="news-card-header">
                        <span className={`sentiment-badge ${
                          item.sentiment === 'Positive' 
                            ? 'sentiment-positive' 
                            : item.sentiment === 'Negative'
                            ? 'sentiment-negative'
                            : 'sentiment-neutral'
                        }`}>
                          {item.sentiment || 'Neutral'}
                        </span>
                        <div className="news-time">
                          <Clock size={12} />
                          <span>{item.time || 'Recently'}</span>
                        </div>
                      </div>

                      {/* Card Title */}
                      <h3 className="news-title">
                        {item.title}
                      </h3>
                      
                      {/* Card Description */}
                      <p className="news-description">
                        {item.description || `Stay updated with the latest market shifts and institutional developments regarding ${query}.`}
                      </p>

                      {/* Card Footer */}
                      <div className="news-card-footer">
                        <div className="news-source">
                          <Globe size={14} />
                          <span>{item.source || 'Global News'}</span>
                        </div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="news-link"
                        >
                          <span>Read More</span>
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon-wrapper">
                    <Newspaper className="empty-state-icon" size={48} />
                  </div>
                  <h3 className="empty-state-title">No articles found</h3>
                  <p className="empty-state-text">
                    Try searching for a different topic or keyword
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;