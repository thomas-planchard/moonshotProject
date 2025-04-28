import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApi } from '../../hooks/useApi';
import { Upload, X, FilePlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InvoiceFile, InvoiceType } from '../../types';
import UploadProgressModal, { UploadStep } from '../modal/UploadProgressModal';

interface InvoiceDropZoneProps {
  tripId: string;
  onUploadSuccess: () => void;
}

const InvoiceDropZone: React.FC<InvoiceDropZoneProps> = ({ tripId, onUploadSuccess }) => {
  const [files, setFiles] = useState<InvoiceFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<UploadStep>('uploading');
  const [uploadResults, setUploadResults] = useState<InvoiceType[]>([]);
  const [calculationProgress, setCalculationProgress] = useState(0);
  
  const { uploadInvoice, loading } = useApi();

  // Simulate calculation progress
  useEffect(() => {
    if (currentStep === 'calculating') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setCalculationProgress(progress);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      type: 'plane' as 'fuel' | 'plane' | 'train', // Default to non-fuel type
      preview: URL.createObjectURL(file)
    }));
    
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
    maxSize: 5242880, // 5MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Release the object URL to prevent memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview as string);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const toggleFuelType = (index: number, isFuel: boolean) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { 
        ...newFiles[index], 
        type: isFuel ? 'fuel' : 'plane'
      };
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    // Reset states
    setUploadStatus('uploading');
    setErrorMessage(null);
    setUploadResults([]);
    setCurrentStep('uploading');
    setIsModalOpen(true);
    setCalculationProgress(0);
    
    try {
      const results: InvoiceType[] = [];
      
      // Upload each file with realistic progress updates
      for (const fileInfo of files) {
        // Step 1: Uploading - Quick
        setCurrentStep('uploading');
        await new Promise(resolve => setTimeout(resolve, 500)); // Quick upload
        
        // Step 2: Processing - Quick
        setCurrentStep('processing');
        await new Promise(resolve => setTimeout(resolve, 800)); // Quick processing
        
        // Step 3: Calculating Carbon Footprint - Slow (handled by the useEffect)
        setCurrentStep('calculating');
        setCalculationProgress(0);
        
        // Wait longer for calculation - simulated through the progress bar
        const calcTime = 4000 + Math.random() * 2000; // 4-6 seconds of calculation
        await new Promise(resolve => setTimeout(resolve, calcTime));
        
        // Actual upload
        const result = await uploadInvoice(tripId, fileInfo.file, fileInfo.type);
        if (!result) throw new Error('Failed to upload invoice');
        
        results.push(result);
      }
      
      // All uploads complete
      setUploadResults(results);
      setCurrentStep('complete');
      setUploadStatus('success');
      
      // Clear files but keep modal open to show results
      setFiles([]);
      
      // Notify parent component of success
      onUploadSuccess();
    } catch (error) {
      setUploadStatus('error');
      setCurrentStep('error');
      setErrorMessage('Failed to upload one or more invoices. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <UploadProgressModal
        isOpen={isModalOpen}
        currentStep={currentStep}
        uploadResults={uploadResults}
        errorMessage={errorMessage || undefined}
        onClose={closeModal}
        progress={calculationProgress}
      />
      
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

      {/* Status messages - Only show when modal is not open */}
      {!isModalOpen && uploadStatus === 'success' && (
        <div className="flex items-center p-4 bg-success-50 text-success-800 rounded-md">
          <CheckCircle2 className="h-5 w-5 mr-2 text-success-500" />
          Invoices uploaded successfully!
        </div>
      )}
      
      {!isModalOpen && uploadStatus === 'error' && (
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
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-gray-50 rounded-md">
                <div className="flex-grow flex items-center min-w-0">
                  <FilePlus className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-800 truncate">
                    {fileInfo.file.name}
                  </span>
                </div>
                
                <div className="flex items-center mt-2 sm:mt-0">
                  <label className="inline-flex items-center mr-4 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-600"
                      checked={fileInfo.type === 'fuel'}
                      onChange={(e) => toggleFuelType(index, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Fuel invoice</span>
                  </label>
                  
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-500 hover:text-error-500 focus:outline-none"
                    aria-label="Remove file"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading || uploadStatus === 'uploading'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Invoices'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDropZone;