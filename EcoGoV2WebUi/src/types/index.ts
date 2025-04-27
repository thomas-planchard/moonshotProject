export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalCarbonFootprint: number;
  invoices: InvoiceType[];
  createdAt: string;
}

export interface InvoiceBase {
  id: string;
  type: 'fuel' | 'plane' | 'train';
  fileName: string;
}

export interface InvoiceTravel extends InvoiceBase {
  type: 'plane' | 'train';
  co2: number[];
  arrival: string[];
  departure: string[];
  transport_type: string[];
}

export interface InvoiceFuel extends InvoiceBase {
  type: 'fuel';
  co2: number;
  volume: number;
  typeOfFuel: string;
}

// Union type for all invoice types
export type InvoiceType = InvoiceTravel | InvoiceFuel;

// For backwards compatibility
export type Invoice = InvoiceTravel;

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