import React from 'react';
import { Link } from 'react-router-dom';
import TripForm from '../components/trips/TripForm';
import { ChevronLeft } from 'lucide-react';

const NewTripPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link 
          to="/trips" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Trips
        </Link>
      </div>
      
      <TripForm />
    </div>
  );
};

export default NewTripPage;