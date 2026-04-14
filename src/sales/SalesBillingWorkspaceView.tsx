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

type SharedSalesComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

export type SalesBillingWorkspaceView =
  | "sales-overview"
  | "client-packages"
  | "invoices"
  | "acknowledgment-receipts"
  | "payment-tracking";

type SalesBillingWorkspaceProps = {
  companyName: string;
  components: SharedSalesComponents;
  view: SalesBillingWorkspaceView;
};

type PackageStatus = "Active" | "Pending" | "Paused";
type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
type ReceiptStatus = "Issued" | "Draft" | "Void";
type PaymentStatus = "Awaiting match" | "Matched" | "Partial" | "Flagged";
type SalesDialogAction = "create-package" | "create-invoice" | "create-receipt" | "export-list";

type ClientPackageRecord = {
  billingCycle: string;
  client: string;
  id: string;
  monthlyFee: number;
  packageName: string;
  scope: string;
  status: PackageStatus;
};

type InvoiceRecord = {
  amount: number;
  client: string;
  dueDate: string;
  id: string;
  invoiceNo: string;
  issueDate: string;
  status: InvoiceStatus;
};

type ReceiptRecord = {
  amount: number;
  arNo: string;
  client: string;
  dateReceived: string;
  id: string;
  reference: string;
  status: ReceiptStatus;
};

type PaymentRecord = {
  bankAccount: string;
  client: string;
  expectedAmount: number;
  id: string;
  invoiceNo: string;
  receivedAmount: number;
  status: PaymentStatus;
};

const packageSeed: ClientPackageRecord[] = [
  {
    id: "pkg-northstar",
    client: "Northstar Retail OPC",
    packageName: "Monthly Accounting Retainer",
    billingCycle: "Monthly",
    monthlyFee: 32500,
    scope: "VAT, bookkeeping, payroll review",
    status: "Active"
  },
  {
    id: "pkg-harbor",
    client: "Harbor Foods Trading",
    packageName: "Compliance Essentials",
    billingCycle: "Monthly",
    monthlyFee: 18500,
    scope: "BIR filings and sales journal review",
    status: "Active"
  },
  {
    id: "pkg-luna",
    client: "Luna Creatives Studio",
    packageName: "Quarterly Advisory",
    billingCycle: "Quarterly",
    monthlyFee: 12000,
    scope: "Quarter-end reports and tax estimate",
    status: "Pending"
  }
];

const invoiceSeed: InvoiceRecord[] = [
  {
    id: "inv-1024",
    invoiceNo: "INV-2026-1024",
    client: "Northstar Retail OPC",
    issueDate: "April 1, 2026",
    dueDate: "April 15, 2026",
    amount: 32500,
    status: "Sent"
  },
  {
    id: "inv-1023",
    invoiceNo: "INV-2026-1023",
    client: "Harbor Foods Trading",
    issueDate: "March 25, 2026",
    dueDate: "April 8, 2026",
    amount: 18500,
    status: "Overdue"
  },
  {
    id: "inv-1022",
    invoiceNo: "INV-2026-1022",
    client: "Luna Creatives Studio",
    issueDate: "April 10, 2026",
    dueDate: "April 20, 2026",
    amount: 12000,
    status: "Draft"
  },
  {
    id: "inv-1021",
    invoiceNo: "INV-2026-1021",
    client: "Makati Dental Group",
    issueDate: "April 3, 2026",
    dueDate: "April 12, 2026",
    amount: 24000,
    status: "Paid"
  }
];

const receiptSeed: ReceiptRecord[] = [
  {
    id: "ar-0844",
    arNo: "AR-2026-0844",
    client: "Makati Dental Group",
    reference: "INV-2026-1021 / BPI-0426-001",
    dateReceived: "April 12, 2026",
    amount: 24000,
    status: "Issued"
  },
  {
    id: "ar-0845",
    arNo: "AR-2026-0845",
    client: "Northstar Retail OPC",
    reference: "INV-2026-1024 / pending bank match",
    dateReceived: "April 14, 2026",
    amount: 32500,
    status: "Draft"
  }
];

