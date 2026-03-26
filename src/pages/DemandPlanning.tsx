import React, { useState } from 'react';
import { PackageSearch, AlertTriangle, Zap, Filter, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { inventory, vendors } from '../data/mockData';

const urgencyVariant = (u: string) => {
  if (u === 'Emergency') return 'danger';
  if (u === 'High') return 'orange';
  if (u === 'Standard') return 'warning';
  return 'success';
};

const statusColor = (s: string) => {
  if (s === 'Stockout') return 'bg-red-500';
  if (s === 'Critical Reorder') return 'bg-orange-500';
  if (s === 'Reorder Required') return 'bg-yellow-400';
  return 'bg-green-500';
};

const lines = ['All Lines', 'Can-Am Dirt', 'Polaris Dirt', 'Ski-Doo Snow', 'Polaris Snow', 'Arctic Cat Snow', 'Yamaha Snow'];

export const DemandPlanning = () => {
  const [filterLine, setFilterLine] = useState('All Lines');
  const [filterUrgency, setFilterUrgency] = useState('All');

  const filtered = inventory.filter(i => {
    const lineMatch = filterLine === 'All Lines' || i.line === filterLine;
    const urgencyMatch = filterUrgency === 'All' || i.urgency === filterUrgency;
    return lineMatch && urgencyMatch;
  });

  const stockouts  = inventory.filter(i => i.status === 'Stockout').length;
  const criticals  = inventory.filter(i => i.status === 'Critical Reorder').length;
  const reorders   = inventory.filter(i => i.status === 'Reorder Required').length;
  const healthy    = inventory.filter(i => i.status === 'Healthy').length;

  const totalReorderValue = inventory
    .filter(i => i.status !== 'Healthy')
    .reduce((sum, i) => sum + (i.drp - i.onHand) * i.unitCost, 0);

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PackageSearch size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF1 — Demand Signal Intake & Replenishment Planning</h1>
          </div>
          <p className="text-sm text-slate-500">Real-time SKU-level reorder status across all product lines · Seasonal mode: UTV Pre-Season ramp active</p>
        </div>
        <Button variant="navy" size="sm" onClick={() => showToast('APEX running full replenishment scan across all pipelines...', 'success')}>
          <Zap size={13} /> Run Replenishment Scan
        </Button>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Stockout / Backorder Emergency', count: stockouts, color: 'border-l-red-500', textColor: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Critical Reorder', count: criticals, color: 'border-l-orange-500', textColor: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Standard Reorder Required', count: reorders, color: 'border-l-yellow-400', textColor: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Healthy — No Action', count: healthy, color: 'border-l-green-500', textColor: 'text-green-700', bg: 'bg-green-50' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border border-l-4 ${k.color} rounded-lg px-4 py-3`}>
            <div className={`text-3xl font-bold ${k.textColor}`}>{k.count}</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-tight">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Estimated reorder value banner */}
      <div className="bg-apex-50 border border-apex-200 rounded-lg px-5 py-3 flex items-center gap-3">
        <AlertTriangle size={16} className="text-apex-600 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-apex-900">Estimated procurement requirement: </span>
          <span className="text-sm text-apex-700">${totalReorderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} across {inventory.filter(i => i.status !== 'Healthy').length} SKUs — sorted by urgency priority below</span>
        </div>
        <Button size="sm" variant="navy" onClick={() => showToast('Procurement demand report sent to Vendor & PO workflow', 'success')}>
          Send to WF2 →
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-slate-400" />
        <div className="flex gap-2 flex-wrap">
          {lines.map(l => (
            <button
              key={l}
              onClick={() => setFilterLine(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterLine === l ? 'bg-apex-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-2 flex-wrap">
          {['All', 'Emergency', 'High', 'Standard'].map(u => (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterUrgency === u ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Procurement Demand Report — {filtered.length} SKUs</h3>
            <span className="text-xs text-slate-400">Sorted: Stockout → Critical → Standard → Healthy</span>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Status', 'SKU', 'Description', 'Line', 'On-Hand', 'DRP', 'Safety Stock', '90d Velocity', 'Rec. Order Qty', 'Preferred Vendor', 'Lead Days', 'Est. Cost', 'Urgency'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...filtered].sort((a, b) => {
                const order: Record<string, number> = { Emergency: 0, High: 1, Standard: 2, None: 3 };
                return (order[a.urgency] ?? 4) - (order[b.urgency] ?? 4);
              }).map(item => {
                const vendor = vendors.find(v => v.id === item.preferredVendor);
                const recQty = Math.max(item.drp - item.onHand + item.drp, 0);
                const estCost = recQty * item.unitCost;
                return (
                  <tr key={item.sku} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor(item.status)}`} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-slate-600 whitespace-nowrap">{item.sku}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800 max-w-[200px]">
                      <div className="truncate" title={item.desc}>{item.desc}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-500">{item.line}</td>
                    <td className={`px-4 py-2.5 font-bold text-center ${item.onHand === 0 ? 'text-red-600' : item.onHand <= item.safetyStock ? 'text-orange-600' : 'text-slate-700'}`}>{item.onHand}</td>
                    <td className="px-4 py-2.5 text-center text-slate-500">{item.drp}</td>
                    <td className="px-4 py-2.5 text-center text-slate-500">{item.safetyStock}</td>
                    <td className="px-4 py-2.5 text-center text-slate-500">{item.velocity90}</td>
                    <td className="px-4 py-2.5 text-center font-semibold text-apex-700">{recQty > 0 ? recQty : '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{vendor?.name ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center text-slate-500">{item.leadDays}d</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-700">{recQty > 0 ? `$${estCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—'}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={urgencyVariant(item.urgency)}>{item.urgency === 'None' ? 'OK' : item.urgency}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Workflow step legend */}
      <Card>
        <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Workflow Execution Log — WF1 Steps</h3></CardHeader>
        <CardBody>
          <div className="space-y-2">
            {[
              { step: 1, desc: 'Pull current on-hand inventory for all active SKUs across 6 product lines', status: 'Complete' },
              { step: 2, desc: 'Cross-reference on-hand against dynamic reorder points with seasonal adjustment (UTV +15%)', status: 'Complete' },
              { step: 3, desc: 'Identify SKUs at or below DRP — classify as Reorder Required', status: 'Complete' },
              { step: 4, desc: 'Identify SKUs at or below safety stock — classify as Critical Reorder', status: 'Complete' },
              { step: 5, desc: 'Identify zero-inventory SKUs with open orders — classify as Stockout/Backorder Emergency', status: 'Complete' },
              { step: 6, desc: 'BOM explosion for kit SKUs — check component inventory before external procurement', status: 'Complete' },
              { step: 7, desc: 'Generate prioritized procurement demand list (Emergency → Critical → Standard)', status: 'Complete' },
              { step: 8, desc: 'Cross-reference demand list against open POs — net out inbound quantities', status: 'Complete' },
              { step: 9, desc: 'Calculate net procurement requirement with EOQ model and vendor MOQs', status: 'Complete' },
              { step: 10, desc: 'Output Procurement Demand Report — delivered to dashboard and human operator', status: 'Complete' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-green-700">{s.step}</span>
                </div>
                <div className="flex-1 text-xs text-slate-600 pt-0.5">{s.desc}</div>
                <Badge variant="success">{s.status}</Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
