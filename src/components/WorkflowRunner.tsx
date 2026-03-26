import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader, AlertTriangle, X, Zap, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  phase: string;
  label: string;
  detail: string;
  status: 'pending' | 'running' | 'complete' | 'flagged';
  delay: number;       // ms after previous step completes
  duration: number;    // ms this step takes to "run"
}

const STEPS: Step[] = [
  // Phase 1 — Demand
  { id: 1,  phase: 'Demand Planning',     label: 'Connecting to inventory management system',                detail: 'Read access confirmed — 18 active SKUs in scope',                                    status: 'pending', delay: 200,  duration: 600  },
  { id: 2,  phase: 'Demand Planning',     label: 'Pulling on-hand inventory — all product lines',           detail: 'Can-Am · Polaris · Ski-Doo · Arctic Cat · Yamaha',                                   status: 'pending', delay: 100,  duration: 900  },
  { id: 3,  phase: 'Demand Planning',     label: 'Calculating dynamic reorder points',                       detail: '90-day rolling velocity + UTV seasonal multiplier ×1.15 applied',                   status: 'pending', delay: 100,  duration: 700  },
  { id: 4,  phase: 'Demand Planning',     label: 'Classifying SKU reorder status',                           detail: '2 Stockouts · 5 Critical · 3 Standard Reorder · 8 Healthy',                         status: 'pending', delay: 100,  duration: 500  },
  { id: 5,  phase: 'Demand Planning',     label: 'Running BOM explosion for kit SKUs',                       detail: 'Component-level inventory checked against finished goods demand',                     status: 'pending', delay: 100,  duration: 800  },
  { id: 6,  phase: 'Demand Planning',     label: 'Cross-referencing open POs — netting inbound inventory',  detail: '6 open POs netted; net procurement requirement calculated',                          status: 'pending', delay: 100,  duration: 600  },
  // Phase 2 — PO Generation
  { id: 7,  phase: 'Purchase Orders',     label: 'Querying approved vendor master',                          detail: '8 vendors active · 2 Watch classification · 0 At-Risk',                             status: 'pending', delay: 300,  duration: 500  },
  { id: 8,  phase: 'Purchase Orders',     label: 'Selecting preferred vendors by demand line',               detail: 'BRP, Tucker, Dayco, Polaris assigned by SKU category',                               status: 'pending', delay: 100,  duration: 700  },
  { id: 9,  phase: 'Purchase Orders',     label: 'Running pre-issuance validation — 4 draft POs',            detail: 'Approved vendor list · duplicate check · delivery date feasibility',                 status: 'pending', delay: 100,  duration: 900  },
  { id: 10, phase: 'Purchase Orders',     label: 'Issuing 2 POs autonomously — within threshold',            detail: 'PO-DRAFT-003 ($4,272) + PO-DRAFT-004 ($7,263) transmitted to vendors',              status: 'pending', delay: 100,  duration: 600  },
  { id: 11, phase: 'Purchase Orders',     label: 'Holding 2 POs — above autonomous threshold',               detail: 'PO-DRAFT-001 ($5,060) + PO-DRAFT-002 ($11,576) queued for Alex approval',          status: 'pending', delay: 100,  duration: 400  },
  // Phase 3 — Tracking & AP
  { id: 12, phase: 'Order Tracking',      label: 'Scanning open PO acknowledgment SLA windows',              detail: 'PO-2603-04 (Polaris) — ack overdue 72h · second follow-up sent',                    status: 'pending', delay: 300,  duration: 700  },
  { id: 13, phase: 'Order Tracking',      label: 'Checking delivery ETA against requested dates',            detail: 'PO-2603-06 (Fox Factory) — 1 day past EDD · carrier follow-up initiated',          status: 'pending', delay: 100,  duration: 500  },
  { id: 14, phase: 'Accounts Payable',    label: 'Running three-way match on pending invoices',              detail: 'INV-4410 full match ✓ · INV-4411 price variance flagged · INV-4414 no PO found',    status: 'pending', delay: 300,  duration: 1000 },
  { id: 15, phase: 'Accounts Payable',    label: 'Checking for duplicate invoice submissions',               detail: 'No duplicates detected across 5 invoices in queue',                                  status: 'pending', delay: 100,  duration: 400  },
  { id: 16, phase: 'Accounts Payable',    label: 'Scanning for early payment discount opportunities',        detail: 'INV-4413 — 2/10 Net 30 · $285.60 savings flagged for operator review',              status: 'pending', delay: 100,  duration: 500  },
  // Phase 4 — Reporting
  { id: 17, phase: 'Vendor Management',   label: 'Updating vendor performance scorecards',                   detail: 'WPS OTD 84% · Gates Unitta OTD 86% — Watch classification maintained',              status: 'pending', delay: 300,  duration: 700  },
  { id: 18, phase: 'Spend Analysis',      label: 'Refreshing MTD spend aggregation',                         detail: 'Mar 2026 MTD: $75,010 · YTD: $1.15M across 8 vendors',                             status: 'pending', delay: 100,  duration: 600  },
  { id: 19, phase: 'Reporting',           label: 'Queuing escalation alerts for operator delivery',          detail: '3 P1 alerts · 2 P2 alerts · 1 P3 discount opportunity',                            status: 'pending', delay: 100,  duration: 400  },
  { id: 20, phase: 'Reporting',           label: 'Writing full audit log — all actions recorded',            detail: '20 workflow steps logged with timestamp and data references',                        status: 'pending', delay: 100,  duration: 300  },
];

