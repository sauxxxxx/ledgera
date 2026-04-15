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

type SharedAccountingComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

export type AccountingWorkspaceView =
  | "general-journal-entry"
  | "general-journal"
  | "cash-receipts-journal"
  | "cash-disbursements-journal"
  | "sales-journal"
  | "purchase-journal";

type AccountingWorkspaceProps = {
  companyName: string;
  components: SharedAccountingComponents;
  view: AccountingWorkspaceView;
};

type JournalStatus = "Draft" | "Posted" | "Flagged" | "Reviewed";
type JournalSource = "Manual" | "Sales" | "Receivables" | "Payables" | "Banking";

type JournalLine = {
  account: string;
  credit: number;
  debit: number;
};

type JournalEntryRecord = {
  date: string;
  id: string;
  lines: JournalLine[];
  memo: string;
  reference: string;
  source: JournalSource;
  status: JournalStatus;
};

type SubsidiaryJournalRecord = {
  account: string;
  amount: number;
  date: string;
  id: string;
  memo: string;
  name: string;
  reference: string;
  status: JournalStatus;
};

type JournalDialogAction =
  | "create-entry"
  | "export-journal"
  | "view-entry"
  | "post-entry"
  | "flag-entry"
  | "review-record";

const journalEntriesSeed: JournalEntryRecord[] = [
  {
    id: "je-2026-0415-01",
    date: "April 15, 2026",
    reference: "GJE-2026-0041",
    source: "Manual",
    memo: "Monthly accrual for professional fees",
    status: "Draft",
    lines: [
      { account: "Professional Fees Expense", debit: 14500, credit: 0 },
      { account: "Accounts Payable", debit: 0, credit: 14500 }
    ]
  },
  {
    id: "je-2026-0414-01",
    date: "April 14, 2026",
    reference: "BANK-2026-0144",
    source: "Banking",
    memo: "Bank charge from imported statement",
    status: "Posted",
    lines: [
      { account: "Bank Charges Expense", debit: 350, credit: 0 },
      { account: "Cash in Bank", debit: 0, credit: 350 }
    ]
  },
  {
    id: "je-2026-0412-01",
    date: "April 12, 2026",
    reference: "AR-2026-0844",
    source: "Receivables",
    memo: "Client collection from Makati Dental Group",
    status: "Posted",
    lines: [
      { account: "Cash in Bank", debit: 24000, credit: 0 },
      { account: "Accounts Receivable", debit: 0, credit: 24000 }
    ]
  },
  {
    id: "je-2026-0408-01",
    date: "April 8, 2026",
    reference: "INV-2026-1023",
    source: "Sales",
    memo: "Service invoice issued to Harbor Foods Trading",
    status: "Posted",
    lines: [
      { account: "Accounts Receivable", debit: 18500, credit: 0 },
      { account: "Service Revenue", debit: 0, credit: 18500 }
    ]
  }
];

const cashReceiptsSeed: SubsidiaryJournalRecord[] = [
  {
    id: "crj-makati",
    date: "April 12, 2026",
    reference: "AR-2026-0844",
    name: "Makati Dental Group",
    account: "Accounts Receivable",
    amount: 24000,
    status: "Posted",
    memo: "BPI collection matched to invoice INV-2026-1021"
  },
  {
    id: "crj-harbor",
    date: "April 10, 2026",
    reference: "BPI partial payment",
    name: "Harbor Foods Trading",
    account: "Accounts Receivable",
    amount: 10000,
    status: "Reviewed",
    memo: "Partial collection still leaves invoice balance"
  }
];

const cashDisbursementsSeed: SubsidiaryJournalRecord[] = [
  {
    id: "cdj-software",
    date: "April 8, 2026",
    reference: "BDO transfer",
    name: "CloudLedger Tools PH",
    account: "Software Subscription",
    amount: 3900,
    status: "Posted",
    memo: "Partial supplier payment"
  },
  {
    id: "cdj-bank-fee",
    date: "April 14, 2026",
    reference: "BPI-FEE-0414",
    name: "Bank of the Philippine Islands",
    account: "Bank Charges Expense",
    amount: 350,
    status: "Posted",
    memo: "Bank service charge"
  }
];

