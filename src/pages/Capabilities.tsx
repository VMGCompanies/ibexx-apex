import React, { useState } from 'react';
import {
  PackageSearch, Building2, ShoppingCart, PackageCheck,
  CreditCard, TrendingUp, BarChart2, GitBranch,
  ChevronDown, ChevronRight, CheckCircle, AlertCircle,
  Clock, Shield, Zap
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// ─── Types ────────────────────────────────────────────────────────────────────
type Autonomy = 'full' | 'gated' | 'flags' | 'assisted';

interface Fn {
  name: string;
  detail: string;
  autonomy: Autonomy;
}

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;           // Tailwind bg for icon wrapper
  textColor: string;       // Tailwind text for category header
  functions: Fn[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: 'demand',
    label: 'Demand & Inventory Intelligence',
    icon: PackageSearch,
    color: 'bg-apex-100',
    textColor: 'text-apex-800',
    functions: [
      { name: 'Real-time SKU-level inventory monitoring',              detail: 'Continuous polling across all warehouse locations — updates every cycle.',                                                  autonomy: 'full'      },
      { name: 'Dynamic reorder point calculation',                     detail: 'Adjusts automatically based on 90-day rolling velocity + seasonal multiplier.',                                              autonomy: 'full'      },
      { name: 'Safety stock optimization',                             detail: 'Uses lead time variability and demand variance to set minimum floor quantities per SKU.',                                    autonomy: 'full'      },
      { name: 'Stockout prediction',                                   detail: 'Flags risk before it happens — models days-of-supply against forecast demand.',                                              autonomy: 'full'      },
      { name: 'Overstock detection',                                   detail: 'Identifies slow-moving inventory tying up cash; flags for liquidation review.',                                              autonomy: 'flags'     },
      { name: 'BOM explosion for kit SKUs',                            detail: 'Translates finished goods demand into component-level procurement need automatically.',                                     autonomy: 'full'      },
      { name: 'Seasonal demand forecasting',                           detail: 'Adjusts planning horizons for UTV April–Sept and Snow Oct–Feb cycles automatically.',                                       autonomy: 'full'      },
      { name: 'Dead inventory identification',                         detail: 'Flags SKUs with zero velocity over configurable window; routes disposition decision to human.',                             autonomy: 'flags'     },
      { name: 'New product launch demand planning',                    detail: 'Builds initial procurement model for new kit SKUs from analogous product history.',                                         autonomy: 'assisted'  },
      { name: 'Demand signal aggregation',                             detail: 'Combines Shopify sales, dealer wholesale orders, and backorder data into one unified demand picture.',                      autonomy: 'full'      },
    ],
  },
  {
    id: 'vendor',
    label: 'Vendor Management',
    icon: Building2,
    color: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    functions: [
      { name: 'Approved vendor list maintenance',                      detail: 'Keeps records current; flags expired certifications, contacts, or terms needing refresh.',                                  autonomy: 'flags'     },
      { name: 'Vendor performance scoring',                            detail: 'OTD, fill rate, invoice accuracy, quality returns — calculated continuously after every PO cycle.',                         autonomy: 'full'      },
      { name: 'Vendor risk monitoring',                                detail: 'Flags over-reliance on single-source suppliers and concentration risk in spend.',                                           autonomy: 'flags'     },
      { name: 'Vendor reclassification alerts',                        detail: 'Auto-downgrades Preferred → Watch → At-Risk based on trailing performance trends.',                                        autonomy: 'full'      },
      { name: 'Price benchmarking',                                    detail: 'Compares current vendor pricing against historical baseline and market signals.',                                            autonomy: 'full'      },
      { name: 'Price increase detection',                              detail: 'Flags when a vendor invoices above PO-agreed price; classifies variance severity.',                                        autonomy: 'flags'     },
      { name: 'Contract expiration tracking',                          detail: 'Alerts before vendor agreements lapse — configurable lead time window.',                                                    autonomy: 'flags'     },
      { name: 'Vendor contact management',                             detail: 'Keeps primary and backup contacts current; flags stale records.',                                                           autonomy: 'full'      },
      { name: 'Spend concentration analysis',                          detail: 'Flags when top-5 vendor concentration exceeds threshold (single-source risk).',                                            autonomy: 'flags'     },
      { name: 'Alternate vendor identification',                       detail: 'When primary vendor is at-risk, surfaces qualified alternates from vendor master automatically.',                           autonomy: 'full'      },
    ],
  },
  {
    id: 'po',
    label: 'Purchase Order Management',
    icon: ShoppingCart,
    color: 'bg-brand-100',
    textColor: 'text-brand-800',
    functions: [
      { name: 'Purchase requisition generation',                       detail: 'Creates draft POs from approved demand list with full line-item detail.',                                                   autonomy: 'full'      },
      { name: 'PO pre-issuance validation',                            detail: 'Confirms approved vendor, no duplicate, price in range, delivery feasible — before any transmission.',                     autonomy: 'full'      },
      { name: 'PO transmission to vendors',                            detail: 'Issues POs via EDI, email, or vendor portal for orders within autonomous threshold.',                                      autonomy: 'full'      },
      { name: 'PO acknowledgment monitoring',                          detail: 'Tracks whether vendor confirmed receipt within configurable SLA window (default 48 business hours).',                      autonomy: 'full'      },
      { name: 'Automated acknowledgment follow-up',                    detail: 'Sends vendor reminders at SLA breach; escalates if no response within secondary window.',                                  autonomy: 'full'      },
      { name: 'Delivery date tracking',                                detail: 'Monitors confirmed ship dates against requested dates across all open POs.',                                                autonomy: 'full'      },
      { name: 'At-risk delivery alerts',                               detail: 'Flags POs where confirmed delivery will miss requested date with SKU impact analysis.',                                    autonomy: 'flags'     },
      { name: 'Overdue PO escalation',                                 detail: 'Flags POs past expected delivery with no update; routes to human with recommended action.',                               autonomy: 'flags'     },
      { name: 'Open PO register maintenance',                          detail: 'Running ledger of all open commitments updated in real-time after every event.',                                           autonomy: 'full'      },
      { name: 'PO amendment drafting',                                 detail: 'Prepares amendment documents for human approval when scope or quantity changes.',                                          autonomy: 'gated'     },
      { name: 'PO closure (fully received)',                           detail: 'Closes fully received and reconciled PO lines automatically; holds open lines for balances.',                              autonomy: 'full'      },
      { name: 'Rush/expedite request generation',                      detail: 'Drafts expedite requests with full justification when stockout risk requires accelerated fulfillment.',                    autonomy: 'flags'     },
      { name: 'Total open commitment tracking',                        detail: 'Real-time dollar value of all outstanding POs summed and broken out by vendor and product line.',                         autonomy: 'full'      },
    ],
  },
  {
    id: 'receiving',
    label: 'Receiving & Reconciliation',
    icon: PackageCheck,
    color: 'bg-green-100',
    textColor: 'text-green-800',
    functions: [
      { name: 'Three-way match automation',                            detail: 'PO vs. receiving record vs. vendor invoice — fully automated on every inbound shipment.',                                  autonomy: 'full'      },
      { name: 'Quantity variance detection',                           detail: 'Flags when received quantity differs from PO quantity; holds invoice pending resolution.',                                 autonomy: 'flags'     },
      { name: 'Price variance detection',                              detail: 'Flags when invoiced unit price exceeds PO agreed price outside tolerance band.',                                           autonomy: 'flags'     },
      { name: 'Short shipment handling',                               detail: 'Keeps PO open for balance, notifies vendor, updates in-transit tracking automatically.',                                  autonomy: 'full'      },
      { name: 'Over-shipment flagging',                                detail: 'Identifies when vendor shipped more than ordered; routes disposition to human.',                                           autonomy: 'gated'     },
      { name: 'SKU / part number mismatch detection',                  detail: 'Catches wrong items received against a PO and routes immediately to P1 escalation.',                                      autonomy: 'flags'     },
      { name: 'Receiving data validation',                             detail: 'Cross-checks warehouse receiving records against system entries for accuracy and completeness.',                           autonomy: 'full'      },
      { name: 'Lot number and batch tracking',                         detail: 'Records lot data against received inventory for quality traceability at SKU level.',                                       autonomy: 'full'      },
      { name: 'Condition exception flagging',                          detail: 'Escalates receiving notes indicating damaged or non-conforming goods before put-away.',                                    autonomy: 'flags'     },
      { name: 'Inventory update on receipt',                           detail: 'Moves quantities from in-transit to on-hand upon confirmed receiving; triggers replenishment recalculation.',             autonomy: 'full'      },
    ],
  },
  {
    id: 'ap',
    label: 'Accounts Payable Integration',
    icon: CreditCard,
    color: 'bg-amber-100',
    textColor: 'text-amber-800',
    functions: [
      { name: 'Invoice intake and capture',                            detail: 'Processes invoices from email, EDI, or upload queue into structured records.',                                            autonomy: 'full'      },
      { name: 'Duplicate invoice detection',                           detail: 'Catches same vendor + invoice number + amount submitted more than once.',                                                  autonomy: 'full'      },
      { name: 'GL coding automation',                                  detail: 'Maps invoiced items to correct expense accounts and cost centers per Ibexx chart of accounts.',                           autonomy: 'full'      },
      { name: 'Payment terms calculation',                             detail: 'Calculates exact due date per vendor terms (Net 15, Net 30, Net 45) from invoice date.',                                  autonomy: 'full'      },
      { name: 'Early payment discount identification',                 detail: 'Flags 2/10 Net 30 type opportunities with ROI calculation and savings dollar amount.',                                    autonomy: 'flags'     },
      { name: 'Payment queue management',                              detail: 'Sorts approved invoices by due date for optimized payment run sequencing.',                                               autonomy: 'full'      },
      { name: 'Weekly payment schedule generation',                    detail: 'Delivers prioritized payment list to human for final authorization — human retains payment authority.',                   autonomy: 'gated'     },
      { name: 'AP aging monitoring',                                   detail: 'Tracks 0-30 · 31-60 · 61-90 · 90+ day buckets per vendor continuously.',                                                autonomy: 'full'      },
      { name: 'AP aging alerts',                                       detail: 'Escalates invoices approaching or past 90 days that are held for dispute.',                                               autonomy: 'flags'     },
      { name: 'Unauthorized invoice detection',                        detail: 'Flags invoices with no corresponding open PO as P1 — holds for human review before any payment.',                        autonomy: 'flags'     },
      { name: 'AP sub-ledger reconciliation',                          detail: 'Monthly reconciliation against GL; produces variance report for finance review.',                                         autonomy: 'full'      },
      { name: 'Vendor payment history tracking',                       detail: 'Maintains running record of payment dates and amounts per vendor for relationship health.',                               autonomy: 'full'      },
      { name: 'Cash flow impact forecasting',                          detail: 'Aggregates upcoming payment obligations against available cash position; flags liquidity risk.',                          autonomy: 'flags'     },
    ],
  },
  {
    id: 'spend',
    label: 'Spend Analysis & Cost Intelligence',
    icon: TrendingUp,
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    functions: [
      { name: 'Total spend aggregation',                               detail: 'By vendor, category, product line, and time period — updated after every AP transaction.',                               autonomy: 'full'      },
      { name: 'Spend trend analysis',                                  detail: 'Month-over-month and year-over-year cost movement by category and product line.',                                         autonomy: 'full'      },
      { name: 'Cost-per-unit calculation',                             detail: 'Fully-loaded component cost per finished kit SKU incorporating all procurement costs.',                                   autonomy: 'full'      },
      { name: 'Price increase event detection',                        detail: 'Flags when unit costs exceed configurable threshold vs. prior period (default >5%).',                                     autonomy: 'flags'     },
      { name: 'Volume consolidation opportunity identification',        detail: 'Where splitting orders across vendors could be consolidated with primary vendor for better pricing.',                    autonomy: 'flags'     },
      { name: 'Seasonal procurement timing analysis',                  detail: 'Identifies whether Ibexx is buying at optimal vs. peak demand pricing windows.',                                         autonomy: 'full'      },
      { name: 'Savings opportunity reporting',                         detail: 'Surfaces actionable cost reduction opportunities with estimated dollar impact each quarter.',                             autonomy: 'full'      },
      { name: 'Budget vs. actual tracking',                            detail: 'Compares procurement spend against budgeted figures; flags overruns by category.',                                       autonomy: 'flags'     },
      { name: 'Procurement cost forecasting',                          detail: 'Forward-looking cost estimates based on vendor pricing trends and planned volume.',                                       autonomy: 'assisted'  },
      { name: 'Maverick spend detection',                              detail: 'Identifies purchases made outside approved vendor list or PO process.',                                                   autonomy: 'flags'     },
    ],
  },
  {
    id: 'reporting',
    label: 'Reporting & Communication',
    icon: BarChart2,
    color: 'bg-slate-100',
    textColor: 'text-slate-700',
    functions: [
      { name: 'Automated procurement dashboard',                       detail: 'Real-time display of all KPIs, pipeline status, open alerts — always current.',                                         autonomy: 'full'      },
      { name: 'Daily procurement summary',                             detail: 'Digest of prior-day activity delivered to human operator each morning.',                                                  autonomy: 'full'      },
      { name: 'Weekly PO status report',                               detail: 'All open POs with delivery status and risk flags, auto-generated every Monday.',                                         autonomy: 'full'      },
      { name: 'Monthly vendor scorecard',                              detail: 'Performance ratings for all active vendors delivered on schedule.',                                                       autonomy: 'full'      },
      { name: 'Quarterly spend analysis report',                       detail: 'Comprehensive cost intelligence package with trend analysis and savings opportunities.',                                  autonomy: 'full'      },
      { name: 'Exception reports',                                     detail: 'Real-time flagging of any anomaly requiring human attention — delivered immediately.',                                   autonomy: 'full'      },
      { name: 'Escalation notifications',                              detail: 'Structured P1/P2/P3 alerts via email, SMS, or in-platform with context and recommended action.',                        autonomy: 'full'      },
      { name: 'Audit trail reporting',                                 detail: 'Full log of every action, decision, and exception — queryable at any time, retained 7 years.',                          autonomy: 'full'      },
      { name: 'Board/leadership summary generation',                   detail: 'High-level procurement metrics formatted for executive review on demand.',                                               autonomy: 'full'      },
      { name: 'Custom on-demand reports',                              detail: 'Human operator can request any slice of procurement data in natural language.',                                           autonomy: 'assisted'  },
    ],
  },
  {
    id: 'orchestration',
    label: 'Workflow Orchestration & Process Intelligence',
    icon: GitBranch,
    color: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    functions: [
      { name: 'End-to-end workflow sequencing',                        detail: 'Triggers downstream steps automatically when upstream steps complete — no human hand-off required.',                    autonomy: 'full'      },
      { name: 'Multi-pipeline coordination',                           detail: 'Reads from inventory, sales, AP, and vendor systems simultaneously for unified decisions.',                              autonomy: 'full'      },
      { name: 'Conflict resolution logic',                             detail: 'When two data sources disagree, applies conservative default and flags for human review.',                               autonomy: 'flags'     },
      { name: 'Threshold-based decision routing',                      detail: 'Knows which decisions to make autonomously vs. escalate based on configured rules.',                                    autonomy: 'full'      },
      { name: 'Workflow state persistence',                            detail: 'If paused or stopped mid-process, resumes from exact last completed step with no data loss.',                           autonomy: 'full'      },
      { name: 'Process exception handling',                            detail: 'When a step fails, logs it, classifies severity, and routes to correct resolution path.',                               autonomy: 'full'      },
      { name: 'Parallel task execution',                               detail: 'Runs multiple non-dependent workflow tasks simultaneously (e.g., 30 open POs + 12 invoices + demand analysis).',       autonomy: 'full'      },
      { name: 'Workflow history and replay',                           detail: 'Can reconstruct exactly what happened in any prior procurement cycle step by step.',                                     autonomy: 'full'      },
    ],
  },
];

