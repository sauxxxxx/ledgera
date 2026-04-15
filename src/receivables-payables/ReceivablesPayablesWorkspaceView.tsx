import { useState, type ReactNode } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SetupFieldComponentProps = {
  children: ReactNode;
  error?: string;
  helper?: string;
  invalid?: boolean;
  label: string;
  labelHint?: string;
  required?: boolean;
};

type CustomSelectComponentProps = {
  ariaLabel: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

type SharedReceivablesPayablesComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

export type ReceivablesPayablesWorkspaceView =
  | "receivables-overview"
  | "accounts-receivable"
  | "accounts-payable"
  | "aging-reports";

type ReceivablesPayablesWorkspaceProps = {
  companyName: string;
  components: SharedReceivablesPayablesComponents;
  view: ReceivablesPayablesWorkspaceView;
};

type AgingBucket = "Current" | "1-30 days" | "31-60 days" | "61+ days";
type ReceivableStatus = "Open" | "Partial" | "Overdue" | "Paid" | "Follow-up";
type PayableStatus = "Open" | "Scheduled" | "Partial" | "Overdue" | "Paid";
type ItemKind = "Receivable" | "Payable";

type PaymentHistoryItem = {
  amount: number;
  date: string;
  reference: string;
};

type ReceivableRecord = {
  agingBucket: AgingBucket;
  client: string;
  dueDate: string;
  id: string;
  invoiceNo: string;
  issueDate: string;
  originalAmount: number;
  outstandingAmount: number;
  paidAmount: number;
  paymentHistory: PaymentHistoryItem[];
  status: ReceivableStatus;
};

type PayableRecord = {
  agingBucket: AgingBucket;
  billNo: string;
  category: string;
  dueDate: string;
  id: string;
  originalAmount: number;
  outstandingAmount: number;
  paidAmount: number;
  paymentHistory: PaymentHistoryItem[];
  status: PayableStatus;
  supplier: string;
};

type PriorityItem = {
  amount: number;
  dueDate: string;
  id: string;
  kind: ItemKind;
  name: string;
  reference: string;
  status: string;
};

type ReceivableAction =
  | { record: ReceivableRecord; type: "detail" }
  | { record: ReceivableRecord; type: "record-payment" }
  | { record: ReceivableRecord; type: "follow-up" };

type PayableAction =
  | { record: PayableRecord; type: "detail" }
  | { record: PayableRecord; type: "schedule-payment" }
  | { record: PayableRecord; type: "mark-paid" };

const receivableSeed: ReceivableRecord[] = [
  {
    id: "ar-northstar-1024",
    client: "Northstar Retail OPC",
    invoiceNo: "INV-2026-1024",
    issueDate: "April 1, 2026",
    dueDate: "April 15, 2026",
    originalAmount: 32500,
    paidAmount: 0,
    outstandingAmount: 32500,
    status: "Open",
    agingBucket: "Current",
    paymentHistory: []
  },
  {
    id: "ar-harbor-1023",
    client: "Harbor Foods Trading",
    invoiceNo: "INV-2026-1023",
    issueDate: "March 25, 2026",
    dueDate: "April 8, 2026",
    originalAmount: 18500,
    paidAmount: 10000,
    outstandingAmount: 8500,
    status: "Partial",
    agingBucket: "1-30 days",
    paymentHistory: [{ amount: 10000, date: "April 10, 2026", reference: "BPI partial payment" }]
  },
  {
    id: "ar-luna-1022",
    client: "Luna Creatives Studio",
    invoiceNo: "INV-2026-1022",
    issueDate: "April 10, 2026",
    dueDate: "April 20, 2026",
    originalAmount: 12000,
    paidAmount: 0,
    outstandingAmount: 12000,
    status: "Open",
    agingBucket: "Current",
    paymentHistory: []
  },
  {
    id: "ar-makati-1021",
    client: "Makati Dental Group",
    invoiceNo: "INV-2026-1021",
    issueDate: "April 3, 2026",
    dueDate: "April 12, 2026",
    originalAmount: 24000,
    paidAmount: 24000,
    outstandingAmount: 0,
    status: "Paid",
    agingBucket: "Current",
    paymentHistory: [{ amount: 24000, date: "April 12, 2026", reference: "AR-2026-0844" }]
  },
  {
    id: "ar-cebu-0998",
    client: "Cebu Logistics Co.",
    invoiceNo: "INV-2026-0998",
    issueDate: "February 20, 2026",
    dueDate: "March 22, 2026",
    originalAmount: 21000,
    paidAmount: 0,
    outstandingAmount: 21000,
    status: "Overdue",
    agingBucket: "31-60 days",
    paymentHistory: []
  }
];

const payableSeed: PayableRecord[] = [
  {
    id: "ap-lease-apr",
    supplier: "Makati Tower Leasing Corp.",
    billNo: "BILL-2026-0412",
    category: "Office Rent Expense",
    dueDate: "April 16, 2026",
    originalAmount: 58000,
    paidAmount: 0,
    outstandingAmount: 58000,
    status: "Open",
    agingBucket: "Current",
    paymentHistory: []
  },
  {
    id: "ap-pldt-apr",
    supplier: "PLDT Enterprise",
    billNo: "BILL-2026-0410",
    category: "Utilities and Internet",
    dueDate: "April 12, 2026",
    originalAmount: 9200,
    paidAmount: 0,
    outstandingAmount: 9200,
    status: "Overdue",
    agingBucket: "1-30 days",
    paymentHistory: []
  },
  {
    id: "ap-tax-remittance",
    supplier: "Bureau of Internal Revenue",
    billNo: "TAX-2026-APR-WHT",
    category: "Tax Payable",
    dueDate: "April 25, 2026",
    originalAmount: 31500,
    paidAmount: 0,
    outstandingAmount: 31500,
    status: "Scheduled",
    agingBucket: "Current",
    paymentHistory: []
  },
  {
    id: "ap-software",
    supplier: "CloudLedger Tools PH",
    billNo: "BILL-2026-0404",
    category: "Software Subscription",
    dueDate: "April 18, 2026",
    originalAmount: 7800,
    paidAmount: 3900,
    outstandingAmount: 3900,
    status: "Partial",
    agingBucket: "Current",
    paymentHistory: [{ amount: 3900, date: "April 8, 2026", reference: "BDO transfer" }]
  },
  {
    id: "ap-audit-review",
    supplier: "Santos Audit Support",
    billNo: "BILL-2026-0330",
    category: "Professional Fees",
    dueDate: "March 30, 2026",
    originalAmount: 14500,
    paidAmount: 0,
    outstandingAmount: 14500,
    status: "Overdue",
    agingBucket: "1-30 days",
    paymentHistory: []
  }
];

const receivableStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Open", label: "Open" },
  { value: "Partial", label: "Partial" },
  { value: "Overdue", label: "Overdue" },
  { value: "Paid", label: "Paid" },
  { value: "Follow-up", label: "Follow-up" }
];

const payableStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Open", label: "Open" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Partial", label: "Partial" },
  { value: "Overdue", label: "Overdue" },
  { value: "Paid", label: "Paid" }
];

const agingTypeOptions: SelectOption[] = [
  { value: "all", label: "All" },
  { value: "Receivable", label: "Receivables" },
  { value: "Payable", label: "Payables" }
];

const agingBuckets: AgingBucket[] = ["Current", "1-30 days", "31-60 days", "61+ days"];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const toStatusClass = (status: string) => status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const sumOutstanding = (records: Array<{ outstandingAmount: number }>) =>
  records.reduce((total, record) => total + record.outstandingAmount, 0);

function ReceivablesPayablesDialog({
  children,
  closeLabel,
  CloseIcon,
  description,
  footerCopy,
  onClose,
  onSubmit,
  submitLabel,
  title
}: {
  children: ReactNode;
  closeLabel: string;
  CloseIcon: () => ReactNode;
  description: string;
  footerCopy?: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  title: string;
}) {
  return (
    <div className="chart-standard-layer admin-audit-dialog-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="chart-standard-backdrop" aria-label={closeLabel} onClick={onClose} />
      <section className="admin-audit-dialog receivables-action-dialog">
        <div className="chart-standard-dialog-head">
          <div>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
          <button type="button" className="chart-standard-close" onClick={onClose} aria-label={closeLabel}>
            <CloseIcon />
          </button>
        </div>
        <div className="chart-standard-dialog-body">{children}</div>
        <div className="chart-standard-dialog-footer receivables-dialog-footer">
          {footerCopy ? <span>{footerCopy}</span> : null}
          <div className="receivables-dialog-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={onClose}>
              Cancel
            </button>
            {onSubmit && submitLabel ? (
              <button type="button" className="chart-page-button chart-page-button-primary" onClick={onSubmit}>
                {submitLabel}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function ReceivablesSummary({
  payables,
  receivables
}: {
  payables: PayableRecord[];
  receivables: ReceivableRecord[];
}) {
  const totalAr = sumOutstanding(receivables);
  const totalAp = sumOutstanding(payables);
  const overdueAr = receivables
    .filter((record) => record.status === "Overdue" || record.agingBucket !== "Current")
    .reduce((total, record) => total + record.outstandingAmount, 0);
  const dueSoon = [...receivables, ...payables].filter(
    (record) => record.outstandingAmount > 0 && record.agingBucket === "Current"
  ).length;

  return (
    <section className="chart-accounts-summary receivables-summary" aria-label="Receivables and payables summary">
      <div className="chart-summary-item">
        <span>Total AR</span>
        <strong>{formatMoney(totalAr)}</strong>
        <small>Client invoices still collectible</small>
      </div>
      <div className="chart-summary-item">
        <span>Total AP</span>
        <strong>{formatMoney(totalAp)}</strong>
        <small>Supplier and statutory obligations</small>
      </div>
      <div className="chart-summary-item">
        <span>Overdue AR</span>
        <strong>{formatMoney(overdueAr)}</strong>
        <small>Past due or aging beyond current</small>
      </div>
      <div className="chart-summary-item">
        <span>Due soon</span>
        <strong>{dueSoon}</strong>
        <small>Current bucket items needing attention</small>
      </div>
    </section>
  );
}

function ReceivablesOverview({
  companyName,
  components,
  payables,
  receivables
}: {
  companyName: string;
  components: SharedReceivablesPayablesComponents;
  payables: PayableRecord[];
  receivables: ReceivableRecord[];
}) {
  const { CloseIcon } = components;
  const [dialog, setDialog] = useState<"record-collection" | "schedule-payable" | null>(null);
  const priorityItems: PriorityItem[] = [
    ...receivables
      .filter((record) => record.outstandingAmount > 0)
      .map((record) => ({
        id: record.id,
        amount: record.outstandingAmount,
        dueDate: record.dueDate,
        kind: "Receivable" as const,
        name: record.client,
        reference: record.invoiceNo,
        status: record.status
      })),
    ...payables
      .filter((record) => record.outstandingAmount > 0)
      .map((record) => ({
        id: record.id,
        amount: record.outstandingAmount,
        dueDate: record.dueDate,
        kind: "Payable" as const,
        name: record.supplier,
        reference: record.billNo,
        status: record.status
      }))
  ].slice(0, 6);

  return (
    <div className="dashboard-content receivables-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Receivables & Payables</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setDialog("schedule-payable")}>
              Schedule payable
            </button>
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setDialog("record-collection")}>
              Record collection
            </button>
          </div>
        </div>

        <div className="admin-page-panel-body">
          <ReceivablesSummary payables={payables} receivables={receivables} />
        </div>

        <div className="receivables-panel-subhead">
          <div>
            <strong>Priority items</strong>
            <span>Open client collections and supplier obligations for {companyName}.</span>
          </div>
          <span>{priorityItems.length} active items</span>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Reference</th>
                <th>Due date</th>
                <th>Outstanding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {priorityItems.map((item) => (
                <tr key={`${item.kind}-${item.id}`}>
                  <td>{item.kind}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.reference}</td>
                  <td>{item.dueDate}</td>
                  <td>{formatMoney(item.amount)}</td>
                  <td><span className={`admin-pill receivables-status-${toStatusClass(item.status)}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {dialog === "record-collection" ? (
        <ReceivablesPayablesDialog
          CloseIcon={CloseIcon}
          closeLabel="Close collection preview"
          description="Preview how a client payment will reduce AR before backend posting is connected."
          footerCopy="Frontend preview only"
          onClose={() => setDialog(null)}
          onSubmit={() => setDialog(null)}
          submitLabel="Open AR queue"
          title="Record collection"
        >
          <div className="receivables-dialog-grid">
            <div className="receivables-dialog-card">
              <span>Recommended source</span>
              <strong>Banking matched receipt</strong>
              <p>Use the AR page to apply payment amounts against open client invoices.</p>
            </div>
            <div className="receivables-dialog-card">
              <span>Control point</span>
              <strong>Acknowledgment receipt</strong>
              <p>Collections should link back to Sales & Billing receipts once backend posting is added.</p>
            </div>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}

      {dialog === "schedule-payable" ? (
        <ReceivablesPayablesDialog
          CloseIcon={CloseIcon}
          closeLabel="Close payable preview"
          description="Preview a payable schedule before bank disbursement and journal posting are connected."
          footerCopy="No bank movement is created"
          onClose={() => setDialog(null)}
          onSubmit={() => setDialog(null)}
          submitLabel="Open AP queue"
          title="Schedule payable"
        >
          <div className="receivables-dialog-grid">
            <div className="receivables-dialog-card">
              <span>Next payable</span>
              <strong>Makati Tower Leasing Corp.</strong>
              <p>Office rent due April 16, 2026 with no payment recorded yet.</p>
            </div>
            <div className="receivables-dialog-card">
              <span>Review policy</span>
              <strong>Schedule before release</strong>
              <p>Payables stay visible until marked paid by accounting or bank reconciliation.</p>
            </div>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}
    </div>
  );
}

function AccountsReceivableView({ components }: { components: SharedReceivablesPayablesComponents }) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon, SetupField } = components;
  const [records, setRecords] = useState(receivableSeed);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [action, setAction] = useState<ReceivableAction | null>(null);
  const [paymentDraft, setPaymentDraft] = useState({ amount: "8500", reference: "BPI collection" });

  const filteredRecords = records.filter((record) => {
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${record.client} ${record.invoiceNo} ${record.dueDate}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openReceivableAction = (record: ReceivableRecord, type: ReceivableAction["type"]) => {
    setPaymentDraft({ amount: String(Math.max(record.outstandingAmount, 0)), reference: "BPI collection" });
    setAction({ record, type });
  };

  const recordPayment = () => {
    if (!action || action.type !== "record-payment") {
      return;
    }

    const paymentAmount = Math.max(Number(paymentDraft.amount) || 0, 0);
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== action.record.id) {
          return record;
        }

        const paidAmount = Math.min(record.originalAmount, record.paidAmount + paymentAmount);
        const outstandingAmount = Math.max(record.originalAmount - paidAmount, 0);

        return {
          ...record,
          paidAmount,
          outstandingAmount,
          status: outstandingAmount === 0 ? "Paid" : "Partial",
          paymentHistory: [
            ...record.paymentHistory,
            {
              amount: paymentAmount,
              date: "Today",
              reference: paymentDraft.reference.trim() || "Manual collection"
            }
          ]
        };
      })
    );
    setAction(null);
  };

  const markFollowUp = () => {
    if (!action || action.type !== "follow-up") {
      return;
    }

    setRecords((current) =>
      current.map((record) => (record.id === action.record.id ? { ...record, status: "Follow-up" } : record))
    );
    setAction(null);
  };

  return (
    <div className="dashboard-content receivables-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Accounts Receivable</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter receivable status" value={statusFilter} options={receivableStatusOptions} onChange={setStatusFilter} />
            </div>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search client, invoice, or due date" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Invoice</th>
                <th>Due date</th>
                <th>Original</th>
                <th>Paid</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} onClick={() => openReceivableAction(record, "detail")}>
                    <td>
                      <div className="admin-primary-cell">
                        <strong>{record.client}</strong>
                        <span>{record.agingBucket}</span>
                      </div>
                    </td>
                    <td>{record.invoiceNo}</td>
                    <td>{record.dueDate}</td>
                    <td>{formatMoney(record.originalAmount)}</td>
                    <td>{formatMoney(record.paidAmount)}</td>
                    <td>{formatMoney(record.outstandingAmount)}</td>
                    <td><span className={`admin-pill receivables-status-${toStatusClass(record.status)}`}>{record.status}</span></td>
                    <td>
                      <div className="receivables-row-actions">
                        <button
                          type="button"
                          className="chart-row-action"
                          aria-label={`Open ${record.invoiceNo}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            openReceivableAction(record, "detail");
                          }}
                        >
                          <RowOpenIcon />
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={record.status === "Paid"}
                          onClick={(event) => {
                            event.stopPropagation();
                            openReceivableAction(record, "record-payment");
                          }}
                        >
                          Record payment
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={record.status === "Paid" || record.status === "Follow-up"}
                          onClick={(event) => {
                            event.stopPropagation();
                            openReceivableAction(record, "follow-up");
                          }}
                        >
                          Follow-up
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="chart-empty-state">
                      <strong>No receivables match the current filters.</strong>
                      <p>Try another status or search by client, invoice, or due date.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {action?.type === "detail" ? (
        <ReceivablesPayablesDialog CloseIcon={CloseIcon} closeLabel="Close receivable details" description="Client invoice balance and payment history for review." footerCopy={action.record.status} onClose={() => setAction(null)} title={action.record.invoiceNo}>
          <div className="admin-audit-detail-grid">
            <div className="admin-audit-detail-item"><span>Client</span><strong>{action.record.client}</strong></div>
            <div className="admin-audit-detail-item"><span>Outstanding</span><strong>{formatMoney(action.record.outstandingAmount)}</strong></div>
            <div className="admin-audit-detail-item"><span>Issue date</span><strong>{action.record.issueDate}</strong></div>
            <div className="admin-audit-detail-item"><span>Due date</span><strong>{action.record.dueDate}</strong></div>
            <div className="admin-audit-detail-item admin-audit-detail-item-full">
              <span>Payment history</span>
              <strong>
                {action.record.paymentHistory.length > 0
                  ? action.record.paymentHistory.map((payment) => `${payment.date}: ${formatMoney(payment.amount)} (${payment.reference})`).join("; ")
                  : "No payments recorded yet"}
              </strong>
            </div>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}

      {action?.type === "record-payment" ? (
        <ReceivablesPayablesDialog CloseIcon={CloseIcon} closeLabel="Close payment form" description="Apply a frontend-only collection against this invoice." footerCopy={action.record.client} onClose={() => setAction(null)} onSubmit={recordPayment} submitLabel="Apply payment" title={`Record payment - ${action.record.invoiceNo}`}>
          <div className="receivables-form-grid">
            <SetupField label="Payment amount" required>
              <input type="number" value={paymentDraft.amount} onChange={(event) => setPaymentDraft((current) => ({ ...current, amount: event.target.value }))} />
            </SetupField>
            <SetupField label="Payment reference">
              <input type="text" value={paymentDraft.reference} onChange={(event) => setPaymentDraft((current) => ({ ...current, reference: event.target.value }))} />
            </SetupField>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}

      {action?.type === "follow-up" ? (
        <ReceivablesPayablesDialog CloseIcon={CloseIcon} closeLabel="Close follow-up confirmation" description="Flag this invoice for collection follow-up in the AR queue." footerCopy={action.record.client} onClose={() => setAction(null)} onSubmit={markFollowUp} submitLabel="Mark follow-up" title={`Follow up - ${action.record.invoiceNo}`}>
          <div className="receivables-dialog-card">
            <span>Collection note</span>
            <strong>{formatMoney(action.record.outstandingAmount)} still outstanding</strong>
            <p>This status change is local only until notifications and activity logs are connected.</p>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}
    </div>
  );
}

function AccountsPayableView({ components }: { components: SharedReceivablesPayablesComponents }) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon } = components;
  const [records, setRecords] = useState(payableSeed);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [action, setAction] = useState<PayableAction | null>(null);

  const filteredRecords = records.filter((record) => {
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${record.supplier} ${record.billNo} ${record.category}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updatePayableStatus = (recordId: string, status: PayableStatus) => {
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== recordId) {
          return record;
        }

        if (status === "Paid") {
          return {
            ...record,
            outstandingAmount: 0,
            paidAmount: record.originalAmount,
            paymentHistory: [
              ...record.paymentHistory,
              {
                amount: record.outstandingAmount,
                date: "Today",
                reference: "Manual payable release"
              }
            ],
            status
          };
        }

        return { ...record, status };
      })
    );
    setAction(null);
  };

  return (
    <div className="dashboard-content receivables-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Accounts Payable</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter payable status" value={statusFilter} options={payableStatusOptions} onChange={setStatusFilter} />
            </div>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search supplier, bill, or category" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Bill</th>
                <th>Due date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} onClick={() => setAction({ record, type: "detail" })}>
                    <td>
                      <div className="admin-primary-cell">
                        <strong>{record.supplier}</strong>
                        <span>{record.agingBucket}</span>
                      </div>
                    </td>
                    <td>{record.billNo}</td>
                    <td>{record.dueDate}</td>
                    <td>{record.category}</td>
                    <td>{formatMoney(record.originalAmount)}</td>
                    <td>{formatMoney(record.paidAmount)}</td>
                    <td>{formatMoney(record.outstandingAmount)}</td>
                    <td><span className={`admin-pill receivables-status-${toStatusClass(record.status)}`}>{record.status}</span></td>
                    <td>
                      <div className="receivables-row-actions">
                        <button
                          type="button"
                          className="chart-row-action"
                          aria-label={`Open ${record.billNo}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setAction({ record, type: "detail" });
                          }}
                        >
                          <RowOpenIcon />
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={record.status === "Paid" || record.status === "Scheduled"}
                          onClick={(event) => {
                            event.stopPropagation();
                            setAction({ record, type: "schedule-payment" });
                          }}
                        >
                          Schedule
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={record.status === "Paid"}
                          onClick={(event) => {
                            event.stopPropagation();
                            setAction({ record, type: "mark-paid" });
                          }}
                        >
                          Mark paid
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="chart-empty-state">
                      <strong>No payables match the current filters.</strong>
                      <p>Try another status or search by supplier, bill, or category.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {action?.type === "detail" ? (
        <ReceivablesPayablesDialog CloseIcon={CloseIcon} closeLabel="Close payable details" description="Supplier obligation and release history for review." footerCopy={action.record.status} onClose={() => setAction(null)} title={action.record.billNo}>
          <div className="admin-audit-detail-grid">
            <div className="admin-audit-detail-item"><span>Supplier</span><strong>{action.record.supplier}</strong></div>
            <div className="admin-audit-detail-item"><span>Outstanding</span><strong>{formatMoney(action.record.outstandingAmount)}</strong></div>
            <div className="admin-audit-detail-item"><span>Category</span><strong>{action.record.category}</strong></div>
            <div className="admin-audit-detail-item"><span>Due date</span><strong>{action.record.dueDate}</strong></div>
            <div className="admin-audit-detail-item admin-audit-detail-item-full">
              <span>Payment history</span>
              <strong>
                {action.record.paymentHistory.length > 0
                  ? action.record.paymentHistory.map((payment) => `${payment.date}: ${formatMoney(payment.amount)} (${payment.reference})`).join("; ")
                  : "No payments released yet"}
              </strong>
            </div>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}

      {action?.type === "schedule-payment" ? (
        <ReceivablesPayablesDialog CloseIcon={CloseIcon} closeLabel="Close schedule confirmation" description="Move this payable into the scheduled release queue." footerCopy={action.record.supplier} onClose={() => setAction(null)} onSubmit={() => updatePayableStatus(action.record.id, "Scheduled")} submitLabel="Schedule payment" title={`Schedule - ${action.record.billNo}`}>
          <div className="receivables-dialog-card">
            <span>Release amount</span>
            <strong>{formatMoney(action.record.outstandingAmount)}</strong>
            <p>Scheduling does not create a bank transaction yet. It only updates this frontend queue.</p>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}

      {action?.type === "mark-paid" ? (
        <ReceivablesPayablesDialog CloseIcon={CloseIcon} closeLabel="Close paid confirmation" description="Mark this supplier obligation as paid in the frontend queue." footerCopy={action.record.supplier} onClose={() => setAction(null)} onSubmit={() => updatePayableStatus(action.record.id, "Paid")} submitLabel="Mark paid" title={`Mark paid - ${action.record.billNo}`}>
          <div className="receivables-dialog-card">
            <span>Payment release</span>
            <strong>{formatMoney(action.record.outstandingAmount)}</strong>
            <p>This sets outstanding to zero and stores a local payment history entry.</p>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}
    </div>
  );
}

function AgingReportsView({
  components,
  payables,
  receivables
}: {
  components: SharedReceivablesPayablesComponents;
  payables: PayableRecord[];
  receivables: ReceivableRecord[];
}) {
  const { CloseIcon, CustomSelect } = components;
  const [typeFilter, setTypeFilter] = useState("all");
  const [exportOpen, setExportOpen] = useState(false);

  const agingRows = agingBuckets.map((bucket) => {
    const arAmount = receivables
      .filter((record) => record.agingBucket === bucket)
      .reduce((total, record) => total + record.outstandingAmount, 0);
    const apAmount = payables
      .filter((record) => record.agingBucket === bucket)
      .reduce((total, record) => total + record.outstandingAmount, 0);
    const count =
      receivables.filter((record) => record.agingBucket === bucket && record.outstandingAmount > 0).length +
      payables.filter((record) => record.agingBucket === bucket && record.outstandingAmount > 0).length;

    return {
      apAmount,
      arAmount,
      bucket,
      count,
      total: arAmount + apAmount
    };
  });

  const filteredRows = agingRows.map((row) => ({
    ...row,
    displayAmount: typeFilter === "Receivable" ? row.arAmount : typeFilter === "Payable" ? row.apAmount : row.total
  }));

  return (
    <div className="dashboard-content receivables-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Aging Reports</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter aging report type" value={typeFilter} options={agingTypeOptions} onChange={setTypeFilter} />
            </div>
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setExportOpen(true)}>
              Export aging report
            </button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Bucket</th>
                <th>Receivables</th>
                <th>Payables</th>
                <th>Displayed total</th>
                <th>Open items</th>
                <th>Review note</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.bucket}>
                  <td><strong>{row.bucket}</strong></td>
                  <td>{formatMoney(row.arAmount)}</td>
                  <td>{formatMoney(row.apAmount)}</td>
                  <td>{formatMoney(row.displayAmount)}</td>
                  <td>{row.count}</td>
                  <td>{row.bucket === "Current" ? "Monitor due-soon items before month-end." : "Requires review before closing reports."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {exportOpen ? (
        <ReceivablesPayablesDialog
          CloseIcon={CloseIcon}
          closeLabel="Close aging export"
          description="Preview the aging report package before backend file generation is connected."
          footerCopy={`${filteredRows.length} aging buckets`}
          onClose={() => setExportOpen(false)}
          onSubmit={() => setExportOpen(false)}
          submitLabel="Prepare export"
          title="Export aging report"
        >
          <div className="receivables-dialog-grid">
            <div className="receivables-dialog-card">
              <span>Included balances</span>
              <strong>{typeFilter === "all" ? "AR and AP" : typeFilter}</strong>
              <p>Current filter will be used for the export preview.</p>
            </div>
            <div className="receivables-dialog-card">
              <span>Format</span>
              <strong>CSV summary</strong>
              <p>Bucket, receivable total, payable total, displayed total, and item count.</p>
            </div>
          </div>
        </ReceivablesPayablesDialog>
      ) : null}
    </div>
  );
}

export function ReceivablesPayablesWorkspace({ companyName, components, view }: ReceivablesPayablesWorkspaceProps) {
  if (view === "accounts-receivable") {
    return <AccountsReceivableView components={components} />;
  }

  if (view === "accounts-payable") {
    return <AccountsPayableView components={components} />;
  }

  if (view === "aging-reports") {
    return <AgingReportsView components={components} payables={payableSeed} receivables={receivableSeed} />;
  }

  return (
    <ReceivablesOverview
      companyName={companyName}
      components={components}
      payables={payableSeed}
      receivables={receivableSeed}
    />
  );
}
