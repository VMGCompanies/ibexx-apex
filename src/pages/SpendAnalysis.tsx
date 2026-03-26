import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { monthlySpendData, vendors } from '../data/mockData';

const COLORS = ['#1B4D80', '#f97316', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const lineLabels = ['Can-Am Dirt', 'Polaris Dirt', 'Ski-Doo Snow', 'Polaris Snow', 'Arctic Cat Snow', 'Yamaha Snow'];
const lineKeys   = ['canAm', 'polarisDirt', 'skiDoo', 'polarisSnow', 'arcticCat', 'yamaha'];

const vendorSpend = vendors.map(v => ({ name: v.name.split(' ').slice(0, 2).join(' '), spend: v.ytdSpend }))
  .sort((a, b) => b.spend - a.spend);

const totalSpend   = vendors.reduce((s, v) => s + v.ytdSpend, 0);
const top3Pct      = vendors.slice(0, 3).reduce((s, v) => s + v.ytdSpend, 0) / totalSpend * 100;

// Monthly totals for trend
const monthlyTotals = monthlySpendData.map(d => ({
  month: d.month,
  total: d.canAm + d.polarisDirt + d.skiDoo + d.polarisSnow + d.arcticCat + d.yamaha,
}));

const pieData = lineLabels.map((label, i) => ({
  name: label,
  value: monthlySpendData.reduce((s, d) => s + (d as any)[lineKeys[i]], 0),
}));

export const SpendAnalysis = () => {
  const [period, setPeriod] = useState<'6mo' | '12mo'>('12mo');

  const spendData = period === '6mo' ? monthlySpendData.slice(6) : monthlySpendData;

  const priceAlerts = [
    { sku: 'Can-Am belt components', vendor: 'BRP Parts Direct', change: '+7.2%', prev: '$88.40', curr: '$94.80', flag: true },
    { sku: 'Polaris clutch weights', vendor: 'Parts Unlimited', change: '+5.8%', prev: '$39.70', curr: '$42.00', flag: true },
    { sku: 'Yamaha Snow belts', vendor: 'Tucker Powersports', change: '+2.1%', prev: '$115.60', curr: '$118.00', flag: false },
  ];

  const savingsOpps = [
    { opp: 'Consolidate belt procurement to Dayco Products exclusively', annualSavings: 18400, confidence: 'High' },
    { opp: 'Volume commit to BRP Parts Direct for Can-Am SKUs — hit Tier 2 pricing', annualSavings: 11200, confidence: 'Medium' },
    { opp: 'Pre-season snow inventory purchase (Aug) vs. in-season pricing', annualSavings: 8600, confidence: 'High' },
  ];

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF7 — Spend Analysis & Cost Intelligence</h1>
          </div>
          <p className="text-sm text-slate-500">Procurement spend aggregation · Vendor concentration analysis · Savings opportunity identification</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            {(['6mo', '12mo'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-medium transition-colors ${period === p ? 'bg-apex-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{p}</button>
            ))}
          </div>
          <Button variant="navy" size="sm" onClick={() => showToast('Q1 2026 Cost Intelligence Report generated', 'success')}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Price increase alerts */}
      {priceAlerts.filter(a => a.flag).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-amber-800 mb-1">[P3] Price Increases Detected — Exceeding 5% Threshold</div>
            <div className="flex flex-wrap gap-2">
              {priceAlerts.filter(a => a.flag).map(a => (
                <span key={a.sku} className="text-[10px] bg-amber-100 border border-amber-300 rounded px-2 py-1 text-amber-800">
                  {a.sku}: {a.change} ({a.prev} → {a.curr})
                </span>
              ))}
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => showToast('Price increase report escalated to Alex', 'warning')}>
            Review
          </Button>
        </div>
      )}

      {/* KPI tiles */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total YTD Spend', value: `$${(totalSpend / 1000).toFixed(0)}k`, sub: 'All vendors · All lines' },
          { label: 'Top 3 Vendor Concentration', value: `${top3Pct.toFixed(0)}%`, sub: 'Single-source risk: Moderate' },
          { label: 'Identified Annual Savings', value: `$${((savingsOpps.reduce((s, o) => s + o.annualSavings, 0)) / 1000).toFixed(0)}k`, sub: '3 opportunities flagged' },
          { label: 'Price Increase Alerts', value: priceAlerts.filter(a => a.flag).length.toString(), sub: '>5% threshold breached' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-slate-900">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Spend by line chart */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 text-sm">Monthly Spend by Product Line — {period}</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={spendData} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  {lineKeys.map((key, i) => (
                    <Bar key={key} dataKey={key} name={lineLabels[i]} stackId="a" fill={COLORS[i]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Pie by line */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Spend Mix — Full Year</h3></CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-[10px] text-slate-600 flex-1">{d.name}</span>
                    <span className="text-[10px] font-semibold text-slate-700">{((d.value / pieData.reduce((s, x) => s + x.value, 0)) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Vendor spend bar */}
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">YTD Spend by Vendor</h3>
                <Badge variant="warning">Top 3 = {top3Pct.toFixed(0)}% concentration</Badge>
              </div>
            </CardHeader>
            <CardBody>
              {vendorSpend.map((v, i) => (
                <div key={v.name} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <div className="w-32 text-[11px] text-slate-600 truncate flex-shrink-0">{v.name}</div>
                  <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all"
                      style={{ width: `${(v.spend / vendorSpend[0].spend) * 100}%`, background: COLORS[i % COLORS.length] }}
                    />
                    <span className="absolute left-2 top-0 h-full flex items-center text-[10px] font-semibold text-white mix-blend-difference">
                      ${(v.spend / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="w-10 text-[10px] text-slate-500 text-right flex-shrink-0">{((v.spend / totalSpend) * 100).toFixed(0)}%</div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Savings opportunities */}
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">APEX Savings Opportunities</h3>
                <Badge variant="success">${((savingsOpps.reduce((s, o) => s + o.annualSavings, 0)) / 1000).toFixed(0)}k potential</Badge>
              </div>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {savingsOpps.map((o, i) => (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-xs font-medium text-slate-800 flex-1">{o.opp}</div>
                    <Badge variant={o.confidence === 'High' ? 'success' : 'info'}>{o.confidence}</Badge>
                  </div>
                  <div className="text-sm font-bold text-green-600">${o.annualSavings.toLocaleString()}/yr potential</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <Button size="sm" variant="navy" className="w-full" onClick={() => showToast('Savings opportunity summary sent to Alex for review', 'success')}>
                Send to Ops Lead for Review
              </Button>
            </div>
          </Card>

          {/* Seasonal procurement timing */}
          <Card className="mt-4">
            <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Seasonal Procurement Pattern</h3></CardHeader>
            <CardBody className="pb-3">
              <div className="text-xs text-slate-600 mb-3">APEX recommendation: Pre-buy snow-line inventory in Aug to avoid Oct–Nov peak pricing surges</div>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={monthlyTotals} margin={{ top: 2, right: 8, bottom: 0, left: -20 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Total']} />
                  <Line type="monotone" dataKey="total" stroke="#1B4D80" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
