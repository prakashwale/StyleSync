import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import MoodBoard from './components/MoodBoard';
import SignUp from './pages/SignUp';
import AuthPage from './pages/AuthPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MoodBoard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/auth" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
