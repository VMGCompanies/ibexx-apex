// ─── VENDORS ────────────────────────────────────────────────────────────────
export const vendors = [
  { id: 'V-001', name: 'BRP Parts Direct', category: 'OEM Components', rating: 4.8, leadDays: 5, payTerms: 'Net 30', ytdSpend: 312400, onTimeRate: 94, fillRate: 97, invoiceAccuracy: 99, classification: 'Preferred' },
  { id: 'V-002', name: 'Tucker Powersports', category: 'Distributor', rating: 4.6, leadDays: 3, payTerms: 'Net 30', ytdSpend: 218700, onTimeRate: 91, fillRate: 95, invoiceAccuracy: 98, classification: 'Preferred' },
  { id: 'V-003', name: 'Parts Unlimited', category: 'Distributor', rating: 4.4, leadDays: 4, payTerms: 'Net 30', ytdSpend: 174200, onTimeRate: 88, fillRate: 93, invoiceAccuracy: 96, classification: 'Approved' },
  { id: 'V-004', name: 'Dayco Products', category: 'Belts & Drives', rating: 4.7, leadDays: 7, payTerms: 'Net 45', ytdSpend: 98600, onTimeRate: 92, fillRate: 98, invoiceAccuracy: 100, classification: 'Preferred' },
  { id: 'V-005', name: 'WPS Western Power Sports', category: 'Distributor', rating: 4.2, leadDays: 4, payTerms: 'Net 30', ytdSpend: 87300, onTimeRate: 84, fillRate: 90, invoiceAccuracy: 95, classification: 'Watch' },
  { id: 'V-006', name: 'Polaris Industries', category: 'OEM Components', rating: 4.5, leadDays: 8, payTerms: 'Net 45', ytdSpend: 143800, onTimeRate: 89, fillRate: 94, invoiceAccuracy: 97, classification: 'Approved' },
  { id: 'V-007', name: 'Fox Factory Components', category: 'Precision Parts', rating: 4.9, leadDays: 10, payTerms: 'Net 30', ytdSpend: 62400, onTimeRate: 96, fillRate: 99, invoiceAccuracy: 100, classification: 'Preferred' },
  { id: 'V-008', name: 'Gates Unitta', category: 'Belts & Drives', rating: 4.3, leadDays: 6, payTerms: 'Net 30', ytdSpend: 54100, onTimeRate: 86, fillRate: 92, invoiceAccuracy: 94, classification: 'Watch' },
];

