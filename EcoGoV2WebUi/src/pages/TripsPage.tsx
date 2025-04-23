import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import TripCard from '../components/trips/TripCard';
import { PlusCircle, Search } from 'lucide-react';
import { Trip } from '../types';

const TripsPage: React.FC = () => {
  const { getTrips, loading, error } = useApi();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchTrips = async () => {
      const data = await getTrips();
      setTrips(data);
    };
    
    fetchTrips();
  }, [getTrips]);
  
  // Filter trips based on search query
  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Business Trips</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <Link
            to="/trips/new"
            className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Trip
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {searchQuery ? (
            <>
              <p className="text-lg text-gray-600 mb-2">No trips found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-600 mb-4">No trips found</p>
              <Link
                to="/trips/new"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create your first trip
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsPage;