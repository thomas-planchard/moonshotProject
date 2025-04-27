import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import NewTripPage from './pages/NewTripPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import { useAuth } from './context/AuthContext';

// RequireAuth wrapper to protect routes
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/trips" element={<TripsPage />} />
                    <Route path="/trips/new" element={<NewTripPage />} />
                    <Route path="/trips/:id" element={<TripDetailPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                  </Routes>
                </RequireAuth>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;