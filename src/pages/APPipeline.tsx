import React, { useState } from 'react';
import { CreditCard, AlertTriangle, CheckCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { invoices, apAging } from '../data/mockData';

const glCodes: Record<string, string> = {
  'BRP Parts Direct':         '5010 — COGS / OEM Components',
  'Tucker Powersports':       '5010 — COGS / Distributed Parts',
  'WPS Western Power Sports': '5010 — COGS / Distributed Parts',
  'Polaris Industries':       '5010 — COGS / OEM Components',
  'Dayco Products':           '5015 — COGS / Belts & Drives',
};

export const APPipeline = () => {
  const [selectedId, setSelectedId] = useState<string | null>('INV-4414');

  const selected = invoices.find(i => i.id === selectedId);
  const pendingMatch = invoices.filter(i => i.status === 'Pending Match').length;
  const approved     = invoices.filter(i => i.status === 'Matched-Approved').length;
  const exceptions   = invoices.filter(i => i.status === 'Exception-Held').length;
  const totalApproved = invoices.filter(i => i.status === 'Matched-Approved').reduce((s, i) => s + i.amount, 0);
  const earlyDiscount = invoices.filter(i => i.earlyDiscountAvail);

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF5 — Accounts Payable Integration & Payment Pipeline</h1>
          </div>
          <p className="text-sm text-slate-500">Invoice reconciliation, GL coding, aging management, and payment schedule generation</p>
        </div>
        <Button variant="navy" size="sm" onClick={() => showToast('Weekly payment schedule generated and sent to Alex for authorization', 'success')}>
          <Calendar size={13} /> Generate Payment Schedule
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Match', count: pendingMatch, color: 'bg-slate-600' },
          { label: 'Matched — Approved', count: approved, color: 'bg-green-600', sub: `$${totalApproved.toLocaleString()} queued` },
          { label: 'Exceptions Held', count: exceptions, color: 'bg-red-600', sub: 'Human review needed' },
          { label: 'Early Pay Discounts', count: earlyDiscount.length, color: 'bg-apex-600', sub: `$${earlyDiscount.reduce((s, i) => s + (i.discountAmount ?? 0), 0).toFixed(2)} available` },
        ].map(k => (
          <div key={k.label} className={`${k.color} rounded-lg px-4 py-3 text-white`}>
            <div className="text-3xl font-bold">{k.count}</div>
            <div className="text-xs mt-0.5 opacity-80">{k.label}</div>
            {k.sub && <div className="text-[10px] mt-0.5 opacity-70">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Early discount alert */}
      {earlyDiscount.length > 0 && (
        <div className="bg-apex-50 border border-apex-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <DollarSign size={15} className="text-apex-600 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <span className="font-semibold text-apex-900">[P3] Early Payment Discount Opportunity — </span>
            <span className="text-apex-700">INV-4413 (Tucker Powersports): 2/10 Net 30 · ${earlyDiscount[0].discountAmount?.toFixed(2)} savings if paid by {earlyDiscount[0].discountDeadline}</span>
          </div>
          <Button size="sm" variant="navy" onClick={() => showToast('Early payment recommendation escalated to Alex', 'success')}>
            Flag for Approval
          </Button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* Invoice queue */}
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 text-sm">Invoice Queue</h3>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id === selectedId ? null : inv.id)}
                  className={`px-5 py-3 hover:bg-slate-50 cursor-pointer ${selectedId === inv.id ? 'bg-apex-50 border-l-2 border-l-apex-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{inv.id}</span>
                      {inv.earlyDiscountAvail && <span className="text-[9px] bg-apex-100 text-apex-700 font-semibold px-1.5 py-0.5 rounded">2/10</span>}
                    </div>
                    <Badge variant={
                      inv.status === 'Matched-Approved' ? 'success' :
                      inv.status === 'Exception-Held' ? 'danger' : 'neutral'
                    }>
                      {inv.status === 'Matched-Approved' ? 'Approved' :
                       inv.status === 'Exception-Held' ? 'Exception' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600">{inv.vendor}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-slate-800">${inv.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">{inv.dueDate ? `Due ${inv.dueDate}` : 'No PO match'}</span>
                  </div>
                  {inv.exceptionNote && (
                    <div className="text-[10px] text-red-600 mt-1 font-medium truncate">{inv.exceptionNote}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* AP Aging */}
          <Card className="mt-4">
            <CardHeader>
              <h3 className="font-semibold text-slate-900 text-sm">AP Aging Summary</h3>
            </CardHeader>
            <CardBody>
              {apAging.map(a => (
                <div key={a.bucket} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className="w-20 text-xs text-slate-600 flex-shrink-0">{a.bucket}</div>
                  <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all ${
                        a.bucket === '90+ days' ? 'bg-red-500' :
                        a.bucket === '61–90 days' ? 'bg-orange-400' :
                        a.bucket === '31–60 days' ? 'bg-yellow-400' : 'bg-apex-500'
                      }`}
                      style={{ width: `${a.pct}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs text-right text-slate-600">{a.pct}%</div>
                  <div className="w-16 text-xs text-right font-medium text-slate-700">${(a.amount / 1000).toFixed(0)}k</div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Total AP Balance</span>
                <span className="font-semibold text-slate-800">${(apAging.reduce((s, a) => s + a.amount, 0) / 1000).toFixed(0)}k</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Invoice detail */}
        <div className="col-span-12 lg:col-span-7">
          {selected ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">Invoice Detail — {selected.id}</h3>
                    <Badge variant={selected.status === 'Matched-Approved' ? 'success' : selected.status === 'Exception-Held' ? 'danger' : 'neutral'}>
                      {selected.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    {[
                      { label: 'Vendor', value: selected.vendor },
                      { label: 'Matched PO', value: selected.po },
                      { label: 'Invoice Amount', value: `$${selected.amount.toLocaleString()}` },
                      { label: 'PO Amount', value: selected.poAmount ? `$${selected.poAmount.toLocaleString()}` : 'No PO Found' },
                      { label: 'Variance', value: selected.poAmount ? `$${(selected.amount - selected.poAmount).toFixed(2)}` : 'N/A' },
                      { label: 'Due Date', value: selected.dueDate ?? 'TBD' },
                      { label: 'AP Aging (days)', value: `${selected.aging} days` },
                      { label: 'GL Code', value: glCodes[selected.vendor] ?? '5010 — COGS' },
                    ].map(d => (
                      <div key={d.label} className={`bg-slate-50 rounded p-2.5 ${d.label === 'Variance' && selected.amount !== selected.poAmount ? 'bg-red-50' : ''}`}>
                        <div className="text-[10px] text-slate-400 mb-0.5">{d.label}</div>
                        <div className={`font-medium ${d.label === 'Variance' && selected.poAmount && selected.amount !== selected.poAmount ? 'text-red-600' : 'text-slate-800'}`}>{d.value}</div>
                      </div>
                    ))}
                  </div>
                  {selected.exceptionNote && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
                      <AlertTriangle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-red-700 leading-snug">{selected.exceptionNote}</div>
                    </div>
                  )}
                  {selected.earlyDiscountAvail && (
                    <div className="mt-3 bg-apex-50 border border-apex-200 rounded-lg px-3 py-2.5">
                      <div className="text-xs font-semibold text-apex-800">Early Payment Discount Available</div>
                      <div className="text-xs text-apex-700 mt-0.5">
                        Save ${selected.discountAmount?.toFixed(2)} — pay by {selected.discountDeadline} (2% discount on Net 30 terms)
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    {selected.status === 'Matched-Approved' && (
                      <Button size="sm" variant="navy" className="flex-1" onClick={() => showToast(`${selected.id} queued for next payment run`, 'success')}>
                        <CheckCircle size={12} /> Queue for Payment
                      </Button>
                    )}
                    {selected.status === 'Exception-Held' && (
                      <>
                        <Button size="sm" variant="navy" className="flex-1" onClick={() => showToast(`${selected.id} approved with override — logged`, 'success')}>
                          Approve with Override
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => showToast(`${selected.id} rejected — vendor notification sent`, 'error')}>
                          Reject Invoice
                        </Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* APEX step log */}
              <Card>
                <CardHeader><h3 className="font-semibold text-slate-900 text-sm">WF5 Execution Log — This Invoice</h3></CardHeader>
                <CardBody className="space-y-2">
                  {[
                    { step: 'Invoice received via AP system intake queue', done: true },
                    { step: 'GL coding applied: ' + (glCodes[selected.vendor] ?? '5010 — COGS'), done: true },
                    { step: 'Payment due date calculated from invoice date + vendor terms', done: selected.dueDate != null },
                    { step: 'Early payment discount ROI calculated', done: true },
                    { step: 'Duplicate submission check — no duplicate found', done: true },
                    { step: 'Three-way match result applied from WF4', done: true },
                    { step: 'Loaded to AP payment queue pending human authorization', done: selected.status === 'Matched-Approved' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle size={13} className={`mt-0.5 flex-shrink-0 ${s.done ? 'text-green-500' : 'text-slate-300'}`} />
                      <span className={`text-xs ${s.done ? 'text-slate-700' : 'text-slate-400'}`}>{s.step}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-16 text-slate-400">
                  <CreditCard size={32} className="mx-auto mb-3 opacity-40" />
                  <div className="text-sm font-medium">Select an invoice to review</div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