// ─── SKUs / INVENTORY ────────────────────────────────────────────────────────
export const inventory = [
  // Can-Am Dirt
  { sku: 'CA-MX3-CK-001', desc: 'Can-Am Maverick X3 Complete Clutch Kit', line: 'Can-Am Dirt', onHand: 14, drp: 20, safetyStock: 8, velocity90: 31, unitCost: 289.00, preferredVendor: 'V-001', leadDays: 5, status: 'Reorder Required', urgency: 'Standard' },
  { sku: 'CA-DEF-CK-002', desc: 'Can-Am Defender Clutch Kit Pro', line: 'Can-Am Dirt', onHand: 4, drp: 15, safetyStock: 6, velocity90: 22, unitCost: 249.00, preferredVendor: 'V-001', leadDays: 5, status: 'Critical Reorder', urgency: 'High' },
  { sku: 'CA-MX3-BLT-003', desc: 'Can-Am Maverick X3 Drive Belt', line: 'Can-Am Dirt', onHand: 0, drp: 30, safetyStock: 12, velocity90: 54, unitCost: 94.50, preferredVendor: 'V-004', leadDays: 7, status: 'Stockout', urgency: 'Emergency' },
  { sku: 'CA-COM-WGT-004', desc: 'Can-Am Commander Clutch Weights (6-pack)', line: 'Can-Am Dirt', onHand: 38, drp: 25, safetyStock: 10, velocity90: 18, unitCost: 42.00, preferredVendor: 'V-002', leadDays: 3, status: 'Healthy', urgency: 'None' },
  // Polaris Dirt
  { sku: 'PL-RZR-CK-010', desc: 'Polaris RZR Pro XP Clutch Kit', line: 'Polaris Dirt', onHand: 9, drp: 18, safetyStock: 7, velocity90: 28, unitCost: 274.00, preferredVendor: 'V-006', leadDays: 8, status: 'Reorder Required', urgency: 'Standard' },
  { sku: 'PL-GEN-CK-011', desc: 'Polaris General Clutch Kit Stage 2', line: 'Polaris Dirt', onHand: 22, drp: 15, safetyStock: 6, velocity90: 19, unitCost: 258.00, preferredVendor: 'V-006', leadDays: 8, status: 'Healthy', urgency: 'None' },
  { sku: 'PL-RZR-BLT-012', desc: 'Polaris RZR XP1000 Drive Belt', line: 'Polaris Dirt', onHand: 7, drp: 25, safetyStock: 10, velocity90: 47, unitCost: 89.00, preferredVendor: 'V-004', leadDays: 7, status: 'Critical Reorder', urgency: 'High' },
  { sku: 'PL-SPR-012', desc: 'Polaris Primary Spring Set (Helix 39°)', line: 'Polaris Dirt', onHand: 52, drp: 20, safetyStock: 8, velocity90: 14, unitCost: 31.50, preferredVendor: 'V-002', leadDays: 3, status: 'Healthy', urgency: 'None' },
  // Ski-Doo Snow
  { sku: 'SD-SUM-CK-020', desc: 'Ski-Doo Summit Expert Clutch Kit', line: 'Ski-Doo Snow', onHand: 3, drp: 22, safetyStock: 9, velocity90: 41, unitCost: 312.00, preferredVendor: 'V-001', leadDays: 5, status: 'Critical Reorder', urgency: 'High' },
  { sku: 'SD-BCK-CK-021', desc: 'Ski-Doo Backcountry X Clutch Kit', line: 'Ski-Doo Snow', onHand: 0, drp: 18, safetyStock: 7, velocity90: 35, unitCost: 298.00, preferredVendor: 'V-001', leadDays: 5, status: 'Stockout', urgency: 'Emergency' },
  { sku: 'SD-SUM-BLT-022', desc: 'Ski-Doo Summit Drive Belt (417300057)', line: 'Ski-Doo Snow', onHand: 11, drp: 30, safetyStock: 12, velocity90: 58, unitCost: 112.00, preferredVendor: 'V-004', leadDays: 7, status: 'Reorder Required', urgency: 'Standard' },
  { sku: 'SD-HLX-023', desc: 'Ski-Doo Helix 42° Angle Set', line: 'Ski-Doo Snow', onHand: 44, drp: 20, safetyStock: 8, velocity90: 12, unitCost: 28.00, preferredVendor: 'V-003', leadDays: 4, status: 'Healthy', urgency: 'None' },
  // Polaris Snow
  { sku: 'PS-IXC-CK-030', desc: 'Polaris Indy XCR Clutch Kit', line: 'Polaris Snow', onHand: 6, drp: 16, safetyStock: 6, velocity90: 29, unitCost: 267.00, preferredVendor: 'V-006', leadDays: 8, status: 'Critical Reorder', urgency: 'High' },
  { sku: 'PS-IXC-BLT-031', desc: 'Polaris Indy XCR Drive Belt', line: 'Polaris Snow', onHand: 18, drp: 20, safetyStock: 8, velocity90: 36, unitCost: 99.00, preferredVendor: 'V-004', leadDays: 7, status: 'Healthy', urgency: 'None' },
  // Arctic Cat Snow
  { sku: 'AC-ZR9-CK-040', desc: 'Arctic Cat ZR 9000 Clutch Kit', line: 'Arctic Cat Snow', onHand: 8, drp: 14, safetyStock: 5, velocity90: 22, unitCost: 283.00, preferredVendor: 'V-003', leadDays: 4, status: 'Reorder Required', urgency: 'Standard' },
  { sku: 'AC-ZR9-BLT-041', desc: 'Arctic Cat ZR 9000 Drive Belt', line: 'Arctic Cat Snow', onHand: 15, drp: 18, safetyStock: 7, velocity90: 31, unitCost: 107.00, preferredVendor: 'V-004', leadDays: 7, status: 'Healthy', urgency: 'None' },
  // Yamaha Snow
  { sku: 'YM-SWD-CK-050', desc: 'Yamaha Sidewinder Clutch Kit', line: 'Yamaha Snow', onHand: 5, drp: 12, safetyStock: 5, velocity90: 18, unitCost: 294.00, preferredVendor: 'V-002', leadDays: 3, status: 'Critical Reorder', urgency: 'High' },
  { sku: 'YM-SWD-BLT-051', desc: 'Yamaha Sidewinder Drive Belt', line: 'Yamaha Snow', onHand: 24, drp: 20, safetyStock: 8, velocity90: 27, unitCost: 118.00, preferredVendor: 'V-004', leadDays: 7, status: 'Healthy', urgency: 'None' },
];

