import React, { useState } from 'react';
import { FileText, TrendingUp, MapPin, Trash2, ChevronDown, ChevronUp, Droplets, User } from 'lucide-react';
import { InvoiceType, InvoiceFuel, InvoiceTravel } from '../../types';
import { useApi } from '../../hooks/useApi';
import ConfirmationModal from '../modal/ConfirmationModal';

interface InvoiceTableProps {
  invoices: InvoiceType[];
  tripId: string;
  onInvoiceDeleted?: () => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, tripId, onInvoiceDeleted }) => {
  const [filter, setFilter] = useState<'all' | 'fuel' | 'plane' | 'train'>('all');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { deleteInvoice, loading } = useApi();
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  
  // Toggle expanded state for a row
  const toggleRowExpand = (invoiceId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [invoiceId]: !prev[invoiceId]
    }));
  };
  
  // Open delete confirmation modal
  const openDeleteConfirmation = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
  };
  
  // Close delete confirmation modal
  const closeDeleteConfirmation = () => {
    setInvoiceToDelete(null);
  };
  
  // Handle invoice deletion
  const confirmDeleteInvoice = async () => {
    if (invoiceToDelete) {
      const success = await deleteInvoice(tripId, invoiceToDelete);
      if (success && onInvoiceDeleted) {
        onInvoiceDeleted();
      }
      closeDeleteConfirmation();
    }
  };

  // Get type icon and label
  const getTypeIcon = (invoice: InvoiceType) => {
    if (isFuelInvoice(invoice)) {
      return <span className="text-amber-500">⛽</span>;
    } else if (isTravelInvoice(invoice)) {
      // Use transport_type if available, otherwise fallback to invoice.type
      const transportType = Array.isArray(invoice.transport_type) && invoice.transport_type[0] 
        ? invoice.transport_type[0] 
        : invoice.type;
        
      switch (transportType.toLowerCase()) {
        case 'plane':
        case 'air':
        case 'flight':
        case 'airplane':
          return <span className="text-blue-500">✈️</span>;
        case 'train':
        case 'rail':
          return <span className="text-green-500">🚆</span>;
        default:
          return <span className="text-blue-500">✈️</span>;
      }
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get display type name
  const getDisplayType = (invoice: InvoiceType) => {
    if (isFuelInvoice(invoice)) {
      return 'Fuel';
    } else if (isTravelInvoice(invoice)) {
      // Use transport_type if available, otherwise fallback to invoice.type
      const transportType = Array.isArray(invoice.transport_type) && invoice.transport_type[0] 
        ? invoice.transport_type[0] 
        : invoice.type;
      return transportType.charAt(0).toUpperCase() + transportType.slice(1).toLowerCase();
    } else {
      // Handle any other invoice types
      return (invoice as {type: string}).type || 'Unknown';
    }
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter invoices
  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.type === filter);
  
  // Check if invoice is a fuel invoice
  const isFuelInvoice = (invoice: InvoiceType): invoice is InvoiceFuel => {
    return invoice.type === 'fuel';
  };

  // Check if invoice is a travel invoice
  const isTravelInvoice = (invoice: InvoiceType): invoice is InvoiceTravel => {
    return invoice.type === 'plane' || invoice.type === 'train';
  };

  // Helper to get transport type emoji
  const getTransportEmoji = (transportType: string) => {
    const type = transportType.toLowerCase();
    if (type === 'plane' || type === 'air' || type === 'flight' || type === 'airplane') {
      return <span className="text-blue-500">✈️</span>;
    } else if (type === 'train' || type === 'rail') {
      return <span className="text-green-500">🚆</span>;
    } else {
      return <span className="text-blue-500">✈️</span>;
    }
  };

  // Render routes for a travel invoice
  const renderRoutes = (invoice: InvoiceTravel) => {
    if (!Array.isArray(invoice.departure) || !Array.isArray(invoice.arrival)) {
      return <span className="text-sm text-gray-400">No route information</span>;
    }
    
    const isExpanded = expandedRows[invoice.id];
    const hasMultipleRoutes = invoice.departure.length > 1;
    
    // Calculate total CO2 for all segments
    const totalCO2 = Array.isArray(invoice.co2) 
      ? invoice.co2.reduce((sum, val) => sum + (val || 0), 0)
      : 0;
    
    return (
      <div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-900">
            {invoice.departure[0] || 'N/A'} → {invoice.arrival[0] || 'N/A'}
          </span>
          
          {hasMultipleRoutes && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleRowExpand(invoice.id);
              }}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {isExpanded && hasMultipleRoutes && (
          <div className="mt-2 pl-6 border-l-2 border-gray-200">
            {invoice.departure.map((dep, idx) => {
              const transportType = Array.isArray(invoice.transport_type) && invoice.transport_type[idx] 
                ? invoice.transport_type[idx] 
                : 'Unknown';
              const co2Value = Array.isArray(invoice.co2) && invoice.co2[idx] 
                ? invoice.co2[idx].toLocaleString() 
                : '0';
              
              return (
                <div key={idx} className="text-sm text-gray-700 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getTransportEmoji(transportType)}
                      <span className="ml-2">{dep || 'N/A'} → {invoice.arrival[idx] || 'N/A'}</span>
                    </div>
                    <span className="text-gray-600">{co2Value} kg CO₂</span>
                  </div>
                </div>
              );
            })}
            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>{totalCO2.toLocaleString()} kg CO₂</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render fuel details
  const renderFuelDetails = (invoice: InvoiceFuel) => {
    return (
      <div className="flex items-center">
        <Droplets className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-900">
          {invoice.volume} L • {invoice.typeOfFuel || 'Unknown fuel type'}
        </span>
      </div>
    );
  };

  // Render carbon footprint
  const renderCarbonFootprint = (invoice: InvoiceType) => {
    if (isFuelInvoice(invoice)) {
      return (
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-900">
            {invoice.co2.toLocaleString()} kg CO₂
          </span>
        </div>
      );
    } else {
      // For travel invoices, just show total CO2
      const totalCO2 = Array.isArray(invoice.co2) 
        ? invoice.co2.reduce((sum, val) => sum + (val || 0), 0) 
        : 0;
        
      return (
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-900">
            {totalCO2.toLocaleString()} kg CO₂
          </span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <ConfirmationModal
        isOpen={invoiceToDelete !== null}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteInvoice}
        onCancel={closeDeleteConfirmation}
      />
      
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(invoice)}
                      <span className="ml-2 text-sm capitalize text-gray-900">
                        {getDisplayType(invoice)}
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
                    {renderCarbonFootprint(invoice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isFuelInvoice(invoice) ? renderFuelDetails(invoice) : 
                     isTravelInvoice(invoice) ? renderRoutes(invoice) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.uploadedBy ? (
                      <div className="flex items-center">
                        <div className="bg-secondary-100 text-secondary-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                          {getUserInitials(invoice.uploadedBy.name)}
                        </div>
                        <span className="text-sm">{invoice.uploadedBy.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-sm">Unknown</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openDeleteConfirmation(invoice.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                      title="Delete invoice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
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