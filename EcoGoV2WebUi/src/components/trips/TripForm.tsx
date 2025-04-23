import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';

const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip, loading, error } = useApi();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {
      name: '',
      startDate: '',
      endDate: '',
    };
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Trip name is required';
      isValid = false;
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
      isValid = false;
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
      isValid = false;
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const trip = await createTrip(formData);
    if (trip) {
      navigate(`/trips/${trip.id}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Trip</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Trip Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              formErrors.name ? 'border-error-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Business Trip to New York"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-error-600">{formErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Details about the purpose of the trip"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.startDate ? 'border-error-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {formErrors.startDate && (
              <p className="mt-1 text-sm text-error-600">{formErrors.startDate}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.endDate ? 'border-error-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {formErrors.endDate && (
              <p className="mt-1 text-sm text-error-600">{formErrors.endDate}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm mr-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;