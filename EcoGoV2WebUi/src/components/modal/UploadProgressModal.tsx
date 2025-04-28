import React from 'react';
import { CheckCircle, Loader2, Upload, LineChart, AlertCircle, Fuel, Plane, Train } from 'lucide-react';
import { InvoiceType, InvoiceFuel, InvoiceTravel } from '../../types';

export type UploadStep = 'uploading' | 'processing' | 'calculating' | 'complete' | 'error';

interface UploadProgressModalProps {
  isOpen: boolean;
  currentStep: UploadStep;
  uploadResults: InvoiceType[];
  errorMessage?: string;
  onClose: () => void;
  progress?: number;
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  currentStep,
  uploadResults,
  errorMessage,
  onClose,
  progress = 0
}) => {
  if (!isOpen) return null;

  // Define steps for the roadmap
  const steps = [
    { id: 'uploading', title: 'Upload', icon: Upload },
    { id: 'processing', title: 'Extract Info', icon: Loader2 },
    { id: 'calculating', title: 'Calculate CO₂', icon: LineChart },
    { id: 'complete', title: 'Done', icon: CheckCircle }
  ];

  // Helper to get step index
  const getStepIndex = (stepId: string) => steps.findIndex(s => s.id === stepId);

  // Calculate total CO2 from all uploaded invoices
  const calculateTotalCO2 = () =>
    uploadResults.reduce((total, invoice) => {
      if ('co2' in invoice) {
        if (Array.isArray(invoice.co2)) {
          return total + invoice.co2.reduce((sum, val) => sum + (val || 0), 0);
        }
        return total + invoice.co2;
      }
      return total;
    }, 0);

  // Helper functions for invoice icons
  const isFuelInvoice = (invoice: InvoiceType): invoice is InvoiceFuel => invoice.type === 'fuel';
  const isTravelInvoice = (invoice: InvoiceType): invoice is InvoiceTravel =>
    invoice.type === 'plane' || invoice.type === 'train';
  const getInvoiceTypeIcon = (invoice: InvoiceType) => {
    if (invoice.type === 'fuel') return <Fuel className="h-4 w-4 text-amber-500" />;
    if (invoice.type === 'plane') return <Plane className="h-4 w-4 text-blue-500" />;
    return <Train className="h-4 w-4 text-green-500" />;
  };

  // Current step index
  const currentStepIndex = currentStep === 'error' ? -1 : getStepIndex(currentStep);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
        {currentStep === 'error' ? (
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Upload Failed</h3>
            <p className="text-gray-600 mb-6">{errorMessage || 'Something went wrong. Please try again.'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Roadmap Stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {steps.map((step, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isCompleted = idx < currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center flex-1 min-w-0">
                        <div
                          className={[
                            "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                            isCompleted
                              ? "bg-primary-500 border-primary-500 text-white"
                              : isActive
                                ? "bg-white border-primary-500 text-primary-500 animate-pulse"
                                : "bg-gray-100 border-gray-300 text-gray-400"
                          ].join(' ')}
                        >
                          {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                        </div>
                        <span
                          className={[
                            "mt-2 text-xs font-medium text-center",
                            isCompleted
                              ? "text-primary-700"
                              : isActive
                                ? "text-primary-600"
                                : "text-gray-400"
                          ].join(' ')}
                        >
                          {step.title}
                        </span>
                      </div>
                      {/* Connecting line */}
                      {idx < steps.length - 1 && (
                        <div className="flex-1 h-1 relative">
                          <div
                            className={[
                              "absolute top-1/2 left-0 right-0 h-1 rounded",
                              idx < currentStepIndex
                                ? "bg-primary-500"
                                : idx === currentStepIndex && currentStep === 'calculating'
                                  ? "bg-gradient-to-r from-primary-500 to-gray-200"
                                  : "bg-gray-200"
                            ].join(' ')}
                          >
                            {/* Progress bar for calculating step */}
                            {idx === currentStepIndex && currentStep === 'calculating' && (
                              <div
                                className="absolute top-0 left-0 h-1 bg-primary-500 rounded transition-all"
                                style={{ width: `${progress}%`, minWidth: '8px' }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Step content */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4 text-center">
                {steps[currentStepIndex]?.title}
              </h3>
              <div className="flex items-center justify-center mb-4">
                {currentStep !== 'complete' ? (
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
                    {currentStep === 'calculating' && (
                      <div className="absolute -bottom-6 w-full text-center text-sm text-primary-600">
                        {Math.round(progress)}%
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Results when complete */}
            {currentStep === 'complete' && uploadResults.length > 0 && (
              <div className="mb-6 border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-gray-800 mb-2">Upload Summary</h4>
                <p className="text-gray-600 mb-4">
                  {uploadResults.length} {uploadResults.length === 1 ? 'invoice' : 'invoices'} successfully processed
                </p>
                <div className="space-y-4">
                  {uploadResults.map((invoice, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {getInvoiceTypeIcon(invoice)}
                          <span className="text-sm font-medium ml-2">{invoice.fileName}</span>
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          {invoice.type === 'fuel'
                            ? `${invoice.co2.toLocaleString()} kg CO₂`
                            : `${Array.isArray(invoice.co2)
                              ? invoice.co2.reduce((sum, val) => sum + (val || 0), 0).toLocaleString()
                              : '0'} kg CO₂`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 pl-6">
                        {isFuelInvoice(invoice) && (
                          <div className="flex flex-col">
                            <span>Fuel Type: {invoice.typeOfFuel || 'Not specified'}</span>
                            <span>Volume: {invoice.volume?.toLocaleString() || 0} L</span>
                          </div>
                        )}
                        {isTravelInvoice(invoice) && (
                          <div className="flex flex-col">
                            {invoice.departure && invoice.arrival && (
                              <span>Route: {invoice.departure[0] || 'Unknown'} → {invoice.arrival[0] || 'Unknown'}</span>
                            )}
                            <span>Transport: {invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)}</span>
                            {invoice.transport_type && invoice.transport_type[0] && (
                              <span>Type: {invoice.transport_type[0]}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-medium border-t border-gray-200">
                    <span>Total Carbon Footprint</span>
                    <span className="text-primary-700">{calculateTotalCO2().toLocaleString()} kg CO₂</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              {currentStep === 'complete' && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600"
                >
                  Done
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadProgressModal;
