import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Trip } from '../types';
import { Plus, Calendar, Briefcase, TrendingUp, ArrowRight, Trash2, AlertTriangle, Users, User } from 'lucide-react';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import { useAuth } from '../context/AuthContext';

const TripsPage: React.FC = () => {
  const { getTrips, deleteTrip, loading, error } = useApi();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sharedTrips, setSharedTrips] = useState<Trip[]>([]);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'my-trips' | 'shared-trips'>('my-trips');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const data = await getTrips();
      const owned = data.filter(trip => trip.ownerId === user?.uid);
      const shared = data.filter(trip => trip.ownerId !== user?.uid);
      
      setTrips(owned);
      setSharedTrips(shared);
    };

    fetchTrips();
  }, [getTrips, refresh, user]);

  const openDeleteConfirmation = (tripId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTripToDelete(tripId);
  };

  const closeDeleteConfirmation = () => {
    setTripToDelete(null);
  };

  const confirmDeleteTrip = async () => {
    if (tripToDelete) {
      const success = await deleteTrip(tripToDelete);
      if (success) {
        setRefresh(prev => prev + 1);
      }
      closeDeleteConfirmation();
    }
  };

  const handleCreateTrip = () => {
    navigate('/trips/new');
  };

  const displayTrips = selectedView === 'my-trips' ? trips : sharedTrips;

  if (loading && trips.length === 0 && sharedTrips.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Business Trips</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-card h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ConfirmationModal
        isOpen={tripToDelete !== null}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This will permanently remove all associated invoices and carbon data. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteTrip}
        onCancel={closeDeleteConfirmation}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Trips</h1>
        <div className="flex space-x-2">
          <div className="mr-2">
            <button 
              onClick={() => setSelectedView('my-trips')}
              className={`px-4 py-2 rounded-md ${
                selectedView === 'my-trips' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="h-4 w-4 inline-block mr-1" />
              My Trips
            </button>
            <button 
              onClick={() => setSelectedView('shared-trips')}
              className={`px-4 py-2 rounded-md ${
                selectedView === 'shared-trips' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4 inline-block mr-1" />
              Shared Trips
            </button>
          </div>
          <button
            onClick={handleCreateTrip}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Trip
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-50 text-error-700 p-4 rounded-md mb-6">
          <AlertTriangle className="h-5 w-5 inline-block mr-2" />
          {error}
        </div>
      )}

      {displayTrips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {selectedView === 'my-trips' 
              ? "No business trips yet" 
              : "No shared trips yet"
            }
          </h2>
          <p className="text-gray-600 mb-4">
            {selectedView === 'my-trips'
              ? "Track your business travel carbon footprint by creating your first trip."
              : "When someone shares a trip with you, it will appear here."
            }
          </p>
          {selectedView === 'my-trips' && (
            <button
              onClick={handleCreateTrip}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Create your first trip
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTrips.map(trip => (
            <Link
              to={`/trips/${trip.id}`}
              key={trip.id}
              className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-medium text-gray-900 line-clamp-1">{trip.name}</h2>
                  {trip.ownerId === user?.uid && (
                    <button 
                      onClick={(e) => openDeleteConfirmation(trip.id, e)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                      aria-label="Delete trip"
                      title="Delete trip"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{trip.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} - 
                      {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{trip.totalCarbonFootprint.toLocaleString()} kg CO₂</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{trip.invoices.length} invoices</span>
                  </div>
                  
                  {trip.ownerId !== user?.uid && (
                    <div className="flex items-center text-sm text-primary-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Shared trip</span>
                    </div>
                  )}
                  
                  {trip.contributors && trip.contributors.length > 0 && (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <div className="flex -space-x-2">
                        {trip.contributors.slice(0, 3).map((contributor, i) => (
                          <div 
                            key={i}
                            className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center text-xs border-2 border-white"
                            title={contributor.name}
                          >
                            {contributor.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {trip.contributors.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border-2 border-white">
                            +{trip.contributors.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <span className="text-primary-600 flex items-center text-sm font-medium">
                    View details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsPage;