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
  type: 'fuel' | 'plane' | 'train';
  co2: number[];
  arrival: string[];
  departure: string[];
  transport_type: string[];
  fileName: string;
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