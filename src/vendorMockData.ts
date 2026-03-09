import { Package, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface VendorOrder {
  id: string;
  poNumber: string;
  productName: string;
  quantity: number;
  status: 'Pre-press' | 'Production' | 'QC' | 'Shipped' | 'Delivered' | 'Late';
  deadline: string;
  startDate: string;
  lastUpdate: string;
  specs: {
    material: string;
    ink: string;
    finish: string;
    dimensions: string;
  };
}

export const VENDOR_ORDERS: VendorOrder[] = [
  {
    id: '1',
    poNumber: 'PO-98231',
    productName: 'Custom Dental Appointment Cards',
    quantity: 5000,
    status: 'Production',
    deadline: '2026-03-15',
    startDate: '2026-03-01',
    lastUpdate: '2026-03-08 10:30 AM',
    specs: {
      material: '14pt Gloss Cover',
      ink: '4/4 Full Color',
      finish: 'UV Coating',
      dimensions: '3.5" x 2"'
    }
  },
  {
    id: '2',
    poNumber: 'PO-98245',
    productName: 'Safco Branded Patient Bags',
    quantity: 10000,
    status: 'Pre-press',
    deadline: '2026-03-20',
    startDate: '2026-03-05',
    lastUpdate: '2026-03-09 09:15 AM',
    specs: {
      material: 'Recycled Paper',
      ink: '2-Color PMS',
      finish: 'Matte',
      dimensions: '12" x 15"'
    }
  },
  {
    id: '3',
    poNumber: 'PO-98112',
    productName: 'Sterilization Pouch Labels',
    quantity: 25000,
    status: 'Late',
    deadline: '2026-03-07',
    startDate: '2026-02-20',
    lastUpdate: '2026-03-06 04:45 PM',
    specs: {
      material: 'Adhesive Vinyl',
      ink: '1-Color Black',
      finish: 'Thermal Transfer',
      dimensions: '4" x 6"'
    }
  },
  {
    id: '4',
    poNumber: 'PO-98301',
    productName: 'Dental Hygiene Instruction Pads',
    quantity: 2000,
    status: 'Shipped',
    deadline: '2026-03-10',
    startDate: '2026-03-02',
    lastUpdate: '2026-03-09 02:00 PM',
    specs: {
      material: '50lb Offset',
      ink: '1-Color Blue',
      finish: 'Padded (50 sheets)',
      dimensions: '5.5" x 8.5"'
    }
  }
];

export const VENDOR_METRICS = [
  { label: 'Active Orders', value: '12', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Proofs', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Late Orders', value: '1', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Completed (MTD)', value: '45', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];
