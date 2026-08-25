import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import '../styles/login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          
          {/* Logo/Brand */}
          <div className="login-header">
            <div className="welcome-badge">
              <Sparkles className="badge-icon" />
              <span>Welcome back</span>
            </div>
            
            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-footer">
              <label className="remember-label">
                <input type="checkbox" className="remember-checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="button-icon" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <div className="social-buttons">
              <button type="button" className="social-button google-button">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
                <span>Google</span>
              </button>

              <button type="button" className="social-button facebook-button">
                <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="login-branding-section">
        {/* Animated background elements */}
        <div className="branding-background">
          <div className="branding-orb branding-orb-1"></div>
          <div className="branding-orb branding-orb-2"></div>
          <div className="branding-orb branding-orb-3"></div>
        </div>

        {/* Content */}
        <div className="branding-content">
          <div className="branding-text">
            <h2 className="branding-title">
              CryptoIQ
            </h2>
            <p className="branding-subtitle">
              Join thousands of users who trust our platform to streamline their workflow and boost their efficiency.
            </p>
            
            {/* Feature highlights */}
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Secure authentication & data protection</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Real-time collaboration tools</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Advanced analytics dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative grid pattern */}
        <div className="grid-overlay"></div>
        <div className="grid-pattern"></div>
      </div>
    </div>
  );
};

export default Login;