// ─── PURCHASE ORDERS ─────────────────────────────────────────────────────────
export const purchaseOrders = [
  { id: 'PO-2603-01', vendor: 'BRP Parts Direct', vendorId: 'V-001', items: 3, totalValue: 18460, issued: '2026-03-10', expectedDelivery: '2026-03-28', status: 'In-Transit', ackStatus: 'Acknowledged', trackingNo: '1Z9F3A820399188423', daysToDelivery: 2, lateRisk: false },
  { id: 'PO-2603-02', vendor: 'Dayco Products', vendorId: 'V-004', items: 2, totalValue: 9840, issued: '2026-03-12', expectedDelivery: '2026-04-02', status: 'In-Production', ackStatus: 'Acknowledged', trackingNo: null, daysToDelivery: 7, lateRisk: false },
  { id: 'PO-2603-03', vendor: 'Tucker Powersports', vendorId: 'V-002', items: 5, totalValue: 14280, issued: '2026-03-14', expectedDelivery: '2026-03-27', status: 'In-Transit', ackStatus: 'Acknowledged', trackingNo: '794611685540432', daysToDelivery: 1, lateRisk: false },
  { id: 'PO-2603-04', vendor: 'Polaris Industries', vendorId: 'V-006', items: 2, totalValue: 7350, issued: '2026-03-15', expectedDelivery: '2026-03-31', status: 'Issued-Pending Ack', ackStatus: 'Overdue', trackingNo: null, daysToDelivery: 5, lateRisk: true },
  { id: 'PO-2603-05', vendor: 'Parts Unlimited', vendorId: 'V-003', items: 4, totalValue: 6920, issued: '2026-03-18', expectedDelivery: '2026-04-01', status: 'Issued-Pending Ack', ackStatus: 'Pending', trackingNo: null, daysToDelivery: 6, lateRisk: false },
  { id: 'PO-2603-06', vendor: 'Fox Factory Components', vendorId: 'V-007', items: 1, totalValue: 4160, issued: '2026-03-08', expectedDelivery: '2026-03-26', status: 'Overdue', ackStatus: 'Acknowledged', trackingNo: '1Z4E8F120349234812', daysToDelivery: -1, lateRisk: true },
  { id: 'PO-2602-07', vendor: 'BRP Parts Direct', vendorId: 'V-001', items: 6, totalValue: 22100, issued: '2026-02-20', expectedDelivery: '2026-03-08', status: 'Received', ackStatus: 'Acknowledged', trackingNo: '1Z9F3A820339187654', daysToDelivery: null, lateRisk: false },
  { id: 'PO-2602-08', vendor: 'Tucker Powersports', vendorId: 'V-002', items: 3, totalValue: 9480, issued: '2026-02-28', expectedDelivery: '2026-03-14', status: 'Received', ackStatus: 'Acknowledged', trackingNo: '794611685540111', daysToDelivery: null, lateRisk: false },
];

// ─── INVOICES / AP QUEUE ─────────────────────────────────────────────────────
export const invoices = [
  { id: 'INV-4410', po: 'PO-2602-07', vendor: 'BRP Parts Direct', amount: 22100.00, poAmount: 22100.00, receivedQty: 'Full', status: 'Matched-Approved', dueDate: '2026-04-07', aging: 18, earlyDiscountAvail: false },
  { id: 'INV-4411', po: 'PO-2602-08', vendor: 'Tucker Powersports', amount: 9612.00, poAmount: 9480.00, receivedQty: 'Full', status: 'Exception-Held', dueDate: '2026-04-13', aging: 12, earlyDiscountAvail: false, exceptionNote: 'Price variance: $132 above PO — unit cost discrepancy on PL-RZR-BLT-012' },
  { id: 'INV-4412', po: 'PO-2603-01', vendor: 'BRP Parts Direct', amount: 18460.00, poAmount: 18460.00, receivedQty: 'Partial', status: 'Pending Match', dueDate: '2026-04-25', aging: 0, earlyDiscountAvail: false, exceptionNote: 'Awaiting full receipt — 2 of 3 line items received' },
  { id: 'INV-4413', po: 'PO-2603-03', vendor: 'Tucker Powersports', amount: 14280.00, poAmount: 14280.00, receivedQty: null, status: 'Pending Match', dueDate: '2026-04-26', aging: 0, earlyDiscountAvail: true, discountAmount: 285.60, discountDeadline: '2026-04-05' },
  { id: 'INV-4414', po: 'UNKNOWN', vendor: 'WPS Western Power Sports', amount: 3840.00, poAmount: null, receivedQty: null, status: 'Exception-Held', dueDate: null, aging: 0, earlyDiscountAvail: false, exceptionNote: 'P1: No matching open PO found — unauthorized invoice submission' },
];

