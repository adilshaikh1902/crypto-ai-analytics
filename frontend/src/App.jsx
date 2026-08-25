import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Coins from './pages/Coins';
import Comparison from './pages/Comparison';
import NewsFeed from './pages/NewsFeed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* New Protected Coins Route */}
        <Route 
          path="/coins" 
          element={
            <ProtectedRoute>
              <Coins />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/comparison"
          element={
            <ProtectedRoute>
              <Comparison/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/news"
        element={
          <ProtectedRoute>
            <NewsFeed/>
          </ProtectedRoute>
        }/>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;