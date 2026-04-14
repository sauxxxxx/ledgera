import {
  MasterCellStack,
  type MasterDataColumn,
  type MasterDataFilter,
  type MasterDataRecordBase,
  type MasterDataSort,
  type MasterDataTone,
  MasterPill,
  MasterPrimaryCell,
  MasterRecordsWorkspace,
  type SharedMasterDataComponents
} from "./MasterRecordsWorkspace";
import { useState } from "react";

type ClientCharge = {
  amount: string;
  detail: string;
  label: string;
};

type ClientPaymentStatus = "Paid" | "Partial" | "Due" | "Scheduled";
type ClientPaymentCategory = "First payment" | "Monthly payment" | "Partial payment";

type ClientPaymentEntry = {
  amountDue: string;
  amountPaid: string;
  balance: string;
  category: ClientPaymentCategory;
  dateLabel: string;
  id: string;
  label: string;
  note: string;
  status: ClientPaymentStatus;
};

type ClientRecord = MasterDataRecordBase & {
  addOnServices: ClientCharge[];
  billingEmail: string;
  contactNumber: string;
  contactPerson: string;
  contractDuration: string;
  contractWindow: string;
  contractStatus: string;
  engagementType: string;
  monthlyBillingAmount: string;
  monthlyBillingValue: number;
  oneTimeFees: ClientCharge[];
  outstandingBalance: string;
  outstandingBalanceValue: number;
  packageName: string;
  paymentSummary: string;
  payments: ClientPaymentEntry[];
  tin: string;
  updatedRank: number;
};

const clientPackageOptions = [
  { value: "all", label: "All package types" },
  { value: "Retainer", label: "Retainer" },
  { value: "Implementation", label: "Implementation" },
  { value: "Advisory", label: "Advisory" }
];

const clientPaymentStatusOptions = [
  { value: "all", label: "All payment states" },
  { value: "Current", label: "Current" },
  { value: "First payment pending", label: "First payment pending" },
  { value: "Partial payment", label: "Partial payment" }
];

const paymentStatusTone: Record<ClientPaymentStatus, MasterDataTone> = {
  Paid: "ready",
  Partial: "pending",
  Due: "attention",
  Scheduled: "neutral"
};

