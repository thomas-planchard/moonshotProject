import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApi } from '../../hooks/useApi';
import { Upload, X, FilePlus, AlertCircle, CheckCircle2, Loader2, Eye, ThumbsUp, ThumbsDown, Save } from 'lucide-react';
import { InvoiceFile, InvoiceType, InvoiceFuel, InvoiceTravel } from '../../types';

interface InvoiceDropZoneProps {
  tripId: string;
  onUploadSuccess: () => void;
}

interface FileWithStatus extends InvoiceFile {
  status: 'idle' | 'uploading' | 'processing' | 'calculating' | 'analyzed' | 'success' | 'error';
  progress: number;
  result?: InvoiceType;
  error?: string;
  accepted?: boolean;
}

const InvoiceDropZone: React.FC<InvoiceDropZoneProps> = ({ tripId, onUploadSuccess }) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedResults, setUploadedResults] = useState<InvoiceType[]>([]);
  const [selectedResult, setSelectedResult] = useState<InvoiceType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  const { analyzeInvoiceFile, saveInvoiceToDatabase, loading } = useApi();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithStatus[] = acceptedFiles.map(file => {
      const isImageFile = file.type.startsWith('image/');

      return {
        file,
        type: isImageFile ? 'fuel' : 'plane' as 'fuel' | 'plane' | 'train',
        preview: URL.createObjectURL(file),
        status: 'idle',
        progress: 0
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    setUploadStatus('idle');
    setErrorMessage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5242880,
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview as string);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileStatus = (index: number, status: FileWithStatus['status'], progress = 0, result?: InvoiceType, error?: string, accepted?: boolean) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { 
        ...newFiles[index], 
        status, 
        progress,
        ...(result && { result }),
        ...(error && { error }),
        ...(typeof accepted !== 'undefined' && { accepted })
      };
      return newFiles;
    });
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    setErrorMessage(null);
    setUploadedResults([]);
    
    try {
      await Promise.all(files.map(async (fileInfo, index) => {
        try {
          updateFileStatus(index, 'uploading', 10);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          updateFileStatus(index, 'processing', 30);
          await new Promise(resolve => setTimeout(resolve, 800));
          
          updateFileStatus(index, 'calculating', 50);
          
          for (let progress = 50; progress <= 90; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            updateFileStatus(index, 'calculating', progress);
          }
          
          const result = await analyzeInvoiceFile(fileInfo.file, fileInfo.type);
          if (!result) throw new Error('Failed to analyze invoice');
          
          updateFileStatus(index, 'analyzed', 100, result);
          
          setUploadedResults(prev => [...prev, result]);
        } catch (error) {
          updateFileStatus(index, 'error', 0, undefined, 'Failed to analyze invoice');
        }
      }));
      
      setUploadStatus('success');
      setIsDetailsOpen(true);
      setActiveTab(0);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to analyze one or more invoices. Please try again.');
    }
  };

  const acceptInvoice = (index: number) => {
    updateFileStatus(index, 'analyzed', 100, files[index].result, undefined, true);
  };

  const rejectInvoice = (index: number) => {
    updateFileStatus(index, 'analyzed', 100, files[index].result, undefined, false);
  };

  const handleSaveInvoices = async () => {
    const acceptedFiles = files.filter(f => f.accepted === true && f.result);
    
    if (acceptedFiles.length === 0) {
      setErrorMessage('No accepted invoices to save');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage(null);

    try {
      console.log(`Saving ${acceptedFiles.length} invoice(s) to database`);
      
      const results: any[] = [];
      for (const fileInfo of acceptedFiles) {
        if (!fileInfo.result) continue;
        const success = await saveInvoiceToDatabase(tripId, fileInfo.result);
        results.push(success);
      }

      const successCount = results.filter(Boolean).length;
      console.log(`Successfully saved ${successCount} of ${acceptedFiles.length} invoice(s)`);
      
      if (successCount > 0) {
        acceptedFiles.forEach((fileInfo, index) => {
          if (results[index]) {
            updateFileStatus(
              files.findIndex(f => f.file === fileInfo.file), 
              'success', 
              100
            );
          }
        });
        
        onUploadSuccess();
        
        setTimeout(() => {
          setFiles(prev => prev.filter(f => f.status !== 'success'));
        }, 2000);
      } else {
        setUploadStatus('error');
        setErrorMessage('Failed to save invoices to database');
      }
    } catch (error) {
      console.error('Error saving invoices:', error);
      setUploadStatus('error');
      setErrorMessage('Error saving invoices: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleCancel = () => {
    files.forEach(fileInfo => {
      if (fileInfo.preview) {
        URL.revokeObjectURL(fileInfo.preview as string);
      }
    });
    
    setFiles([]);
    setUploadStatus('idle');
    setErrorMessage(null);
    setUploadedResults([]);
  };
  
  const calculateTotalCO2 = (invoice: InvoiceType): number => {
    if (invoice.type === 'fuel') {
      return Math.round(invoice.co2);
    } else if (invoice.type === 'plane' || invoice.type === 'train') {
      return Array.isArray(invoice.co2) 
        ? Math.round(invoice.co2.reduce((sum, val) => sum + (val || 0), 0))
        : 0;
    }
    return 0;
  };

  const hasAnalyzedFiles = files.some(file => file.status === 'analyzed');
  const acceptedFilesCount = files.filter(file => file.accepted === true).length;

  return (
    <div className="space-y-6">
      {isDetailsOpen && files.filter(f => f.status === 'analyzed' || f.status === 'success').length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
              <button 
                onClick={() => { setIsDetailsOpen(false); setSelectedResult(null); }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {files.filter(f => f.status === 'analyzed' || f.status === 'success').map((fileInfo, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === idx ? 'border-b-2 border-primary-500 text-primary-700' : 'text-gray-600 hover:text-primary-700'}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {fileInfo.file.name}
                </button>
              ))}
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {(() => {
                const analyzedFiles = files.filter(f => f.status === 'analyzed' || f.status === 'success');
                if (analyzedFiles.length === 0) return null;
                const fileInfo = analyzedFiles[activeTab] || analyzedFiles[0];
                const result = fileInfo.result;
                if (!result) return null;
                return (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">File</p>
                      <p className="text-base text-gray-900">{result.fileName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Carbon Footprint</p>
                      <p className="text-base text-gray-900 font-medium">
                        {calculateTotalCO2(result).toLocaleString()} kg CO₂
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Calculation Method</p>
                      <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded border border-gray-200 mt-1">
                        {result.type === 'fuel' ? (
                          <>
                            <p className="font-medium mb-1">Fuel CO₂ calculation:</p>
                            <p>CO₂ = Fuel Volume × Emission Factor</p>
                            <p className="mt-1">Where emission factor depends on fuel type:</p>
                            <ul className="list-disc pl-4 mt-1">
                              <li>Diesel: 2.69 kg CO₂/liter</li>
                              <li>Petrol/Gasoline: 2.24 kg CO₂/liter</li>
                            </ul>
                          </>
                        ) : (
                          <>
                            <p className="font-medium mb-1">Travel CO₂ calculation:</p>
                            <p>CO₂ = Distance × Emission Factor</p>
                            <p className="mt-1">Where emission factor depends on transport type:</p>
                            <ul className="list-disc pl-4 mt-1">
                              <li>flight: 0.13 kg CO₂/km</li>
                              <li>Train: 0.035 kg CO₂/km</li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                    {result.type === 'fuel' && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fuel Type</p>
                          <p className="text-base text-gray-900">{result.typeOfFuel || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Volume</p>
                          <p className="text-base text-gray-900">{result.volume || 0} L</p>
                        </div>
                      </>
                    )}
                    {result.type === 'plane' || result.type === 'train' ? (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Routes</p>
                        <div className="mt-1 space-y-2">
                          {result.departure?.map((dep, idx) => {
                            const arr = result.arrival?.[idx] || 'Unknown';
                            const co2 = Array.isArray(result.co2) && result.co2[idx] 
                              ? result.co2[idx] 
                              : 0;
                            return (
                              <div key={idx} className="p-2 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-800">
                                  {dep || 'Unknown'} → {arr}
                                </p>
                                <p className="text-xs text-gray-600">
                                  CO₂: {Math.round(co2).toLocaleString()} kg
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={() => acceptInvoice(files.findIndex(f => f.file === fileInfo.file))}
                        className={`flex items-center px-3 py-1 rounded-md ${fileInfo.accepted === true ? 'bg-success-500 text-white' : 'bg-gray-100 text-success-700 hover:bg-success-100'}`}
                        disabled={fileInfo.accepted === true}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => rejectInvoice(files.findIndex(f => f.file === fileInfo.file))}
                        className={`flex items-center px-3 py-1 rounded-md ${fileInfo.accepted === false ? 'bg-error-500 text-white' : 'bg-gray-100 text-error-700 hover:bg-error-100'}`}
                        disabled={fileInfo.accepted === false}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                      {fileInfo.accepted === true && (
                        <span className="text-xs text-success-600">Accepted</span>
                      )}
                      {fileInfo.accepted === false && (
                        <span className="text-xs text-error-600">Rejected</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => { setIsDetailsOpen(false); setSelectedResult(null); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors text-center cursor-pointer ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className={`h-10 w-10 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} />
          <p className="text-sm font-medium text-gray-700">
            {isDragActive
              ? 'Drop your invoices here...'
              : 'Drag & drop your invoice files here, or click to select files'
            }
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, JPG, PNG (max. 5MB)
          </p>
        </div>
      </div>

      {uploadStatus === 'success' && hasAnalyzedFiles && (
        <div className="flex items-center justify-between p-4 bg-success-50 text-success-800 rounded-md">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-success-500" />
            <span>{uploadedResults.length} {uploadedResults.length === 1 ? 'invoice' : 'invoices'} analyzed successfully!</span>
            <span className="ml-2 text-sm text-gray-600">Please review and accept/reject each invoice.</span>
          </div>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="flex items-center p-4 bg-error-50 text-error-800 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2 text-error-500" />
          {errorMessage || 'Something went wrong. Please try again.'}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Selected Invoices</h3>

          <div className="space-y-3">
            {files.map((fileInfo, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center min-w-0 max-w-[60%]">
                  <FilePlus className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-800 truncate">
                    {fileInfo.file.name}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 w-full sm:w-auto">
                  <div className="mt-2 sm:mt-0 w-full sm:w-auto">
                    {(() => {
                      switch (fileInfo.status) {
                        case 'idle':
                          return null;
                        case 'uploading':
                          return <div className="flex items-center">
                            <Loader2 className="h-4 w-4 text-primary-500 animate-spin mr-2" />
                            <span className="text-xs text-gray-600">Uploading...</span>
                          </div>;
                        case 'processing':
                          return <div className="flex items-center">
                            <Loader2 className="h-4 w-4 text-primary-500 animate-spin mr-2" />
                            <span className="text-xs text-gray-600">Processing...</span>
                          </div>;
                        case 'calculating':
                          return <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 text-primary-500 animate-spin mr-2" />
                              <span className="text-xs text-gray-600">Calculating CO₂...</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${fileInfo.progress}%` }}
                              ></div>
                            </div>
                          </div>;
                        case 'analyzed':
                          return <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-warning-500" />
                            <span className="text-xs text-warning-600">Analyzed</span>
                          </div>;
                        case 'success':
                          return <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-success-500 mr-2" />
                            <span className="text-xs text-success-600">Saved</span>
                          </div>;
                        case 'error':
                          return <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-error-500 mr-2" />
                            <span className="text-xs text-error-600">{fileInfo.error || 'Error'}</span>
                          </div>;
                        default:
                          return null;
                      }
                    })()}
                  </div>

                  {fileInfo.status !== 'uploading' && fileInfo.status !== 'processing' && fileInfo.status !== 'calculating' && fileInfo.status !== 'success' && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="mt-2 sm:mt-0 p-1 text-gray-500 hover:text-error-500 focus:outline-none"
                      aria-label="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            {files.some(f => f.status === 'idle') && (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || files.length === 0 || files.some(f => ['uploading', 'processing', 'calculating'].includes(f.status))}
                className="px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {files.some(f => ['uploading', 'processing', 'calculating'].includes(f.status))
                  ? 'Processing...'
                  : 'Analyze Invoices'}
              </button>
            )}
          </div>

          {acceptedFilesCount > 0 && (
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSaveInvoices}
                disabled={loading}
                className="px-4 py-2 bg-success-500 text-white rounded-md shadow-sm hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save {acceptedFilesCount}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceDropZone;