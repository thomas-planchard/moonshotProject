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
                ) : null}
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
                          {invoice.uploadedBy && (
                            <div className="bg-primary-100 text-primary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2">
                              {getUserInitials(invoice.uploadedBy.name)}
                            </div>
                          )}
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
                            <span>Total Trips: <b>{invoice.departure?.length || 0}</b></span>
                            <span>Total CO₂: <b>{Array.isArray(invoice.co2) ? invoice.co2.reduce((sum, val) => sum + (val || 0), 0).toLocaleString() : '0'} kg</b></span>
                            <ul className="mt-1 ml-2 list-disc">
                              {invoice.departure?.map((dep, i) => (
                                <li key={i}>
                                  Trip {i + 1}: {dep || 'Unknown'} → {invoice.arrival?.[i] || 'Unknown'} | Distance: <b>{invoice.distance?.[i] ?? (invoice.type === 'plane' ? 1000 : 500)}</b> km | CO₂: <b>{invoice.co2?.[i]?.toLocaleString() || '0'} kg</b>
                                </li>
                              ))}
                            </ul>
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
                {/* Explanation Section */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">How was this calculated?</h5>
                  <ul className="space-y-4 text-xs text-gray-700">
                    {uploadResults.map((invoice, idx) => {
                      if (isFuelInvoice(invoice)) {
                        const ef = invoice.typeOfFuel === 'diesel' ? 2.69 : 2.24;
                        return (
                          <li key={idx}>
                            <b>Fuel Invoice:</b> {invoice.fileName} <br />
                            Formula: <span className="font-mono">Emissions = Volume (L) × EF (kg CO₂/L)</span><br />
                            Volume: <b>{invoice.volume?.toLocaleString() || 0} L</b>, EF: <b>{ef} kg CO₂/L</b><br />
                            <span>CO₂ = {invoice.volume?.toLocaleString() || 0} × {ef} = <b>{invoice.co2?.toLocaleString()} kg CO₂</b></span><br />
                            <span className="italic">EPA: 2.24 kg/L for gasoline, 2.69 kg/L for diesel</span>
                          </li>
                        );
                      } else if (invoice.type === 'plane' || invoice.type === 'train') {
                        const ef = invoice.type === 'plane'
                          ? (invoice.transport_type && invoice.transport_type[0] === 'long-haul' ? 0.11 : 0.15)
                          : undefined;
                        const isPlane = invoice.type === 'plane';
                        const segments = invoice.departure?.length || 0;
                        return (
                          <li key={idx}>
                            <b>{isPlane ? 'Flight' : 'Train'} Invoice:</b> {invoice.fileName} <br />
                            <span className="font-mono">Emissions = Distance (km) × EF (kg CO₂/p-km)</span>
                            <ul className="mt-2 ml-4 space-y-1">
                              {Array.from({ length: segments }).map((_, i) => {
                                const dep = invoice.departure?.[i] || 'Unknown';
                                const arr = invoice.arrival?.[i] || 'Unknown';
                                const dist = invoice.distance?.[i] ?? (isPlane ? 1000 : 500);
                                const co2 = invoice.co2?.[i] ?? 0;
                                const efVal = isPlane
                                  ? (invoice.transport_type && invoice.transport_type[i] === 'long-haul' ? 0.11 : 0.15)
                                  : 'EF';
                                return (
                                  <li key={i} className="mb-1">
                                    <b>Segment {i + 1}:</b> {dep} → {arr} | Distance: <b>{dist}</b> km | EF: <b>{efVal}</b> | CO₂: <b>{co2.toLocaleString()} kg</b><br />
                                    <span className="font-mono text-xs">CO₂ = {dist} × {efVal} = {(isPlane && typeof efVal === 'number') ? (dist * efVal).toLocaleString() : '...'}</span>
                                  </li>
                                );
                              })}
                            </ul>
                            <span className="italic">{isPlane ? 'ICAO: 0.15 kg/p-km (short-haul), 0.11 kg/p-km (long-haul)' : 'EF depends on train type (see documentation)'}</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
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