// ─── ACTIVE ALERTS ───────────────────────────────────────────────────────────
export const alerts = [
  { id: 'ALT-0041', priority: 'P1', workflow: 'Demand Planning', issue: 'Stockout detected — CA-MX3-BLT-003 with 3 open dealer orders', impact: '3 dealer orders totaling $1,134 at risk', sku: 'CA-MX3-BLT-003', timeOpen: '4h 22m', status: 'Awaiting PO Approval', action: 'Approve PO-DRAFT-001 to Tucker Powersports ($2,835)' },
  { id: 'ALT-0042', priority: 'P1', workflow: 'Demand Planning', issue: 'Stockout detected — SD-BCK-CK-021 with 2 open dealer orders', impact: '2 dealer orders totaling $3,576 at risk', sku: 'SD-BCK-CK-021', timeOpen: '4h 22m', status: 'Awaiting PO Approval', action: 'Approve PO-DRAFT-002 to BRP Parts Direct ($5,960)' },
  { id: 'ALT-0043', priority: 'P1', workflow: 'AP Pipeline', issue: 'Unauthorized invoice received — no matching PO for INV-4414 from WPS', impact: 'Invoice hold: $3,840 — potential duplicate or erroneous submission', sku: null, timeOpen: '1h 08m', status: 'Held Pending Human Review', action: 'Review INV-4414 and confirm PO reference or reject invoice' },
  { id: 'ALT-0044', priority: 'P2', workflow: 'Order Tracking', issue: 'PO-2603-04 acknowledgment overdue 52 hours — Polaris Industries', impact: 'PL-RZR-CK-010, PL-GEN-CK-011 delivery at risk; current DRP breach in 6 days', sku: null, timeOpen: '52h 00m', status: 'Follow-Up Sent x2', action: 'Confirm vendor contact escalation or reassign to alternate vendor' },
  { id: 'ALT-0045', priority: 'P2', workflow: 'AP Pipeline', issue: 'Price variance on INV-4411 — Tucker Powersports $132 above PO rate', impact: 'Belt unit cost $6.60/unit vs. contracted $5.94/unit (11.1% variance)', sku: 'PL-RZR-BLT-012', timeOpen: '9h 15m', status: 'Held Pending Human Review', action: 'Approve adjusted amount or initiate vendor price dispute' },
  { id: 'ALT-0046', priority: 'P2', workflow: 'Order Tracking', issue: 'PO-2603-06 delivery overdue 1 day — Fox Factory Components', impact: 'Precision clutch components for 3 build orders delayed', sku: null, timeOpen: '26h 00m', status: 'Carrier Follow-Up Initiated', action: 'Confirm updated ETA with vendor or escalate to expedite' },
];

// ─── SPEND TREND DATA ────────────────────────────────────────────────────────
export const monthlySpendData = [
  { month: 'Apr', canAm: 38200, polarisDirt: 29100, skiDoo: 8400, polarisSnow: 4200, arcticCat: 3100, yamaha: 2800 },
  { month: 'May', canAm: 44100, polarisDirt: 34200, skiDoo: 9200, polarisSnow: 4800, arcticCat: 3400, yamaha: 3100 },
  { month: 'Jun', canAm: 51300, polarisDirt: 39800, skiDoo: 7100, polarisSnow: 3600, arcticCat: 2800, yamaha: 2400 },
  { month: 'Jul', canAm: 49800, polarisDirt: 41200, skiDoo: 6200, polarisSnow: 3100, arcticCat: 2200, yamaha: 2100 },
  { month: 'Aug', canAm: 46200, polarisDirt: 38100, skiDoo: 18400, polarisSnow: 9200, arcticCat: 7100, yamaha: 6400 },
  { month: 'Sep', canAm: 38400, polarisDirt: 31200, skiDoo: 34200, polarisSnow: 18100, arcticCat: 13200, yamaha: 11800 },
  { month: 'Oct', canAm: 24100, polarisDirt: 19800, skiDoo: 48900, polarisSnow: 24200, arcticCat: 18400, yamaha: 16200 },
  { month: 'Nov', canAm: 18200, polarisDirt: 14100, skiDoo: 52400, polarisSnow: 26800, arcticCat: 21100, yamaha: 18400 },
  { month: 'Dec', canAm: 16400, polarisDirt: 12800, skiDoo: 49200, polarisSnow: 24100, arcticCat: 19800, yamaha: 17200 },
  { month: 'Jan', canAm: 21200, polarisDirt: 17400, skiDoo: 44100, polarisSnow: 22400, arcticCat: 17200, yamaha: 15100 },
  { month: 'Feb', canAm: 29800, polarisDirt: 23100, skiDoo: 38200, polarisSnow: 19400, arcticCat: 14800, yamaha: 13200 },
  { month: 'Mar', canAm: 41200, polarisDirt: 31800, skiDoo: 24100, polarisSnow: 12400, arcticCat: 9200, yamaha: 8100 },
];

