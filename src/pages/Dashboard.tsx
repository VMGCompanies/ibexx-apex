import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, BarChart, Bar, Cell,
} from 'recharts';
import {
  PackageSearch, ShoppingCart, Truck, PackageCheck, CreditCard,
  BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Zap, Play, ChevronRight, Activity, ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import {
  alerts, purchaseOrders, inventory, vendors, pipelineStages,
  apAging, monthlySpendData, auditTrail,
} from '../data/mockData';

// ─── KPI CARD ────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, icon: Icon, color, alert: isAlert }: any) => (
  <Card>
    <CardBody className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        {sub && <div className={`text-xs mt-1 font-medium ${isAlert ? 'text-red-600' : 'text-slate-400'}`}>{sub}</div>}
      </div>
    </CardBody>
  </Card>
);

// ─── WORKFLOW CARD ───────────────────────────────────────────────────────────
const WorkflowCard = ({ name, icon: Icon, desc, to, confidence, onRun }: any) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-slate-800">{name}</div>
      <div className="text-[10px] text-slate-400 truncate">{desc}</div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[10px] text-slate-400">{confidence}%</span>
      <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        Idle
      </div>
      <button
        onClick={onRun}
        className="inline-flex items-center gap-1 px-2 py-1 bg-apex-600 hover:bg-apex-700 text-white text-[10px] font-semibold rounded transition-colors"
      >
        <Play size={9} fill="currentColor" /> Run
      </button>
    </div>
  </div>
);

