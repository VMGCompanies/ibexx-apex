import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, PackageSearch, ShoppingCart, Truck,
  PackageCheck, CreditCard, BarChart3, TrendingUp,
  Bell, Search, Zap, Menu, X, ChevronRight, Settings,
  AlertTriangle, Cpu, Play, Square, PauseCircle,
  XOctagon, RefreshCw, CheckCircle,
} from 'lucide-react';
import { alerts } from '../data/mockData';
import { Button } from './ui/Button';
import { WorkflowRunner } from './WorkflowRunner';

type ApexStatus = 'active' | 'paused' | 'stopped' | 'aborted';

// ─── Logo ─────────────────────────────────────────────────────────────────────
const ApexLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="14,2 26,26 19,19 14,24 9,19 2,26" fill="white" fillOpacity="0.92" />
    <polygon points="14,8 22,24 17,18 14,21 11,18 6,24" fill="#0A1F3C" fillOpacity="0.4" />
  </svg>
);

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },

  { separator: true, label: 'PROCUREMENT' },
  { to: '/demand-planning',    label: 'Demand Planning',   icon: PackageSearch },
  { to: '/purchasing',         label: 'Purchase Orders',   icon: ShoppingCart  },
  { to: '/order-tracking',     label: 'Order Tracking',    icon: Truck         },
  { to: '/receiving',          label: 'Receiving',         icon: PackageCheck  },

  { separator: true, label: 'FINANCE' },
  { to: '/ap-pipeline',        label: 'Accounts Payable',  icon: CreditCard    },

  { separator: true, label: 'VENDORS' },
  { to: '/vendor-performance', label: 'Vendor Management', icon: BarChart3     },
  { to: '/spend-analysis',     label: 'Spend Analysis',    icon: TrendingUp    },

  { separator: true, label: 'SYSTEM' },
  { to: '/capabilities',       label: 'Capability Matrix', icon: Cpu           },
  { to: '/settings',           label: 'Settings',          icon: Settings      },
];

// ─── Abort confirmation modal ─────────────────────────────────────────────────
const AbortModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
      <div className="px-6 pt-6 pb-2 flex items-start gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <XOctagon size={20} className="text-red-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Confirm ABORT</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            This will immediately terminate all active APEX sub-processes and roll back any uncommitted writes. This action cannot be undone within the current session — a new trigger will be required to restart.
          </p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-slate-100 mt-2 flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
        >
          Confirm ABORT
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ApexStatus, {
  pill: string; pillDot: string; pillText: string;
  ribbonBg: string; ribbonText: string; ribbonLabel: string;
}> = {
  active:  {
    pill: '',         pillDot: 'bg-brand-300', pillText: 'text-brand-200',
    ribbonBg: 'bg-red-600', ribbonText: 'text-white',
    ribbonLabel: 'P1 Alerts — Immediate Action Required',
  },
  paused:  {
    pill: '',         pillDot: 'bg-amber-400', pillText: 'text-amber-200',
    ribbonBg: 'bg-amber-500', ribbonText: 'text-white',
    ribbonLabel: 'APEX PAUSED — Workflow suspended at last clean checkpoint · No actions executing',
  },
  stopped: {
    pill: '',         pillDot: 'bg-slate-400', pillText: 'text-slate-300',
    ribbonBg: 'bg-slate-700', ribbonText: 'text-white',
    ribbonLabel: 'APEX STOPPED — Last completed step logged · State snapshot saved · Ready for new trigger',
  },
  aborted: {
    pill: '',         pillDot: 'bg-red-400',   pillText: 'text-red-300',
    ribbonBg: 'bg-zinc-900',  ribbonText: 'text-white',
    ribbonLabel: 'APEX ABORTED — All processes terminated · Uncommitted writes rolled back · New trigger required',
  },
};

