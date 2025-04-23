import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, FileText } from 'lucide-react';
import { Trip } from '../../types';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  // Format the dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get color for carbon footprint
  const getCarbonColor = (value: number) => {
    if (value < 1000) return 'text-success-500';
    if (value < 3000) return 'text-warning-500';
    return 'text-error-500';
  };

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="block bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{trip.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{trip.description}</p>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-secondary-500" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
        
        <div className="flex items-center">
          <TrendingUp className={`h-5 w-5 mr-2 ${getCarbonColor(trip.totalCarbonFootprint)}`} />
          <span className={`font-medium ${getCarbonColor(trip.totalCarbonFootprint)}`}>
            {trip.totalCarbonFootprint.toLocaleString()} kg CO₂
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FileText className="h-5 w-5 mr-2 text-secondary-500" />
          <span>{trip.invoices.length} {trip.invoices.length === 1 ? 'invoice' : 'invoices'}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 text-right">
        <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View Details →
        </span>
      </div>
    </Link>
  );
};

export default TripCard;