const clientRecords: ClientRecord[] = [
  {
    id: "client-northstar",
    avatarLabel: "NS",
    avatarTone: "client",
    name: "Northstar Studio",
    sublabel: "Mara Quimson | billing@northstar.studio",
    contactPerson: "Mara Quimson",
    contactNumber: "+63 917 551 0144",
    billingEmail: "billing@northstar.studio",
    tin: "239-541-882-000",
    packageName: "Finance concierge",
    engagementType: "Retainer",
    contractDuration: "12 months",
    contractWindow: "Jan 1, 2026 to Dec 31, 2026",
    contractStatus: "Active and auto-renewing",
    monthlyBillingAmount: "PHP 82,000 / month",
    monthlyBillingValue: 82000,
    oneTimeFees: [
      {
        label: "Domain registration",
        detail: "Annual domain and DNS setup for the finance portal",
        amount: "PHP 12,000"
      },
      {
        label: "Onboarding setup",
        detail: "Initial ledger cleanup and migration support",
        amount: "PHP 8,000"
      }
    ],
    addOnServices: [
      {
        label: "BIR filing support",
        detail: "Monthly add-on for filing pack preparation",
        amount: "PHP 6,000 / month"
      },
      {
        label: "Payroll review",
        detail: "Monthly payroll review before release",
        amount: "PHP 9,500 / month"
      }
    ],
    paymentSummary: "First payment cleared and April recurring bill paid",
    outstandingBalance: "PHP 0",
    outstandingBalanceValue: 0,
    payments: [
      {
        id: "northstar-first",
        category: "First payment",
        label: "First payment",
        note: "Initial kickoff invoice covering the first month plus onboarding charges",
        dateLabel: "Paid Jan 4, 2026",
        amountDue: "PHP 102,000",
        amountPaid: "PHP 102,000",
        balance: "PHP 0",
        status: "Paid"
      },
      {
        id: "northstar-march",
        category: "Monthly payment",
        label: "March 2026 billing",
        note: "Base monthly billing plus recurring add-on services",
        dateLabel: "Paid Mar 5, 2026",
        amountDue: "PHP 97,500",
        amountPaid: "PHP 97,500",
        balance: "PHP 0",
        status: "Paid"
      },
      {
        id: "northstar-april",
        category: "Monthly payment",
        label: "April 2026 billing",
        note: "Base monthly billing plus recurring add-on services",
        dateLabel: "Paid Apr 5, 2026",
        amountDue: "PHP 97,500",
        amountPaid: "PHP 97,500",
        balance: "PHP 0",
        status: "Paid"
      }
    ],
    updatedAt: "2 hours ago",
    updatedRank: 1,
    health: { label: "Current", tone: "ready" },
    drawer: {
      kicker: "Client profile",
      code: "CL-1001",
      title: "Northstar Studio",
      description: "Retainer client with a complete contract, clear recurring billing, and a fully settled payment trail.",
      badges: [
        { label: "Current", tone: "ready" },
        { label: "Retainer", tone: "accent" },
        { label: "VAT", tone: "info" }
      ],
      summary: [
        { label: "Package availed", value: "Finance concierge" },
        { label: "Contract duration", value: "12 months" },
        { label: "Monthly billing", value: "PHP 82,000 / month" },
        { label: "Outstanding", value: "PHP 0" }
      ],
      sections: [],
      footerActionLabel: "Open payment history",
      footerActionNotice: "Detailed payment history will connect here next. Northstar already has a complete first and recurring payment trail."
    }
  },
  {
    id: "client-harborview",
    avatarLabel: "HV",
    avatarTone: "client",
    name: "Harborview Foods",
    sublabel: "Janine Dy | ap@harborview.ph",
    contactPerson: "Janine Dy",
    contactNumber: "+63 917 621 3800",
    billingEmail: "ap@harborview.ph",
    tin: "214-772-501-000",
    packageName: "Inventory cleanup",
    engagementType: "Implementation",
    contractDuration: "6 months",
    contractWindow: "Feb 1, 2026 to Jul 31, 2026",
    contractStatus: "Milestone billing live",
    monthlyBillingAmount: "PHP 40,000 / month",
    monthlyBillingValue: 40000,
    oneTimeFees: [
      {
        label: "Data migration fee",
        detail: "Historical SKU and stock record normalization",
        amount: "PHP 35,000"
      },
      {
        label: "Domain transfer fee",
        detail: "Domain transfer and email routing handoff",
        amount: "PHP 8,500"
      }
    ],
    addOnServices: [
      {
        label: "On-site stock count support",
        detail: "Monthly field support during implementation",
        amount: "PHP 15,000 / month"
      }
    ],
    paymentSummary: "First payment invoice is still open",
    outstandingBalance: "PHP 83,500",
    outstandingBalanceValue: 83500,
    payments: [
      {
        id: "harborview-first",
        category: "First payment",
        label: "First payment",
        note: "Initial invoice covering month one plus one-time setup charges",
        dateLabel: "Due Apr 12, 2026",
        amountDue: "PHP 83,500",
        amountPaid: "PHP 0",
        balance: "PHP 83,500",
        status: "Due"
      },
      {
        id: "harborview-april",
        category: "Monthly payment",
        label: "April 2026 billing",
        note: "Second monthly invoice once the first milestone is approved",
        dateLabel: "Scheduled Apr 30, 2026",
        amountDue: "PHP 55,000",
        amountPaid: "PHP 0",
        balance: "PHP 55,000",
        status: "Scheduled"
      }
    ],
    updatedAt: "Today",
    updatedRank: 2,
    health: { label: "First payment pending", tone: "attention" },
    drawer: {
      kicker: "Client profile",
      code: "CL-1014",
      title: "Harborview Foods",
      description: "Implementation client with pricing configured, but the first payment still needs to land before the monthly billing rhythm feels stable.",
      badges: [
        { label: "First payment pending", tone: "attention" },
        { label: "Implementation", tone: "accent" },
        { label: "Priority", tone: "info" }
      ],
      summary: [
        { label: "Package availed", value: "Inventory cleanup" },
        { label: "Contract duration", value: "6 months" },
        { label: "Monthly billing", value: "PHP 40,000 / month" },
        { label: "Outstanding", value: "PHP 83,500" }
      ],
      sections: [],
      footerActionLabel: "Send first-payment reminder",
      footerActionNotice: "First-payment follow-up will connect here next. Harborview is the clearest example of a client waiting on its initial invoice."
    }
  },
  {
    id: "client-echofleet",
    avatarLabel: "EF",
    avatarTone: "client",
    name: "EchoFleet Logistics",
    sublabel: "Victor Co | finance@echofleet.co",
    contactPerson: "Victor Co",
    contactNumber: "+63 998 440 6612",
    billingEmail: "finance@echofleet.co",
    tin: "205-618-094-000",
    packageName: "Bookkeeping + payroll",
    engagementType: "Retainer",
    contractDuration: "12 months",
    contractWindow: "Jan 1, 2026 to Dec 31, 2026",
    contractStatus: "Active with one partial collection",
    monthlyBillingAmount: "PHP 126,000 / month",
    monthlyBillingValue: 126000,
    oneTimeFees: [
      {
        label: "Payroll migration",
        detail: "Historical payroll and leave balance migration",
        amount: "PHP 18,000"
      }
    ],
    addOnServices: [
      {
        label: "Fleet allowances tracker",
        detail: "Monthly reimbursement and allowance review",
        amount: "PHP 12,000 / month"
      },
      {
        label: "Branch reimbursements review",
        detail: "Monthly add-on for multi-branch expense reviews",
        amount: "PHP 8,000 / month"
      }
    ],
    paymentSummary: "April recurring bill was only partially settled",
    outstandingBalance: "PHP 42,000",
    outstandingBalanceValue: 42000,
    payments: [
      {
        id: "echofleet-first",
        category: "First payment",
        label: "First payment",
        note: "Initial invoice covering kickoff plus payroll migration",
        dateLabel: "Paid Jan 6, 2026",
        amountDue: "PHP 144,000",
        amountPaid: "PHP 144,000",
        balance: "PHP 0",
        status: "Paid"
      },
      {
        id: "echofleet-march",
        category: "Monthly payment",
        label: "March 2026 billing",
        note: "Base monthly billing plus active add-on services",
        dateLabel: "Paid Mar 8, 2026",
        amountDue: "PHP 146,000",
        amountPaid: "PHP 146,000",
        balance: "PHP 0",
        status: "Paid"
      },
      {
        id: "echofleet-april",
        category: "Partial payment",
        label: "April 2026 billing",
        note: "Partial collection received while branch approvals were still pending",
        dateLabel: "Received Apr 7, 2026",
        amountDue: "PHP 146,000",
        amountPaid: "PHP 104,000",
        balance: "PHP 42,000",
        status: "Partial"
      }
    ],
    updatedAt: "Yesterday",
    updatedRank: 3,
    health: { label: "Partial payment", tone: "pending" },
    drawer: {
      kicker: "Client profile",
      code: "CL-1022",
      title: "EchoFleet Logistics",
      description: "Retainer client with solid recurring billing, but the current month remains partially paid and needs active follow-through.",
      badges: [
        { label: "Partial payment", tone: "pending" },
        { label: "Retainer", tone: "accent" },
        { label: "Payroll", tone: "info" }
      ],
      summary: [
        { label: "Package availed", value: "Bookkeeping + payroll" },
        { label: "Contract duration", value: "12 months" },
        { label: "Monthly billing", value: "PHP 126,000 / month" },
        { label: "Outstanding", value: "PHP 42,000" }
      ],
      sections: [],
      footerActionLabel: "Review partial payment",
      footerActionNotice: "Partial-payment follow-up will connect here next. EchoFleet already shows the open balance that AR should continue to track."
    }
  },
  {
    id: "client-lumen",
    avatarLabel: "LC",
    avatarTone: "client",
    name: "Lumen Care",
    sublabel: "Celine Yu | finance@lumencare.ph",
    contactPerson: "Celine Yu",
    contactNumber: "+63 917 299 4104",
    billingEmail: "finance@lumencare.ph",
    tin: "226-405-310-000",
    packageName: "Tax planning advisory",
    engagementType: "Advisory",
    contractDuration: "12 months",
    contractWindow: "Apr 1, 2026 to Mar 31, 2027",
    contractStatus: "Current with scheduled billing",
    monthlyBillingAmount: "PHP 60,000 / month",
    monthlyBillingValue: 60000,
    oneTimeFees: [
      {
        label: "Domain renewal",
        detail: "Annual domain renewal for client document access",
        amount: "PHP 6,000"
      }
    ],
    addOnServices: [
      {
        label: "Executive reporting add-on",
        detail: "Monthly board and leadership reporting support",
        amount: "PHP 9,000 / month"
      }
    ],
    paymentSummary: "First payment cleared and the next monthly bill is scheduled",
    outstandingBalance: "PHP 0",
    outstandingBalanceValue: 0,
    payments: [
      {
        id: "lumen-first",
        category: "First payment",
        label: "First payment",
        note: "Initial invoice covering the first month plus annual domain fee",
        dateLabel: "Paid Apr 1, 2026",
        amountDue: "PHP 66,000",
        amountPaid: "PHP 66,000",
        balance: "PHP 0",
        status: "Paid"
      },
      {
        id: "lumen-may",
        category: "Monthly payment",
        label: "May 2026 billing",
        note: "Base advisory billing plus the executive reporting add-on",
        dateLabel: "Scheduled Apr 29, 2026",
        amountDue: "PHP 69,000",
        amountPaid: "PHP 0",
        balance: "PHP 69,000",
        status: "Scheduled"
      }
    ],
    updatedAt: "3 days ago",
    updatedRank: 4,
    health: { label: "Current", tone: "ready" },
    drawer: {
      kicker: "Client profile",
      code: "CL-1030",
      title: "Lumen Care",
      description: "Advisory client with a live contract, clean monthly pricing, and a predictable payment cadence.",
      badges: [
        { label: "Current", tone: "ready" },
        { label: "Advisory", tone: "accent" },
        { label: "Scheduled billing", tone: "info" }
      ],
      summary: [
        { label: "Package availed", value: "Tax planning advisory" },
        { label: "Contract duration", value: "12 months" },
        { label: "Monthly billing", value: "PHP 60,000 / month" },
        { label: "Outstanding", value: "PHP 0" }
      ],
      sections: [],
      footerActionLabel: "Review contract billing",
      footerActionNotice: "Contract billing review will connect here next. Lumen already has the first payment and next monthly charge clearly staged."
    }
  }
];