const STATUS_LABEL: Record<ApexStatus, string> = {
  active:  'Active — Standing By',
  paused:  'Paused — Awaiting Resume',
  stopped: 'Stopped — Standby',
  aborted: 'Aborted — Requires Restart',
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export const Layout = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [apexStatus, setApexStatus]     = useState<ApexStatus>('active');
  const [showAbort, setShowAbort]       = useState(false);
  const [stopMsg, setStopMsg]           = useState(false);   // brief "stopped" ribbon

  const openAlerts = alerts.filter(a => a.priority === 'P1' || a.priority === 'P2').length;
  const p1Count    = alerts.filter(a => a.priority === 'P1').length;
  const showRibbon = p1Count > 0 || apexStatus !== 'active';
  const cfg        = STATUS_CONFIG[apexStatus];

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handlePause = () => {
    if (apexStatus === 'active') setApexStatus('paused');
  };
  const handleResume = () => {
    if (apexStatus === 'paused') setApexStatus('active');
  };
  const handleStop = () => {
    setApexStatus('stopped');
    setStopMsg(true);
    setTimeout(() => setStopMsg(false), 8000);   // auto-dismiss stopped ribbon after 8s
  };
  const handleAbortRequest = () => setShowAbort(true);
  const handleAbortConfirm = () => {
    setShowAbort(false);
    setApexStatus('aborted');
  };
  const handleRestart = () => {
    setApexStatus('active');
  };

  const canTrigger  = apexStatus === 'active' || apexStatus === 'stopped';
  const isInactive  = apexStatus === 'paused' || apexStatus === 'aborted';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? 'w-62' : 'w-0 overflow-hidden'} transition-all duration-200 bg-apex-900 flex-shrink-0 flex flex-col`}
        style={{ minWidth: sidebarOpen ? '220px' : '0' }}
      >
        {/* Branding */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ApexLogo />
            <div>
              <div className="text-white font-bold text-sm leading-tight tracking-wide">APEX</div>
              <div className="text-white/45 text-[10px] leading-tight uppercase tracking-wider">Ibexx Procurement Platform</div>
            </div>
          </div>
        </div>

        {/* Status pill — changes with apexStatus */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.pillDot} ${apexStatus === 'active' ? 'pulse-dot' : ''}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.pillText}`}>
            {STATUS_LABEL[apexStatus]}
          </span>
          {p1Count > 0 && apexStatus === 'active' && (
            <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{p1Count} P1</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto pb-3 px-3 pt-2">
          {navItems.map((item, i) => {
            if (item.separator) return (
              <div key={i} className="mt-4 mb-1 px-2">
                {item.label
                  ? <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">{item.label}</span>
                  : <div className="border-t border-white/10" />
                }
              </div>
            );
            const Icon = item.icon!;
            return (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded text-xs mb-0.5 transition-colors ${
                    isActive
                      ? 'bg-brand-500 text-white font-semibold'
                      : 'text-white/55 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <Icon size={14} />
                <span className="flex-1 leading-tight">{item.label}</span>
                {item.to === '/' && openAlerts > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{openAlerts}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Seasonal mode + footer */}
        <div className="px-4 py-3 border-t border-white/10 space-y-2">
          <div className="bg-apex-800/80 border border-brand-500/30 rounded px-2.5 py-2">
            <div className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Seasonal Mode</div>
            <div className="text-brand-300 text-[10px] font-semibold">UTV Pre-Season Ramp</div>
            <div className="text-white/35 text-[9px]">Can-Am & Polaris Dirt sensitivity ↑</div>
          </div>
          <div className="text-white/20 text-[9px] text-center">Powered by Neuralogic Group LLC</div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-apex-900 transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex-1 max-w-md relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKUs, POs, vendors, invoices..."
              className="w-full pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:border-apex-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex-1" />

          {/* Seasonal badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded px-2.5 py-1">
            <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
            <span className="text-brand-700 text-xs font-medium">UTV Pre-Season Active</span>
          </div>

          {/* Alerts bell */}
          <button className="relative text-slate-500 hover:text-apex-900 transition-colors">
            <Bell size={18} />
            {openAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {openAlerts}
              </span>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 bg-apex-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AL</span>
            </div>
            <div>
              <div className="font-medium text-slate-900 text-xs leading-tight">Alex</div>
              <div className="text-slate-400 text-[10px]">Ops Lead</div>
            </div>
          </div>

          {/* Trigger / status button */}
          {apexStatus === 'paused' ? (
            <Button variant="navy" size="sm" onClick={handleResume}>
              <Play size={13} />
              Resume APEX
            </Button>
          ) : apexStatus === 'aborted' ? (
            <Button variant="navy" size="sm" onClick={handleRestart}>
              <RefreshCw size={13} />
              Restart APEX
            </Button>
          ) : apexStatus === 'stopped' ? (
            <Button variant="navy" size="sm" onClick={() => { setApexStatus('active'); setWorkflowOpen(true); }}>
              <Zap size={13} />
              Trigger APEX
            </Button>
          ) : (
            <Button variant="navy" size="sm" onClick={() => setWorkflowOpen(true)}>
              <Zap size={13} />
              Trigger APEX
            </Button>
          )}
        </header>

        {/* ── Status ribbon — context-aware ────────────────────────────── */}
        {showRibbon && (

          /* ACTIVE: red P1 ribbon with working PAUSE / STOP / ABORT */
          apexStatus === 'active' ? (
            <div className="bg-red-600 px-4 py-1.5 flex items-center gap-3 flex-shrink-0">
              <AlertTriangle size={14} className="text-white flex-shrink-0" />
              <span className="text-white text-xs font-semibold">
                {p1Count} P1 Alert{p1Count > 1 ? 's' : ''} — Immediate Action Required
              </span>
              <div className="flex-1" />
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/35 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
              >
                <PauseCircle size={11} /> PAUSE
              </button>
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/35 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
              >
                <Square size={11} /> STOP
              </button>
              <button
                onClick={handleAbortRequest}
                className="flex items-center gap-1.5 bg-white text-red-600 text-[10px] font-bold px-2.5 py-1 rounded transition-colors hover:bg-red-50"
              >
                <XOctagon size={11} /> ABORT
              </button>
              <ChevronRight size={14} className="text-white/40" />
            </div>

          /* PAUSED: amber ribbon with RESUME + STOP */
          ) : apexStatus === 'paused' ? (
            <div className="bg-amber-500 px-4 py-1.5 flex items-center gap-3 flex-shrink-0">
              <PauseCircle size={14} className="text-white flex-shrink-0" />
              <span className="text-white text-xs font-semibold">
                APEX PAUSED — Workflow suspended at last clean checkpoint · No actions executing
              </span>
              <div className="flex-1" />
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 bg-white text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded transition-colors hover:bg-amber-50"
              >
                <Play size={11} fill="currentColor" /> RESUME
              </button>
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 bg-white/25 hover:bg-white/40 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
              >
                <Square size={11} /> STOP
              </button>
              <button
                onClick={handleAbortRequest}
                className="flex items-center gap-1.5 bg-white/25 hover:bg-white/40 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
              >
                <XOctagon size={11} /> ABORT
              </button>
            </div>

          /* STOPPED: slate ribbon, auto-dismisses */
          ) : apexStatus === 'stopped' ? (
            <div className="bg-slate-700 px-4 py-1.5 flex items-center gap-3 flex-shrink-0">
              <CheckCircle size={14} className="text-slate-300 flex-shrink-0" />
              <span className="text-slate-200 text-xs font-semibold">
                APEX STOPPED — Last completed step logged · State snapshot saved · Ready for new trigger
              </span>
              <div className="flex-1" />
              <button
                onClick={() => { setApexStatus('active'); setWorkflowOpen(true); }}
                className="flex items-center gap-1.5 bg-white text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded transition-colors hover:bg-slate-50"
              >
                <Zap size={11} /> NEW TRIGGER
              </button>
              <button
                onClick={() => setApexStatus('active')}
                className="text-slate-400 hover:text-white text-[10px] transition-colors px-1"
              >
                <X size={14} />
              </button>
            </div>

          /* ABORTED: near-black ribbon, requires restart */
          ) : apexStatus === 'aborted' ? (
            <div className="bg-zinc-900 px-4 py-1.5 flex items-center gap-3 flex-shrink-0">
              <XOctagon size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-white text-xs font-semibold">
                APEX ABORTED — All processes terminated · Uncommitted writes rolled back · New trigger required
              </span>
              <div className="flex-1" />
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
              >
                <RefreshCw size={11} /> RESTART
              </button>
            </div>
          ) : null
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Workflow modal */}
      {workflowOpen && <WorkflowRunner onClose={() => setWorkflowOpen(false)} />}

      {/* Abort confirmation modal */}
      {showAbort && (
        <AbortModal
          onConfirm={handleAbortConfirm}
          onCancel={() => setShowAbort(false)}
        />
      )}
    </div>
  );
};