// ─── AUDIT TRAIL ─────────────────────────────────────────────────────────────
export const auditTrail = [
  { id: 'AUD-2201', timestamp: '2026-03-26 08:41:02', workflow: 'Demand Planning', action: 'Replenishment scan complete — 8 SKUs at or below DRP; 3 stockout conditions detected', status: 'Escalated' },
  { id: 'AUD-2200', timestamp: '2026-03-26 08:40:58', workflow: 'AP Pipeline', action: 'Unauthorized invoice INV-4414 received from WPS — no matching PO found; flagged P1', status: 'Escalated' },
  { id: 'AUD-2199', timestamp: '2026-03-25 14:22:11', workflow: 'Order Tracking', action: 'PO-2603-04 acknowledgment SLA breached (72h) — second follow-up sent to Polaris Industries', status: 'Escalated' },
  { id: 'AUD-2198', timestamp: '2026-03-25 09:14:33', workflow: 'AP Pipeline', action: 'INV-4411 three-way match failed — $132 price variance flagged; invoice held pending review', status: 'Escalated' },
  { id: 'AUD-2197', timestamp: '2026-03-24 16:08:44', workflow: 'Receiving', action: 'PO-2603-01 partial receipt confirmed — 2 of 3 line items received and matched; 1 line pending', status: 'In Progress' },
  { id: 'AUD-2196', timestamp: '2026-03-24 11:31:22', workflow: 'Order Tracking', action: 'PO-2603-06 passed expected delivery date — carrier follow-up initiated; ETA pending', status: 'Escalated' },
  { id: 'AUD-2195', timestamp: '2026-03-23 15:44:09', workflow: 'Vendor Performance', action: 'WPS monthly scorecard updated — on-time delivery rate declined to 84%; classification Watch maintained', status: 'Completed' },
  { id: 'AUD-2194', timestamp: '2026-03-22 09:02:17', workflow: 'PO Generation', action: 'PO-2603-05 issued to Parts Unlimited — 4 line items, $6,920 total; within autonomous threshold', status: 'Completed' },
  { id: 'AUD-2193', timestamp: '2026-03-21 14:18:44', workflow: 'AP Pipeline', action: 'INV-4410 three-way match passed — $22,100 approved and queued for payment run Apr 7', status: 'Completed' },
];

// ─── PIPELINE STAGE COUNTS ───────────────────────────────────────────────────
export const pipelineStages = [
  { stage: 'Demand Identified', count: 8, value: 41820 },
  { stage: 'PO Draft', count: 2, value: 8795 },
  { stage: 'PO Issued', count: 3, value: 28450 },
  { stage: 'Acknowledged', count: 2, value: 28120 },
  { stage: 'In-Transit', count: 2, value: 32740 },
  { stage: 'Received', count: 1, value: 18460 },
  { stage: 'Reconciled', count: 2, value: 31580 },
  { stage: 'AP Approved', count: 1, value: 22100 },
];

// ─── VENDOR SCORECARD TRENDS ─────────────────────────────────────────────────
export const vendorTrends = [
  { vendor: 'BRP Parts Direct', q1: 96, q2: 95, q3: 97, q4: 94, trend: 'stable' },
  { vendor: 'Tucker Powersports', q1: 90, q2: 92, q3: 94, q4: 91, trend: 'stable' },
  { vendor: 'Parts Unlimited', q1: 91, q2: 89, q3: 88, q4: 88, trend: 'declining' },
  { vendor: 'Dayco Products', q1: 93, q2: 95, q3: 96, q4: 97, trend: 'improving' },
  { vendor: 'WPS', q1: 89, q2: 87, q3: 85, q4: 84, trend: 'declining' },
  { vendor: 'Polaris Industries', q1: 88, q2: 90, q3: 91, q4: 89, trend: 'stable' },
  { vendor: 'Fox Factory', q1: 94, q2: 96, q3: 97, q4: 96, trend: 'stable' },
  { vendor: 'Gates Unitta', q1: 88, q2: 87, q3: 86, q4: 86, trend: 'declining' },
];

// ─── AP AGING ────────────────────────────────────────────────────────────────
export const apAging = [
  { bucket: '0–30 days', amount: 64640, pct: 72 },
  { bucket: '31–60 days', amount: 18200, pct: 20 },
  { bucket: '61–90 days', amount: 5400, pct: 6 },
  { bucket: '90+ days', amount: 1840, pct: 2 },
];
