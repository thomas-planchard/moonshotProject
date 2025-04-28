import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    // Additional check to ensure authentication
    if (!loading && !user) {
      console.log("RequireAuth: No user detected, redirecting to login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Save the current location to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
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