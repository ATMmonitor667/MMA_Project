import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';

import HomePage from './pages/HomePage';
import DashBoard from './pages/DashBoard';
import CardStore from './pages/CardStore';
import FighterCardPage from './pages/FighterCardPage';
import Listings from './pages/Listings';
import UserProfile from './pages/UserProfile';
import BattleArena from './pages/BattleArena';
import Leaderboard from './pages/Leaderboard';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-yellow-400 text-xl animate-pulse">Loading...</p>
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        <Route path="/store" element={<ProtectedRoute><CardStore /></ProtectedRoute>} />
        <Route path="/collection" element={<ProtectedRoute><FighterCardPage /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
        <Route path="/battle" element={<ProtectedRoute><BattleArena /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
