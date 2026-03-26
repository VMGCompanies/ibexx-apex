import React, { useState } from 'react';
import { PackageCheck, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';

// Receiving events with three-way match results
const receivingEvents = [
  {
    id: 'RCV-0881',
    po: 'PO-2603-01',
    vendor: 'BRP Parts Direct',
    receivedDate: '2026-03-24',
    matchStatus: 'Partial Match',
    lines: [
      { sku: 'CA-MX3-CK-001', desc: 'Can-Am Maverick X3 Clutch Kit', poQty: 20, rcvQty: 20, invoiceQty: 20, poPrice: 289.00, invoicePrice: 289.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
      { sku: 'CA-DEF-CK-002', desc: 'Can-Am Defender Clutch Kit Pro', poQty: 15, rcvQty: 15, invoiceQty: 15, poPrice: 249.00, invoicePrice: 249.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
      { sku: 'CA-MX3-BLT-003', desc: 'Can-Am Maverick X3 Drive Belt', poQty: 30, rcvQty: 0, invoiceQty: null, poPrice: 94.50, invoicePrice: null, qtyMatch: false, priceMatch: null, result: 'Outstanding — Not Yet Received' },
    ],
    totalPO: 18460,
    totalReceived: 11055,
    apStatus: 'Partial — 2 lines approved, 1 outstanding',
  },
  {
    id: 'RCV-0880',
    po: 'PO-2602-07',
    vendor: 'BRP Parts Direct',
    receivedDate: '2026-03-08',
    matchStatus: 'Full Match',
    lines: [
      { sku: 'SD-SUM-CK-020', desc: 'Ski-Doo Summit Expert Clutch Kit', poQty: 18, rcvQty: 18, invoiceQty: 18, poPrice: 312.00, invoicePrice: 312.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
      { sku: 'SD-BCK-CK-021', desc: 'Ski-Doo Backcountry X Clutch Kit', poQty: 20, rcvQty: 20, invoiceQty: 20, poPrice: 298.00, invoicePrice: 298.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
      { sku: 'PS-IXC-CK-030', desc: 'Polaris Indy XCR Clutch Kit', poQty: 14, rcvQty: 14, invoiceQty: 14, poPrice: 267.00, invoicePrice: 267.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
    ],
    totalPO: 22100,
    totalReceived: 22100,
    apStatus: 'Approved — Queued for payment Apr 7',
  },
  {
    id: 'RCV-0879',
    po: 'PO-2602-08',
    vendor: 'Tucker Powersports',
    receivedDate: '2026-03-14',
    matchStatus: 'Price Variance',
    lines: [
      { sku: 'PL-RZR-CK-010', desc: 'Polaris RZR Pro XP Clutch Kit', poQty: 12, rcvQty: 12, invoiceQty: 12, poPrice: 274.00, invoicePrice: 274.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
      { sku: 'PL-RZR-BLT-012', desc: 'Polaris RZR XP1000 Drive Belt', poQty: 20, rcvQty: 20, invoiceQty: 20, poPrice: 5.94, invoicePrice: 6.60, qtyMatch: true, priceMatch: false, result: 'Price Variance — $0.66/unit · $13.20 total · HELD' },
      { sku: 'YM-SWD-CK-050', desc: 'Yamaha Sidewinder Clutch Kit', poQty: 10, rcvQty: 10, invoiceQty: 10, poPrice: 294.00, invoicePrice: 294.00, qtyMatch: true, priceMatch: true, result: 'Full Match' },
    ],
    totalPO: 9480,
    totalReceived: 9480,
    apStatus: 'Exception Held — INV-4411 price variance pending human review',
  },
];

export const Receiving = () => {
  const [selectedId, setSelectedId] = useState<string>('RCV-0881');
  const selected = receivingEvents.find(r => r.id === selectedId)!;

  const fullMatches = receivingEvents.filter(r => r.matchStatus === 'Full Match').length;
  const exceptions  = receivingEvents.filter(r => r.matchStatus !== 'Full Match').length;

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PackageCheck size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF4 — Receiving Reconciliation & Three-Way Match</h1>
          </div>
          <p className="text-sm text-slate-500">Automated PO vs. receiving vs. invoice reconciliation · Zero-tolerance write policy before AP commit</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Full Match — Auto-Approved', count: fullMatches, color: 'border-green-400 bg-green-50', text: 'text-green-700' },
          { label: 'Exceptions — Human Review', count: exceptions, color: 'border-red-400 bg-red-50', text: 'text-red-700' },
          { label: 'Total Receiving Events', count: receivingEvents.length, color: 'border-slate-400 bg-slate-50', text: 'text-slate-700' },
        ].map(k => (
          <div key={k.label} className={`border border-l-4 rounded-lg px-4 py-3 ${k.color}`}>
            <div className={`text-3xl font-bold ${k.text}`}>{k.count}</div>
            <div className="text-xs text-slate-600 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Event list */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {receivingEvents.map(r => (
            <Card key={r.id} onClick={() => setSelectedId(r.id)} className={selectedId === r.id ? '!border-apex-500 !shadow-md' : ''}>
              <CardBody className="py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{r.id}</span>
                  <Badge variant={r.matchStatus === 'Full Match' ? 'success' : r.matchStatus === 'Partial Match' ? 'warning' : 'danger'}>
                    {r.matchStatus}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600">{r.po} · {r.vendor}</div>
                <div className="text-[10px] text-slate-400 mt-1">{r.receivedDate} · {r.lines.length} lines · ${r.totalReceived.toLocaleString()}</div>
                <div className={`text-[10px] mt-2 font-medium px-2 py-1 rounded ${
                  r.matchStatus === 'Full Match' ? 'bg-green-50 text-green-700' :
                  r.matchStatus === 'Partial Match' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>{r.apStatus}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Three-way match detail */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Three-Way Match — {selected.id} / {selected.po}</h3>
                <Badge variant={selected.matchStatus === 'Full Match' ? 'success' : selected.matchStatus === 'Partial Match' ? 'warning' : 'danger'}>
                  {selected.matchStatus}
                </Badge>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">SKU / Description</th>
                    <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">PO Qty</th>
                    <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Rcv Qty</th>
                    <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Inv Qty</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">PO Price</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Inv Price</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Match Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selected.lines.map(line => (
                    <tr key={line.sku} className={`${!line.qtyMatch || line.priceMatch === false ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-3">
                        <div className="font-mono text-[10px] text-slate-500">{line.sku}</div>
                        <div className="font-medium text-slate-800 text-xs mt-0.5">{line.desc}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">{line.poQty}</td>
                      <td className={`px-4 py-3 text-center font-semibold ${line.rcvQty !== line.poQty ? 'text-amber-600' : 'text-slate-700'}`}>{line.rcvQty}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{line.invoiceQty ?? '—'}</td>
                      <td className="px-4 py-3 text-right text-slate-600">${line.poPrice.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${line.priceMatch === false ? 'text-red-600' : 'text-slate-600'}`}>
                        {line.invoicePrice != null ? `$${line.invoicePrice.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {line.result === 'Full Match'
                            ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                            : line.result.includes('Outstanding')
                            ? <Clock size={12} className="text-slate-400 flex-shrink-0" />
                            : <XCircle size={12} className="text-red-500 flex-shrink-0" />
                          }
                          <span className={`text-[10px] leading-tight ${
                            line.result === 'Full Match' ? 'text-green-700' :
                            line.result.includes('Outstanding') ? 'text-slate-500' :
                            'text-red-700 font-semibold'
                          }`}>{line.result}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">AP Status: </span>{selected.apStatus}
                </div>
                {selected.matchStatus === 'Full Match' && (
                  <Badge variant="success">Auto-Approved for AP</Badge>
                )}
                {selected.matchStatus === 'Price Variance' && (
                  <Button size="sm" variant="danger" onClick={() => showToast('Vendor price dispute notification sent', 'warning')}>
                    <AlertTriangle size={12} /> Initiate Dispute
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Match logic legend */}
          <Card className="mt-4">
            <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Three-Way Match Logic</h3></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Match', desc: 'PO qty = Rcv qty = Inv qty · PO price = Inv price · Auto-approved → AP queue', icon: CheckCircle, iconColor: 'text-green-500', bg: 'bg-green-50' },
                  { label: 'Quantity Variance', desc: 'Rcv qty ≠ PO qty — flag to human; do not approve invoice until resolved', icon: AlertTriangle, iconColor: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Price Variance', desc: 'Inv price ≠ PO price — flag to human; initiate vendor price discrepancy notification', icon: XCircle, iconColor: 'text-red-500', bg: 'bg-red-50' },
                  { label: 'Short Shipment', desc: 'Rcv qty < PO qty — keep PO open for balance; notify vendor; update open PO register', icon: AlertTriangle, iconColor: 'text-orange-500', bg: 'bg-orange-50' },
                ].map(m => (
                  <div key={m.label} className={`${m.bg} rounded-lg p-3 flex items-start gap-2.5`}>
                    <m.icon size={14} className={`${m.iconColor} mt-0.5 flex-shrink-0`} />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{m.label}</div>
                      <div className="text-[10px] text-slate-600 leading-snug mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