const paymentSeed: PaymentRecord[] = [
  {
    id: "pay-northstar",
    client: "Northstar Retail OPC",
    invoiceNo: "INV-2026-1024",
    expectedAmount: 32500,
    receivedAmount: 32500,
    bankAccount: "BPI Operating Account",
    status: "Awaiting match"
  },
  {
    id: "pay-harbor",
    client: "Harbor Foods Trading",
    invoiceNo: "INV-2026-1023",
    expectedAmount: 18500,
    receivedAmount: 10000,
    bankAccount: "BPI Operating Account",
    status: "Partial"
  },
  {
    id: "pay-makati",
    client: "Makati Dental Group",
    invoiceNo: "INV-2026-1021",
    expectedAmount: 24000,
    receivedAmount: 24000,
    bankAccount: "BPI Operating Account",
    status: "Matched"
  }
];

const invoiceStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Draft", label: "Draft" },
  { value: "Sent", label: "Sent" },
  { value: "Paid", label: "Paid" },
  { value: "Overdue", label: "Overdue" }
];

const paymentStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Awaiting match", label: "Awaiting match" },
  { value: "Matched", label: "Matched" },
  { value: "Partial", label: "Partial" },
  { value: "Flagged", label: "Flagged" }
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const toStatusClass = (status: string) => status.toLowerCase().replace(/\s+/g, "-");

function SalesActionDialog({
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
      <section className="admin-audit-dialog sales-action-dialog">
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
        <div className="chart-standard-dialog-footer sales-dialog-footer">
          {footerCopy ? <span>{footerCopy}</span> : null}
          <div className="sales-dialog-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={onClose}>Cancel</button>
            {onSubmit && submitLabel ? (
              <button type="button" className="chart-page-button chart-page-button-primary" onClick={onSubmit}>{submitLabel}</button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function SalesSummary({ invoices, payments }: { invoices: InvoiceRecord[]; payments: PaymentRecord[] }) {
  const openInvoices = invoices.filter((invoice) => invoice.status !== "Paid").length;
  const overdueAmount = invoices.filter((invoice) => invoice.status === "Overdue").reduce((total, invoice) => total + invoice.amount, 0);
  const paidThisMonth = invoices.filter((invoice) => invoice.status === "Paid").reduce((total, invoice) => total + invoice.amount, 0);
  const awaitingMatch = payments.filter((payment) => payment.status === "Awaiting match").length;

  return (
    <section className="chart-accounts-summary sales-summary" aria-label="Sales and billing summary">
      <div className="chart-summary-item">
        <span>Open invoices</span>
        <strong>{openInvoices}</strong>
        <small>Draft, sent, and overdue invoices</small>
      </div>
      <div className="chart-summary-item">
        <span>Overdue amount</span>
        <strong>{formatMoney(overdueAmount)}</strong>
        <small>Needs follow-up with clients</small>
      </div>
      <div className="chart-summary-item">
        <span>Paid this month</span>
        <strong>{formatMoney(paidThisMonth)}</strong>
        <small>Cash receipts ready for review</small>
      </div>
      <div className="chart-summary-item">
        <span>Bank match queue</span>
        <strong>{awaitingMatch}</strong>
        <small>Payments waiting for Banking</small>
      </div>
    </section>
  );
}

function SalesOverview({
  companyName,
  components,
  invoices,
  payments
}: {
  companyName: string;
  components: SharedSalesComponents;
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
}) {
  const { CloseIcon } = components;
  const [dialog, setDialog] = useState<SalesDialogAction | null>(null);

  return (
    <div className="dashboard-content sales-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Sales Overview</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setDialog("export-list")}>Export list</button>
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setDialog("create-invoice")}>Create invoice</button>
          </div>
        </div>

        <div className="admin-page-panel-body">
          <SalesSummary invoices={invoices} payments={payments} />
        </div>

        <div className="sales-panel-subhead">
          <div>
            <strong>Recent billing activity</strong>
            <span>Current sales documents and payment signals for {companyName}.</span>
          </div>
          <span>{invoices.length} invoices tracked</span>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Due date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNo}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.dueDate}</td>
                  <td>{formatMoney(invoice.amount)}</td>
                  <td><span className={`admin-pill sales-status-${toStatusClass(invoice.status)}`}>{invoice.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {dialog === "export-list" ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close sales export"
          description="Preview the billing export package before backend file generation is connected."
          footerCopy={`${invoices.length} invoices included`}
          onClose={() => setDialog(null)}
          onSubmit={() => setDialog(null)}
          submitLabel="Prepare export"
          title="Export sales list"
        >
          <div className="sales-dialog-grid">
            <div className="sales-dialog-card">
              <span>Included data</span>
              <strong>Invoices, payment status, and client names</strong>
              <p>Use this later for CSV export and accounting review.</p>
            </div>
            <div className="sales-dialog-card">
              <span>Scope</span>
              <strong>{companyName}</strong>
              <p>Frontend preview only. No file is generated yet.</p>
            </div>
          </div>
        </SalesActionDialog>
      ) : null}

      {dialog === "create-invoice" ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close invoice preview"
          description="Invoice creation lives in the Invoices page. This shortcut previews the next workflow."
          onClose={() => setDialog(null)}
          onSubmit={() => setDialog(null)}
          submitLabel="Open invoices"
          title="Create invoice"
        >
          <div className="sales-dialog-card">
            <span>Recommended next action</span>
            <strong>Create invoices from package billing cycles</strong>
            <p>The Invoices page supports frontend-only invoice creation and status updates.</p>
          </div>
        </SalesActionDialog>
      ) : null}
    </div>
  );
}