const salesJournalSeed: SubsidiaryJournalRecord[] = [
  {
    id: "sj-northstar",
    date: "April 1, 2026",
    reference: "INV-2026-1024",
    name: "Northstar Retail OPC",
    account: "Service Revenue",
    amount: 32500,
    status: "Reviewed",
    memo: "Monthly accounting retainer invoice"
  },
  {
    id: "sj-harbor",
    date: "March 25, 2026",
    reference: "INV-2026-1023",
    name: "Harbor Foods Trading",
    account: "Service Revenue",
    amount: 18500,
    status: "Posted",
    memo: "Compliance essentials invoice"
  }
];

const purchaseJournalSeed: SubsidiaryJournalRecord[] = [
  {
    id: "pj-lease",
    date: "April 12, 2026",
    reference: "BILL-2026-0412",
    name: "Makati Tower Leasing Corp.",
    account: "Office Rent Expense",
    amount: 58000,
    status: "Draft",
    memo: "Office lease payable for April"
  },
  {
    id: "pj-pldt",
    date: "April 10, 2026",
    reference: "BILL-2026-0410",
    name: "PLDT Enterprise",
    account: "Utilities and Internet",
    amount: 9200,
    status: "Flagged",
    memo: "Overdue internet service bill"
  }
];

const sourceOptions: SelectOption[] = [
  { value: "all", label: "All sources" },
  { value: "Manual", label: "Manual" },
  { value: "Sales", label: "Sales" },
  { value: "Receivables", label: "Receivables" },
  { value: "Payables", label: "Payables" },
  { value: "Banking", label: "Banking" }
];

const statusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Draft", label: "Draft" },
  { value: "Posted", label: "Posted" },
  { value: "Flagged", label: "Flagged" },
  { value: "Reviewed", label: "Reviewed" }
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const toStatusClass = (status: string) => status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const getDebitTotal = (entry: JournalEntryRecord) => entry.lines.reduce((total, line) => total + line.debit, 0);
const getCreditTotal = (entry: JournalEntryRecord) => entry.lines.reduce((total, line) => total + line.credit, 0);
const isBalanced = (entry: JournalEntryRecord) => getDebitTotal(entry) === getCreditTotal(entry);