// ─── Autonomy config ───────────────────────────────────────────────────────────
const AUTONOMY_CONFIG: Record<Autonomy, { label: string; badge: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }> = {
  full:     { label: 'Fully Autonomous',  badge: 'success',  icon: CheckCircle,  desc: 'APEX executes without human input' },
  gated:    { label: 'Human-Gated',       badge: 'warning',  icon: Shield,       desc: 'AI prepares; human authorizes'      },
  flags:    { label: 'Flags & Escalates', badge: 'orange',   icon: AlertCircle,  desc: 'AI detects; human resolves'         },
  assisted: { label: 'AI-Assisted',       badge: 'info',     icon: Clock,        desc: 'AI drafts; human refines'           },
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const AutonomyBadge = ({ autonomy }: { autonomy: Autonomy }) => {
  const cfg = AUTONOMY_CONFIG[autonomy];
  return <Badge variant={cfg.badge as any}>{cfg.label}</Badge>;
};

const CategorySection = ({ cat }: { cat: Category }) => {
  const [open, setOpen] = useState(true);
  const Icon = cat.icon;
  const fullCount     = cat.functions.filter(f => f.autonomy === 'full').length;
  const pct           = Math.round((fullCount / cat.functions.length) * 100);

  return (
    <Card>
      {/* Category header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 border-b border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors rounded-t-lg"
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
          <Icon size={17} className={cat.textColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${cat.textColor}`}>{cat.label}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {cat.functions.length} functions · {pct}% fully autonomous
          </div>
        </div>
        {/* Mini progress */}
        <div className="w-24 hidden sm:block">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-slate-400">{pct}% auto</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Badge variant="neutral" className="ml-2 flex-shrink-0">{cat.functions.length}</Badge>
        {open ? <ChevronDown size={15} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={15} className="text-slate-400 flex-shrink-0" />}
      </button>

      {/* Function list */}
      {open && (
        <div className="divide-y divide-slate-50">
          {cat.functions.map((fn, i) => {
            const cfg = AUTONOMY_CONFIG[fn.autonomy];
            const StatusIcon = cfg.icon;
            return (
              <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <StatusIcon
                  size={15}
                  className={`mt-0.5 flex-shrink-0 ${
                    fn.autonomy === 'full'     ? 'text-green-500' :
                    fn.autonomy === 'gated'    ? 'text-amber-500' :
                    fn.autonomy === 'flags'    ? 'text-orange-500' :
                    'text-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 leading-snug">{fn.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{fn.detail}</div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <AutonomyBadge autonomy={fn.autonomy} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const Capabilities = () => {
  const totalFns    = CATEGORIES.reduce((a, c) => a + c.functions.length, 0);
  const fullAuto    = CATEGORIES.reduce((a, c) => a + c.functions.filter(f => f.autonomy === 'full').length, 0);
  const humanGated  = CATEGORIES.reduce((a, c) => a + c.functions.filter(f => f.autonomy === 'gated').length, 0);
  const flagsOnly   = CATEGORIES.reduce((a, c) => a + c.functions.filter(f => f.autonomy === 'flags').length, 0);
  const assisted    = CATEGORIES.reduce((a, c) => a + c.functions.filter(f => f.autonomy === 'assisted').length, 0);
  const autoPct     = Math.round((fullAuto / totalFns) * 100);

  const [filter, setFilter] = useState<Autonomy | 'all'>('all');

  const filteredCats: Category[] = filter === 'all'
    ? CATEGORIES
    : CATEGORIES.map(c => ({ ...c, functions: c.functions.filter(f => f.autonomy === filter) }))
               .filter(c => c.functions.length > 0);

  return (
    <div className="p-6 space-y-6 fade-in">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">APEX Capability Matrix</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {totalFns} automated functions across {CATEGORIES.length} procurement domains
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex-shrink-0">
          <Zap size={15} className="text-green-600" />
          <div className="text-right">
            <div className="text-xl font-bold text-green-700">{autoPct}%</div>
            <div className="text-[10px] text-green-600 uppercase tracking-wider">Fully Autonomous</div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fully Autonomous',  count: fullAuto,   color: 'bg-green-500',  textColor: 'text-green-700',  bgColor: 'bg-green-50',  border: 'border-green-200', desc: 'APEX executes without any human input',          autonomy: 'full'     as Autonomy },
          { label: 'Human-Gated',       count: humanGated, color: 'bg-amber-400',  textColor: 'text-amber-700',  bgColor: 'bg-amber-50',  border: 'border-amber-200', desc: 'AI prepares — human authorizes before execution', autonomy: 'gated'    as Autonomy },
          { label: 'Flags & Escalates', count: flagsOnly,  color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', border: 'border-orange-200',desc: 'AI detects anomalies — human resolves',           autonomy: 'flags'    as Autonomy },
          { label: 'AI-Assisted',       count: assisted,   color: 'bg-blue-500',   textColor: 'text-blue-700',   bgColor: 'bg-blue-50',   border: 'border-blue-200',  desc: 'AI drafts or models — human refines',             autonomy: 'assisted' as Autonomy },
        ].map(kpi => (
          <button
            key={kpi.label}
            onClick={() => setFilter(filter === kpi.autonomy ? 'all' : kpi.autonomy)}
            className={`text-left rounded-lg border p-4 transition-all ${kpi.bgColor} ${kpi.border} ${filter === kpi.autonomy ? 'ring-2 ring-offset-1 ring-apex-500' : 'hover:shadow-sm'}`}
          >
            <div className={`text-3xl font-bold ${kpi.textColor}`}>{kpi.count}</div>
            <div className={`text-xs font-semibold ${kpi.textColor} mt-0.5`}>{kpi.label}</div>
            <div className="text-[10px] text-slate-500 mt-1 leading-snug">{kpi.desc}</div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Legend</span>
        {(Object.entries(AUTONOMY_CONFIG) as [Autonomy, typeof AUTONOMY_CONFIG[Autonomy]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <Icon size={13} className={
                key === 'full' ? 'text-green-500' : key === 'gated' ? 'text-amber-500' : key === 'flags' ? 'text-orange-500' : 'text-blue-500'
              } />
              <span className="text-[11px] text-slate-600 font-medium">{cfg.label}</span>
              <span className="text-[11px] text-slate-400">— {cfg.desc}</span>
            </div>
          );
        })}
        {filter !== 'all' && (
          <button
            onClick={() => setFilter('all')}
            className="ml-auto text-[10px] text-apex-600 font-semibold hover:text-apex-800 transition-colors"
          >
            Clear filter ×
          </button>
        )}
      </div>

      {/* Category sections */}
      <div className="space-y-4">
        {filteredCats.map(cat => (
          <CategorySection key={cat.id} cat={cat} />
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-400">
          All functions execute within APEX's configured authorization matrix. Dollar thresholds and SLA windows set during Neuralogic onboarding.
        </p>
        <p className="text-[10px] text-slate-300 mt-1">APEX — Built exclusively for Ibexx LLC by Neuralogic Group LLC</p>
      </div>
    </div>
  );
};
