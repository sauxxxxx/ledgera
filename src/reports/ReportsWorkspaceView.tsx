import { useState, type ReactNode } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectComponentProps = {
  ariaLabel: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

type SharedReportsComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
};

export type ReportsWorkspaceView =
  | "trial-balance"
  | "income-statement"
  | "balance-sheet"
  | "cash-flow-statement"
  | "report-exports";

type ReportsWorkspaceProps = {
  companyName: string;
  components: SharedReportsComponents;
  view: ReportsWorkspaceView;
};

type AccountType = "Asset" | "Liability" | "Equity" | "Income" | "Expense";
type ReportStatus = "Ready" | "Review" | "Draft";

type TrialBalanceAccount = {
  account: string;
  code: string;
  credit: number;
  debit: number;
  type: AccountType;
};

type StatementLine = {
  amount: number;
  label: string;
  note: string;
};

type ExportRecord = {
  format: "PDF" | "Excel";
  id: string;
  period: string;
  report: string;
  status: ReportStatus;
  updatedAt: string;
};

const periodOptions: SelectOption[] = [
  { value: "april-2026", label: "April 2026" },
  { value: "q2-2026", label: "Q2 2026" },
  { value: "year-2026", label: "Year 2026" }
];

const reportStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Ready", label: "Ready" },
  { value: "Review", label: "Review" },
  { value: "Draft", label: "Draft" }
];

const trialBalanceSeed: TrialBalanceAccount[] = [
  { code: "1020", account: "Cash in Bank", type: "Asset", debit: 476100.75, credit: 0 },
  { code: "1100", account: "Accounts Receivable", type: "Asset", debit: 74000, credit: 0 },
  { code: "2000", account: "Accounts Payable", type: "Liability", debit: 0, credit: 117100 },
  { code: "3000", account: "Owner's Equity", type: "Equity", debit: 0, credit: 245000 },
  { code: "4100", account: "Service Revenue", type: "Income", debit: 0, credit: 63000 },
  { code: "5100", account: "Office Rent Expense", type: "Expense", debit: 58000, credit: 0 },
  { code: "5200", account: "Professional Fees Expense", type: "Expense", debit: 14500, credit: 0 },
  { code: "5300", account: "Bank Charges Expense", type: "Expense", debit: 350, credit: 0 }
];

const revenueLines: StatementLine[] = [
  { label: "Service revenue", amount: 63000, note: "Sales invoices and monthly retainers" },
  { label: "Advisory income", amount: 12000, note: "Quarterly advisory draft pipeline" }
];

const expenseLines: StatementLine[] = [
  { label: "Office rent expense", amount: 58000, note: "April lease payable" },
  { label: "Professional fees expense", amount: 14500, note: "Audit support accrual" },
  { label: "Bank charges expense", amount: 350, note: "Imported bank service charge" },
  { label: "Software subscription", amount: 7800, note: "CloudLedger Tools PH" }
];

const assetLines: StatementLine[] = [
  { label: "Cash in Bank", amount: 476100.75, note: "Operating and payroll bank balances" },
  { label: "Accounts Receivable", amount: 74000, note: "Open client invoices" },
  { label: "Petty Cash", amount: 16250, note: "Manual cash ledger" }
];

const liabilityLines: StatementLine[] = [
  { label: "Accounts Payable", amount: 117100, note: "Supplier and statutory obligations" },
  { label: "Tax Payable", amount: 31500, note: "Withholding tax schedule" }
];

const equityLines: StatementLine[] = [
  { label: "Owner's Equity", amount: 245000, note: "Opening capital and retained balances" }
];

const cashFlowLines: StatementLine[] = [
  { label: "Client collections", amount: 34000, note: "Cash receipts from AR" },
  { label: "Supplier payments", amount: -4250, note: "Cash disbursements and bank charges" },
  { label: "Payroll reserve movement", amount: -122000, note: "Payroll funding transfer" },
  { label: "Operating cash before financing", amount: -92250, note: "Net operating cash movement" }
];