function pluralize(label: string, count: number, pluralLabel = `${label}s`) {
  return `${count} ${count === 1 ? label : pluralLabel}`;
}

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  maximumFractionDigits: 0
});

function parsePesoValue(value: string) {
  const parsedValue = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatPesoValue(value: number) {
  return `PHP ${pesoFormatter.format(Math.round(value))}`;
}

function formatBillingLabel(value: string) {
  const match = value.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})/i);

  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  return value.replace(/^(Paid|Due|Scheduled)\s+/i, "");
}

function ClientPaymentCell({ record }: { record: ClientRecord }) {
  return <MasterPill label={record.health.label} tone={record.health.tone} />;
}

function ClientBalanceCell({ record }: { record: ClientRecord }) {
  return (
    <div className="client-balance-cell">
      <strong>{record.outstandingBalance}</strong>
    </div>
  );
}

function ClientChargeGroup({
  charges,
  description,
  title
}: {
  charges: ClientCharge[];
  description: string;
  title: string;
}) {
  return (
    <div className="client-charge-group">
      <div className="client-section-subhead">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <div className="client-charge-list">
        {charges.map((charge) => (
          <div key={`${title}-${charge.label}`} className="client-charge-item">
            <div className="client-charge-copy">
              <strong>{charge.label}</strong>
              <span>{charge.detail}</span>
            </div>
            <strong className="client-charge-amount">{charge.amount}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientBillingTrendChart({ record }: { record: ClientRecord }) {
  const trendPoints =
    record.payments.length > 0
      ? record.payments.map((payment) => ({
          billed: parsePesoValue(payment.amountDue),
          collected: parsePesoValue(payment.amountPaid),
          label: formatBillingLabel(payment.dateLabel),
          status: payment.status
        }))
      : [
          {
            billed: record.monthlyBillingValue,
            collected: 0,
            label: "Current",
            status: record.outstandingBalanceValue > 0 ? ("Due" as const) : ("Scheduled" as const)
          }
        ];

  const totalBilled = trendPoints.reduce((sum, point) => sum + point.billed, 0);
  const totalCollected = trendPoints.reduce((sum, point) => sum + point.collected, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const chartCeiling = Math.max(5000, Math.ceil((Math.max(...trendPoints.map((point) => Math.max(point.billed, point.collected))) * 1.15) / 5000) * 5000);

  const svgWidth = 680;
  const svgHeight = 220;
  const svgLeft = 58;
  const svgRight = 18;
  const svgTop = 18;
  const svgBottom = 40;
  const plotWidth = svgWidth - svgLeft - svgRight;
  const plotHeight = svgHeight - svgTop - svgBottom;
  const baselineY = svgTop + plotHeight;
  const slotWidth = plotWidth / trendPoints.length;
  const billedBarWidth = Math.max(14, Math.min(28, slotWidth * 0.22));
  const collectedBarWidth = Math.max(14, Math.min(28, slotWidth * 0.22));
  const collectedPath = trendPoints
    .map((point, index) => {
      const centerX = svgLeft + slotWidth * (index + 0.5);
      const y = baselineY - (point.collected / chartCeiling) * plotHeight;
      return `${index === 0 ? "M" : "L"} ${centerX} ${y}`;
    })
    .join(" ");

  const axisTicks = [chartCeiling, Math.round(chartCeiling / 2), 0];

  return (
    <div className="client-overview-chart">
      <div className="client-overview-chart-stats">
        <article className="client-overview-chart-stat">
          <span>Total billed</span>
          <strong>{formatPesoValue(totalBilled)}</strong>
          <p>Across tracked payment entries</p>
        </article>

        <article className="client-overview-chart-stat">
          <span>Total collected</span>
          <strong>{formatPesoValue(totalCollected)}</strong>
          <p>Actual receipts recorded</p>
        </article>

        <article className="client-overview-chart-stat">
          <span>Collection rate</span>
          <strong>{collectionRate}%</strong>
          <p>Billed versus collected</p>
        </article>
      </div>

      <div className="client-overview-chart-surface">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="client-overview-chart-svg" aria-label="Billing trend chart" role="img">
          {axisTicks.map((value, index) => {
            const y = index === 0 ? svgTop : index === 1 ? svgTop + plotHeight / 2 : baselineY;
            return (
              <g key={`${value}-${index}`}>
                <line className="client-overview-chart-grid" x1={svgLeft} x2={svgWidth - svgRight} y1={y} y2={y} />
                <text className="client-overview-chart-axis-label" x={0} y={y + 4}>
                  {value === 0 ? "PHP 0" : formatPesoValue(value)}
                </text>
              </g>
            );
          })}

          <line className="client-overview-chart-axis" x1={svgLeft} x2={svgWidth - svgRight} y1={baselineY} y2={baselineY} />

          {trendPoints.map((point, index) => {
            const centerX = svgLeft + slotWidth * (index + 0.5);
            const billedHeight = Math.max(4, (point.billed / chartCeiling) * plotHeight);
            const collectedHeight = Math.max(4, (point.collected / chartCeiling) * plotHeight);
            const billedX = centerX - billedBarWidth - 4;
            const collectedX = centerX + 4;
            const collectedY = baselineY - (point.collected / chartCeiling) * plotHeight;

            return (
              <g key={`${point.label}-${index}`}>
                <rect className="client-overview-chart-bar client-overview-chart-bar-billed" x={billedX} y={baselineY - billedHeight} width={billedBarWidth} height={billedHeight} rx={4} />
                <rect className="client-overview-chart-bar client-overview-chart-bar-collected" x={collectedX} y={baselineY - collectedHeight} width={collectedBarWidth} height={collectedHeight} rx={4} />
                <text className="client-overview-chart-label" x={centerX} y={svgHeight - 10} textAnchor="middle">
                  {point.label}
                </text>
                <circle className="client-overview-chart-point" cx={centerX + 4 + collectedBarWidth / 2} cy={collectedY} r={4} />
              </g>
            );
          })}

          <path className="client-overview-chart-line" d={collectedPath} />
        </svg>
      </div>

      <div className="client-overview-chart-legend">
        <div className="client-overview-chart-legend-list">
          <span className="client-overview-chart-legend-item">
            <span className="client-overview-chart-swatch client-overview-chart-swatch-billed" />
            Billed
          </span>
          <span className="client-overview-chart-legend-item">
            <span className="client-overview-chart-swatch client-overview-chart-swatch-collected" />
            Collected
          </span>
        </div>
        <span className="client-overview-chart-note">{formatPesoValue(totalCollected)} collected out of {formatPesoValue(totalBilled)} billed.</span>
      </div>
    </div>
  );
}

function renderClientDrawerBody(record: ClientRecord) {
  const firstPayment = record.payments.find((payment) => payment.category === "First payment");
  const monthlyPaymentCount = record.payments.filter((payment) => payment.category === "Monthly payment").length;
  const partialPaymentCount = record.payments.filter((payment) => payment.category === "Partial payment").length;
  const latestPayment = record.payments[record.payments.length - 1];
  const nextDuePayment = record.payments.find((payment) => payment.status === "Due" || payment.status === "Scheduled");
  const recentPayments = record.payments.slice(0, 3);
  const totalTrackedPayments = record.payments.length;
  const recurringStatus = `${monthlyPaymentCount} tracked month${monthlyPaymentCount === 1 ? "" : "s"}`;
  const openPartialStatus =
    partialPaymentCount > 0 ? `${partialPaymentCount} open partial balance${partialPaymentCount === 1 ? "" : "s"}` : "No open partial balances";

  const billingHighlights = [
    {
      label: "Current state",
      note: record.paymentSummary,
      tone: record.health.tone,
      value: record.health.label
    },
    {
      label: "Outstanding",
      note: record.outstandingBalanceValue > 0 ? "Open balance to collect" : "Nothing pending",
      tone: record.outstandingBalanceValue > 0 ? "attention" : "ready",
      value: record.outstandingBalance
    },
    {
      label: "Next due",
      note: nextDuePayment ? nextDuePayment.label : "Ready for the next billing run",
      tone: nextDuePayment ? paymentStatusTone[nextDuePayment.status] : "neutral",
      value: nextDuePayment ? nextDuePayment.dateLabel : "No queued invoice"
    },
    {
      label: "Monthly bill",
      note: recurringStatus,
      tone: "accent",
      value: record.monthlyBillingAmount
    }
  ] as const;

  const cadenceItems = [
    {
      detail: firstPayment ? firstPayment.dateLabel : "Waiting for the kickoff invoice",
      label: "First payment",
      meta: firstPayment ? firstPayment.amountDue : record.monthlyBillingAmount,
      status: firstPayment ? firstPayment.status : "Not scheduled",
      tone: firstPayment ? paymentStatusTone[firstPayment.status] : "neutral"
    },
    {
      detail: latestPayment ? `Latest receipt ${latestPayment.dateLabel}` : "Recurring receipts will appear here",
      label: "Recurring cycle",
      meta: recurringStatus,
      status: record.health.label,
      tone: "info"
    },
    {
      detail: partialPaymentCount > 0 ? "Needs follow-up before the next cycle" : "No partial balances are open",
      label: "Partial balances",
      meta: record.outstandingBalance,
      status: openPartialStatus,
      tone: partialPaymentCount > 0 ? "attention" : "ready"
    }
  ] as const;

  return (
    <div className="client-billing-dashboard">
      <section className="client-billing-hero">
        <div className="client-billing-hero-copy">
          <span className="client-billing-kicker">Billing cockpit</span>
          <strong>{record.paymentSummary}</strong>
          <p>
            {record.packageName} | {record.engagementType} | {record.contractStatus}
          </p>
        </div>

        <div className="client-billing-hero-metrics">
          {billingHighlights.map((highlight) => (
            <article key={highlight.label} className={`client-billing-metric client-billing-metric-${highlight.tone}`}>
              <span>{highlight.label}</span>
              <strong>{highlight.value}</strong>
              <p>{highlight.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="client-profile-workspace-section client-billing-section">
        <div className="client-profile-workspace-section-head">
          <div>
            <strong>Billing cadence</strong>
            <span>First payment, recurring billing, and partial balances from one view.</span>
          </div>
          <MasterPill label={record.health.label} tone={record.health.tone} />
        </div>

        <div className="client-billing-cadence">
          {cadenceItems.map((item) => (
            <article key={item.label} className={`client-billing-cadence-item client-billing-cadence-item-${item.tone}`}>
              <div className="client-billing-cadence-copy">
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>

              <div className="client-billing-cadence-meta">
                <MasterPill label={item.status} tone={item.tone} />
                <strong>{item.meta}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="client-profile-workspace-section client-billing-section">
        <div className="client-profile-workspace-section-head">
          <div>
            <strong>Recent payment trail</strong>
            <span>{pluralize("entry", totalTrackedPayments, "entries")} surfaced from the billing ledger.</span>
          </div>
        </div>

        <div className="client-billing-trace">
          {recentPayments.map((payment) => (
            <article key={payment.id} className={`client-billing-trace-item client-billing-trace-item-${paymentStatusTone[payment.status]}`}>
              <div className="client-billing-trace-main">
                <div className="client-billing-trace-copy">
                  <strong>{payment.label}</strong>
                  <span>{payment.note}</span>
                </div>

                <div className="client-billing-trace-meta">
                  <span className="client-billing-trace-date">{payment.dateLabel}</span>
                  <MasterPill label={payment.status} tone={paymentStatusTone[payment.status]} />
                </div>
              </div>

              <div className="client-billing-trace-values">
                <div className="client-billing-trace-value">
                  <span>Amount due</span>
                  <strong>{payment.amountDue}</strong>
                </div>
                <div className="client-billing-trace-value">
                  <span>Amount paid</span>
                  <strong>{payment.amountPaid}</strong>
                </div>
                <div className="client-billing-trace-value">
                  <span>Balance</span>
                  <strong>{payment.balance}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

type ClientWorkspaceTab = "overview" | "billing" | "notes" | "documents" | "files";

function ClientWorkspaceIcon({
  kind
}: {
  kind: "activity" | "action" | "billing" | "close" | "document" | "edit" | "file" | "note";
}) {
  switch (kind) {
    case "close":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="m4.5 4.5 9 9" />
          <path d="m13.5 4.5-9 9" />
        </svg>
      );
    case "edit":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4.5 12.5 12.6 4.4l1.9 1.9-8.1 8.1-2.4.5.5-2.4Z" />
          <path d="M10.7 5.3 12.7 7.3" />
        </svg>
      );
    case "billing":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4.5 4.5h9v9h-9z" />
          <path d="M6.25 7.25h5.5" />
          <path d="M6.25 9.75h3.5" />
        </svg>
      );
    case "document":
    case "file":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M5.5 3.75h5.2l2.8 2.8v7.7h-8z" />
          <path d="M10.7 3.75v3.1h3.1" />
        </svg>
      );
    case "note":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4.5 4.5h9v9h-9z" />
          <path d="M6.25 7h5.5" />
          <path d="M6.25 9.5h4.1" />
        </svg>
      );
    case "activity":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4.5 12.5h2.8l1.3-5 1.6 3.8 1.3-2.4h1.95" />
          <path d="M4.5 5.75h9" />
        </svg>
      );
    case "action":
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 4v10" />
          <path d="M4 9h10" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4.5 4.5h9v9h-9z" />
          <path d="m6.25 9.2 1.5 1.45 3.25-3.4" />
        </svg>
      );
  }
}

function ClientProfileDetailRow({
  accent,
  label,
  value
}: {
  accent?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className={`client-profile-detail-row ${accent ? "client-profile-detail-row-accent" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ClientProfileModalWorkspace({
  announce,
  close,
  record
}: {
  announce: (notice: string) => void;
  close: () => void;
  record: ClientRecord;
}) {
  const [activeTab, setActiveTab] = useState<ClientWorkspaceTab>("overview");
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const latestPayment = record.payments[record.payments.length - 1];
  const latestReceipt = [...record.payments].reverse().find((payment) => payment.status === "Paid" || payment.status === "Partial") ?? latestPayment;
  const nextDuePayment = record.payments.find((payment) => payment.status === "Due" || payment.status === "Scheduled");
  const billingTrendPoints = record.payments.map((payment) => ({
    billed: parsePesoValue(payment.amountDue),
    collected: parsePesoValue(payment.amountPaid),
    label: formatBillingLabel(payment.dateLabel),
    status: payment.status
  }));
  const totalBilled = billingTrendPoints.reduce((sum, point) => sum + point.billed, 0);
  const totalCollected = billingTrendPoints.reduce((sum, point) => sum + point.collected, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const openPaymentCount = record.payments.filter((payment) => payment.status !== "Paid").length;

  const overviewHighlights = [
    {
      label: "Current balance",
      note: openPaymentCount > 0 ? `${openPaymentCount} open payment${openPaymentCount === 1 ? "" : "s"} to collect` : "Everything is settled",
      tone: record.outstandingBalanceValue > 0 ? ("attention" as const) : ("ready" as const),
      value: record.outstandingBalance
    },
    {
      label: "Collection rate",
      note: `${formatPesoValue(totalCollected)} collected of ${formatPesoValue(totalBilled)} billed`,
      tone: collectionRate >= 95 ? ("ready" as const) : collectionRate >= 70 ? ("accent" as const) : ("attention" as const),
      value: `${collectionRate}%`
    },
    {
      label: "Next due",
      note: nextDuePayment ? nextDuePayment.label : "Billing is current",
      tone: nextDuePayment ? paymentStatusTone[nextDuePayment.status] : "neutral",
      value: nextDuePayment ? nextDuePayment.dateLabel : "No queued invoice"
    },
    {
      label: "Latest receipt",
      note: latestReceipt ? latestReceipt.dateLabel : "Awaiting first receipt",
      tone: latestReceipt ? paymentStatusTone[latestReceipt.status] : "neutral",
      value: latestReceipt ? latestReceipt.amountPaid : "No receipt yet"
    }
  ] as const;

  const overviewActivityItems = [
    {
      detail: record.paymentSummary,
      id: "current-state",
      meta: "Current state"
    },
    {
      detail: latestReceipt
        ? `${latestReceipt.label} recorded ${formatBillingLabel(latestReceipt.dateLabel)} for ${latestReceipt.amountPaid}.`
        : "No receipt has been recorded yet.",
      id: "latest-receipt",
      meta: "Latest receipt"
    },
    {
      detail: nextDuePayment ? `${nextDuePayment.label} is next and ${formatBillingLabel(nextDuePayment.dateLabel)}.` : "No invoice is queued right now.",
      id: "next-due",
      meta: "Next due"
    }
  ];

  const pinnedDocuments = [
    {
      detail: record.contractWindow,
      icon: "document" as const,
      id: "contract",
      title: "Contract brief",
      tone: "blue"
    },
    {
      detail: record.monthlyBillingAmount,
      icon: "billing" as const,
      id: "pricing",
      title: "Pricing sheet",
      tone: "amber"
    },
    {
      detail: `${record.oneTimeFees.length} one-time fee${record.oneTimeFees.length === 1 ? "" : "s"} and ${record.addOnServices.length} add-on${record.addOnServices.length === 1 ? "" : "s"}`,
      icon: "file" as const,
      id: "supporting",
      title: "Supporting files",
      tone: "green"
    }
  ];

  const quickActions = [
    {
      description: "Record a settlement or partial receipt.",
      id: "log-payment",
      icon: "billing" as const,
      label: "Log payment",
      notice: "Payment logging will connect here next."
    },
    {
      description: "Capture a note for the account team.",
      id: "add-note",
      icon: "note" as const,
      label: "Add note",
      notice: "Client note capture will connect here next."
    },
    {
      description: "Generate the next invoice from this profile.",
      id: "create-invoice",
      icon: "document" as const,
      label: "Create invoice",
      notice: "Invoice creation will connect here next."
    },
    {
      description: "Upload contracts, PDFs, or billing attachments.",
      id: "upload-file",
      icon: "file" as const,
      label: "Upload file",
      notice: "File upload will connect here next."
    },
    {
      description: "Capture a follow-up reminder for the account team.",
      id: "add-reminder",
      icon: "note" as const,
      label: "Add reminder",
      notice: "Client reminder capture will connect here next."
    }
  ];
  const quickActionsPanelId = `client-profile-quick-actions-${record.id}`;

  const tabs: Array<{ count?: number; id: ClientWorkspaceTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { count: record.payments.length, id: "billing", label: "Billing" },
    { count: 1, id: "notes", label: "Notes" },
    { count: record.oneTimeFees.length + record.addOnServices.length, id: "documents", label: "Documents" },
    { count: record.payments.length, id: "files", label: "Files" }
  ];

  const renderWorkspacePanel = () => {
    if (activeTab === "billing") {
      return <div className="client-profile-billing-pane">{renderClientDrawerBody(record)}</div>;
    }

    if (activeTab === "notes") {
      return (
        <section className="client-profile-workspace-section">
          <div className="client-profile-workspace-section-head">
            <div>
              <strong>Notes</strong>
              <span>Short reminders and context for the client record.</span>
            </div>
          </div>

          <div className="client-note-card">
            <div className="client-note-card-head">
              <ClientWorkspaceIcon kind="note" />
              <strong>{record.paymentSummary}</strong>
            </div>
            <p>{record.drawer.footerActionNotice}</p>
            <span>Updated {record.updatedAt}</span>
          </div>
        </section>
      );
    }

    if (activeTab === "documents") {
      return (
        <section className="client-profile-workspace-section">
          <div className="client-profile-workspace-section-head">
            <div>
              <strong>Documents & files</strong>
              <span>Pricing, contract, and support assets tied to this client.</span>
            </div>
          </div>

          <div className="client-doc-grid">
            {pinnedDocuments.map((document) => (
              <article key={document.id} className={`client-doc-card client-doc-card-${document.tone}`}>
                <span className="client-doc-card-icon">
                  <ClientWorkspaceIcon kind={document.icon} />
                </span>
                <strong>{document.title}</strong>
                <p>{document.detail}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "files") {
      return (
        <section className="client-profile-workspace-section">
          <div className="client-profile-workspace-section-head">
            <div>
              <strong>Files</strong>
              <span>Tracked payment records and supporting billing artifacts.</span>
            </div>
          </div>

          <div className="client-file-list">
            {record.payments.map((payment) => (
              <article key={payment.id} className="client-file-row">
                <div className="client-file-row-main">
                  <span className="client-file-row-icon">
                    <ClientWorkspaceIcon kind="billing" />
                  </span>
                  <div className="client-file-row-copy">
                    <strong>{payment.label}</strong>
                    <span>{payment.dateLabel}</span>
                  </div>
                </div>

                <div className="client-file-row-meta">
                  <MasterPill label={payment.status} tone={paymentStatusTone[payment.status]} />
                  <span>{payment.balance}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <div className="client-overview-dashboard">
        <section className="client-overview-hero">
          <div className="client-billing-hero-metrics">
            {overviewHighlights.map((highlight) => (
              <article key={highlight.label} className={`client-billing-metric client-billing-metric-${highlight.tone}`}>
                <span>{highlight.label}</span>
                <strong>{highlight.value}</strong>
                <p>{highlight.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="client-profile-workspace-section">
          <div className="client-profile-workspace-section-head">
            <div>
              <strong>Billing trend</strong>
            </div>
            <button type="button" className="client-profile-section-link" onClick={() => setActiveTab("billing")}>
              Open billing detail
            </button>
          </div>

          <ClientBillingTrendChart record={record} />
        </section>

        <section className="client-profile-workspace-section">
          <div className="client-profile-workspace-section-head">
            <div>
              <strong>Recent billing activity</strong>
            </div>
          </div>

          <div className="client-activity-list">
            {overviewActivityItems.map((activity, index) => (
              <article key={activity.id} className="client-activity-item">
                <span className="client-activity-index">{index + 1}</span>
                <div className="client-activity-copy">
                  <strong>{activity.meta}</strong>
                  <p>{activity.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  };
  const handleQuickAction = (notice: string) => {
    announce(notice);
    setIsQuickActionsOpen(false);
  };

  return (
    <div className="chart-standard-layer client-profile-modal-layer" role="dialog" aria-modal="true" aria-label={`${record.name} profile`}>
      <button type="button" className="chart-standard-backdrop client-profile-modal-backdrop" aria-label="Close client profile" onClick={close} />

      <div className="client-profile-modal-stage">
        <button type="button" className="admin-user-modal-close client-profile-modal-close" aria-label="Close client profile" onClick={close}>
          <ClientWorkspaceIcon kind="close" />
        </button>

        <section className="client-profile-modal-shell">
          <aside className="client-profile-modal-left">
            <div className="client-profile-identity">
              <div className={`client-profile-identity-avatar master-record-avatar master-record-avatar-${record.avatarTone}`}>{record.avatarLabel}</div>
              <span className="client-profile-identity-kicker">
                {record.drawer.kicker} - {record.drawer.code}
              </span>
              <h3>{record.name}</h3>
            </div>

            <section className="client-profile-rail-section">
              <div className="client-profile-rail-head">
                <strong>Client details</strong>
                <button
                  type="button"
                  className="client-profile-rail-link"
                  aria-label="Edit client details"
                  onClick={() => announce("Client detail editing will connect here next.")}
                >
                  <ClientWorkspaceIcon kind="edit" />
                </button>
              </div>

              <div className="client-profile-detail-list">
                <ClientProfileDetailRow label="Primary contact" value={record.contactPerson} />
                <ClientProfileDetailRow accent label="Email" value={record.billingEmail} />
                <ClientProfileDetailRow accent label="Phone number" value={record.contactNumber} />
                <ClientProfileDetailRow label="TIN" value={record.tin} />
                <ClientProfileDetailRow label="Payment status" value={record.health.label} />
              </div>
            </section>

            <section className="client-profile-rail-section">
              <div className="client-profile-rail-head">
                <strong>Contract</strong>
              </div>

              <div className="client-profile-detail-list">
                <ClientProfileDetailRow label="Duration" value={record.contractDuration} />
                <ClientProfileDetailRow label="Window" value={record.contractWindow} />
                <ClientProfileDetailRow label="Monthly billing" value={record.monthlyBillingAmount} />
                <ClientProfileDetailRow label="Outstanding" value={record.outstandingBalance} />
              </div>
            </section>
          </aside>

          <div className="client-profile-modal-right">
            <div className="client-profile-tabs" role="tablist" aria-label={`${record.name} profile sections`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`client-profile-tab ${activeTab === tab.id ? "client-profile-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" ? <em>{tab.count}</em> : null}
                </button>
              ))}
            </div>

            <div className="client-profile-modal-workspace">{renderWorkspacePanel()}</div>

            <div className="client-profile-action-fab" aria-label="Client actions">
              <aside
                id={quickActionsPanelId}
                className={`client-profile-action-dock ${isQuickActionsOpen ? "client-profile-action-dock-open" : ""}`}
                aria-hidden={!isQuickActionsOpen}
              >
                <div className="client-profile-action-dock-head">
                  <strong>Quick actions</strong>
                  <span>Record work without leaving the profile</span>
                </div>

                <div className="client-profile-action-list">
                  {quickActions.map((action) => (
                    <button key={action.id} type="button" className="client-profile-action-item" onClick={() => handleQuickAction(action.notice)}>
                      <span className="client-profile-action-icon">
                        <ClientWorkspaceIcon kind={action.icon} />
                      </span>
                      <span className="client-profile-action-copy">
                        <strong>{action.label}</strong>
                        <span>{action.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              <button
                type="button"
                className={`client-profile-action-toggle ${isQuickActionsOpen ? "client-profile-action-toggle-open" : ""}`}
                aria-controls={quickActionsPanelId}
                aria-expanded={isQuickActionsOpen}
                aria-label={isQuickActionsOpen ? "Close quick actions" : "Open quick actions"}
                onClick={() => setIsQuickActionsOpen((isOpen) => !isOpen)}
              >
                <ClientWorkspaceIcon kind={isQuickActionsOpen ? "close" : "action"} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const clientColumns: MasterDataColumn<ClientRecord>[] = [
  {
    id: "client",
    label: "Client",
    render: (record) => (
      <MasterPrimaryCell
        avatarLabel={record.avatarLabel}
        avatarTone={record.avatarTone}
        title={record.name}
        subtitle={`${record.contactPerson} | ${record.billingEmail}`}
      />
    )
  },
  {
    id: "package",
    label: "Package availed",
    render: (record) => (
      <MasterCellStack
        title={record.packageName}
        subtitle={pluralize("add-on", record.addOnServices.length, "add-ons")}
      />
    )
  },
  {
    id: "contract",
    label: "Contract duration",
    render: (record) => <MasterCellStack title={record.contractDuration} />
  },
  {
    id: "billing",
    label: "Monthly billing",
    render: (record) => <MasterCellStack title={record.monthlyBillingAmount} />
  },
  {
    id: "payments",
    label: "Status",
    render: (record) => <ClientPaymentCell record={record} />
  },
  {
    id: "balance",
    label: "Outstanding",
    render: (record) => <ClientBalanceCell record={record} />
  }
];

const clientFilters: MasterDataFilter<ClientRecord>[] = [
  {
    id: "package",
    label: "Package type",
    options: clientPackageOptions,
    getValue: (record) => record.engagementType
  },
  {
    id: "payment-status",
    label: "Payment status",
    options: clientPaymentStatusOptions,
    getValue: (record) => record.health.label
  }
];

const clientSorts: MasterDataSort<ClientRecord>[] = [
  {
    id: "name",
    label: "Sort by name",
    compare: (left, right) => left.name.localeCompare(right.name)
  },
  {
    id: "billing",
    label: "Sort by billing amount",
    compare: (left, right) => right.monthlyBillingValue - left.monthlyBillingValue
  },
  {
    id: "balance",
    label: "Sort by outstanding balance",
    compare: (left, right) => right.outstandingBalanceValue - left.outstandingBalanceValue
  }
];

export function ClientsWorkspace({
  companyName,
  components
}: {
  companyName: string;
  components: SharedMasterDataComponents;
}) {
  return (
    <MasterRecordsWorkspace
      title="Clients"
      subtitle={`Manage client profiles, contract pricing, and payment tracking for ${companyName}.`}
      components={components}
      records={clientRecords}
      columns={clientColumns}
      filters={clientFilters}
      sorts={clientSorts}
      recordOverlayMode="modal"
      renderModalWorkspace={({ announce, close, record }) => (
        <ClientProfileModalWorkspace announce={announce} close={close} record={record} />
      )}
      searchPlaceholder="Search client, package, contact, contract, or billing email"
      searchIndex={(record) =>
        `${record.name} ${record.contactPerson} ${record.packageName} ${record.engagementType} ${record.billingEmail} ${record.contractWindow} ${record.tin}`
      }
      renderDrawerBody={renderClientDrawerBody}
      primaryActionLabel="Add client"
      primaryActionNotice="Client creation will connect here next. This workspace is now shaped around contracts, pricing, and payment tracking."
      actionMenuItems={[
        {
          id: "import-clients",
          label: "Import client billing sheet",
          description: "Bring in package, contract, and pricing records from your current onboarding spreadsheet.",
          notice: "Client import will connect here next. This screen is now ready for a richer client billing sheet flow."
        },
        {
          id: "export-payments",
          label: "Export payment tracker",
          description: "Create an operational list of first, recurring, and partial payments per client.",
          notice: "Payment tracker export will connect here next. The client list now carries the required billing and payment fields."
        }
      ]}
      emptyState={{
        title: "No clients match the current filters.",
        description: "Try a broader search or clear the current package and payment-status filters."
      }}
    />
  );
}
