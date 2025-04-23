import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import NewTripPage from './pages/NewTripPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<NewTripPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/settings" element={<div className="container mx-auto p-6"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;