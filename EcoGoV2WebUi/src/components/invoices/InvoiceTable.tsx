import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, TrendingUp, MapPin } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoiceTableProps {
  invoices: Invoice[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  const [filter, setFilter] = useState<'all' | 'fuel' | 'plane' | 'train'>('all');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-success-100 text-success-800';
      case 'processing':
        return 'bg-warning-100 text-warning-800';
      case 'error':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fuel':
        return <span className="text-amber-500">⛽</span>;
      case 'plane':
        return <span className="text-blue-500">✈️</span>;
      case 'train':
        return <span className="text-green-500">🚆</span>;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Filter invoices
  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.type === filter);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
          Invoices ({filteredInvoices.length})
        </h3>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('fuel')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'fuel' 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fuel
          </button>
          <button
            onClick={() => setFilter('plane')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'plane' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Plane
          </button>
          <button
            onClick={() => setFilter('train')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'train' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Train
          </button>
        </div>
      </div>
      
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No invoices found. Add some invoices to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbon Footprint
                </th>
                {(filter === 'all' || filter === 'plane' || filter === 'train') && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(invoice.type)}
                      <span className="ml-2 text-sm capitalize text-gray-900">
                        {invoice.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900">
                        {invoice.fileName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900">
                        {Array.isArray(invoice.co2) && invoice.co2[0] 
                          ? invoice.co2[0].toLocaleString() 
                          : '0'} kg CO₂
                      </span>
                    </div>
                  </td>
                  {(filter === 'all' || filter === 'plane' || filter === 'train') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(invoice.type === 'plane' || invoice.type === 'train') && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">
                            {Array.isArray(invoice.departure) && invoice.departure[0]
                              ? invoice.departure[0] + ' → ' + (Array.isArray(invoice.arrival) && invoice.arrival[0] ? invoice.arrival[0] : 'N/A')
                              : 'N/A'}
                          </span>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;