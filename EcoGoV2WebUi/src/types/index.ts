export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalCarbonFootprint: number;
  invoices: Invoice[];
  createdAt: string;
}

export interface Invoice {
  id: string;
  tripId: string;
  type: 'fuel' | 'plane' | 'train';
  date: string;
  amount: number;
  carbonFootprint: number;
  fileName: string;
  status: 'processing' | 'processed' | 'error';
  metadata?: Record<string, any>;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface InvoiceFile {
  file: File;
  type: 'fuel' | 'plane' | 'train';
  preview?: string;
}