export type RiskLevel = 'low' | 'medium' | 'high';

export interface SKU {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  leadTime: number; // days
  unitPrice: number;
  riskLevel: RiskLevel;
  riskType: 'stockout' | 'overstock' | 'none';
  accuracy: number; // percentage
}

export interface ForecastDataPoint {
  date: string;
  actual?: number;
  forecast: number;
  adjusted?: number;
  inventory?: number;
}

export interface Alert {
  id: string;
  skuId: string;
  skuName: string;
  type: 'stockout' | 'overstock';
  severity: RiskLevel;
  impactValue: number;
  description: string;
  timestamp: string;
}

export interface ForecastVersion {
  id: string;
  skuId: string;
  version: number;
  date: string;
  author: string;
  reason: string;
  data: ForecastDataPoint[];
}