// ─── PIPELINE STAGE BAR ──────────────────────────────────────────────────────
const PipelineBar = ({ stage, count, value, maxCount }: any) => (
  <div className="flex items-center gap-3 py-1.5">
    <div className="w-28 text-[10px] text-slate-500 truncate flex-shrink-0">{stage}</div>
    <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden relative">
      <div
        className="h-full bg-apex-600 rounded transition-all"
        style={{ width: `${Math.max((count / maxCount) * 100, 4)}%` }}
      />
      <span className="absolute left-2 top-0 h-full flex items-center text-[10px] font-semibold text-white mix-blend-difference">
        {count}
      </span>
    </div>
    <div className="w-18 text-[10px] text-slate-500 text-right flex-shrink-0">${value.toLocaleString()}</div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();

  const openPOs    = purchaseOrders.filter(p => p.status !== 'Received').length;
  const p1Alerts   = alerts.filter(a => a.priority === 'P1').length;
  const stockouts  = inventory.filter(i => i.status === 'Stockout').length;
  const criticals  = inventory.filter(i => i.status === 'Critical Reorder').length;
  const spendMTD   = purchaseOrders.filter(p => p.issued.startsWith('2026-03')).reduce((s, p) => s + p.totalValue, 0);
  const maxPipeline = Math.max(...pipelineStages.map(s => s.count));

  // last 6 months spend for mini chart
  const recentSpend = monthlySpendData.slice(6).map(d => ({
    month: d.month,
    total: d.canAm + d.polarisDirt + d.skiDoo + d.polarisSnow + d.arcticCat + d.yamaha,
  }));

  return (
    <div className="p-6 space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">APEX Operations Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Week of March 23, 2026 — All 7 Procurement Workflows Active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-apex-50 border border-apex-200 rounded-lg px-3 py-1.5">
            <div className="w-2 h-2 bg-apex-500 rounded-full pulse-dot" />
            <span className="text-xs font-semibold text-apex-700">APEX Standby</span>
          </div>
          <Button variant="blue" size="sm" onClick={() => showToast('APEX Full Cycle triggered — demand scan initiated', 'success')}>
            <Zap size={13} /> Trigger Full Cycle
          </Button>
        </div>
      </div>

      {/* ── Panel 1: KPI Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Open POs" value={openPOs} sub={`$${(purchaseOrders.filter(p => p.status !== 'Received').reduce((s, p) => s + p.totalValue, 0) / 1000).toFixed(0)}k open commitment`} icon={ShoppingCart} color="bg-slate-900" />
        <KpiCard label="P1 Alerts" value={p1Alerts} sub={`${p1Alerts} require immediate action`} icon={AlertTriangle} color="bg-red-600" alert />
        <KpiCard label="Stockout SKUs" value={stockouts} sub={`+${criticals} critical reorder`} icon={PackageSearch} color="bg-red-500" alert />
        <KpiCard label="Spend MTD" value={`$${(spendMTD / 1000).toFixed(0)}k`} sub="Mar 2026 PO issuance" icon={TrendingUp} color="bg-apex-600" />
        <KpiCard label="AP Queue" value="5" sub="2 exceptions held" icon={CreditCard} color="bg-amber-500" alert />
        <KpiCard label="Vendor Watch" value="2" sub="WPS + Gates Unitta" icon={BarChart3} color="bg-yellow-600" alert />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* ── Panel 2: Procurement Pipeline ──────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Procurement Pipeline</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Items & value at each stage</p>
                </div>
                <Badge variant="blue">Live</Badge>
              </div>
            </CardHeader>
            <CardBody className="space-y-0.5">
              {pipelineStages.map(s => (
                <PipelineBar key={s.stage} {...s} maxCount={maxPipeline} />
              ))}
            </CardBody>
          </Card>
        </div>

        {/* ── Panel 4: Open POs ───────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Open Purchase Orders</h3>
                <button onClick={() => navigate('/order-tracking')} className="text-xs text-apex-600 hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
              </div>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {purchaseOrders.filter(p => p.status !== 'Received').map(po => (
                <div key={po.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">{po.id}</span>
                      <span className="text-xs text-slate-500">{po.vendor}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{po.items} items · ${po.totalValue.toLocaleString()} · Due {po.expectedDelivery}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {po.lateRisk && <Badge variant="danger">Late Risk</Badge>}
                    <Badge variant={
                      po.status === 'In-Transit' ? 'info' :
                      po.status === 'Overdue' ? 'danger' :
                      po.ackStatus === 'Overdue' ? 'warning' : 'neutral'
                    }>
                      {po.status === 'Issued-Pending Ack' ? po.ackStatus + ' Ack' : po.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* ── Panel 3: Inventory Health ───────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Inventory Health</h3>
                <button onClick={() => navigate('/demand-planning')} className="text-xs text-apex-600 hover:underline flex items-center gap-1">Full view <ChevronRight size={12} /></button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {/* Summary pills */}
              <div className="px-5 pt-3 pb-3 grid grid-cols-2 gap-2">
                {[
                  { label: 'Healthy', count: inventory.filter(i => i.status === 'Healthy').length, cls: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'Reorder', count: inventory.filter(i => i.status === 'Reorder Required').length, cls: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                  { label: 'Critical', count: criticals, cls: 'bg-orange-50 border-orange-200 text-orange-700' },
                  { label: 'Stockout', count: stockouts, cls: 'bg-red-50 border-red-200 text-red-700' },
                ].map(s => (
                  <div key={s.label} className={`border rounded px-3 py-2 text-center ${s.cls}`}>
                    <div className="text-lg font-bold">{s.count}</div>
                    <div className="text-[10px] font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="divide-y divide-slate-100">
                {inventory.filter(i => i.status !== 'Healthy').slice(0, 6).map(item => (
                  <div key={item.sku} className="px-5 py-2.5 flex items-center gap-2 hover:bg-slate-50">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.status === 'Stockout' ? 'bg-red-500' :
                      item.status === 'Critical Reorder' ? 'bg-orange-500' : 'bg-yellow-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-slate-700 truncate">{item.desc}</div>
                      <div className="text-[9px] text-slate-400">{item.line} · {item.onHand} on-hand</div>
                    </div>
                    <Badge variant={item.status === 'Stockout' ? 'danger' : item.status === 'Critical Reorder' ? 'orange' : 'warning'}>
                      {item.status === 'Stockout' ? 'OUT' : item.status === 'Critical Reorder' ? 'CRIT' : 'ROP'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Panel 7: Active Alerts ──────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Active Alerts</h3>
                <Badge variant="danger">{alerts.length} Open</Badge>
              </div>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {alerts.map(a => (
                <div key={a.id} className="px-5 py-3 flex items-start gap-2 hover:bg-slate-50 cursor-pointer">
                  <AlertTriangle size={13} className={`mt-0.5 flex-shrink-0 ${a.priority === 'P1' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge variant={a.priority === 'P1' ? 'danger' : 'warning'}>{a.priority}</Badge>
                      <span className="text-[10px] text-slate-400">{a.workflow}</span>
                    </div>
                    <div className="text-[10px] text-slate-700 leading-snug line-clamp-2">{a.issue}</div>
                    <div className="text-[9px] text-slate-400 mt-1">Open {a.timeOpen} · {a.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Panel 5: AP Queue ───────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">AP Queue</h3>
                <button onClick={() => navigate('/ap-pipeline')} className="text-xs text-apex-600 hover:underline flex items-center gap-1">Details <ChevronRight size={12} /></button>
              </div>
            </CardHeader>
            <CardBody>
              {/* Status breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Pending Match', count: 2, color: 'text-slate-600' },
                  { label: 'Approved', count: 1, color: 'text-green-600' },
                  { label: 'Exceptions', count: 2, color: 'text-red-600' },
                ].map(s => (
                  <div key={s.label} className="text-center bg-slate-50 rounded p-2">
                    <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
                    <div className="text-[9px] text-slate-500 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* AP Aging */}
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">AP Aging</div>
              {apAging.map(a => (
                <div key={a.bucket} className="flex items-center gap-2 mb-1.5">
                  <div className="w-20 text-[10px] text-slate-500 flex-shrink-0">{a.bucket}</div>
                  <div className="flex-1 h-3 bg-slate-100 rounded overflow-hidden">
                    <div
                      className={`h-full rounded ${a.pct > 20 && a.bucket !== '0–30 days' ? 'bg-red-400' : 'bg-apex-500'}`}
                      style={{ width: `${a.pct}%` }}
                    />
                  </div>
                  <div className="w-14 text-[10px] text-slate-500 text-right">${(a.amount / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* ── Panel 8: Spend Intelligence ─────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Spend Intelligence — Rolling 6 Months by Product Line</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Oct 2025 – Mar 2026</p>
                </div>
                <Badge variant="blue">Seasonal Pattern Visible</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlySpendData.slice(6)} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                  <defs>
                    {[
                      { id: 'gCA', color: '#3b82f6' },
                      { id: 'gPD', color: '#f97316' },
                      { id: 'gSD', color: '#8b5cf6' },
                      { id: 'gPS', color: '#10b981' },
                      { id: 'gAC', color: '#f59e0b' },
                      { id: 'gYM', color: '#ef4444' },
                    ].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={g.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="canAm"       name="Can-Am Dirt"    stroke="#3b82f6" fill="url(#gCA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="polarisDirt" name="Polaris Dirt"   stroke="#f97316" fill="url(#gPD)" strokeWidth={2} />
                  <Area type="monotone" dataKey="skiDoo"      name="Ski-Doo Snow"   stroke="#8b5cf6" fill="url(#gSD)" strokeWidth={2} />
                  <Area type="monotone" dataKey="polarisSnow" name="Polaris Snow"   stroke="#10b981" fill="url(#gPS)" strokeWidth={2} />
                  <Area type="monotone" dataKey="arcticCat"   name="Arctic Cat"     stroke="#f59e0b" fill="url(#gAC)" strokeWidth={2} />
                  <Area type="monotone" dataKey="yamaha"      name="Yamaha Snow"    stroke="#ef4444" fill="url(#gYM)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* ── Panel 6: Vendor Scorecard ───────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Vendor Scorecard</h3>
                <button onClick={() => navigate('/vendor-performance')} className="text-xs text-apex-600 hover:underline flex items-center gap-1">Full <ChevronRight size={12} /></button>
              </div>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {vendors.map(v => {
                const TrendIcon = v.onTimeRate >= 92 ? ArrowUpRight : v.onTimeRate >= 87 ? Minus : ArrowDownRight;
                const trendColor = v.onTimeRate >= 92 ? 'text-green-500' : v.onTimeRate >= 87 ? 'text-slate-400' : 'text-red-500';
                return (
                  <div key={v.id} className="px-5 py-2.5 flex items-center gap-2 hover:bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{v.name}</div>
                      <div className="text-[10px] text-slate-400">OTD {v.onTimeRate}% · Fill {v.fillRate}%</div>
                    </div>
                    <TrendIcon size={13} className={trendColor} />
                    <Badge variant={
                      v.classification === 'Preferred' ? 'success' :
                      v.classification === 'Approved'  ? 'info' :
                      v.classification === 'Watch'     ? 'warning' : 'danger'
                    }>
                      {v.classification}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Activity Feed ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">APEX Activity Feed</h3>
            <Badge variant="neutral">{auditTrail.length} events today</Badge>
          </div>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {auditTrail.slice(0, 7).map(a => (
            <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                a.status === 'Escalated' ? 'bg-red-500' :
                a.status === 'In Progress' ? 'bg-apex-500' : 'bg-green-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">{a.workflow}</span>
                  <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                </div>
                <div className="text-xs text-slate-600">{a.action}</div>
              </div>
              <Badge variant={a.status === 'Escalated' ? 'danger' : a.status === 'In Progress' ? 'blue' : 'success'}>
                {a.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
