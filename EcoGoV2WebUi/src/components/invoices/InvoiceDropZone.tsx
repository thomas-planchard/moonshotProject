import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApi } from '../../hooks/useApi';
import { Upload, X, FilePlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InvoiceFile } from '../../types';

interface InvoiceDropZoneProps {
  tripId: string;
  onUploadSuccess: () => void;
}

const InvoiceDropZone: React.FC<InvoiceDropZoneProps> = ({ tripId, onUploadSuccess }) => {
  const [files, setFiles] = useState<InvoiceFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { uploadInvoice, loading } = useApi();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      type: 'fuel' as 'fuel' | 'plane' | 'train', // Default type
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

  const updateFileType = (index: number, type: 'fuel' | 'plane' | 'train') => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], type };
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    setErrorMessage(null);
    
    try {
      for (const fileInfo of files) {
        const result = await uploadInvoice(tripId, fileInfo.file, fileInfo.type);
        if (!result) throw new Error('Failed to upload invoice');
      }
      
      // Clear files after successful upload
      setFiles([]);
      setUploadStatus('success');
      onUploadSuccess();
      
      // Reset success message after a delay
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to upload one or more invoices. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Status messages */}
      {uploadStatus === 'success' && (
        <div className="flex items-center p-4 bg-success-50 text-success-800 rounded-md">
          <CheckCircle2 className="h-5 w-5 mr-2 text-success-500" />
          Invoices uploaded successfully!
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
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-gray-50 rounded-md">
                <div className="flex-grow flex items-center min-w-0">
                  <FilePlus className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-800 truncate">
                    {fileInfo.file.name}
                  </span>
                </div>
                
                <div className="flex items-center mt-2 sm:mt-0">
                  <select
                    value={fileInfo.type}
                    onChange={(e) => updateFileType(index, e.target.value as 'fuel' | 'plane' | 'train')}
                    className="mr-2 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="fuel">Fuel</option>
                    <option value="plane">Plane</option>
                    <option value="train">Train</option>
                  </select>
                  
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