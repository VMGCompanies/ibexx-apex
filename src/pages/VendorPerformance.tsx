import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { vendors, vendorTrends } from '../data/mockData';

const classVariant = (c: string) => {
  if (c === 'Preferred') return 'success';
  if (c === 'Approved')  return 'info';
  if (c === 'Watch')     return 'warning';
  return 'danger';
};

const trendIcon = (rate: number) => {
  if (rate >= 92) return <TrendingUp size={14} className="text-green-500" />;
  if (rate >= 87) return <Minus size={14} className="text-slate-400" />;
  return <TrendingDown size={14} className="text-red-500" />;
};

const scorebarColor = (val: number) =>
  val >= 95 ? 'bg-green-500' : val >= 88 ? 'bg-yellow-400' : 'bg-red-500';

export const VendorPerformance = () => {
  const [selectedId, setSelectedId] = useState<string>('V-001');
  const selected = vendors.find(v => v.id === selectedId)!;
  const trend = vendorTrends.find(t => t.vendor === selected.name.split(' ').slice(0, 2).join(' '));

  const radarData = [
    { metric: 'On-Time Delivery', value: selected.onTimeRate },
    { metric: 'Fill Rate', value: selected.fillRate },
    { metric: 'Invoice Accuracy', value: selected.invoiceAccuracy },
    { metric: 'Price Compliance', value: selected.invoiceAccuracy },
    { metric: 'Quality', value: 100 - (100 - selected.fillRate) * 0.5 },
  ];

  const quarterlyData = trend ? [
    { quarter: 'Q2 2025', score: trend.q1 },
    { quarter: 'Q3 2025', score: trend.q2 },
    { quarter: 'Q4 2025', score: trend.q3 },
    { quarter: 'Q1 2026', score: trend.q4 },
  ] : [];

  const watchVendors = vendors.filter(v => v.classification === 'Watch');

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">WF6 — Vendor Performance Management</h1>
          </div>
          <p className="text-sm text-slate-500">Monthly automated scorecard · Real-time reclassification alerts · Relationship health monitoring</p>
        </div>
        <Button variant="navy" size="sm" onClick={() => showToast('Monthly vendor scorecards regenerated and delivered', 'success')}>
          Run Scorecard Cycle
        </Button>
      </div>

      {/* Watch alerts */}
      {watchVendors.length > 0 && (
        <div className="space-y-2">
          {watchVendors.map(v => (
            <div key={v.id} className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-semibold text-amber-800">[P3] Vendor Watch Classification — {v.name}</span>
                <span className="text-amber-700 ml-2">OTD {v.onTimeRate}% (target &gt;92%) · Fill {v.fillRate}% (target &gt;95%) — declining trend</span>
              </div>
              <Badge variant="warning">Watch</Badge>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* Vendor list */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 text-sm">Vendor Roster</h3>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {vendors.map(v => {
                const trendScore = vendorTrends.find(t => t.vendor.includes(v.name.split(' ')[0]));
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    className={`px-5 py-3 hover:bg-slate-50 cursor-pointer ${selectedId === v.id ? 'bg-apex-50 border-l-2 border-l-apex-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800">{v.name}</span>
                      <div className="flex items-center gap-1">
                        {trendIcon(v.onTimeRate)}
                        <Badge variant={classVariant(v.classification)}>{v.classification}</Badge>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">{v.category} · Lead {v.leadDays}d · {v.payTerms}</div>
                    <div className="flex gap-3 mt-1.5">
                      {[
                        { label: 'OTD', value: v.onTimeRate },
                        { label: 'Fill', value: v.fillRate },
                        { label: 'Inv', value: v.invoiceAccuracy },
                      ].map(m => (
                        <div key={m.label} className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] text-slate-400">{m.label}</span>
                            <span className={`text-[9px] font-semibold ${m.value >= 95 ? 'text-green-600' : m.value >= 88 ? 'text-yellow-600' : 'text-red-600'}`}>{m.value}%</span>
                          </div>
                          <div className="h-1 bg-slate-200 rounded overflow-hidden">
                            <div className={`h-full rounded ${scorebarColor(m.value)}`} style={{ width: `${m.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Detail */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{selected.name} — Performance Scorecard</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selected.category} · {selected.payTerms} · Lead {selected.leadDays} days</p>
                </div>
                <Badge variant={classVariant(selected.classification)}>{selected.classification}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-6">
                {/* KPI metrics */}
                <div className="space-y-3">
                  {[
                    { label: 'On-Time Delivery Rate', value: selected.onTimeRate, target: 92 },
                    { label: 'Fill Rate', value: selected.fillRate, target: 95 },
                    { label: 'Invoice Accuracy', value: selected.invoiceAccuracy, target: 98 },
                    { label: 'YTD Spend', value: null, raw: `$${selected.ytdSpend.toLocaleString()}`, target: null },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">{m.label}</span>
                        {m.value !== null ? (
                          <span className={`text-sm font-bold ${m.value >= (m.target ?? 95) ? 'text-green-600' : m.value >= (m.target ?? 95) - 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {m.value}%
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-slate-700">{m.raw}</span>
                        )}
                      </div>
                      {m.value !== null && (
                        <div className="h-2 bg-slate-100 rounded overflow-hidden">
                          <div
                            className={`h-full rounded ${scorebarColor(m.value)}`}
                            style={{ width: `${m.value}%` }}
                          />
                        </div>
                      )}
                      {m.target && <div className="text-[9px] text-slate-400 mt-0.5">Target: {m.target}%</div>}
                    </div>
                  ))}
                </div>

                {/* Radar */}
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Performance Profile</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                      <Radar dataKey="value" stroke="#1B4D80" fill="#1B4D80" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quarterly trend */}
          {quarterlyData.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">Composite Score Trend — Q2 2025 → Q1 2026</h3>
                  <Badge variant={
                    (trend?.trend ?? '') === 'improving' ? 'success' :
                    (trend?.trend ?? '') === 'stable'    ? 'info' : 'warning'
                  }>
                    {trend?.trend === 'improving' ? '↑ Improving' : trend?.trend === 'declining' ? '↓ Declining' : '→ Stable'}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={quarterlyData} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis domain={[75, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: any) => [`${v}%`, 'Score']} />
                    <Line type="monotone" dataKey="score" stroke="#1B4D80" strokeWidth={2.5} dot={{ fill: '#1B4D80', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          )}

          {/* Classification rules */}
          <Card>
            <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Classification Thresholds</h3></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { tier: 'Preferred', color: 'bg-green-100 border-green-300 text-green-800', desc: 'OTD ≥95% · Fill ≥97% · Inv Accuracy ≥98% · No active disputes' },
                  { tier: 'Approved', color: 'bg-blue-100 border-blue-300 text-blue-800', desc: 'OTD ≥90% · Fill ≥93% · Inv Accuracy ≥95% · Standard performance' },
                  { tier: 'Watch', color: 'bg-amber-100 border-amber-300 text-amber-800', desc: 'OTD 85–90% or Fill 88–93% — declining trend; monitor closely' },
                  { tier: 'At-Risk', color: 'bg-red-100 border-red-300 text-red-800', desc: 'OTD &lt;85% or Fill &lt;88% — new PO issuance held; human review required' },
                ].map(t => (
                  <div key={t.tier} className={`border rounded-lg p-3 ${t.color}`}>
                    <div className="font-bold mb-1">{t.tier}</div>
                    <div className="opacity-80 leading-snug">{t.desc}</div>
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