function AccountingDialog({
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
      <section className="admin-audit-dialog accounting-action-dialog">
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
        <div className="chart-standard-dialog-footer accounting-dialog-footer">
          {footerCopy ? <span>{footerCopy}</span> : null}
          <div className="accounting-dialog-actions">
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

function JournalLines({ entry }: { entry: JournalEntryRecord }) {
  return (
    <div className="accounting-line-list">
      {entry.lines.map((line) => (
        <div key={`${entry.id}-${line.account}`} className="accounting-line-item">
          <strong>{line.account}</strong>
          <span>{line.debit > 0 ? `Debit ${formatMoney(line.debit)}` : `Credit ${formatMoney(line.credit)}`}</span>
        </div>
      ))}
    </div>
  );
}

function GeneralJournalEntryView({ components }: { components: SharedAccountingComponents }) {
  const { CloseIcon, RowOpenIcon, SearchIcon, SetupField } = components;
  const [entries, setEntries] = useState(journalEntriesSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState<JournalDialogAction | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryRecord | null>(null);
  const [draft, setDraft] = useState({
    creditAccount: "Service Revenue",
    creditAmount: "32500",
    date: "Today",
    debitAccount: "Accounts Receivable",
    debitAmount: "32500",
    memo: "Manual journal entry",
    reference: "GJE-2026-0042"
  });

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${entry.reference} ${entry.memo} ${entry.source}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesSearch && entry.status !== "Posted";
  });

  const createEntry = () => {
    const debitAmount = Math.max(Number(draft.debitAmount) || 0, 0);
    const creditAmount = Math.max(Number(draft.creditAmount) || 0, 0);
    const newEntry: JournalEntryRecord = {
      id: `je-${Date.now()}`,
      date: draft.date.trim() || "Today",
      reference: draft.reference.trim() || `GJE-${Date.now()}`,
      source: "Manual",
      memo: draft.memo.trim() || "Manual journal entry",
      status: debitAmount === creditAmount ? "Draft" : "Flagged",
      lines: [
        { account: draft.debitAccount.trim() || "Suspense", debit: debitAmount, credit: 0 },
        { account: draft.creditAccount.trim() || "Suspense", debit: 0, credit: creditAmount }
      ]
    };

    setEntries((current) => [newEntry, ...current]);
    setDialog(null);
  };

  const updateEntryStatus = (status: JournalStatus) => {
    if (!selectedEntry) {
      return;
    }

    setEntries((current) =>
      current.map((entry) => (entry.id === selectedEntry.id ? { ...entry, status } : entry))
    );
    setDialog(null);
    setSelectedEntry(null);
  };

  const openEntryAction = (entry: JournalEntryRecord, action: JournalDialogAction) => {
    setSelectedEntry(entry);
    setDialog(action);
  };

  return (
    <div className="dashboard-content accounting-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>General Journal Entry</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setDialog("create-entry")}>
              Create entry
            </button>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search reference, memo, or source" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Memo</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Validation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} onClick={() => openEntryAction(entry, "view-entry")}>
                  <td>{entry.date}</td>
                  <td><strong>{entry.reference}</strong></td>
                  <td>{entry.memo}</td>
                  <td>{formatMoney(getDebitTotal(entry))}</td>
                  <td>{formatMoney(getCreditTotal(entry))}</td>
                  <td>{isBalanced(entry) ? "Balanced" : "Out of balance"}</td>
                  <td><span className={`admin-pill accounting-status-${toStatusClass(entry.status)}`}>{entry.status}</span></td>
                  <td>
                    <div className="accounting-row-actions">
                      <button
                        type="button"
                        className="chart-row-action"
                        aria-label={`Open ${entry.reference}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          openEntryAction(entry, "view-entry");
                        }}
                      >
                        <RowOpenIcon />
                      </button>
                      <button
                        type="button"
                        className="chart-page-button chart-page-button-ghost"
                        disabled={!isBalanced(entry) || entry.status === "Posted"}
                        onClick={(event) => {
                          event.stopPropagation();
                          openEntryAction(entry, "post-entry");
                        }}
                      >
                        Post
                      </button>
                      <button
                        type="button"
                        className="chart-page-button chart-page-button-ghost"
                        disabled={entry.status === "Flagged"}
                        onClick={(event) => {
                          event.stopPropagation();
                          openEntryAction(entry, "flag-entry");
                        }}
                      >
                        Flag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {dialog === "create-entry" ? (
        <AccountingDialog CloseIcon={CloseIcon} closeLabel="Close create entry" description="Create a frontend-only double-entry draft. Equal debit and credit totals can be posted." onClose={() => setDialog(null)} onSubmit={createEntry} submitLabel="Create entry" title="Create journal entry">
          <div className="accounting-form-grid">
            <SetupField label="Date"><input type="text" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} /></SetupField>
            <SetupField label="Reference" required><input type="text" value={draft.reference} onChange={(event) => setDraft((current) => ({ ...current, reference: event.target.value }))} /></SetupField>
            <SetupField label="Debit account" required><input type="text" value={draft.debitAccount} onChange={(event) => setDraft((current) => ({ ...current, debitAccount: event.target.value }))} /></SetupField>
            <SetupField label="Debit amount"><input type="number" value={draft.debitAmount} onChange={(event) => setDraft((current) => ({ ...current, debitAmount: event.target.value }))} /></SetupField>
            <SetupField label="Credit account" required><input type="text" value={draft.creditAccount} onChange={(event) => setDraft((current) => ({ ...current, creditAccount: event.target.value }))} /></SetupField>
            <SetupField label="Credit amount"><input type="number" value={draft.creditAmount} onChange={(event) => setDraft((current) => ({ ...current, creditAmount: event.target.value }))} /></SetupField>
            <SetupField label="Memo" helper="This memo appears in the general journal preview."><input type="text" value={draft.memo} onChange={(event) => setDraft((current) => ({ ...current, memo: event.target.value }))} /></SetupField>
          </div>
        </AccountingDialog>
      ) : null}

      {selectedEntry && (dialog === "view-entry" || dialog === "post-entry" || dialog === "flag-entry") ? (
        <AccountingDialog
          CloseIcon={CloseIcon}
          closeLabel="Close journal entry"
          description={dialog === "view-entry" ? "Review the entry lines and posting validation." : "Confirm the selected journal action."}
          footerCopy={isBalanced(selectedEntry) ? "Debits and credits match" : "Entry is out of balance"}
          onClose={() => {
            setDialog(null);
            setSelectedEntry(null);
          }}
          onSubmit={dialog === "post-entry" ? () => updateEntryStatus("Posted") : dialog === "flag-entry" ? () => updateEntryStatus("Flagged") : undefined}
          submitLabel={dialog === "post-entry" ? "Post entry" : dialog === "flag-entry" ? "Flag entry" : undefined}
          title={selectedEntry.reference}
        >
          <JournalLines entry={selectedEntry} />
        </AccountingDialog>
      ) : null}
    </div>
  );
}

function GeneralJournalView({
  companyName,
  components
}: {
  companyName: string;
  components: SharedAccountingComponents;
}) {
  const { CloseIcon, CustomSelect, SearchIcon } = components;
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const postedEntries = journalEntriesSeed.filter((entry) => entry.status === "Posted");
  const filteredEntries = postedEntries.filter((entry) => {
    const matchesSource = sourceFilter === "all" || entry.source === sourceFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${entry.reference} ${entry.memo} ${entry.source}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesSource && matchesSearch;
  });

  return (
    <div className="dashboard-content accounting-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>General Journal</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter journal source" value={sourceFilter} options={sourceOptions} onChange={setSourceFilter} />
            </div>
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setExportOpen(true)}>
              Export journal
            </button>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search reference, memo, or source" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Source</th>
                <th>Memo</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td><strong>{entry.reference}</strong></td>
                  <td>{entry.source}</td>
                  <td>{entry.memo}</td>
                  <td>{formatMoney(getDebitTotal(entry))}</td>
                  <td>{formatMoney(getCreditTotal(entry))}</td>
                  <td><span className={`admin-pill accounting-status-${toStatusClass(entry.status)}`}>{entry.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {exportOpen ? (
        <AccountingDialog CloseIcon={CloseIcon} closeLabel="Close journal export" description="Preview the general journal export package before backend file generation is connected." footerCopy={`${filteredEntries.length} posted entries`} onClose={() => setExportOpen(false)} onSubmit={() => setExportOpen(false)} submitLabel="Prepare export" title="Export general journal">
          <div className="accounting-dialog-grid">
            <div className="accounting-dialog-card">
              <span>Workspace</span>
              <strong>{companyName}</strong>
              <p>Export uses the current source filter and search results.</p>
            </div>
            <div className="accounting-dialog-card">
              <span>Format</span>
              <strong>CSV journal summary</strong>
              <p>Date, reference, source, memo, debit, credit, and status.</p>
            </div>
          </div>
        </AccountingDialog>
      ) : null}
    </div>
  );
}

function SubsidiaryJournalView({
  accountHeader,
  components,
  records,
  title
}: {
  accountHeader: string;
  components: SharedAccountingComponents;
  records: SubsidiaryJournalRecord[];
  title: string;
}) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon } = components;
  const [items, setItems] = useState(records);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<SubsidiaryJournalRecord | null>(null);
  const [reviewRecord, setReviewRecord] = useState<SubsidiaryJournalRecord | null>(null);

  const filteredItems = items.filter((record) => {
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${record.name} ${record.reference} ${record.account}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const markReviewed = () => {
    if (!reviewRecord) {
      return;
    }

    setItems((current) =>
      current.map((record) => (record.id === reviewRecord.id ? { ...record, status: "Reviewed" } : record))
    );
    setReviewRecord(null);
  };

  return (
    <div className="dashboard-content accounting-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>{title}</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel={`Filter ${title} status`} value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
            </div>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search name, reference, or account" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Reference</th>
                <th>{accountHeader}</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((record) => (
                  <tr key={record.id} onClick={() => setSelectedRecord(record)}>
                    <td>{record.date}</td>
                    <td><strong>{record.name}</strong></td>
                    <td>{record.reference}</td>
                    <td>{record.account}</td>
                    <td>{formatMoney(record.amount)}</td>
                    <td><span className={`admin-pill accounting-status-${toStatusClass(record.status)}`}>{record.status}</span></td>
                    <td>
                      <div className="accounting-row-actions">
                        <button
                          type="button"
                          className="chart-row-action"
                          aria-label={`Open ${record.reference}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedRecord(record);
                          }}
                        >
                          <RowOpenIcon />
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={record.status === "Reviewed"}
                          onClick={(event) => {
                            event.stopPropagation();
                            setReviewRecord(record);
                          }}
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="chart-empty-state">
                      <strong>No records match the current filters.</strong>
                      <p>Try another status or search by name, reference, or account.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRecord ? (
        <AccountingDialog CloseIcon={CloseIcon} closeLabel="Close record details" description="Review the source document before it flows into reports and compliance." footerCopy={selectedRecord.status} onClose={() => setSelectedRecord(null)} title={selectedRecord.reference}>
          <div className="admin-audit-detail-grid">
            <div className="admin-audit-detail-item"><span>Name</span><strong>{selectedRecord.name}</strong></div>
            <div className="admin-audit-detail-item"><span>Amount</span><strong>{formatMoney(selectedRecord.amount)}</strong></div>
            <div className="admin-audit-detail-item"><span>Account</span><strong>{selectedRecord.account}</strong></div>
            <div className="admin-audit-detail-item"><span>Date</span><strong>{selectedRecord.date}</strong></div>
            <div className="admin-audit-detail-item admin-audit-detail-item-full"><span>Memo</span><strong>{selectedRecord.memo}</strong></div>
          </div>
        </AccountingDialog>
      ) : null}

      {reviewRecord ? (
        <AccountingDialog CloseIcon={CloseIcon} closeLabel="Close review confirmation" description="Mark this row as reviewed for frontend workflow tracking." footerCopy={reviewRecord.reference} onClose={() => setReviewRecord(null)} onSubmit={markReviewed} submitLabel="Mark reviewed" title={`Review - ${reviewRecord.reference}`}>
          <div className="accounting-dialog-card">
            <span>Review item</span>
            <strong>{reviewRecord.name}</strong>
            <p>{reviewRecord.memo}</p>
          </div>
        </AccountingDialog>
      ) : null}
    </div>
  );
}

export function AccountingWorkspace({ companyName, components, view }: AccountingWorkspaceProps) {
  if (view === "general-journal") {
    return <GeneralJournalView companyName={companyName} components={components} />;
  }

  if (view === "cash-receipts-journal") {
    return <SubsidiaryJournalView accountHeader="Credit account" components={components} records={cashReceiptsSeed} title="Cash Receipts Journal" />;
  }

  if (view === "cash-disbursements-journal") {
    return <SubsidiaryJournalView accountHeader="Debit account" components={components} records={cashDisbursementsSeed} title="Cash Disbursements Journal" />;
  }

  if (view === "sales-journal") {
    return <SubsidiaryJournalView accountHeader="Revenue account" components={components} records={salesJournalSeed} title="Sales Journal" />;
  }

  if (view === "purchase-journal") {
    return <SubsidiaryJournalView accountHeader="Expense account" components={components} records={purchaseJournalSeed} title="Purchase Journal" />;
  }

  return <GeneralJournalEntryView components={components} />;
}
