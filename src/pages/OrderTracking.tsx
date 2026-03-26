import React, { useState } from 'react';
import { Truck, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { purchaseOrders } from '../data/mockData';

const statusVariant = (status: string, ack: string) => {
  if (status === 'Overdue') return 'danger';
  if (status === 'In-Transit') return 'info';
  if (status === 'In-Production') return 'blue';
  if (status === 'Received') return 'success';
  if (ack === 'Overdue') return 'danger';
  return 'neutral';
};

const timelineSteps = [
  'PO Issued',
  'Ack Received',
  'In Production',
  'Shipped',
  'In Transit',
  'Delivered',
];

const getStepIndex = (po: typeof purchaseOrders[0]) => {
  if (po.status === 'Received') return 5;
  if (po.status === 'In-Transit') return 4;
  if (po.status === 'In-Production') return 2;
  if (po.ackStatus === 'Acknowledged') return 1;
  return 0;
};

export const OrderTracking = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = purchaseOrders.find(p => p.id === selectedId);

  const openPOs   = purchaseOrders.filter(p => p.status !== 'Received');
  const lateRisk  = purchaseOrders.filter(p => p.lateRisk).length;
  const overdue   = purchaseOrders.filter(p => p.status === 'Overdue').length;
  const ackOverdue = purchaseOrders.filter(p => p.ackStatus === 'Overdue').length;

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF3 — Vendor Acknowledgment & Delivery Tracking</h1>
          </div>
          <p className="text-sm text-slate-500">Continuous monitoring of all open POs for acknowledgment SLA compliance and delivery status</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open POs Being Tracked', count: openPOs.length, color: 'bg-slate-900' },
          { label: 'Ack Overdue (SLA Breach)', count: ackOverdue, color: 'bg-red-600', alert: true },
          { label: 'Late Delivery Risk', count: lateRisk, color: 'bg-amber-500', alert: true },
          { label: 'Overdue — Passed EDD', count: overdue, color: 'bg-red-700', alert: true },
        ].map(k => (
          <div key={k.label} className={`${k.color} rounded-lg px-4 py-3 text-white`}>
            <div className="text-3xl font-bold">{k.count}</div>
            <div className="text-xs mt-0.5 opacity-80 leading-tight">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(overdue > 0 || ackOverdue > 0) && (
        <div className="space-y-2">
          {purchaseOrders.filter(p => p.ackStatus === 'Overdue').map(po => (
            <div key={po.id + '-ack'} className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-semibold text-red-800">[P2] Acknowledgment SLA Breach — {po.id}</span>
                <span className="text-red-600 ml-2">Vendor: {po.vendor} · PO issued {po.issued} · No ack received after 72+ hours</span>
              </div>
              <Button size="sm" variant="danger" onClick={() => showToast(`Manual escalation call initiated — ${po.vendor}`, 'warning')}>
                Escalate
              </Button>
            </div>
          ))}
          {purchaseOrders.filter(p => p.status === 'Overdue').map(po => (
            <div key={po.id + '-late'} className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-semibold text-red-800">[P2] Delivery Overdue — {po.id}</span>
                <span className="text-red-600 ml-2">Vendor: {po.vendor} · Expected {po.expectedDelivery} · APEX carrier follow-up initiated</span>
              </div>
              <Button size="sm" variant="danger" onClick={() => showToast(`Expedite request sent to ${po.vendor}`, 'warning')}>
                Expedite
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* PO table */}
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 text-sm">All Purchase Orders — Tracking Status</h3>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {purchaseOrders.map(po => (
                <div
                  key={po.id}
                  onClick={() => setSelectedId(po.id === selectedId ? null : po.id)}
                  className={`px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${selectedId === po.id ? 'bg-apex-50 border-l-2 border-l-apex-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{po.id}</span>
                      {po.lateRisk && <AlertTriangle size={11} className="text-amber-500" />}
                    </div>
                    <Badge variant={statusVariant(po.status, po.ackStatus)}>
                      {po.status === 'Issued-Pending Ack' ? (po.ackStatus === 'Overdue' ? 'Ack Overdue' : 'Pending Ack') : po.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600">{po.vendor}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-400">${po.totalValue.toLocaleString()} · {po.items} items</span>
                    <span className={`text-[10px] font-medium ${
                      po.status === 'Received' ? 'text-green-600' :
                      po.daysToDelivery !== null && (po.daysToDelivery as number) < 0 ? 'text-red-600' :
                      po.daysToDelivery !== null && (po.daysToDelivery as number) <= 2 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {po.status === 'Received' ? 'Delivered' :
                       po.daysToDelivery === null ? '—' :
                       (po.daysToDelivery as number) < 0 ? `${Math.abs(po.daysToDelivery as number)}d overdue` :
                       (po.daysToDelivery as number) === 0 ? 'Due today' :
                       `${po.daysToDelivery}d to delivery`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {selected ? (
            <>
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">{selected.id} — Timeline</h3>
                    <span className="text-xs text-slate-500">{selected.vendor}</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="relative">
                    {/* Line */}
                    <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-200" />
                    {timelineSteps.map((step, i) => {
                      const currentStep = getStepIndex(selected);
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step} className="relative flex items-start gap-4 mb-4 last:mb-0">
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                            done ? 'bg-apex-600 border-apex-600' : 'bg-white border-slate-300'
                          } ${active ? 'ring-2 ring-apex-300 ring-offset-1' : ''}`}>
                            {done
                              ? <CheckCircle size={12} className="text-white" />
                              : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            }
                          </div>
                          <div className="flex-1 pt-1">
                            <div className={`text-xs font-semibold ${done ? 'text-slate-800' : 'text-slate-400'}`}>{step}</div>
                            {active && (
                              <div className="text-[10px] text-apex-600 font-medium mt-0.5">Current status</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* PO details card */}
              <Card>
                <CardHeader><h3 className="font-semibold text-slate-900 text-sm">PO Details</h3></CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { label: 'Vendor', value: selected.vendor },
                      { label: 'Total Value', value: `$${selected.totalValue.toLocaleString()}` },
                      { label: 'Date Issued', value: selected.issued },
                      { label: 'Expected Delivery', value: selected.expectedDelivery },
                      { label: 'Acknowledgment', value: selected.ackStatus },
                      { label: 'Tracking #', value: selected.trackingNo ?? 'Not yet available' },
                      { label: 'Line Items', value: `${selected.items} items` },
                      { label: 'Late Risk', value: selected.lateRisk ? 'YES — Flagged' : 'None identified' },
                    ].map(d => (
                      <div key={d.label} className="bg-slate-50 rounded p-2.5">
                        <div className="text-[10px] text-slate-400 mb-0.5">{d.label}</div>
                        <div className={`font-medium ${d.label === 'Late Risk' && selected.lateRisk ? 'text-red-600' : 'text-slate-800'}`}>{d.value}</div>
                      </div>
                    ))}
                  </div>
                  {selected.trackingNo && (
                    <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => showToast('Opening carrier tracking portal...', 'success')}>
                      <Truck size={13} /> Track Shipment
                    </Button>
                  )}
                </CardBody>
              </Card>
            </>
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-16 text-slate-400">
                  <Package size={32} className="mx-auto mb-3 opacity-40" />
                  <div className="text-sm font-medium">Select a PO to view tracking details</div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
