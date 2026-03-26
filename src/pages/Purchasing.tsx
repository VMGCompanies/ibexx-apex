import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, AlertTriangle, Clock, Zap, FileText } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { vendors, inventory, purchaseOrders } from '../data/mockData';

// Draft POs generated from demand report
const draftPOs = [
  {
    id: 'PO-DRAFT-001',
    vendor: 'Tucker Powersports',
    vendorId: 'V-002',
    status: 'Awaiting Approval',
    reason: 'Above autonomous threshold',
    items: [
      { sku: 'CA-MX3-BLT-003', desc: 'Can-Am Maverick X3 Drive Belt', qty: 30, unitPrice: 94.50, total: 2835.00 },
      { sku: 'PL-RZR-BLT-012', desc: 'Polaris RZR XP1000 Drive Belt', qty: 25, unitPrice: 89.00, total: 2225.00 },
    ],
    total: 5060.00,
    requestedDelivery: '2026-04-05',
    payTerms: 'Net 30',
    note: 'APEX: Emergency stockout reorder — rush delivery requested. Both SKUs have open dealer orders.',
  },
  {
    id: 'PO-DRAFT-002',
    vendor: 'BRP Parts Direct',
    vendorId: 'V-001',
    status: 'Awaiting Approval',
    reason: 'Stockout condition — P1 escalation',
    items: [
      { sku: 'SD-BCK-CK-021', desc: 'Ski-Doo Backcountry X Clutch Kit', qty: 20, unitPrice: 298.00, total: 5960.00 },
      { sku: 'SD-SUM-CK-020', desc: 'Ski-Doo Summit Expert Clutch Kit', qty: 18, unitPrice: 312.00, total: 5616.00 },
    ],
    total: 11576.00,
    requestedDelivery: '2026-04-03',
    payTerms: 'Net 30',
    note: 'APEX: SD-BCK-CK-021 stockout — 2 open dealer orders. SD-SUM-CK-020 critical. Bundled to BRP for single shipment.',
  },
  {
    id: 'PO-DRAFT-003',
    vendor: 'Polaris Industries',
    vendorId: 'V-006',
    status: 'Ready to Issue',
    reason: 'Within autonomous threshold',
    items: [
      { sku: 'PS-IXC-CK-030', desc: 'Polaris Indy XCR Clutch Kit', qty: 16, unitPrice: 267.00, total: 4272.00 },
    ],
    total: 4272.00,
    requestedDelivery: '2026-04-10',
    payTerms: 'Net 45',
    note: 'APEX: Standard reorder — critical tier. Note: awaiting acknowledgment on PO-2603-04 from same vendor (52h overdue). Recommending hold pending ack resolution.',
  },
  {
    id: 'PO-DRAFT-004',
    vendor: 'Tucker Powersports',
    vendorId: 'V-002',
    status: 'Ready to Issue',
    reason: 'Within autonomous threshold',
    items: [
      { sku: 'YM-SWD-CK-050', desc: 'Yamaha Sidewinder Clutch Kit', qty: 12, unitPrice: 294.00, total: 3528.00 },
      { sku: 'CA-DEF-CK-002', desc: 'Can-Am Defender Clutch Kit Pro', qty: 15, unitPrice: 249.00, total: 3735.00 },
    ],
    total: 7263.00,
    requestedDelivery: '2026-04-02',
    payTerms: 'Net 30',
    note: 'APEX: Tucker lead time 3 days — optimal for pre-season ramp. Price break at 15 units for Defender kit achieved.',
  },
];

