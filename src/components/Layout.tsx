import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, PackageSearch, ShoppingCart, Truck,
  PackageCheck, CreditCard, BarChart3, TrendingUp,
  Bell, Search, Zap, Menu, X, ChevronRight, Settings,
  AlertTriangle,
} from 'lucide-react';
import { alerts } from '../data/mockData';
import { Button } from './ui/Button';
import { showToast } from './ui/Toast';

// APEX logo mark — angular chevron / bolt
const ApexLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="14,2 26,26 19,19 14,24 9,19 2,26" fill="white" fillOpacity="0.9" />
    <polygon points="14,8 22,24 17,18 14,21 11,18 6,24" fill="#0f172a" fillOpacity="0.5" />
  </svg>
);

const navItems = [
  { to: '/', label: 'APEX Dashboard', icon: LayoutDashboard },
  { separator: true, label: 'PROCUREMENT WORKFLOWS' },
  { to: '/demand-planning',     label: 'WF1 — Demand Planning',    icon: PackageSearch },
  { to: '/purchasing',          label: 'WF2 — Vendor & PO',         icon: ShoppingCart },
  { to: '/order-tracking',      label: 'WF3 — Order Tracking',      icon: Truck },
  { to: '/receiving',           label: 'WF4 — Receiving & Match',   icon: PackageCheck },
  { to: '/ap-pipeline',         label: 'WF5 — AP Pipeline',         icon: CreditCard },
  { to: '/vendor-performance',  label: 'WF6 — Vendor Performance',  icon: BarChart3 },
  { to: '/spend-analysis',      label: 'WF7 — Spend Analysis',      icon: TrendingUp },
  { separator: true, label: 'SYSTEM' },
  { to: '/settings', label: 'Settings & Config', icon: Settings },
];

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const openAlerts = alerts.filter(a => a.priority === 'P1' || a.priority === 'P2').length;
  const p1Count = alerts.filter(a => a.priority === 'P1').length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-62' : 'w-0 overflow-hidden'} transition-all duration-200 bg-slate-950 flex-shrink-0 flex flex-col`} style={{ minWidth: sidebarOpen ? '248px' : '0' }}>

        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ApexLogo />
            <div>
              <div className="text-white font-bold text-sm leading-tight tracking-wide">APEX</div>
              <div className="text-white/45 text-[10px] leading-tight uppercase tracking-wider">Ibexx Procurement ADE</div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 bg-apex-400 rounded-full pulse-dot flex-shrink-0" />
          <span className="text-apex-300 text-[10px] font-semibold uppercase tracking-wider">Active — Standing By</span>
          {p1Count > 0 && (
            <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{p1Count} P1</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto pb-3 px-3 pt-2">
          {navItems.map((item, i) => {
            if (item.separator) return (
              <div key={i} className="mt-4 mb-1 px-2">
                {item.label && <span className="text-white/25 text-[9px] uppercase tracking-widest font-semibold">{item.label}</span>}
                {!item.label && <div className="border-t border-white/10" />}
              </div>
            );
            const Icon = item.icon!;
            return (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded text-xs mb-0.5 transition-colors group ${
                    isActive
                      ? 'bg-apex-600 text-white font-semibold'
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

        {/* Season indicator */}
        <div className="px-4 py-3 border-t border-white/10 space-y-2">
          <div className="bg-apex-900/60 border border-apex-700/40 rounded px-2.5 py-2">
            <div className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Seasonal Mode</div>
            <div className="text-apex-300 text-[10px] font-semibold">UTV Pre-Season Ramp</div>
            <div className="text-white/35 text-[9px]">Can-Am & Polaris Dirt sensitivity ↑</div>
          </div>
          <div className="text-white/20 text-[9px] text-center">
            Powered by Neuralogic Group LLC
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-900 transition-colors">
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
          <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded px-2.5 py-1">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <span className="text-amber-700 text-xs font-medium">UTV Pre-Season Active</span>
          </div>

          {/* Alerts bell */}
          <button
            className="relative text-slate-500 hover:text-slate-900 transition-colors"
            onClick={() => showToast(`${openAlerts} active alerts require attention`, 'warning')}
          >
            <Bell size={18} />
            {openAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {openAlerts}
              </span>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AL</span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-slate-900 text-xs leading-tight">Alex</div>
              <div className="text-slate-400 text-[10px]">Ops Lead</div>
            </div>
          </div>

          {/* Trigger */}
          <Button variant="blue" size="sm" onClick={() => showToast('APEX Full Cycle triggered — scanning all pipelines...', 'success')}>
            <Zap size={13} />
            Trigger APEX
          </Button>
        </header>

        {/* STOP controls ribbon */}
        {p1Count > 0 && (
          <div className="bg-red-600 px-4 py-1.5 flex items-center gap-3 flex-shrink-0">
            <AlertTriangle size={14} className="text-white flex-shrink-0" />
            <span className="text-white text-xs font-semibold">{p1Count} P1 Alert{p1Count > 1 ? 's' : ''} — Immediate Action Required</span>
            <div className="flex-1" />
            <button onClick={() => showToast('APEX PAUSED at next clean checkpoint', 'warning')} className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors">PAUSE</button>
            <button onClick={() => showToast('APEX STOPPED — state snapshot written', 'warning')} className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors">STOP</button>
            <button onClick={() => showToast('APEX ABORT — rolling back uncommitted writes', 'error')} className="bg-white text-red-600 text-[10px] font-bold px-2.5 py-1 rounded transition-colors hover:bg-red-50">ABORT</button>
            <ChevronRight size={14} className="text-white/50" />
          </div>
        )}

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