const exportSeed: ExportRecord[] = [
  { id: "exp-trial-balance", report: "Trial Balance", period: "April 2026", format: "Excel", status: "Ready", updatedAt: "Today, 10:24 AM" },
  { id: "exp-income", report: "Income Statement", period: "April 2026", format: "PDF", status: "Review", updatedAt: "Today, 9:42 AM" },
  { id: "exp-balance-sheet", report: "Balance Sheet", period: "April 2026", format: "PDF", status: "Ready", updatedAt: "Yesterday, 5:18 PM" },
  { id: "exp-cash-flow", report: "Cash Flow Statement", period: "April 2026", format: "Excel", status: "Draft", updatedAt: "Yesterday, 4:55 PM" }
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const toStatusClass = (status: string) => status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const sum = (lines: StatementLine[]) => lines.reduce((total, line) => total + line.amount, 0);

function ReportsDialog({
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
      <section className="admin-audit-dialog reports-action-dialog">
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
        <div className="chart-standard-dialog-footer reports-dialog-footer">
          {footerCopy ? <span>{footerCopy}</span> : null}
          <div className="reports-dialog-actions">
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

function ReportHeader({
  CustomSelect,
  actionLabel,
  onAction,
  period,
  setPeriod,
  title
}: {
  CustomSelect: SharedReportsComponents["CustomSelect"];
  actionLabel: string;
  onAction: () => void;
  period: string;
  setPeriod: (value: string) => void;
  title: string;
}) {
  return (
    <div className="admin-table-header">
      <h1>{title}</h1>
      <div className="admin-table-header-actions">
        <div className="admin-filter-grid admin-filter-grid-single">
          <CustomSelect ariaLabel={`Choose ${title} period`} value={period} options={periodOptions} onChange={setPeriod} />
        </div>
        <button type="button" className="chart-page-button chart-page-button-ghost" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function ExportPreviewDialog({
  CloseIcon,
  onClose,
  period,
  reportTitle
}: {
  CloseIcon: () => ReactNode;
  onClose: () => void;
  period: string;
  reportTitle: string;
}) {
  return (
    <ReportsDialog
      CloseIcon={CloseIcon}
      closeLabel="Close report export"
      description="Preview this export before backend PDF or Excel generation is connected."
      footerCopy="Frontend preview only"
      onClose={onClose}
      onSubmit={onClose}
      submitLabel="Prepare export"
      title={`Export ${reportTitle}`}
    >
      <div className="reports-dialog-grid">
        <div className="reports-dialog-card">
          <span>Report</span>
          <strong>{reportTitle}</strong>
          <p>Uses the current period filter and table values.</p>
        </div>
        <div className="reports-dialog-card">
          <span>Period</span>
          <strong>{periodOptions.find((option) => option.value === period)?.label ?? period}</strong>
          <p>PDF and Excel generation will be connected in a backend phase.</p>
        </div>
      </div>
    </ReportsDialog>
  );
}

function TrialBalanceView({ components }: { components: SharedReportsComponents }) {
  const { CloseIcon, CustomSelect, SearchIcon } = components;
  const [period, setPeriod] = useState("april-2026");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const filteredAccounts = trialBalanceSeed.filter((account) =>
    `${account.code} ${account.account} ${account.type}`.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  const debitTotal = filteredAccounts.reduce((total, account) => total + account.debit, 0);
  const creditTotal = filteredAccounts.reduce((total, account) => total + account.credit, 0);

  return (
    <div className="dashboard-content reports-workspace-view">
      <section className="admin-workspace-main">
        <ReportHeader CustomSelect={CustomSelect} actionLabel="Export trial balance" onAction={() => setExportOpen(true)} period={period} setPeriod={setPeriod} title="Trial Balance" />
        <div className="reports-summary-row">
          <div><span>Total debit</span><strong>{formatMoney(debitTotal)}</strong></div>
          <div><span>Total credit</span><strong>{formatMoney(creditTotal)}</strong></div>
          <div><span>Difference</span><strong>{formatMoney(Math.abs(debitTotal - creditTotal))}</strong></div>
        </div>
        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search account, code, or type" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>
        <div className="chart-table-panel">
          <table className="chart-table">
            <thead><tr><th>Code</th><th>Account</th><th>Type</th><th>Debit</th><th>Credit</th></tr></thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.code}>
                  <td>{account.code}</td>
                  <td><strong>{account.account}</strong></td>
                  <td>{account.type}</td>
                  <td>{account.debit ? formatMoney(account.debit) : "-"}</td>
                  <td>{account.credit ? formatMoney(account.credit) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {exportOpen ? <ExportPreviewDialog CloseIcon={CloseIcon} onClose={() => setExportOpen(false)} period={period} reportTitle="Trial Balance" /> : null}
    </div>
  );
}

function StatementTable({ lines, totalLabel }: { lines: StatementLine[]; totalLabel: string }) {
  return (
    <div className="chart-table-panel">
      <table className="chart-table">
        <thead><tr><th>Line</th><th>Note</th><th>Amount</th></tr></thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.label}>
              <td><strong>{line.label}</strong></td>
              <td>{line.note}</td>
              <td>{formatMoney(line.amount)}</td>
            </tr>
          ))}
          <tr>
            <td><strong>{totalLabel}</strong></td>
            <td>Calculated from visible report lines</td>
            <td><strong>{formatMoney(sum(lines))}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function IncomeStatementView({ components }: { components: SharedReportsComponents }) {
  const { CloseIcon, CustomSelect } = components;
  const [period, setPeriod] = useState("april-2026");
  const [exportOpen, setExportOpen] = useState(false);
  const revenue = sum(revenueLines);
  const expenses = sum(expenseLines);
  const netIncome = revenue - expenses;

  return (
    <div className="dashboard-content reports-workspace-view">
      <section className="admin-workspace-main">
        <ReportHeader CustomSelect={CustomSelect} actionLabel="Export income statement" onAction={() => setExportOpen(true)} period={period} setPeriod={setPeriod} title="Income Statement" />
        <div className="reports-summary-row">
          <div><span>Revenue</span><strong>{formatMoney(revenue)}</strong></div>
          <div><span>Expenses</span><strong>{formatMoney(expenses)}</strong></div>
          <div><span>Net income</span><strong>{formatMoney(netIncome)}</strong></div>
        </div>
        <div className="reports-section-label">Revenue</div>
        <StatementTable lines={revenueLines} totalLabel="Total revenue" />
        <div className="reports-section-label">Expenses</div>
        <StatementTable lines={expenseLines} totalLabel="Total expenses" />
      </section>
      {exportOpen ? <ExportPreviewDialog CloseIcon={CloseIcon} onClose={() => setExportOpen(false)} period={period} reportTitle="Income Statement" /> : null}
    </div>
  );
}

function BalanceSheetView({ components }: { components: SharedReportsComponents }) {
  const { CloseIcon, CustomSelect } = components;
  const [period, setPeriod] = useState("april-2026");
  const [exportOpen, setExportOpen] = useState(false);
  const assets = sum(assetLines);
  const liabilities = sum(liabilityLines);
  const equity = sum(equityLines);

  return (
    <div className="dashboard-content reports-workspace-view">
      <section className="admin-workspace-main">
        <ReportHeader CustomSelect={CustomSelect} actionLabel="Export balance sheet" onAction={() => setExportOpen(true)} period={period} setPeriod={setPeriod} title="Balance Sheet" />
        <div className="reports-summary-row">
          <div><span>Assets</span><strong>{formatMoney(assets)}</strong></div>
          <div><span>Liabilities</span><strong>{formatMoney(liabilities)}</strong></div>
          <div><span>Equity</span><strong>{formatMoney(equity)}</strong></div>
        </div>
        <div className="reports-section-label">Assets</div>
        <StatementTable lines={assetLines} totalLabel="Total assets" />
        <div className="reports-section-label">Liabilities</div>
        <StatementTable lines={liabilityLines} totalLabel="Total liabilities" />
        <div className="reports-section-label">Equity</div>
        <StatementTable lines={equityLines} totalLabel="Total equity" />
      </section>
      {exportOpen ? <ExportPreviewDialog CloseIcon={CloseIcon} onClose={() => setExportOpen(false)} period={period} reportTitle="Balance Sheet" /> : null}
    </div>
  );
}

function CashFlowStatementView({ components }: { components: SharedReportsComponents }) {
  const { CloseIcon, CustomSelect } = components;
  const [period, setPeriod] = useState("april-2026");
  const [exportOpen, setExportOpen] = useState(false);
  const inflows = cashFlowLines.filter((line) => line.amount > 0).reduce((total, line) => total + line.amount, 0);
  const outflows = cashFlowLines.filter((line) => line.amount < 0).reduce((total, line) => total + Math.abs(line.amount), 0);

  return (
    <div className="dashboard-content reports-workspace-view">
      <section className="admin-workspace-main">
        <ReportHeader CustomSelect={CustomSelect} actionLabel="Export cash flow" onAction={() => setExportOpen(true)} period={period} setPeriod={setPeriod} title="Cash Flow Statement" />
        <div className="reports-summary-row">
          <div><span>Cash inflows</span><strong>{formatMoney(inflows)}</strong></div>
          <div><span>Cash outflows</span><strong>{formatMoney(outflows)}</strong></div>
          <div><span>Net cash movement</span><strong>{formatMoney(sum(cashFlowLines))}</strong></div>
        </div>
        <StatementTable lines={cashFlowLines} totalLabel="Net cash movement" />
      </section>
      {exportOpen ? <ExportPreviewDialog CloseIcon={CloseIcon} onClose={() => setExportOpen(false)} period={period} reportTitle="Cash Flow Statement" /> : null}
    </div>
  );
}

function ReportExportsView({ companyName, components }: { companyName: string; components: SharedReportsComponents }) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon } = components;
  const [items, setItems] = useState(exportSeed);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExport, setSelectedExport] = useState<ExportRecord | null>(null);
  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${item.report} ${item.period} ${item.format}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const markReady = () => {
    if (!selectedExport) {
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === selectedExport.id ? { ...item, status: "Ready", updatedAt: "Just now" } : item))
    );
    setSelectedExport(null);
  };

  return (
    <div className="dashboard-content reports-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Exports</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter export status" value={statusFilter} options={reportStatusOptions} onChange={setStatusFilter} />
            </div>
          </div>
        </div>
        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search report, period, or format" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>
        <div className="chart-table-panel">
          <table className="chart-table">
            <thead><tr><th>Report</th><th>Period</th><th>Format</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} onClick={() => setSelectedExport(item)}>
                  <td><strong>{item.report}</strong></td>
                  <td>{item.period}</td>
                  <td>{item.format}</td>
                  <td><span className={`admin-pill reports-status-${toStatusClass(item.status)}`}>{item.status}</span></td>
                  <td>{item.updatedAt}</td>
                  <td>
                    <button
                      type="button"
                      className="chart-row-action"
                      aria-label={`Open ${item.report} export`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedExport(item);
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
      {selectedExport ? (
        <ReportsDialog CloseIcon={CloseIcon} closeLabel="Close export details" description="Review this frontend-only export queue item." footerCopy={companyName} onClose={() => setSelectedExport(null)} onSubmit={selectedExport.status === "Ready" ? undefined : markReady} submitLabel={selectedExport.status === "Ready" ? undefined : "Mark ready"} title={`${selectedExport.report} export`}>
          <div className="reports-dialog-grid">
            <div className="reports-dialog-card"><span>Format</span><strong>{selectedExport.format}</strong><p>Backend export generation is not connected yet.</p></div>
            <div className="reports-dialog-card"><span>Status</span><strong>{selectedExport.status}</strong><p>{selectedExport.period} report package.</p></div>
          </div>
        </ReportsDialog>
      ) : null}
    </div>
  );
}

export function ReportsWorkspace({ companyName, components, view }: ReportsWorkspaceProps) {
  if (view === "income-statement") {
    return <IncomeStatementView components={components} />;
  }

  if (view === "balance-sheet") {
    return <BalanceSheetView components={components} />;
  }

  if (view === "cash-flow-statement") {
    return <CashFlowStatementView components={components} />;
  }

  if (view === "report-exports") {
    return <ReportExportsView companyName={companyName} components={components} />;
  }

  return <TrialBalanceView components={components} />;
}