export const Purchasing = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPO = draftPOs.find(p => p.id === selected);

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF2 — Vendor Selection & Purchase Order Generation</h1>
          </div>
          <p className="text-sm text-slate-500">APEX-generated draft POs from approved procurement demand report · Human approval required above threshold</p>
        </div>
        <Button variant="navy" size="sm" onClick={() => showToast('Issuing all Ready-to-Issue POs autonomously...', 'success')}>
          <Zap size={13} /> Issue All Approved
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Awaiting Human Approval', count: draftPOs.filter(p => p.status === 'Awaiting Approval').length, value: draftPOs.filter(p => p.status === 'Awaiting Approval').reduce((s, p) => s + p.total, 0), color: 'border-amber-400 bg-amber-50', text: 'text-amber-700' },
          { label: 'Ready to Issue (Autonomous)', count: draftPOs.filter(p => p.status === 'Ready to Issue').length, value: draftPOs.filter(p => p.status === 'Ready to Issue').reduce((s, p) => s + p.total, 0), color: 'border-apex-500 bg-apex-50', text: 'text-apex-700' },
          { label: 'Open POs (Active)', count: purchaseOrders.filter(p => p.status !== 'Received').length, value: purchaseOrders.filter(p => p.status !== 'Received').reduce((s, p) => s + p.totalValue, 0), color: 'border-slate-400 bg-slate-50', text: 'text-slate-700' },
          { label: 'Received This Month', count: purchaseOrders.filter(p => p.status === 'Received').length, value: purchaseOrders.filter(p => p.status === 'Received').reduce((s, p) => s + p.totalValue, 0), color: 'border-green-400 bg-green-50', text: 'text-green-700' },
        ].map(k => (
          <div key={k.label} className={`border border-l-4 rounded-lg px-4 py-3 ${k.color}`}>
            <div className={`text-2xl font-bold ${k.text}`}>{k.count}</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-tight">{k.label}</div>
            <div className={`text-xs font-semibold mt-1 ${k.text}`}>${k.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Draft PO list */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">APEX-Generated Draft POs</h3>
          {draftPOs.map(po => {
            const vendor = vendors.find(v => v.id === po.vendorId);
            return (
              <Card key={po.id} onClick={() => setSelected(po.id === selected ? null : po.id)} className={selected === po.id ? '!border-apex-500 !shadow-md' : ''}>
                <CardBody className="py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{po.id}</div>
                      <div className="text-xs text-slate-500">{po.vendor} · {po.items.length} line items</div>
                    </div>
                    <Badge variant={po.status === 'Awaiting Approval' ? 'warning' : 'blue'}>
                      {po.status === 'Awaiting Approval' ? 'Needs Approval' : 'Auto-Issue'}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-1">${po.total.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mb-2">Due: {po.requestedDelivery} · {po.payTerms} · OTD {vendor?.onTimeRate}%</div>
                  <div className="text-[10px] text-apex-700 bg-apex-50 border border-apex-100 rounded px-2 py-1.5 leading-snug">{po.note}</div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="navy" className="flex-1" onClick={(e) => { e.stopPropagation(); showToast(`${po.id} approved and issued to ${po.vendor}`, 'success'); }}>
                      <CheckCircle size={12} /> Approve & Issue
                    </Button>
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); showToast(`${po.id} sent back for revision`, 'warning'); }}>
                      Revise
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Detail pane */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          {selectedPO ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">PO Line Items — {selectedPO.id}</h3>
                    <Badge variant={selectedPO.status === 'Awaiting Approval' ? 'warning' : 'blue'}>{selectedPO.status}</Badge>
                  </div>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {['SKU', 'Description', 'Qty', 'Unit Price', 'Extended'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPO.items.map(item => (
                        <tr key={item.sku} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500">{item.sku}</td>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{item.desc}</td>
                          <td className="px-4 py-2.5 text-center font-semibold text-slate-700">{item.qty}</td>
                          <td className="px-4 py-2.5 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-slate-800">${item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={4} className="px-4 py-2.5 text-right text-slate-700 text-xs">PO Total</td>
                        <td className="px-4 py-2.5 text-right text-apex-700 text-sm">${selectedPO.total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pre-issuance validation */}
              <Card>
                <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Pre-Issuance Validation Checklist</h3></CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {[
                      { check: 'Vendor on approved vendor list', pass: true },
                      { check: `Total PO value $${selectedPO.total.toLocaleString()} vs. autonomous threshold`, pass: selectedPO.status === 'Ready to Issue', note: selectedPO.status === 'Awaiting Approval' ? 'Above threshold — human approval required' : 'Within threshold' },
                      { check: 'No duplicate PO exists for same vendor / item combination', pass: true },
                      { check: 'Delivery date achievable given vendor lead time', pass: selectedPO.id !== 'PO-DRAFT-003' },
                      { check: 'No active AP dispute with vendor', pass: selectedPO.id !== 'PO-DRAFT-003', note: selectedPO.id === 'PO-DRAFT-003' ? 'Caution: PO-2603-04 ack overdue 52h — same vendor' : undefined },
                    ].map((c, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        {c.pass
                          ? <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          : <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        }
                        <div className="flex-1">
                          <div className="text-xs text-slate-700">{c.check}</div>
                          {c.note && <div className={`text-[10px] mt-0.5 ${c.pass ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>{c.note}</div>}
                        </div>
                        <Badge variant={c.pass ? 'success' : 'warning'}>{c.pass ? 'Pass' : 'Flag'}</Badge>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </>
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-12 text-slate-400">
                  <FileText size={32} className="mx-auto mb-3 opacity-40" />
                  <div className="text-sm font-medium">Select a draft PO to review details</div>
                  <div className="text-xs mt-1">Line items, validation checklist, and vendor data will appear here</div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Vendor comparison table */}
          <Card>
            <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Approved Vendor Master — Performance Summary</h3></CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Vendor', 'Category', 'Lead Days', 'Terms', 'OTD %', 'Fill %', 'Inv Acc %', 'Classification'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{v.name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{v.category}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">{v.leadDays}d</td>
                      <td className="px-4 py-2.5 text-slate-500">{v.payTerms}</td>
                      <td className={`px-4 py-2.5 text-center font-semibold ${v.onTimeRate >= 92 ? 'text-green-600' : v.onTimeRate >= 87 ? 'text-yellow-600' : 'text-red-600'}`}>{v.onTimeRate}%</td>
                      <td className={`px-4 py-2.5 text-center font-semibold ${v.fillRate >= 95 ? 'text-green-600' : v.fillRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>{v.fillRate}%</td>
                      <td className={`px-4 py-2.5 text-center font-semibold ${v.invoiceAccuracy >= 98 ? 'text-green-600' : 'text-yellow-600'}`}>{v.invoiceAccuracy}%</td>
                      <td className="px-4 py-2.5">
                        <Badge variant={v.classification === 'Preferred' ? 'success' : v.classification === 'Approved' ? 'info' : 'warning'}>
                          {v.classification}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
