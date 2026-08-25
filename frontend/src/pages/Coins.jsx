import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Search, Loader2, TrendingUp, TrendingDown, 
  LayoutDashboard, LogOut, ArrowRight, Globe,
  Activity, Sparkles
} from 'lucide-react';
import '../styles/coins.css';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await api.get('/crypto/list-coins');
        setCoins(res.data);
      } catch (err) {
        console.error("Error fetching coins:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCoins();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="coins-loading-container">
        <div className="coins-loading-content">
          <div className="loading-spinner-wrapper">
            <div className="loading-spinner-glow"></div>
            <Loader2 className="loading-spinner" />
          </div>
          <p className="loading-text">Syncing Market Data...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="coins-container">
      {/* Animated Background */}
      <div className="coins-background">
        <div className="coins-orb coins-orb-1"></div>
        <div className="coins-orb coins-orb-2"></div>
        <div className="coins-orb coins-orb-3"></div>
      </div>

      <div className="coins-wrapper">
        {/* Header */}
        <header className="coins-header">
          <div className="header-left">
            <div className="header-icon-wrapper">
              <div className="header-icon-glow"></div>
              <div className="header-icon">
                <Globe size={24} />
              </div>
            </div>
            <div className="header-title-section">
              <h1 className="header-title">
                <span className="title-main">Market</span>
                <span className="title-accent">Assets</span>
              </h1>
              <div className="header-badge">
                <Sparkles className="badge-icon" />
                <span>Live Data</span>
              </div>
            </div>
          </div>

          <nav className="header-nav">
            <Link to="/dashboard" className="nav-link">
              <LayoutDashboard size={16} />
              <span>AI Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="nav-link nav-link-logout">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </nav>
        </header>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-glow"></div>
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by name or symbol..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="search-stats">
            <span className="stats-count">{filteredCoins.length}</span>
            <span className="stats-label">Assets Found</span>
          </div>
        </div>

        {/* Coins Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="coins-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">
                    <span className="header-content">
                      <Activity size={14} className="header-icon-small" />
                      Asset
                    </span>
                  </th>
                  <th className="table-header">
                    <span className="header-content">Price (USD)</span>
                  </th>
                  <th className="table-header table-header-right">
                    <span className="header-content">24h Change</span>
                  </th>
                  <th className="table-header table-header-right table-header-desktop">
                    <span className="header-content">Market Cap</span>
                  </th>
                  <th className="table-header table-header-center">
                    <span className="header-content">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredCoins.map((coin, index) => (
                  <tr 
                    key={coin.id} 
                    className="table-row"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="table-cell">
                      <div className="coin-info">
                        <div className="coin-image-wrapper">
                          <div className="coin-image-glow"></div>
                          <img src={coin.image} alt={coin.name} className="coin-image" />
                        </div>
                        <div className="coin-details">
                          <p className="coin-name">{coin.name}</p>
                          <p className="coin-symbol">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="table-cell">
                      <p className="coin-price">
                        ${coin.current_price < 1 
                          ? coin.current_price.toFixed(6) 
                          : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        }
                      </p>
                    </td>

                    <td className="table-cell table-cell-right">
                      <div className={`change-badge ${
                        coin.price_change_24h > 0 ? 'change-positive' : 'change-negative'
                      }`}>
                        {coin.price_change_24h > 0 ? 
                          <TrendingUp className="change-icon" size={14} /> : 
                          <TrendingDown className="change-icon" size={14} />
                        }
                        <span className="change-value">
                          {Math.abs(coin.price_change_24h || 0).toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    <td className="table-cell table-cell-right table-cell-desktop">
                      <p className="market-cap">
                        ${(coin.market_cap / 1e9).toFixed(2)}B
                      </p>
                    </td>

                    <td className="table-cell table-cell-center">
                      <Link 
                        to={`/dashboard?coin=${coin.id}`} 
                        className="action-button"
                      >
                        <span className="action-button-text">Analyze</span>
                        <ArrowRight className="action-button-icon" size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCoins.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon-wrapper">
                  <Search className="empty-state-icon" size={40} />
                </div>
                <h3 className="empty-state-title">No matching assets found</h3>
                <p className="empty-state-text">
                  Try searching for a different name or ticker symbol
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="coins-footer">
          <div className="footer-badge">
            <div className="footer-badge-dot"></div>
            <span>Real-time data powered by CoinGecko API</span>
          </div>
          <p className="footer-stats">
            Tracking <span className="footer-highlight">{coins.length}</span> cryptocurrencies
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Coins;