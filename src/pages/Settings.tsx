import React, { useState } from 'react';
import { Settings, Save, Lock, Bell, Calendar, DollarSign, Package, Zap } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';

const ConfigField = ({ label, defaultValue, type = 'text', note }: { label: string; defaultValue: string; type?: string; note?: string }) => (
  <div className="mb-4 last:mb-0">
    <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      className="w-full text-sm border border-slate-200 rounded px-3 py-2 bg-slate-50 focus:outline-none focus:border-apex-400 focus:bg-white transition-colors"
    />
    {note && <p className="text-[10px] text-slate-400 mt-1">{note}</p>}
  </div>
);

const sections = [
  {
    id: 'thresholds',
    icon: DollarSign,
    label: 'Authorization Thresholds',
    desc: 'Dollar limits for autonomous PO issuance',
    fields: [
      { label: 'Autonomous PO Threshold (per single PO)', defaultValue: '$[Configure with Alex]', note: 'POs above this require human approval before issuance' },
      { label: 'Autonomous PO Threshold (cumulative per vendor/month)', defaultValue: '$[Configure with Alex]', note: 'Monthly cap per vendor before requiring human sign-off' },
      { label: 'Three-Way Match Price Variance Tolerance', defaultValue: '$0.00 (0%)', note: 'Allowable price delta before invoice is flagged — default ±$0' },
      { label: 'Invoice Exception Auto-Hold Threshold', defaultValue: '$[Configure with Alex]', note: 'Invoice variances above this are immediately escalated as P1' },
    ],
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Inventory & Replenishment',
    desc: 'DRP, safety stock, and EOQ parameters',
    fields: [
      { label: 'DRP Calculation Window (rolling days)', defaultValue: '90', note: 'Number of days of sales history used to calculate dynamic reorder points' },
      { label: 'UTV Seasonal Demand Multiplier (Can-Am / Polaris Dirt)', defaultValue: '1.15', note: 'Applied Feb–Mar pre-season ramp; increases DRP sensitivity by this factor' },
      { label: 'Snow Seasonal Demand Multiplier (Ski-Doo / Polaris / AC / Yamaha)', defaultValue: '1.20', note: 'Applied Aug–Sep pre-season ramp; increases DRP sensitivity by this factor' },
      { label: 'UTV Peak Season (months)', defaultValue: 'April – September', note: 'Peak demand window for Can-Am and Polaris Dirt product lines' },
      { label: 'Snow Peak Season (months)', defaultValue: 'October – February', note: 'Peak demand window for all snowmobile product lines' },
    ],
  },
  {
    id: 'vendors',
    icon: Settings,
    label: 'Vendor SLA Parameters',
    desc: 'Acknowledgment windows and delivery SLAs',
    fields: [
      { label: 'Default Acknowledgment SLA (business hours)', defaultValue: '48', note: 'Hours before APEX sends automated follow-up; escalates after secondary window' },
      { label: 'Secondary Ack Escalation Window (additional hours)', defaultValue: '24', note: 'If no ack after primary SLA + this window, escalates to human operator as P2' },
      { label: 'Vendor Watch Classification Threshold — OTD %', defaultValue: '87%', note: 'Vendors below this on-time delivery rate are reclassified to Watch' },
      { label: 'Vendor At-Risk Classification Threshold — OTD %', defaultValue: '85%', note: 'Vendors below this trigger immediate human review; new POs held' },
    ],
  },
  {
    id: 'ap',
    icon: DollarSign,
    label: 'AP & Payment Settings',
    desc: 'Payment scheduling and aging alert triggers',
    fields: [
      { label: 'Early Payment Discount ROI Threshold', defaultValue: '12%', note: 'Annualized ROI required before APEX flags an early payment discount opportunity' },
      { label: 'AP Aging Alert — 60-Day Threshold', defaultValue: '5%', note: 'Escalates to human if invoices >60 days exceed this % of total AP balance' },
      { label: 'Weekly Payment Run Day', defaultValue: 'Wednesday', note: 'Day of week APEX generates the payment schedule for human authorization' },
    ],
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Escalation Recipients',
    desc: 'Who receives APEX alerts by priority tier',
    fields: [
      { label: 'P1 Alert Recipients (email)', defaultValue: '[Configure with Alex]', note: 'P1 escalations — 5 minute notification window' },
      { label: 'P2 Alert Recipients (email)', defaultValue: '[Configure with Alex]', note: 'P2 escalations — same-session window' },
      { label: 'P3 / Daily Summary Recipients', defaultValue: '[Configure with Alex]', note: 'Included in next scheduled report or daily digest' },
      { label: 'Notification Channel', defaultValue: 'Email + In-Platform', note: 'Supported: Email, SMS, Slack, MS Teams — configure per channel integration' },
    ],
  },
  {
    id: 'schedule',
    icon: Calendar,
    label: 'Scheduled Trigger Calendar',
    desc: 'Pre-authorized recurring APEX activation times',
    fields: [
      { label: 'Replenishment Review Cadence', defaultValue: 'Monday 6:00 AM (Mode 4)', note: 'APEX auto-runs full demand scan on this schedule without manual trigger' },
      { label: 'Vendor Scorecard Generation', defaultValue: '1st of each month', note: 'Automated monthly vendor performance scorecard cycle' },
      { label: 'Spend Analysis Report', defaultValue: 'Monthly + Quarterly', note: 'Monthly summary + quarterly full cost intelligence report' },
      { label: 'AP Reconciliation', defaultValue: 'Last business day of month', note: 'AP sub-ledger vs. GL reconciliation; produces variance report' },
    ],
  },
];

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('thresholds');
  const active = sections.find(s => s.id === activeSection)!;

  return (
    <div className="p-6 space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={18} className="text-apex-600" />
            <h1 className="text-xl font-bold text-slate-900">APEX Configuration & Onboarding Variables</h1>
          </div>
          <p className="text-sm text-slate-500">Part IX — Engineering config variables to be populated with Alex during implementation</p>
        </div>
        <Badge variant="warning">Onboarding Mode</Badge>
      </div>

      {/* Onboarding notice */}
      <div className="bg-apex-50 border border-apex-200 rounded-lg px-5 py-4 flex items-start gap-3">
        <Zap size={16} className="text-apex-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-apex-900">Neuralogic Implementation Checklist</div>
          <div className="text-xs text-apex-700 mt-1">All fields marked <strong>[Configure with Alex]</strong> require confirmation from the Ibexx operations lead before APEX can operate in production mode. Integration credentials, dollar thresholds, and notification routing must be validated before first live trigger. Demo mode active until all fields are populated.</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Nav */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <div className="divide-y divide-slate-100">
              {sections.map(s => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${activeSection === s.id ? 'bg-apex-50 border-l-2 border-l-apex-500' : ''}`}
                  >
                    <Icon size={14} className={`mt-0.5 flex-shrink-0 ${activeSection === s.id ? 'text-apex-600' : 'text-slate-400'}`} />
                    <div>
                      <div className={`text-xs font-semibold ${activeSection === s.id ? 'text-apex-700' : 'text-slate-700'}`}>{s.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Config fields */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <active.icon size={16} className="text-apex-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{active.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{active.desc}</p>
                  </div>
                </div>
                <Lock size={14} className="text-slate-400" />
              </div>
            </CardHeader>
            <CardBody>
              {active.fields.map(f => <ConfigField key={f.label} {...f} />)}
              <div className="mt-6 flex gap-3">
                <Button variant="blue" onClick={() => showToast(`${active.label} settings saved`, 'success')}>
                  <Save size={13} /> Save Section
                </Button>
                <Button variant="secondary" onClick={() => showToast('Configuration export sent to Neuralogic engineering', 'success')}>
                  Export Config to Engineering
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Integration status */}
          <Card className="mt-4">
            <CardHeader><h3 className="font-semibold text-slate-900 text-sm">Integration Pipeline Status (Part IX — Priority Sequence)</h3></CardHeader>
            <CardBody>
              <div className="space-y-2">
                {[
                  { priority: 1, system: 'Inventory / WMS', purpose: 'Real-time stock levels, receiving events, location data', status: 'Pending' },
                  { priority: 2, system: 'Purchase Order System', purpose: 'Open PO register, PO issuance, status updates', status: 'Pending' },
                  { priority: 3, system: 'Accounts Payable System', purpose: 'Invoice register, payment queue, AP aging', status: 'Pending' },
                  { priority: 4, system: 'Shopify Storefront', purpose: 'Sales velocity, order history, backorder status', status: 'Pending' },
                  { priority: 5, system: 'Vendor Master Database', purpose: 'Vendor records, pricing, terms, performance', status: 'Pending' },
                  { priority: 6, system: 'General Ledger / ERP', purpose: 'GL coding, cost center allocation, journal entries', status: 'Pending' },
                  { priority: 7, system: 'APEX Dashboard Write Layer', purpose: 'All outputs, alerts, reports, status displays', status: 'Live (Demo)' },
                  { priority: 8, system: 'Notification System', purpose: 'Email, SMS, or in-platform alert delivery', status: 'Pending' },
                ].map(i => (
                  <div key={i.priority} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-slate-600">{i.priority}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-slate-800">{i.system}</span>
                      <span className="text-xs text-slate-500 ml-2">— {i.purpose}</span>
                    </div>
                    <Badge variant={i.status === 'Live (Demo)' ? 'success' : 'neutral'}>{i.status}</Badge>
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
