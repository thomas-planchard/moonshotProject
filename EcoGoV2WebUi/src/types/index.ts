export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalCarbonFootprint: number;
  invoices: InvoiceType[];
  createdAt: string;
  ownerId: string;
  contributors: Contributor[];
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
}

// User types and roles
export type Department = 'Finance' | 'Industry' | 'Tech' | 'Marketing' | 'Operations';
export type UserRole = 'employee' | 'manager';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobPosition: string;
  department: Department;
  role: UserRole;
  totalCarbon: number;
  }

export interface InvoiceBase {
  id: string;
  type: 'fuel' | 'plane' | 'train';
  fileName: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

export interface InvoiceTravel extends InvoiceBase {
  type: 'plane' | 'train';
  co2: number[];
  arrival: string[];
  departure: string[];
  transport_type: string[];
  distance?: number[]; // Optional array of distances in km
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