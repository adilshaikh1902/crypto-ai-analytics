import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
  Scale, ArrowLeft, BrainCircuit, TrendingUp, 
  TrendingDown, Loader2, Zap, Sparkles, Activity, LayoutDashboard
} from 'lucide-react';
import '../styles/comparison.css';

const Comparison = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [coinA, setCoinA] = useState('bitcoin');
  const [coinB, setCoinB] = useState('ethereum');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await api.get('/crypto/list-coins');
        setAllCoins(res.data);
      } catch (err) { 
        console.error(err); 
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const [resA, resB] = await Promise.all([
          api.get(`/crypto/analyze/${coinA}`),
          api.get(`/crypto/analyze/${coinB}`)
        ]);
        setDataA(resA.data);
        setDataB(resB.data);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchComparison();
  }, [coinA, coinB]);

  // Design Logic: Determine which coin is "Better"
  const getVerdict = () => {
    if (!dataA || !dataB) return null;
    if (dataA.prediction === 'Rise' && dataB.prediction === 'Fall') return dataA.coin;
    if (dataB.prediction === 'Rise' && dataA.prediction === 'Fall') return dataB.coin;
    return "Neutral";
  };

  const ComparisonCard = ({ analysis, onSelect, isWinner, side }) => (
    <div className={`comparison-card ${isWinner ? 'comparison-card-winner' : ''}`}>
      <div className="card-glow"></div>
      <div className="card-content">
        {isWinner && (
          <div className="winner-badge">
            <Sparkles className="winner-badge-icon" />
            <span>Stronger Signal</span>
          </div>
        )}
        
        <label className="card-label">Select Asset</label>
        <div className="select-wrapper">
          <select 
            className="card-select"
            value={analysis?.coin || ""}
            onChange={(e) => onSelect(e.target.value)}
          >
            {allCoins.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {analysis ? (
          <div className="card-analysis">
            {/* Price Section */}
            <div className="price-section">
              <p className="price-label">Live Valuation</p>
              <p className="price-value">
                ${analysis.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Prediction Section */}
            <div className={`prediction-section ${
              analysis.prediction === 'Rise' ? 'prediction-rise' : 'prediction-fall'
            }`}>
              <div className="prediction-section-bg"></div>
              <div className="prediction-header">
                <BrainCircuit className="prediction-header-icon" size={20} />
                <span className="prediction-header-label">AI Momentum Forecast</span>
              </div>
              <div className="prediction-content">
                <p className="prediction-value">{analysis.prediction}</p>
                {analysis.prediction === 'Rise' ? 
                  <TrendingUp className="prediction-icon" size={36} /> : 
                  <TrendingDown className="prediction-icon" size={36} />
                }
              </div>
            </div>

            {/* Confidence Section */}
            {analysis.confidence && (
              <div className="confidence-section">
                <p className="confidence-label">Model Confidence</p>
                <p className="confidence-text">{analysis.confidence}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card-loading">
            <Loader2 className="card-loading-spinner" />
            <p className="card-loading-text">Syncing market data...</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="comparison-container">
      {/* Animated Background */}
      <div className="comparison-background">
        <div className="comparison-orb orb-1"></div>
        <div className="comparison-orb orb-2"></div>
        <div className="comparison-orb orb-3"></div>
      </div>

      <div className="comparison-wrapper">
        {/* Header */}
        <header className="comparison-header">
          <div className="header-left">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft className="back-link-icon" size={16} />
              <LayoutDashboard size={20} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="page-title">
              <span className="title-main">Comparison</span>
              <span className="title-accent">Engine</span>
            </h1>
          </div>
          
          <div className="header-status">
            <div className="status-icon-wrapper">
              <div className="status-icon-glow"></div>
              <Scale className="status-icon" size={32} />
            </div>
            {loading && <Loader2 className="status-spinner" />}
          </div>
        </header>

        {/* Comparison Grid */}
        <div className="comparison-grid">
          <ComparisonCard 
            analysis={dataA} 
            onSelect={setCoinA} 
            isWinner={getVerdict() === dataA?.coin}
            side="left"
          />
          
          {/* VS Divider */}
          <div className="vs-divider">
            <div className="vs-divider-line"></div>
            <div className="vs-badge">
              <Activity className="vs-badge-icon" />
              <span>VS</span>
            </div>
            <div className="vs-divider-line"></div>
          </div>
          
          <ComparisonCard 
            analysis={dataB} 
            onSelect={setCoinB} 
            isWinner={getVerdict() === dataB?.coin}
            side="right"
          />
        </div>

        {/* Verdict Section */}
        {dataA && dataB && (
          <div className="verdict-section">
            <div className="verdict-glow"></div>
            <div className="verdict-content">
              <div className="verdict-badge">
                <Zap className="verdict-badge-icon" size={14} />
                <span>AI Recommendation</span>
              </div>
              
              <h2 className="verdict-title">
                {getVerdict() === "Neutral" 
                  ? "Market Sentiment is Symmetrical" 
                  : `${getVerdict().toUpperCase()} shows stronger bullish signals`}
              </h2>
              
              <p className="verdict-description">
                The Decision Support System suggests {getVerdict() === "Neutral" 
                  ? "waiting for a clearer divergence in price action." 
                  : `prioritizing ${getVerdict()} for current-window long positions.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comparison;