function ClientPackagesView({ components, initialPackages }: { components: SharedSalesComponents; initialPackages: ClientPackageRecord[] }) {
  const { CloseIcon, RowOpenIcon, SetupField } = components;
  const [packages, setPackages] = useState(initialPackages);
  const [selectedPackage, setSelectedPackage] = useState<ClientPackageRecord | null>(null);
  const [dialog, setDialog] = useState<SalesDialogAction | null>(null);
  const [draft, setDraft] = useState({
    billingCycle: "Monthly",
    client: "Cebu Logistics Co.",
    monthlyFee: "21000",
    packageName: "Accounting Starter",
    scope: "Bookkeeping, VAT summary, BIR filing calendar"
  });

  const createPackage = () => {
    const monthlyFee = Number(draft.monthlyFee) || 0;
    const newPackage: ClientPackageRecord = {
      id: `pkg-${Date.now()}`,
      billingCycle: draft.billingCycle.trim() || "Monthly",
      client: draft.client.trim() || "New client",
      monthlyFee,
      packageName: draft.packageName.trim() || "New package",
      scope: draft.scope.trim() || "Accounting support",
      status: "Pending"
    };

    setPackages((current) => [newPackage, ...current]);
    setDialog(null);
  };

  return (
    <div className="dashboard-content sales-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Client Packages</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setDialog("create-package")}>Create package</button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Package</th>
                <th>Billing cycle</th>
                <th>Monthly fee</th>
                <th>Scope</th>
                <th>Status</th>
                <th className="chart-table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((item) => (
                <tr key={item.id} onClick={() => setSelectedPackage(item)}>
                  <td>{item.client}</td>
                  <td><strong>{item.packageName}</strong></td>
                  <td>{item.billingCycle}</td>
                  <td>{formatMoney(item.monthlyFee)}</td>
                  <td>{item.scope}</td>
                  <td><span className={`admin-pill sales-status-${toStatusClass(item.status)}`}>{item.status}</span></td>
                  <td className="chart-table-actions-col">
                    <button
                      type="button"
                      className="chart-row-action"
                      aria-label={`Open ${item.packageName}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedPackage(item);
                      }}
                    >
                      <RowOpenIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedPackage ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close package details"
          description="Review package billing scope before it becomes an invoice source."
          footerCopy={selectedPackage.billingCycle}
          onClose={() => setSelectedPackage(null)}
          title={`${selectedPackage.client} package`}
        >
          <div className="admin-audit-detail-grid">
            <div className="admin-audit-detail-item">
              <span>Package</span>
              <strong>{selectedPackage.packageName}</strong>
            </div>
            <div className="admin-audit-detail-item">
              <span>Monthly fee</span>
              <strong>{formatMoney(selectedPackage.monthlyFee)}</strong>
            </div>
            <div className="admin-audit-detail-item admin-audit-detail-item-full">
              <span>Scope</span>
              <strong>{selectedPackage.scope}</strong>
            </div>
          </div>
        </SalesActionDialog>
      ) : null}

      {dialog === "create-package" ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close create package"
          description="Create a frontend-only service package that can later generate invoices."
          onClose={() => setDialog(null)}
          onSubmit={createPackage}
          submitLabel="Create package"
          title="Create client package"
        >
          <div className="sales-form-grid">
            <SetupField label="Client" required>
              <input type="text" value={draft.client} onChange={(event) => setDraft((current) => ({ ...current, client: event.target.value }))} />
            </SetupField>
            <SetupField label="Package name" required>
              <input type="text" value={draft.packageName} onChange={(event) => setDraft((current) => ({ ...current, packageName: event.target.value }))} />
            </SetupField>
            <SetupField label="Billing cycle">
              <input type="text" value={draft.billingCycle} onChange={(event) => setDraft((current) => ({ ...current, billingCycle: event.target.value }))} />
            </SetupField>
            <SetupField label="Monthly fee">
              <input type="number" value={draft.monthlyFee} onChange={(event) => setDraft((current) => ({ ...current, monthlyFee: event.target.value }))} />
            </SetupField>
            <SetupField label="Scope" helper="Keep the scope short enough to fit invoice summaries.">
              <input type="text" value={draft.scope} onChange={(event) => setDraft((current) => ({ ...current, scope: event.target.value }))} />
            </SetupField>
          </div>
        </SalesActionDialog>
      ) : null}
    </div>
  );
}

function InvoicesView({ components, initialInvoices }: { components: SharedSalesComponents; initialInvoices: InvoiceRecord[] }) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon, SetupField } = components;
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState<SalesDialogAction | null>(null);
  const [draft, setDraft] = useState({
    amount: "28000",
    client: "Cebu Logistics Co.",
    dueDate: "April 30, 2026",
    invoiceNo: "INV-2026-1025"
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${invoice.invoiceNo} ${invoice.client}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((current) => current.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)));
  };

  const createInvoice = () => {
    const amount = Number(draft.amount) || 0;
    const newInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      amount,
      client: draft.client.trim() || "New client",
      dueDate: draft.dueDate.trim() || "April 30, 2026",
      invoiceNo: draft.invoiceNo.trim() || `INV-2026-${Date.now()}`,
      issueDate: "Today",
      status: "Draft"
    };

    setInvoices((current) => [newInvoice, ...current]);
    setDialog(null);
  };

  return (
    <div className="dashboard-content sales-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Invoices</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter invoice status" value={statusFilter} options={invoiceStatusOptions} onChange={setStatusFilter} />
            </div>
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setDialog("create-invoice")}>Create invoice</button>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search invoice or client" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Issue date</th>
                <th>Due date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td><strong>{invoice.invoiceNo}</strong></td>
                    <td>{invoice.client}</td>
                    <td>{invoice.issueDate}</td>
                    <td>{invoice.dueDate}</td>
                    <td>{formatMoney(invoice.amount)}</td>
                    <td><span className={`admin-pill sales-status-${toStatusClass(invoice.status)}`}>{invoice.status}</span></td>
                    <td>
                      <div className="sales-row-actions">
                        <button type="button" className="chart-row-action" aria-label={`Open ${invoice.invoiceNo}`} onClick={() => setSelectedInvoice(invoice)}>
                          <RowOpenIcon />
                        </button>
                        <button type="button" className="chart-page-button chart-page-button-ghost" disabled={invoice.status === "Sent"} onClick={() => updateInvoiceStatus(invoice.id, "Sent")}>Send</button>
                        <button type="button" className="chart-page-button chart-page-button-ghost" disabled={invoice.status === "Paid"} onClick={() => updateInvoiceStatus(invoice.id, "Paid")}>Paid</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="chart-empty-state">
                      <strong>No invoices match the current filters.</strong>
                      <p>Try another status or search by client name.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedInvoice ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close invoice details"
          description="Invoice preview for frontend review. Posting is not connected yet."
          footerCopy={selectedInvoice.status}
          onClose={() => setSelectedInvoice(null)}
          title={selectedInvoice.invoiceNo}
        >
          <div className="admin-audit-detail-grid">
            <div className="admin-audit-detail-item">
              <span>Client</span>
              <strong>{selectedInvoice.client}</strong>
            </div>
            <div className="admin-audit-detail-item">
              <span>Amount</span>
              <strong>{formatMoney(selectedInvoice.amount)}</strong>
            </div>
            <div className="admin-audit-detail-item">
              <span>Issue date</span>
              <strong>{selectedInvoice.issueDate}</strong>
            </div>
            <div className="admin-audit-detail-item">
              <span>Due date</span>
              <strong>{selectedInvoice.dueDate}</strong>
            </div>
          </div>
        </SalesActionDialog>
      ) : null}

      {dialog === "create-invoice" ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close create invoice"
          description="Create a frontend-only invoice row for demo billing workflows."
          onClose={() => setDialog(null)}
          onSubmit={createInvoice}
          submitLabel="Create invoice"
          title="Create invoice"
        >
          <div className="sales-form-grid">
            <SetupField label="Invoice number" required>
              <input type="text" value={draft.invoiceNo} onChange={(event) => setDraft((current) => ({ ...current, invoiceNo: event.target.value }))} />
            </SetupField>
            <SetupField label="Client" required>
              <input type="text" value={draft.client} onChange={(event) => setDraft((current) => ({ ...current, client: event.target.value }))} />
            </SetupField>
            <SetupField label="Amount">
              <input type="number" value={draft.amount} onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))} />
            </SetupField>
            <SetupField label="Due date">
              <input type="text" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />
            </SetupField>
          </div>
        </SalesActionDialog>
      ) : null}
    </div>
  );
}

function AcknowledgmentReceiptsView({ components, initialReceipts }: { components: SharedSalesComponents; initialReceipts: ReceiptRecord[] }) {
  const { CloseIcon, RowOpenIcon, SetupField } = components;
  const [receipts, setReceipts] = useState(initialReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null);
  const [dialog, setDialog] = useState<SalesDialogAction | null>(null);
  const [draft, setDraft] = useState({
    amount: "32500",
    arNo: "AR-2026-0846",
    client: "Northstar Retail OPC",
    reference: "INV-2026-1024 / BPI pending match"
  });

  const createReceipt = () => {
    const amount = Number(draft.amount) || 0;
    const newReceipt: ReceiptRecord = {
      id: `ar-${Date.now()}`,
      amount,
      arNo: draft.arNo.trim() || `AR-2026-${Date.now()}`,
      client: draft.client.trim() || "New client",
      dateReceived: "Today",
      reference: draft.reference.trim() || "Unlinked payment",
      status: "Draft"
    };

    setReceipts((current) => [newReceipt, ...current]);
    setDialog(null);
  };

  return (
    <div className="dashboard-content sales-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Acknowledgment Receipts</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setDialog("create-receipt")}>Create receipt</button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>AR number</th>
                <th>Client</th>
                <th>Reference</th>
                <th>Date received</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="chart-table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} onClick={() => setSelectedReceipt(receipt)}>
                  <td><strong>{receipt.arNo}</strong></td>
                  <td>{receipt.client}</td>
                  <td>{receipt.reference}</td>
                  <td>{receipt.dateReceived}</td>
                  <td>{formatMoney(receipt.amount)}</td>
                  <td><span className={`admin-pill sales-status-${toStatusClass(receipt.status)}`}>{receipt.status}</span></td>
                  <td className="chart-table-actions-col">
                    <button
                      type="button"
                      className="chart-row-action"
                      aria-label={`Open ${receipt.arNo}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedReceipt(receipt);
                      }}
                    >
                      <RowOpenIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReceipt ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close receipt details"
          description="Receipt preview for client payment documentation."
          footerCopy={selectedReceipt.status}
          onClose={() => setSelectedReceipt(null)}
          title={selectedReceipt.arNo}
        >
          <div className="admin-audit-detail-grid">
            <div className="admin-audit-detail-item">
              <span>Client</span>
              <strong>{selectedReceipt.client}</strong>
            </div>
            <div className="admin-audit-detail-item">
              <span>Amount</span>
              <strong>{formatMoney(selectedReceipt.amount)}</strong>
            </div>
            <div className="admin-audit-detail-item admin-audit-detail-item-full">
              <span>Reference</span>
              <strong>{selectedReceipt.reference}</strong>
            </div>
          </div>
        </SalesActionDialog>
      ) : null}

      {dialog === "create-receipt" ? (
        <SalesActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close create receipt"
          description="Create a frontend-only receipt for payment documentation."
          onClose={() => setDialog(null)}
          onSubmit={createReceipt}
          submitLabel="Create receipt"
          title="Create acknowledgment receipt"
        >
          <div className="sales-form-grid">
            <SetupField label="AR number" required>
              <input type="text" value={draft.arNo} onChange={(event) => setDraft((current) => ({ ...current, arNo: event.target.value }))} />
            </SetupField>
            <SetupField label="Client" required>
              <input type="text" value={draft.client} onChange={(event) => setDraft((current) => ({ ...current, client: event.target.value }))} />
            </SetupField>
            <SetupField label="Amount">
              <input type="number" value={draft.amount} onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))} />
            </SetupField>
            <SetupField label="Reference">
              <input type="text" value={draft.reference} onChange={(event) => setDraft((current) => ({ ...current, reference: event.target.value }))} />
            </SetupField>
          </div>
        </SalesActionDialog>
      ) : null}
    </div>
  );
}

