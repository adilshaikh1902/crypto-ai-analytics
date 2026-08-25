import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { 
  TrendingUp, TrendingDown, BrainCircuit, Search, 
  Loader2, LogOut, Scale, Activity, ChevronRight, 
  Globe, Sparkles, AlertCircle, BarChart3, Zap, Newspaper, LayoutDashboard
} from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [coin, setCoin] = useState('bitcoin');
  const [allCoins, setAllCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoinList = async () => {
      try {
        const res = await api.get('/crypto/list-coins');
        setAllCoins(res.data);
      } catch (err) {
        console.error("Error fetching coin list", err);
      }
    };
    fetchCoinList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [coin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const marketRes = await api.get(`/crypto/market-data/${coin}`);
      const analysisRes = await api.get(`/crypto/analyze/${coin}`);
      setData(marketRes.data.prices);
      setAnalysis(analysisRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = allCoins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="dashboard-orb orb-1"></div>
        <div className="dashboard-orb orb-2"></div>
        <div className="dashboard-orb orb-3"></div>
      </div>

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* Logo Section */}
        <div className="sidebar-logo">
          <div className="logo-icon-wrapper">
            <div className="logo-glow"></div>
            <div className="logo-icon">
              <Activity size={20} />
            </div>
          </div>
          <div className="logo-text">
            <span className="logo-title">CRYPTOIQ</span>
            <span className="logo-subtitle">ANALYTICS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-label">Navigation</p>
          
          <Link to="/dashboard" className="nav-item nav-item-active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/coins" className="nav-item">
            <Globe size={20} />
            <span>Market Overview</span>
          </Link>

          <Link to="/comparison" className="nav-item">
            <Scale size={20} />
            <span>Compare Assets</span>
          </Link>

          <Link to="/news" className="nav-item">
            <Newspaper size={20} />
            <span>News</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            {/* Title */}
            <div className="header-title-section">
              <div className="header-title-wrapper">
                <h1 className="header-title">
                  <span className="title-main">{coin}</span>
                  <span className="title-accent">Intelligence</span>
                </h1>
                <div className="live-badge">
                  <span>LIVE</span>
                </div>
              </div>
              <p className="header-subtitle">
                <Zap size={14} className="subtitle-icon" />
                AI-Powered Market Analysis & Prediction Engine
              </p>
            </div>

            {/* Search */}
            <div className="header-search">
              <div className="search-glow"></div>
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search cryptocurrencies..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Search Dropdown */}
              {searchTerm && (
                <div className="search-dropdown">
                  {filteredCoins.length > 0 ? (
                    filteredCoins.map(c => (
                      <div 
                        key={c.id}
                        className="search-item"
                        onClick={() => { setCoin(c.id); setSearchTerm(""); }}
                      >
                        <div className="search-item-content">
                          <div className="coin-image-wrapper">
                            <div className="coin-image-glow"></div>
                            <img src={c.image} alt={c.name} className="coin-image" />
                          </div>
                          <div className="coin-info">
                            <p className="coin-name">{c.name}</p>
                            <p className="coin-symbol">{c.symbol}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="search-chevron" />
                      </div>
                    ))
                  ) : (
                    <div className="search-empty">
                      <p>No cryptocurrencies found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="dashboard-grid">
            
            {/* Main Chart Section */}
            <div className="chart-card">
              <div className="chart-card-glow"></div>
              <div className="chart-card-content">
                <div className="chart-corner-glow"></div>
                
                {/* Chart Header */}
                <div className="chart-header">
                  <div className="chart-header-left">
                    <div className="chart-icon-wrapper">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <h3 className="chart-title">Price Movement</h3>
                      <p className="chart-subtitle">7-day historical data</p>
                    </div>
                  </div>
                  
                  {loading && (
                    <div className="loading-badge">
                      <Loader2 className="loading-spinner" size={16} />
                      <span>Updating</span>
                    </div>
                  )}
                </div>

                {/* Chart */}
                <div className="chart-container">
                  {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="rgba(255,255,255,0.2)" 
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          hide
                        />
                        <YAxis 
                          domain={['auto', 'auto']} 
                          stroke="rgba(255,255,255,0.2)" 
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(19, 19, 26, 0.95)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                            padding: '12px'
                          }}
                          itemStyle={{color: '#3b82f6', fontWeight: 'bold', fontSize: '13px'}}
                          labelStyle={{color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '4px'}}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="url(#colorGradient)" 
                          strokeWidth={3} 
                          dot={false}
                          animationDuration={2000}
                          fill="url(#colorGradient)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-loading">
                      <Loader2 className="chart-loading-spinner" size={40} />
                      <p className="chart-loading-text">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Analysis Sidebar */}
            <div className="analysis-sidebar">
              
              {/* AI Prediction Card */}
              <div className="prediction-card">
                <div className="prediction-card-glow"></div>
                
                <div className="prediction-card-content">
                  <div className="prediction-orb prediction-orb-1"></div>
                  <div className="prediction-orb prediction-orb-2"></div>
                  
                  {/* Header */}
                  <div className="prediction-header">
                    <div className="prediction-icon-wrapper">
                      <BrainCircuit size={20} />
                    </div>
                    <div>
                      <h3 className="prediction-title">AI Prediction</h3>
                      <p className="prediction-subtitle">Neural network analysis</p>
                    </div>
                  </div>

                  {analysis && !loading ? (
                    <div className="prediction-content">
                      {/* Main Prediction */}
                      <div className={`prediction-result ${analysis.prediction === 'Rise' ? 'prediction-rise' : 'prediction-fall'}`}>
                        <div className="prediction-result-bg"></div>
                        <div className="prediction-result-content">
                          <p className="prediction-label">Market Direction</p>
                          <div className="prediction-value-wrapper">
                            <p className="prediction-value">
                              {analysis.prediction}
                            </p>
                            {analysis.prediction === 'Rise' ? 
                              <TrendingUp size={48} className="prediction-icon" /> : 
                              <TrendingDown size={48} className="prediction-icon" />
                            }
                          </div>
                        </div>
                      </div>

                      {/* Current Price */}
                      <div className="price-card">
                        <p className="price-label">Current Price</p>
                        <p className="price-value">
                          ${analysis.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>

                      {/* Confidence */}
                      <div className="confidence-card">
                        <div className="confidence-content">
                          <Sparkles size={18} className="confidence-icon" />
                          <div>
                            <p className="confidence-label">Model Confidence</p>
                            <p className="confidence-text">{analysis.confidence}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="prediction-loading">
                      <div className="prediction-loading-wrapper">
                        <div className="prediction-loading-glow"></div>
                        <Loader2 className="prediction-loading-spinner" size={48} />
                      </div>
                      <p className="prediction-loading-text">Processing data...</p>
                      <p className="prediction-loading-subtext">Running Random Forest algorithm</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="disclaimer-card">
                <div className="disclaimer-content">
                  <AlertCircle size={16} className="disclaimer-icon" />
                  <div>
                    <p className="disclaimer-label">Important Notice</p>
                    <p className="disclaimer-text">
                      {analysis?.disclaimer || "AI predictions are for educational purposes only. Cryptocurrency investments carry significant risk. Always conduct thorough research before making financial decisions."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;