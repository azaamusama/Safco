import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  History, 
  Settings, 
  Search, 
  Bell, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Edit3,
  CheckCircle2,
  Clock,
  User,
  Info,
  Lock,
  LogOut,
  ShieldCheck,
  Grid,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell,
  Legend,
  ComposedChart
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MOCK_SKUS, MOCK_ALERTS, generateForecastData } from './mockData';
import { SKU, Alert, ForecastDataPoint } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group",
      active 
        ? "bg-brand text-white" 
        : "text-zinc-500 hover:text-brand hover:bg-zinc-100"
    )}
  >
    <Icon className={cn("w-5 h-5 mr-3", active ? "text-white" : "text-zinc-400 group-hover:text-brand")} />
    {label}
  </button>
);

const Card = ({ children, className, title, subtitle }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string }) => (
  <div className={cn("bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm", className)}>
    {(title || subtitle) && (
      <div className="px-6 py-4 border-bottom border-zinc-100">
        {title && <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>}
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const StatCard = ({ label, value, trend, trendType }: { label: string, value: string, trend?: string, trendType?: 'up' | 'down' }) => (
  <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
    <div className="flex items-end justify-between mt-2">
      <h4 className="text-2xl font-bold text-zinc-900">{value}</h4>
      {trend && (
        <span className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trendType === 'up' ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
        )}>
          {trendType === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </span>
      )}
    </div>
  </div>
);

// --- SSO & RBAC Components ---

const LoginScreen = ({ onLogin }: { onLogin: (role: string) => void }) => (
  <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand/20">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Safco Internal Portal</h1>
        <p className="text-sm text-zinc-500 mt-2 text-center">Unified access to Safco Dental enterprise modules</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => onLogin('Inventory Planner')}
          className="w-full flex items-center justify-center px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition-all shadow-sm"
        >
          <ShieldCheck className="w-5 h-5 mr-3" />
          Sign in with Safco SSO
        </button>
        
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-400 font-bold">External Partners</span></div>
        </div>

        <button 
          onClick={() => onLogin('Vendor')}
          className="w-full flex items-center justify-center px-6 py-3 bg-white border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all"
        >
          <ExternalLink className="w-5 h-5 mr-3" />
          Vendor Portal Login
        </button>
      </div>

      <p className="mt-8 text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
        Protected by Safco Identity Services
      </p>
    </div>
  </div>
);

const ModuleLauncher = ({ userRole, onLaunch }: { userRole: string, onLaunch: (module: string) => void }) => {
  const modules = [
    { id: 'forecast', name: 'Forecast IQ', desc: 'AI-driven inventory predictions', icon: TrendingUp, allowed: ['Inventory Planner', 'Admin'] },
    { id: 'marketplace', name: 'Marketplace Tools', desc: 'Manage Magento listings', icon: Grid, allowed: ['Merchandising', 'Admin'] },
    { id: 'vendor', name: 'Vendor Portal', desc: 'PO and lead time management', icon: Package, allowed: ['Vendor', 'Admin'] },
    { id: 'finance', name: 'Finance Dashboard', desc: 'AS400 reporting & audits', icon: ShieldCheck, allowed: ['Finance', 'Admin'] },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-zinc-900">Welcome back, Sarah</h2>
        <p className="text-zinc-500 mt-2">Select a module to begin your workday.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(mod => {
          const isAllowed = mod.allowed.includes(userRole);
          return (
            <div 
              key={mod.id}
              onClick={() => isAllowed && onLaunch(mod.id)}
              className={cn(
                "group p-6 bg-white border rounded-2xl shadow-sm transition-all relative overflow-hidden",
                isAllowed ? "cursor-pointer hover:shadow-md hover:border-brand/30" : "opacity-60 grayscale cursor-not-allowed"
              )}
            >
              {!isAllowed && (
                <div className="absolute top-4 right-4 text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                isAllowed ? "bg-zinc-50 group-hover:bg-brand/10 text-zinc-900 group-hover:text-brand" : "bg-zinc-100 text-zinc-400"
              )}>
                <mod.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{mod.name}</h3>
              <p className="text-sm text-zinc-500 mt-1">{mod.desc}</p>
              
              {isAllowed ? (
                <div className="mt-6 flex items-center text-xs font-bold text-brand uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Launch Module <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              ) : (
                <div className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Access Restricted
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AccessDenied = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
      <ShieldAlert className="w-10 h-10 text-rose-600" />
    </div>
    <h2 className="text-2xl font-bold text-zinc-900">Access Denied</h2>
    <p className="text-zinc-500 mt-2 max-w-md">
      Your account does not have the necessary permissions to access this module. 
      Please contact your department administrator to request access.
    </p>
    <div className="mt-8 flex space-x-4">
      <button 
        onClick={onBack}
        className="px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg"
      >
        Back to Launcher
      </button>
      <button className="px-6 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90">
        Request Access
      </button>
    </div>
  </div>
);

// --- Screens ---

const DashboardHome = ({ onSelectSKU }: { onSelectSKU: (sku: SKU) => void }) => {
  const riskData = [
    { name: 'Restorative', risk: 12000, over: 4000 },
    { name: 'Hygiene', risk: 8000, over: 15000 },
    { name: 'PPE', risk: 45000, over: 2000 },
    { name: 'Endo', risk: 5000, over: 8000 },
  ];

  const trendData = [
    { date: 'Oct', actual: 4200, forecast: 4000 },
    { date: 'Nov', actual: 4500, forecast: 4300 },
    { date: 'Dec', actual: 5100, forecast: 4800 },
    { date: 'Jan', actual: 4800, forecast: 4900 },
    { date: 'Feb', actual: 4600, forecast: 4700 },
    { date: 'Mar', forecast: 5200 },
    { date: 'Apr', forecast: 5400 },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Date Range</label>
          <select className="text-sm font-medium bg-transparent border-none p-0 focus:ring-0 cursor-pointer">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Year to Date</option>
          </select>
        </div>
        <div className="h-8 w-px bg-zinc-100 mx-2" />
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
          <select className="text-sm font-medium bg-transparent border-none p-0 focus:ring-0 cursor-pointer">
            <option>All Categories</option>
            <option>Restorative</option>
            <option>Hygiene</option>
            <option>PPE</option>
          </select>
        </div>
        <div className="h-8 w-px bg-zinc-100 mx-2" />
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Warehouse</label>
          <select className="text-sm font-medium bg-transparent border-none p-0 focus:ring-0 cursor-pointer">
            <option>All Locations</option>
            <option>East Coast Hub</option>
            <option>West Coast Hub</option>
            <option>Central Distribution</option>
          </select>
        </div>
        <button className="ml-auto flex items-center px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Value at Risk" value="$62,450" trend="12%" trendType="up" />
        <StatCard label="Avg. Accuracy" value="89.4%" trend="2.1%" trendType="up" />
        <StatCard label="Stockout Alerts" value="14" trend="4" trendType="up" />
        <StatCard label="Overstock Value" value="$28,900" trend="8%" trendType="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Trend Visualization */}
        <Card title="Aggregate Demand Trend" subtitle="Actual vs Forecasted sales across selected filters" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Area type="monotone" dataKey="actual" name="Actual Sales" fill="#e4e4e7" stroke="#a1a1aa" fillOpacity={0.3} />
                <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#18181b" strokeWidth={2} dot={{ r: 4, fill: '#18181b' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Product Risk Alerts */}
        <Card title="Critical Risk Alerts" subtitle="Items requiring immediate review">
          <div className="space-y-4">
            {MOCK_ALERTS.slice(0, 3).map(alert => (
              <div 
                key={alert.id} 
                className="p-3 border border-zinc-100 rounded-lg bg-zinc-50/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    alert.type === 'stockout' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-zinc-400">{new Date(alert.timestamp).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 truncate">{alert.skuName}</h4>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{alert.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">${alert.impactValue.toLocaleString()}</span>
                  <button className="text-xs font-medium text-zinc-900 hover:underline">Review SKU</button>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              View All 14 Alerts
            </button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inventory Risk by Category" subtitle="Financial impact of projected stockouts vs overstock">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f4f4f5' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar dataKey="risk" name="Stockout Risk" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="over" name="Overstock Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top SKUs by Accuracy" subtitle="Most reliable AI forecasts this month">
          <div className="space-y-4">
            {MOCK_SKUS.sort((a, b) => b.accuracy - a.accuracy).slice(0, 5).map(sku => (
              <div 
                key={sku.id} 
                onClick={() => onSelectSKU(sku)}
                className="flex items-center justify-between p-3 border border-zinc-100 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center text-xs font-bold text-zinc-500">
                    {sku.id.split('-')[1]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900">{sku.name}</h4>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{sku.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{sku.accuracy}%</p>
                  <p className="text-[10px] text-zinc-400">Accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const SKUDetail = ({ sku, onAdjust }: { sku: SKU, onAdjust: () => void }) => {
  const forecastData = useMemo(() => generateForecastData(sku.id), [sku.id]);
  
  // Calculate a mock reorder recommendation
  const reorderQty = sku.reorderPoint - sku.currentStock > 0 ? sku.reorderPoint - sku.currentStock + sku.safetyStock : 0;
  const daysToStockout = Math.max(0, Math.floor(sku.currentStock / 15)); // Mock calculation

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-lg font-bold text-zinc-500">
            {sku.id.split('-')[1]}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase rounded tracking-wider">{sku.category}</span>
              <span className="text-zinc-400 text-xs">SKU: {sku.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">{sku.name}</h2>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={onAdjust}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Adjust Forecast
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Product Information Panel (Stats) */}
        <StatCard label="On Hand" value={sku.currentStock.toString()} />
        <StatCard label="Safety Stock" value={sku.safetyStock.toString()} />
        <StatCard label="Forecast Accuracy" value={`${sku.accuracy}%`} trend="1.2%" trendType="up" />
        
        {/* Reorder Recommendation */}
        <div className={cn(
          "p-6 border rounded-xl shadow-sm flex flex-col justify-between",
          sku.riskType === 'stockout' ? "bg-rose-50 border-rose-100" : "bg-white border-zinc-200"
        )}>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Reorder Status</p>
          <div className="mt-2">
            {sku.riskType === 'stockout' ? (
              <>
                <h4 className="text-xl font-bold text-rose-700">Order {reorderQty} Units</h4>
                <p className="text-xs text-rose-600 mt-1">Stockout expected in {daysToStockout} days</p>
              </>
            ) : (
              <>
                <h4 className="text-xl font-bold text-emerald-700">Healthy</h4>
                <p className="text-xs text-emerald-600 mt-1">Next order in ~18 days</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Forecast vs Historical Sales Chart */}
        <Card title="Demand Analysis" subtitle="Actual sales vs AI-generated demand predictions" className="lg:col-span-2">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Area type="monotone" dataKey="actual" name="Historical Sales" fill="#e4e4e7" stroke="#a1a1aa" fillOpacity={0.3} />
                <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#18181b" strokeWidth={2} dot={{ r: 4, fill: '#18181b' }} />
                <Line type="monotone" dataKey="adjusted" name="Adjusted Forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#f59e0b' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Time Visualization */}
        <Card title="Supply Chain Reliability" subtitle="Lead time and fulfillment performance">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Standard Lead Time</span>
                <span className="font-bold text-zinc-900">{sku.leadTime} Days</span>
              </div>
              <div className="relative h-4 bg-zinc-100 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-brand w-2/3" />
                <div className="absolute inset-y-0 left-2/3 bg-amber-400 w-1/6" />
                <div className="absolute inset-y-0 left-[83%] bg-rose-400 w-1/6" />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 uppercase font-bold">
                <span>Optimal</span>
                <span>Delayed</span>
                <span>Critical</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">On-Time Rate</p>
                <p className="text-lg font-bold text-zinc-900">94.2%</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Fill Rate</p>
                <p className="text-lg font-bold text-zinc-900">98.8%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Level Indicators (Projected) */}
      <Card title="Projected Inventory Depletion" subtitle="Estimated stock levels based on current demand forecast">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
              <Tooltip />
              <Area type="stepAfter" dataKey="inventory" name="Projected Stock" fill="#ecfdf5" stroke="#10b981" />
              <Line type="stepAfter" dataKey={() => sku.safetyStock} name="Safety Stock" stroke="#f43f5e" strokeDasharray="3 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

const ForecastAdjustment = ({ sku, onSave, onCancel }: { sku: SKU, onSave: () => void, onCancel: () => void }) => {
  const [adjustments, setAdjustments] = useState<Record<string, number>>({
    'May': 650,
    'Jun': 700,
    'Jul': 680,
    'Aug': 520
  });
  const [reason, setReason] = useState('Promotion');
  const [note, setNote] = useState('');

  const months = ['May', 'Jun', 'Jul', 'Aug'];
  const aiForecasts: Record<string, number> = {
    'May': 524,
    'Jun': 510,
    'Jul': 535,
    'Aug': 505
  };

  const totalAdjustment = Object.keys(adjustments).reduce((acc, month) => {
    return acc + (adjustments[month] - aiForecasts[month]);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Manual Forecast Override</h2>
            <p className="text-xs text-zinc-500">Adjusting predictions for {sku.name}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Discard Changes
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 shadow-sm"
          >
            Commit Version V2.5
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Monthly Adjustments" subtitle="Compare AI baseline with your manual overrides">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase">Month</th>
                    <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase">AI Baseline</th>
                    <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase">Manual Entry</th>
                    <th className="pb-3 text-[10px] font-bold text-zinc-400 uppercase text-right">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {months.map(month => {
                    const ai = aiForecasts[month];
                    const manual = adjustments[month];
                    const diff = manual - ai;
                    const percent = ((diff / ai) * 100).toFixed(1);

                    return (
                      <tr key={month}>
                        <td className="py-4 text-sm font-medium text-zinc-900">{month} 2024</td>
                        <td className="py-4 text-sm text-zinc-500 font-mono">{ai}</td>
                        <td className="py-4">
                          <div className="relative max-w-[120px]">
                            <input 
                              type="number" 
                              value={manual}
                              onChange={(e) => setAdjustments({...adjustments, [month]: parseInt(e.target.value) || 0})}
                              className="w-full px-3 py-1.5 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className={cn(
                            "text-xs font-bold",
                            diff > 0 ? "text-amber-600" : diff < 0 ? "text-rose-600" : "text-zinc-400"
                          )}>
                            {diff > 0 ? '+' : ''}{diff} ({percent}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Override Context" subtitle="Document the business logic for this adjustment">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Primary Reason</label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option>Promotion / Marketing Campaign</option>
                  <option>Seasonal Demand Shift</option>
                  <option>Supplier Delay / Lead Time Change</option>
                  <option>Competitor Activity</option>
                  <option>Market Trend Adjustment</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Supporting Notes</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe the specific factors driving this change..."
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm h-24 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Impact Summary" subtitle="How these changes affect planning">
            <div className="space-y-6">
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Demand Delta</p>
                <p className={cn(
                  "text-xl font-bold",
                  totalAdjustment > 0 ? "text-amber-600" : "text-rose-600"
                )}>
                  {totalAdjustment > 0 ? '+' : ''}{totalAdjustment} Units
                </p>
                <p className="text-xs text-zinc-500 mt-1">Across 4 month planning horizon</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 p-1 bg-amber-100 rounded">
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Inventory Risk</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Increased demand in June reduces safety stock buffer by 12 days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 p-1 bg-emerald-100 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Purchase Trigger</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      New reorder point will be reached on May 12th (4 days earlier).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">Projected Carrying Cost</span>
                  <span className="text-xs font-bold text-zinc-900">+$420.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Service Level Impact</span>
                  <span className="text-xs font-bold text-emerald-600">+0.5%</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-brand rounded-xl text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-4 h-4 text-zinc-400" />
              <h4 className="text-sm font-bold">Version Preview</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Current Version</span>
                <span>V2.4 (AI)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">New Version</span>
                <span className="text-emerald-400">V2.5 (Manual)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Author</span>
                <span>Sarah Miller</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const accuracyData = [
    { month: 'Oct', accuracy: 88, bias: -2 },
    { month: 'Nov', accuracy: 91, bias: 1 },
    { month: 'Dec', accuracy: 89, bias: 3 },
    { month: 'Jan', accuracy: 94, bias: -1 },
    { month: 'Feb', accuracy: 92, bias: 0 },
    { month: 'Mar', accuracy: 95, bias: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Overall MAPE" value="10.2%" trend="1.5%" trendType="down" />
        <StatCard label="Forecast Bias" value="+0.8%" trend="Neutral" />
        <StatCard label="SKUs with >90% Acc" value="142" trend="12" trendType="up" />
      </div>

      <Card title="Forecast Accuracy Trend" subtitle="Monthly WMAPE (Weighted Mean Absolute Percentage Error)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#18181b" strokeWidth={3} dot={{ r: 6, fill: '#18181b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Forecast Bias Analysis" subtitle="Over-forecasting vs Under-forecasting tendencies">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                <Tooltip />
                <Bar dataKey="bias" name="Bias %">
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.bias > 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Model Performance by Category" subtitle="AI Accuracy across product lines">
          <div className="space-y-4">
            {['Restorative', 'Infection Control', 'Hygiene', 'PPE'].map(cat => (
              <div key={cat} className="flex items-center justify-between p-3 border-b border-zinc-100 last:border-0">
                <span className="text-sm font-medium text-zinc-900">{cat}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-zinc-900">{85 + Math.floor(Math.random() * 10)}%</span>
                  <div className="w-24 bg-zinc-100 h-1.5 rounded-full">
                    <div className="bg-brand h-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const AlertsScreen = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-zinc-900">Demand Risk Alerts</h2>
      <div className="flex space-x-2">
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg"><Filter className="w-5 h-5" /></button>
        <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg"><Download className="w-5 h-5" /></button>
      </div>
    </div>

    <div className="space-y-4">
      {MOCK_ALERTS.map(alert => (
        <div key={alert.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              alert.severity === 'high' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
            )}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-base font-bold text-zinc-900">{alert.skuName}</h3>
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                  alert.severity === 'high' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                )}>
                  {alert.severity} Priority
                </span>
              </div>
              <p className="text-sm text-zinc-600 mb-2">{alert.description}</p>
              <div className="flex items-center space-x-4 text-xs text-zinc-400">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(alert.timestamp).toLocaleTimeString()}</span>
                <span className="flex items-center font-medium text-zinc-900">Financial Impact: ${alert.impactValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90">Resolve Now</button>
            <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg">Snooze</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HistoryScreen = () => (
  <div className="space-y-6">
    <Card title="Forecast Version History" subtitle="Audit trail of all manual adjustments and model updates">
      <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-zinc-100">
        {[
          { v: 'V2.4', date: 'Today, 10:45 AM', user: 'Sarah Miller', action: 'Manual Adjustment', reason: 'Summer Promo Campaign' },
          { v: 'V2.3', date: 'Yesterday, 04:20 PM', user: 'System (AI)', action: 'Model Retraining', reason: 'New sales data ingested' },
          { v: 'V2.2', date: 'Mar 3, 09:15 AM', user: 'James Wilson', action: 'Manual Adjustment', reason: 'Supplier lead time update' },
          { v: 'V2.1', date: 'Mar 1, 00:01 AM', user: 'System (AI)', action: 'Monthly Refresh', reason: 'Scheduled forecast generation' },
        ].map((item, i) => (
          <div key={i} className="relative pl-12">
            <div className="absolute left-4 top-1 w-4 h-4 rounded-full border-2 border-white bg-brand ring-4 ring-zinc-50" />
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-zinc-900">{item.v}</span>
                  <span className="text-xs text-zinc-400">{item.date}</span>
                </div>
                <p className="text-sm text-zinc-600"><span className="font-medium text-zinc-900">{item.user}</span> performed <span className="font-medium text-zinc-900">{item.action}</span></p>
                <p className="text-xs text-zinc-500 mt-1 italic">"{item.reason}"</p>
              </div>
              <button className="text-xs font-medium text-zinc-900 hover:underline">View Diff</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// --- Main App Layout ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'sku' | 'adjust' | 'analytics' | 'alerts' | 'history'>('dashboard');
  const [selectedSKU, setSelectedSKU] = useState<SKU | null>(null);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentModule(null); // Go to launcher first
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentModule(null);
  };

  const handleSelectSKU = (sku: SKU) => {
    setSelectedSKU(sku);
    setCurrentScreen('sku');
  };

  const renderModule = () => {
    if (currentModule === 'forecast') {
      if (userRole !== 'Inventory Planner' && userRole !== 'Admin') {
        return <AccessDenied onBack={() => setCurrentModule(null)} />;
      }
      
      switch (currentScreen) {
        case 'dashboard': return <DashboardHome onSelectSKU={handleSelectSKU} />;
        case 'sku': return selectedSKU ? <SKUDetail sku={selectedSKU} onAdjust={() => setCurrentScreen('adjust')} /> : null;
        case 'adjust': return selectedSKU ? <ForecastAdjustment sku={selectedSKU} onSave={() => setCurrentScreen('sku')} onCancel={() => setCurrentScreen('sku')} /> : null;
        case 'analytics': return <Analytics />;
        case 'alerts': return <AlertsScreen />;
        case 'history': return <HistoryScreen />;
        default: return <DashboardHome onSelectSKU={handleSelectSKU} />;
      }
    }
    
    if (currentModule) {
      return <AccessDenied onBack={() => setCurrentModule(null)} />;
    }

    return <ModuleLauncher userRole={userRole} onLaunch={setCurrentModule} />;
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Sidebar - Only show if in a module */}
      {currentModule === 'forecast' && (
        <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed inset-y-0">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => setCurrentModule(null)}>
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">Forecast IQ</h1>
            </div>
            
            <nav className="space-y-1">
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Overview" 
                active={currentScreen === 'dashboard'} 
                onClick={() => setCurrentScreen('dashboard')} 
              />
              <SidebarItem 
                icon={Package} 
                label="Inventory" 
                active={currentScreen === 'sku' || currentScreen === 'adjust'} 
                onClick={() => {
                  if (!selectedSKU) setSelectedSKU(MOCK_SKUS[0]);
                  setCurrentScreen('sku');
                }} 
              />
              <SidebarItem 
                icon={TrendingUp} 
                label="Analytics" 
                active={currentScreen === 'analytics'} 
                onClick={() => setCurrentScreen('analytics')} 
              />
              <SidebarItem 
                icon={AlertTriangle} 
                label="Risk Alerts" 
                active={currentScreen === 'alerts'} 
                onClick={() => setCurrentScreen('alerts')} 
              />
              <SidebarItem 
                icon={History} 
                label="History" 
                active={currentScreen === 'history'} 
                onClick={() => setCurrentScreen('history')} 
              />
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-zinc-100">
            <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
            <div className="flex items-center mt-6 px-4">
              <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Sarah Miller</p>
                <p className="text-[10px] text-zinc-500 truncate">{userRole}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-auto p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={cn("flex-1", currentModule === 'forecast' ? "ml-64" : "")}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            {!currentModule && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Safco Portal</span>
              </div>
            )}
            {currentModule && (
              <button 
                onClick={() => setCurrentModule(null)}
                className="flex items-center text-xs font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors"
              >
                <Grid className="w-4 h-4 mr-2" />
                Launcher
              </button>
            )}
            <div className="h-6 w-px bg-zinc-200 mx-2" />
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search portal..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-zinc-200" />
            <div className="flex items-center text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Last Sync: 2 mins ago
            </div>
            {!currentModule && (
              <button 
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}
