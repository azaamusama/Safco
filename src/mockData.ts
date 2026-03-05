import { SKU, Alert, ForecastDataPoint } from './types';

export const MOCK_SKUS: SKU[] = [
  {
    id: 'DS-101',
    name: 'Premium Dental Composite A2',
    category: 'Restorative',
    currentStock: 450,
    safetyStock: 300,
    reorderPoint: 400,
    leadTime: 14,
    unitPrice: 85,
    riskLevel: 'low',
    riskType: 'none',
    accuracy: 94,
  },
  {
    id: 'DS-205',
    name: 'Sterilization Pouches 3.5x9',
    category: 'Infection Control',
    currentStock: 120,
    safetyStock: 500,
    reorderPoint: 600,
    leadTime: 7,
    unitPrice: 12,
    riskLevel: 'high',
    riskType: 'stockout',
    accuracy: 88,
  },
  {
    id: 'DS-312',
    name: 'Disposable Prophy Angles',
    category: 'Hygiene',
    currentStock: 2500,
    safetyStock: 800,
    reorderPoint: 1000,
    leadTime: 21,
    unitPrice: 0.45,
    riskLevel: 'medium',
    riskType: 'overstock',
    accuracy: 91,
  },
  {
    id: 'DS-404',
    name: 'Nitrile Gloves - Medium',
    category: 'PPE',
    currentStock: 800,
    safetyStock: 1200,
    reorderPoint: 1500,
    leadTime: 30,
    unitPrice: 15,
    riskLevel: 'high',
    riskType: 'stockout',
    accuracy: 82,
  },
  {
    id: 'DS-550',
    name: 'Alginate Impression Material',
    category: 'Impression',
    currentStock: 300,
    safetyStock: 250,
    reorderPoint: 350,
    leadTime: 10,
    unitPrice: 22,
    riskLevel: 'low',
    riskType: 'none',
    accuracy: 96,
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'AL-001',
    skuId: 'DS-205',
    skuName: 'Sterilization Pouches 3.5x9',
    type: 'stockout',
    severity: 'high',
    impactValue: 4500,
    description: 'Projected stockout in 4 days. Lead time is 7 days.',
    timestamp: '2024-03-05T08:30:00Z',
  },
  {
    id: 'AL-002',
    skuId: 'DS-404',
    skuName: 'Nitrile Gloves - Medium',
    type: 'stockout',
    severity: 'high',
    impactValue: 12000,
    description: 'Current stock below safety levels. High demand volatility detected.',
    timestamp: '2024-03-05T09:15:00Z',
  },
  {
    id: 'AL-003',
    skuId: 'DS-312',
    skuName: 'Disposable Prophy Angles',
    type: 'overstock',
    severity: 'medium',
    impactValue: 2100,
    description: 'Inventory exceeds 6 months of forecasted demand.',
    timestamp: '2024-03-04T14:20:00Z',
  },
];

export const generateForecastData = (skuId: string): ForecastDataPoint[] => {
  const data: ForecastDataPoint[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  months.forEach((month, i) => {
    const isPast = i < 3; // Assume Mar is current
    const base = 500 + Math.random() * 200;
    data.push({
      date: month,
      actual: isPast ? base + (Math.random() * 50 - 25) : undefined,
      forecast: base,
      adjusted: !isPast && i === 4 ? base + 150 : undefined,
      inventory: 1000 - (i * 100) + (Math.random() * 50),
    });
  });
  
  return data;
};
