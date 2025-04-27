import React, { useState } from 'react';
import { FileText, TrendingUp, MapPin, Trash2, ChevronDown, ChevronUp, Droplets } from 'lucide-react';
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
  
  // Check if invoice is a fuel invoice
  const isFuelInvoice = (invoice: InvoiceType): invoice is InvoiceFuel => {
    return invoice.type === 'fuel';
  };

  // Check if invoice is a travel invoice
  const isTravelInvoice = (invoice: InvoiceType): invoice is InvoiceTravel => {
    return invoice.type === 'plane' || invoice.type === 'train';
  };

  // Render routes for a travel invoice
  const renderRoutes = (invoice: InvoiceTravel) => {
    if (!Array.isArray(invoice.departure) || !Array.isArray(invoice.arrival)) {
      return <span className="text-sm text-gray-400">No route information</span>;
    }
    
    const isExpanded = expandedRows[invoice.id];
    const hasMultipleRoutes = invoice.departure.length > 1;
    
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
            {invoice.departure.slice(1).map((dep, idx) => {
              const arrIdx = idx + 1;
              return (
                <div key={idx} className="text-sm text-gray-700 py-1">
                  {dep || 'N/A'} → {invoice.arrival[arrIdx] || 'N/A'}
                </div>
              );
            })}
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
      return (
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-900">
            {Array.isArray(invoice.co2) && invoice.co2[0] 
              ? invoice.co2[0].toLocaleString() 
              : '0'} kg CO₂
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
                    {renderCarbonFootprint(invoice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isFuelInvoice(invoice) ? renderFuelDetails(invoice) : 
                     isTravelInvoice(invoice) ? renderRoutes(invoice) : null}
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