function PaymentTrackingView({ components, initialPayments }: { components: SharedSalesComponents; initialPayments: PaymentRecord[] }) {
  const { CustomSelect, SearchIcon } = components;
  const [payments, setPayments] = useState(initialPayments);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${payment.client} ${payment.invoiceNo} ${payment.bankAccount}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setPayments((current) => current.map((payment) => (payment.id === id ? { ...payment, status } : payment)));
  };

  return (
    <div className="dashboard-content sales-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Payment Tracking</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter payment status" value={statusFilter} options={paymentStatusOptions} onChange={setStatusFilter} />
            </div>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search client, invoice, or bank account" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Invoice</th>
                <th>Expected</th>
                <th>Received</th>
                <th>Bank account</th>
                <th>Match status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>{payment.client}</strong></td>
                    <td>{payment.invoiceNo}</td>
                    <td>{formatMoney(payment.expectedAmount)}</td>
                    <td>{formatMoney(payment.receivedAmount)}</td>
                    <td>{payment.bankAccount}</td>
                    <td><span className={`admin-pill sales-status-${toStatusClass(payment.status)}`}>{payment.status}</span></td>
                    <td>
                      <div className="sales-row-actions">
                        <button type="button" className="chart-page-button chart-page-button-ghost" disabled={payment.status === "Matched"} onClick={() => updatePaymentStatus(payment.id, "Matched")}>Match</button>
                        <button type="button" className="chart-page-button chart-page-button-ghost" disabled={payment.status === "Partial"} onClick={() => updatePaymentStatus(payment.id, "Partial")}>Partial</button>
                        <button type="button" className="chart-page-button chart-page-button-ghost" disabled={payment.status === "Flagged"} onClick={() => updatePaymentStatus(payment.id, "Flagged")}>Flag</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="chart-empty-state">
                      <strong>No payments match the current filters.</strong>
                      <p>Try another status or search by client, invoice, or bank account.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function SalesBillingWorkspace({ companyName, components, view }: SalesBillingWorkspaceProps) {
  if (view === "client-packages") {
    return <ClientPackagesView components={components} initialPackages={packageSeed} />;
  }

  if (view === "invoices") {
    return <InvoicesView components={components} initialInvoices={invoiceSeed} />;
  }

  if (view === "acknowledgment-receipts") {
    return <AcknowledgmentReceiptsView components={components} initialReceipts={receiptSeed} />;
  }

  if (view === "payment-tracking") {
    return <PaymentTrackingView components={components} initialPayments={paymentSeed} />;
  }

  return <SalesOverview companyName={companyName} components={components} invoices={invoiceSeed} payments={paymentSeed} />;
}