const FLAGGED_IDS = new Set([11, 12, 13, 14]);

const phaseColors: Record<string, string> = {
  'Demand Planning':   'text-apex-700 bg-apex-50 border-apex-200',
  'Purchase Orders':   'text-brand-700 bg-brand-50 border-brand-200',
  'Order Tracking':    'text-slate-700 bg-slate-50 border-slate-200',
  'Accounts Payable':  'text-amber-700 bg-amber-50 border-amber-200',
  'Vendor Management': 'text-purple-700 bg-purple-50 border-purple-200',
  'Spend Analysis':    'text-green-700 bg-green-50 border-green-200',
  'Reporting':         'text-slate-700 bg-slate-50 border-slate-200',
};

interface Props { onClose: () => void; }

export const WorkflowRunner = ({ onClose }: Props) => {
  const [steps, setSteps]             = useState<Step[]>(STEPS.map(s => ({ ...s })));
  const [activeIdx, setActiveIdx]     = useState<number>(-1);
  const [done, setDone]               = useState(false);
  const [elapsedMs, setElapsedMs]     = useState(0);

  // Clock
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setElapsedMs(p => p + 100), 100);
    return () => clearInterval(t);
  }, [done]);

  // Step sequencer
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return;
        await new Promise(r => setTimeout(r, STEPS[i].delay));
        // Mark running
        setActiveIdx(i);
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
        await new Promise(r => setTimeout(r, STEPS[i].duration));
        if (cancelled) return;
        // Mark complete or flagged
        const finalStatus = FLAGGED_IDS.has(STEPS[i].id) ? 'flagged' : 'complete';
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: finalStatus } : s));
      }
      setActiveIdx(-1);
      setDone(true);
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const completed  = steps.filter(s => s.status === 'complete' || s.status === 'flagged').length;
  const flagged    = steps.filter(s => s.status === 'flagged').length;
  const pct        = Math.round((completed / STEPS.length) * 100);
  const elapsed    = (elapsedMs / 1000).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3 flex-shrink-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${done ? 'bg-green-100' : 'bg-apex-100'}`}>
            {done
              ? <CheckCircle size={16} className="text-green-600" />
              : <Zap size={16} className="text-apex-700 animate-pulse" />
            }
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900 text-sm">
              {done ? 'APEX Full Cycle — Complete' : 'APEX Full Cycle — Executing…'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {done
                ? `${STEPS.length} steps completed · ${flagged} items flagged for review · ${elapsed}s`
                : `Step ${Math.min(activeIdx + 1, STEPS.length)} of ${STEPS.length} · ${elapsed}s elapsed`}
            </div>
          </div>
          {done && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">{completed} / {STEPS.length} steps</span>
            <span className="text-xs font-semibold text-apex-700">{pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-green-500' : 'bg-apex-700'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {(() => {
            let lastPhase = '';
            return steps.map((step, i) => {
              const phaseHeader = step.phase !== lastPhase;
              lastPhase = step.phase;
              return (
                <React.Fragment key={step.id}>
                  {phaseHeader && (
                    <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border mt-3 first:mt-0 inline-block ${phaseColors[step.phase] ?? 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                      {step.phase}
                    </div>
                  )}
                  <div className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-colors ${step.status === 'running' ? 'bg-apex-50' : ''}`}>
                    {/* Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {step.status === 'pending'  && <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                      {step.status === 'running'  && <Loader size={16} className="text-apex-600 animate-spin" />}
                      {step.status === 'complete' && <CheckCircle size={16} className="text-green-500" />}
                      {step.status === 'flagged'  && <AlertTriangle size={16} className="text-amber-500" />}
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium leading-snug ${
                        step.status === 'pending'  ? 'text-slate-400' :
                        step.status === 'running'  ? 'text-apex-900 font-semibold' :
                        step.status === 'flagged'  ? 'text-amber-800' :
                        'text-slate-700'
                      }`}>
                        {step.label}
                      </div>
                      {(step.status === 'complete' || step.status === 'flagged' || step.status === 'running') && (
                        <div className={`text-[10px] mt-0.5 ${step.status === 'flagged' ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                          {step.detail}
                        </div>
                      )}
                    </div>
                    {/* Status badge */}
                    {step.status === 'flagged' && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0">FLAGGED</span>
                    )}
                  </div>
                </React.Fragment>
              );
            });
          })()}
        </div>

        {/* Footer — shown when done */}
        {done && (
          <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 bg-slate-50 rounded-b-xl">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Steps Executed',      value: STEPS.length,         color: 'text-slate-800' },
                { label: 'POs Issued / Queued', value: '2 issued · 2 held',  color: 'text-apex-800' },
                { label: 'Items Flagged',        value: flagged,              color: 'text-amber-700' },
              ].map(s => (
                <div key={s.label} className="text-center bg-white border border-slate-200 rounded-lg py-2.5">
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-apex-800 hover:bg-apex-700 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                View Dashboard <ChevronRight size={14} />
              </button>
              <button
                onClick={onClose}
                className="px-4 text-slate-600 hover:text-slate-900 text-sm font-medium py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
