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

type SharedBankingComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

export type BankingWorkspaceView =
  | "banking-overview"
  | "bank-accounts"
  | "bank-transactions"
  | "bank-rules"
  | "bank-reconciliation";

type BankingWorkspaceProps = {
  companyName: string;
  components: SharedBankingComponents;
  view: BankingWorkspaceView;
};

type BankAccountStatus = "Connected" | "CSV import" | "Manual";
type BankTransactionStatus = "Uncategorized" | "Matched" | "Categorized" | "Excluded";
type BankRuleStatus = "Active" | "Inactive";
type ReconciliationStatus = "Open" | "Reconciled";

type BankAccountRecord = {
  accountName: string;
  bankBalance: number;
  bookBalance: number;
  currency: string;
  id: string;
  institution: string;
  lastUpdated: string;
  status: BankAccountStatus;
  unresolved: number;
};

type BankTransactionRecord = {
  account: string;
  amount: number;
  date: string;
  description: string;
  id: string;
  reference: string;
  status: BankTransactionStatus;
};

type BankRuleRecord = {
  condition: string;
  id: string;
  name: string;
  status: BankRuleStatus;
  target: string;
};

type ReconciliationRecord = {
  account: string;
  bookBalance: number;
  difference: number;
  id: string;
  statementBalance: number;
  statementDate: string;
  status: ReconciliationStatus;
};

type BankingDialogAction = "add-account" | "import-statement" | "review-transactions" | "create-rule" | "export-reconciliation";

type TransactionActionDraft = {
  status: BankTransactionStatus;
  transaction: BankTransactionRecord;
};

const bankAccountsSeed: BankAccountRecord[] = [
  {
    id: "bpi-operating",
    accountName: "BPI Operating Account",
    institution: "Bank of the Philippine Islands",
    currency: "PHP",
    bankBalance: 482350.75,
    bookBalance: 476100.75,
    status: "CSV import",
    lastUpdated: "Today, 9:20 AM",
    unresolved: 4
  },
  {
    id: "bdo-payroll",
    accountName: "BDO Payroll Account",
    institution: "BDO Unibank",
    currency: "PHP",
    bankBalance: 216800,
    bookBalance: 216800,
    status: "Connected",
    lastUpdated: "Today, 8:15 AM",
    unresolved: 0
  },
  {
    id: "cash-on-hand",
    accountName: "Petty Cash",
    institution: "Internal cash ledger",
    currency: "PHP",
    bankBalance: 18500,
    bookBalance: 16250,
    status: "Manual",
    lastUpdated: "Yesterday, 4:30 PM",
    unresolved: 2
  }
];

const bankTransactionsSeed: BankTransactionRecord[] = [
  {
    id: "txn-1",
    date: "2026-04-14",
    description: "Client payment - Northstar Retail",
    reference: "BPI-0426-001",
    account: "BPI Operating Account",
    amount: 84500,
    status: "Matched"
  },
  {
    id: "txn-2",
    date: "2026-04-14",
    description: "Bank service charge",
    reference: "BPI-FEE-0414",
    account: "BPI Operating Account",
    amount: -350,
    status: "Uncategorized"
  },
  {
    id: "txn-3",
    date: "2026-04-13",
    description: "Payroll funding transfer",
    reference: "BDO-PR-2044",
    account: "BDO Payroll Account",
    amount: -122000,
    status: "Categorized"
  },
  {
    id: "txn-4",
    date: "2026-04-12",
    description: "Duplicate imported transfer",
    reference: "BPI-DUP-0412",
    account: "BPI Operating Account",
    amount: 25000,
    status: "Excluded"
  },
  {
    id: "txn-5",
    date: "2026-04-11",
    description: "Office supplies reimbursement",
    reference: "PC-APR-012",
    account: "Petty Cash",
    amount: -2250,
    status: "Uncategorized"
  }
];

const bankRulesSeed: BankRuleRecord[] = [
  {
    id: "rule-bank-fees",
    name: "Bank fees",
    condition: "Description contains service charge or fee",
    target: "Bank Charges Expense",
    status: "Active"
  },
  {
    id: "rule-payroll",
    name: "Payroll funding",
    condition: "Reference starts with BDO-PR",
    target: "Payroll Clearing",
    status: "Active"
  },
  {
    id: "rule-petty-cash",
    name: "Petty cash reimbursements",
    condition: "Account is Petty Cash and amount is negative",
    target: "Office Supplies Expense",
    status: "Inactive"
  }
];

const reconciliationSeed: ReconciliationRecord[] = [
  {
    id: "rec-bpi-apr",
    account: "BPI Operating Account",
    statementDate: "April 14, 2026",
    statementBalance: 482350.75,
    bookBalance: 476100.75,
    difference: 6250,
    status: "Open"
  },
  {
    id: "rec-bdo-apr",
    account: "BDO Payroll Account",
    statementDate: "April 14, 2026",
    statementBalance: 216800,
    bookBalance: 216800,
    difference: 0,
    status: "Reconciled"
  },
  {
    id: "rec-cash-apr",
    account: "Petty Cash",
    statementDate: "April 13, 2026",
    statementBalance: 18500,
    bookBalance: 16250,
    difference: 2250,
    status: "Open"
  }
];

const transactionStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Uncategorized", label: "Uncategorized" },
  { value: "Matched", label: "Matched" },
  { value: "Categorized", label: "Categorized" },
  { value: "Excluded", label: "Excluded" }
];

const accountStatusOptions: SelectOption[] = [
  { value: "Connected", label: "Connected feed" },
  { value: "CSV import", label: "CSV import" },
  { value: "Manual", label: "Manual tracking" }
];

const transactionCategoryOptions: SelectOption[] = [
  { value: "Accounts Receivable", label: "Accounts Receivable" },
  { value: "Bank Charges Expense", label: "Bank Charges Expense" },
  { value: "Office Supplies Expense", label: "Office Supplies Expense" },
  { value: "Payroll Clearing", label: "Payroll Clearing" }
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const formatAmountClass = (value: number) => (value < 0 ? "banking-amount-negative" : "banking-amount-positive");

function BankingActionDialog({
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
      <section className="admin-audit-dialog banking-action-dialog">
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
        <div className="chart-standard-dialog-footer banking-dialog-footer">
          {footerCopy ? <span>{footerCopy}</span> : null}
          <div className="banking-dialog-actions">
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

function BankingSummary({ accounts, transactions, reconciliations }: { accounts: BankAccountRecord[]; transactions: BankTransactionRecord[]; reconciliations: ReconciliationRecord[] }) {
  const bankBalance = accounts.reduce((total, account) => total + account.bankBalance, 0);
  const bookBalance = accounts.reduce((total, account) => total + account.bookBalance, 0);
  const uncategorizedCount = transactions.filter((transaction) => transaction.status === "Uncategorized").length;
  const openReconciliations = reconciliations.filter((item) => item.status === "Open").length;

  return (
    <section className="chart-accounts-summary banking-summary" aria-label="Banking summary">
      <div className="chart-summary-item">
        <span>Bank balance</span>
        <strong>{formatMoney(bankBalance)}</strong>
        <small>Across active bank and cash accounts</small>
      </div>
      <div className="chart-summary-item">
        <span>Book balance</span>
        <strong>{formatMoney(bookBalance)}</strong>
        <small>Ledger-side cash balance</small>
      </div>
      <div className="chart-summary-item">
        <span>Uncategorized</span>
        <strong>{uncategorizedCount}</strong>
        <small>Transactions still need review</small>
      </div>
      <div className="chart-summary-item">
        <span>Reconciliation</span>
        <strong>{openReconciliations} open</strong>
        <small>Accounts waiting for review</small>
      </div>
    </section>
  );
}

function BankingOverview({
  accounts,
  companyName,
  components,
  transactions,
  reconciliations
}: {
  accounts: BankAccountRecord[];
  companyName: string;
  components: SharedBankingComponents;
  transactions: BankTransactionRecord[];
  reconciliations: ReconciliationRecord[];
}) {
  const { CloseIcon } = components;
  const [actionDialog, setActionDialog] = useState<BankingDialogAction | null>(null);
  const uncategorizedCount = transactions.filter((transaction) => transaction.status === "Uncategorized").length;

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Banking Overview</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setActionDialog("import-statement")}>Import CSV</button>
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setActionDialog("review-transactions")}>Review transactions</button>
          </div>
        </div>

        <div className="admin-page-panel-body">
          <BankingSummary accounts={accounts} transactions={transactions} reconciliations={reconciliations} />
        </div>

        <div className="banking-panel-subhead">
          <div>
            <strong>Recent bank activity</strong>
            <span>Latest imported and manually tracked cash movements for {companyName}.</span>
          </div>
          <span>{transactions.length} lines in review</span>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.account}</td>
                  <td className={formatAmountClass(transaction.amount)}>{formatMoney(transaction.amount)}</td>
                  <td><span className={`admin-pill banking-status-${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {actionDialog === "import-statement" ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close CSV import"
          description="Preview a statement import before it creates bank lines. This is frontend-only for now."
          footerCopy="Mock import only"
          onClose={() => setActionDialog(null)}
          onSubmit={() => setActionDialog(null)}
          submitLabel="Queue import"
          title="Import bank statement"
        >
          <div className="banking-dialog-grid">
            <div className="banking-dialog-card">
              <span>Source file</span>
              <strong>BPI_operating_april.csv</strong>
              <p>5 rows detected, 2 need category review, 1 possible duplicate.</p>
            </div>
            <div className="banking-dialog-card">
              <span>Target account</span>
              <strong>BPI Operating Account</strong>
              <p>New lines will stay unposted until reviewed by accounting.</p>
            </div>
          </div>
        </BankingActionDialog>
      ) : null}

      {actionDialog === "review-transactions" ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close transaction review"
          description="Use this queue to resolve imported lines before they affect the books."
          footerCopy={`${uncategorizedCount} uncategorized lines`}
          onClose={() => setActionDialog(null)}
          onSubmit={() => setActionDialog(null)}
          submitLabel="Open transaction queue"
          title="Review bank transactions"
        >
          <div className="banking-review-list">
            {transactions.filter((transaction) => transaction.status === "Uncategorized").map((transaction) => (
              <div key={transaction.id} className="banking-review-item">
                <div>
                  <strong>{transaction.description}</strong>
                  <span>{transaction.account} - {transaction.reference}</span>
                </div>
                <span className={formatAmountClass(transaction.amount)}>{formatMoney(transaction.amount)}</span>
              </div>
            ))}
          </div>
        </BankingActionDialog>
      ) : null}
    </div>
  );
}

function BankAccountsView({ accounts, components }: { accounts: BankAccountRecord[]; components: SharedBankingComponents }) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SetupField } = components;
  const [bankAccounts, setBankAccounts] = useState(accounts);
  const [selectedAccount, setSelectedAccount] = useState<BankAccountRecord | null>(null);
  const [actionDialog, setActionDialog] = useState<BankingDialogAction | null>(null);
  const [accountDraft, setAccountDraft] = useState({
    accountName: "Metrobank Tax Reserve",
    bankBalance: "125000",
    institution: "Metrobank",
    status: "Manual"
  });

  const handleAddAccount = () => {
    const bankBalance = Number(accountDraft.bankBalance) || 0;
    const newAccount: BankAccountRecord = {
      id: `bank-account-${Date.now()}`,
      accountName: accountDraft.accountName.trim() || "New Bank Account",
      bankBalance,
      bookBalance: bankBalance,
      currency: "PHP",
      institution: accountDraft.institution.trim() || "Manual bank account",
      lastUpdated: "Just now",
      status: accountDraft.status as BankAccountStatus,
      unresolved: 0
    };

    setBankAccounts((current) => [newAccount, ...current]);
    setActionDialog(null);
  };

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Accounts</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setActionDialog("import-statement")}>Import statement</button>
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setActionDialog("add-account")}>Add account</button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Institution</th>
                <th>Bank balance</th>
                <th>Book balance</th>
                <th>Status</th>
                <th>Last updated</th>
                <th className="chart-table-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankAccounts.map((account) => (
                <tr key={account.id} onClick={() => setSelectedAccount(account)}>
                  <td>
                    <div className="admin-primary-cell">
                      <strong>{account.accountName}</strong>
                      <span>{account.currency} - {account.unresolved} unresolved</span>
                    </div>
                  </td>
                  <td>{account.institution}</td>
                  <td>{formatMoney(account.bankBalance)}</td>
                  <td>{formatMoney(account.bookBalance)}</td>
                  <td><span className={`admin-pill banking-status-${account.status.toLowerCase().replace(/\s+/g, "-")}`}>{account.status}</span></td>
                  <td>{account.lastUpdated}</td>
                  <td className="chart-table-actions-col">
                    <button
                      type="button"
                      className="chart-row-action"
                      aria-label={`Open ${account.accountName}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedAccount(account);
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

      {selectedAccount ? (
        <div className="chart-standard-layer admin-audit-dialog-layer" role="dialog" aria-modal="true" aria-label={`${selectedAccount.accountName} details`}>
          <button type="button" className="chart-standard-backdrop" aria-label="Close bank account" onClick={() => setSelectedAccount(null)} />
          <section className="admin-audit-dialog banking-account-dialog">
            <div className="chart-standard-dialog-head">
              <div>
                <strong>{selectedAccount.accountName}</strong>
                <p>{selectedAccount.institution}</p>
              </div>
              <button type="button" className="chart-standard-close" onClick={() => setSelectedAccount(null)} aria-label="Close bank account">
                <CloseIcon />
              </button>
            </div>
            <div className="chart-standard-dialog-body">
              <div className="admin-audit-detail-grid">
                <div className="admin-audit-detail-item">
                  <span>Bank balance</span>
                  <strong>{formatMoney(selectedAccount.bankBalance)}</strong>
                </div>
                <div className="admin-audit-detail-item">
                  <span>Book balance</span>
                  <strong>{formatMoney(selectedAccount.bookBalance)}</strong>
                </div>
                <div className="admin-audit-detail-item">
                  <span>Import status</span>
                  <strong>{selectedAccount.status}</strong>
                </div>
                <div className="admin-audit-detail-item">
                  <span>Unresolved</span>
                  <strong>{selectedAccount.unresolved} transactions</strong>
                </div>
                <div className="admin-audit-detail-item admin-audit-detail-item-full">
                  <span>Last updated</span>
                  <strong>{selectedAccount.lastUpdated}</strong>
                </div>
              </div>
            </div>
            <div className="chart-standard-dialog-footer">
              <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setSelectedAccount(null)}>Done</button>
            </div>
          </section>
        </div>
      ) : null}

      {actionDialog === "add-account" ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close add account"
          description="Create a frontend-only bank account record for the current workspace."
          onClose={() => setActionDialog(null)}
          onSubmit={handleAddAccount}
          submitLabel="Add account"
          title="Add bank account"
        >
          <div className="banking-form-grid">
            <SetupField label="Account name" required>
              <input
                type="text"
                value={accountDraft.accountName}
                onChange={(event) => setAccountDraft((current) => ({ ...current, accountName: event.target.value }))}
              />
            </SetupField>
            <SetupField label="Institution" required>
              <input
                type="text"
                value={accountDraft.institution}
                onChange={(event) => setAccountDraft((current) => ({ ...current, institution: event.target.value }))}
              />
            </SetupField>
            <SetupField label="Opening balance" helper="For now this also sets the book balance.">
              <input
                type="number"
                value={accountDraft.bankBalance}
                onChange={(event) => setAccountDraft((current) => ({ ...current, bankBalance: event.target.value }))}
              />
            </SetupField>
            <SetupField label="Import method">
              <CustomSelect
                ariaLabel="Choose bank import method"
                value={accountDraft.status}
                options={accountStatusOptions}
                onChange={(value) => setAccountDraft((current) => ({ ...current, status: value }))}
              />
            </SetupField>
          </div>
        </BankingActionDialog>
      ) : null}

      {actionDialog === "import-statement" ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close statement import"
          description="Stage a statement file and review detected lines before posting."
          footerCopy="CSV parsing will be connected later"
          onClose={() => setActionDialog(null)}
          onSubmit={() => setActionDialog(null)}
          submitLabel="Stage import"
          title="Import statement"
        >
          <div className="banking-dialog-grid">
            <div className="banking-dialog-card">
              <span>Detected columns</span>
              <strong>Date, Description, Debit, Credit, Balance</strong>
              <p>Ledgera will map these to bank lines in the next backend phase.</p>
            </div>
            <div className="banking-dialog-card">
              <span>Review policy</span>
              <strong>Do not post automatically</strong>
              <p>Imported rows remain in Banking Transactions until matched, categorized, or excluded.</p>
            </div>
          </div>
        </BankingActionDialog>
      ) : null}
    </div>
  );
}

function BankTransactionsView({ components, initialTransactions }: { components: SharedBankingComponents; initialTransactions: BankTransactionRecord[] }) {
  const { CloseIcon, CustomSelect, SearchIcon } = components;
  const [transactions, setTransactions] = useState(initialTransactions);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionAction, setTransactionAction] = useState<TransactionActionDraft | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Bank Charges Expense");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${transaction.description} ${transaction.account} ${transaction.reference}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateStatus = (id: string, status: BankTransactionStatus) => {
    setTransactions((current) => current.map((transaction) => (transaction.id === id ? { ...transaction, status } : transaction)));
  };

  const openTransactionAction = (transaction: BankTransactionRecord, status: BankTransactionStatus) => {
    setSelectedCategory(status === "Matched" ? "Accounts Receivable" : "Bank Charges Expense");
    setTransactionAction({ transaction, status });
  };

  const confirmTransactionAction = () => {
    if (!transactionAction) {
      return;
    }

    updateStatus(transactionAction.transaction.id, transactionAction.status);
    setTransactionAction(null);
  };

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Transactions</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter transaction status" value={statusFilter} options={transactionStatusOptions} onChange={setStatusFilter} />
            </div>
          </div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search description, account, or reference" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>
                      <div className="admin-primary-cell">
                        <strong>{transaction.description}</strong>
                        <span>{transaction.reference}</span>
                      </div>
                    </td>
                    <td>{transaction.account}</td>
                    <td className={formatAmountClass(transaction.amount)}>{formatMoney(transaction.amount)}</td>
                    <td><span className={`admin-pill banking-status-${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                    <td>
                      <div className="banking-row-actions">
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={transaction.status === "Matched"}
                          onClick={() => openTransactionAction(transaction, "Matched")}
                        >
                          Match
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={transaction.status === "Categorized"}
                          onClick={() => openTransactionAction(transaction, "Categorized")}
                        >
                          Categorize
                        </button>
                        <button
                          type="button"
                          className="chart-page-button chart-page-button-ghost"
                          disabled={transaction.status === "Excluded"}
                          onClick={() => openTransactionAction(transaction, "Excluded")}
                        >
                          Exclude
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="chart-empty-state">
                      <strong>No bank lines match the current filters.</strong>
                      <p>Try another status or search by description, account, or reference.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {transactionAction ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close transaction action"
          description="Confirm how this bank line should move through the review queue."
          footerCopy={transactionAction.transaction.reference}
          onClose={() => setTransactionAction(null)}
          onSubmit={confirmTransactionAction}
          submitLabel={`Mark as ${transactionAction.status.toLowerCase()}`}
          title={`${transactionAction.status} transaction`}
        >
          <div className="banking-dialog-grid">
            <div className="banking-dialog-card">
              <span>Bank line</span>
              <strong>{transactionAction.transaction.description}</strong>
              <p>{transactionAction.transaction.account} - {formatMoney(transactionAction.transaction.amount)}</p>
            </div>
            <div className="banking-dialog-card">
              <span>Review result</span>
              <strong>{transactionAction.status}</strong>
              <p>{transactionAction.status === "Excluded" ? "This line will be ignored in accounting reports." : "This line remains frontend-only until posting is connected."}</p>
            </div>
          </div>
          {transactionAction.status !== "Excluded" ? (
            <div className="banking-form-grid banking-form-grid-single">
              <div className="setup-field">
                <span className="setup-field-label">Target ledger account</span>
                <CustomSelect
                  ariaLabel="Choose transaction target account"
                  value={selectedCategory}
                  options={transactionCategoryOptions}
                  onChange={setSelectedCategory}
                />
                <span className="setup-field-note">This records the intended accounting mapping for the next backend phase.</span>
              </div>
            </div>
          ) : null}
        </BankingActionDialog>
      ) : null}
    </div>
  );
}

function BankRulesView({ components }: { components: SharedBankingComponents }) {
  const { CloseIcon, SetupField } = components;
  const [rules, setRules] = useState(bankRulesSeed);
  const [actionDialog, setActionDialog] = useState<BankingDialogAction | null>(null);
  const [ruleDraft, setRuleDraft] = useState({
    condition: "Description contains transfer fee",
    name: "Transfer fees",
    target: "Bank Charges Expense"
  });

  const toggleRule = (id: string) => {
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, status: rule.status === "Active" ? "Inactive" : "Active" } : rule)));
  };

  const handleCreateRule = () => {
    const newRule: BankRuleRecord = {
      id: `bank-rule-${Date.now()}`,
      condition: ruleDraft.condition.trim() || "Description contains keyword",
      name: ruleDraft.name.trim() || "New bank rule",
      status: "Active",
      target: ruleDraft.target.trim() || "Uncategorized Clearing"
    };

    setRules((current) => [newRule, ...current]);
    setActionDialog(null);
  };

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Rules</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setActionDialog("create-rule")}>Create rule</button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Condition</th>
                <th>Target</th>
                <th>Status</th>
                <th>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td><strong>{rule.name}</strong></td>
                  <td>{rule.condition}</td>
                  <td>{rule.target}</td>
                  <td><span className={`admin-pill banking-status-${rule.status.toLowerCase()}`}>{rule.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className={`admin-toggle-control ${rule.status === "Active" ? "admin-toggle-control-enabled" : ""}`}
                      aria-label={`Toggle ${rule.name}`}
                      aria-pressed={rule.status === "Active"}
                      onClick={() => toggleRule(rule.id)}
                    >
                      <span className="admin-toggle-knob" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {actionDialog === "create-rule" ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close create rule"
          description="Create a frontend-only rule that can be toggled in the rules table."
          onClose={() => setActionDialog(null)}
          onSubmit={handleCreateRule}
          submitLabel="Create rule"
          title="Create bank rule"
        >
          <div className="banking-form-grid">
            <SetupField label="Rule name" required>
              <input
                type="text"
                value={ruleDraft.name}
                onChange={(event) => setRuleDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </SetupField>
            <SetupField label="Target account" required>
              <input
                type="text"
                value={ruleDraft.target}
                onChange={(event) => setRuleDraft((current) => ({ ...current, target: event.target.value }))}
              />
            </SetupField>
            <SetupField label="Condition" helper="Keep it readable so reviewers understand why the rule matched.">
              <input
                type="text"
                value={ruleDraft.condition}
                onChange={(event) => setRuleDraft((current) => ({ ...current, condition: event.target.value }))}
              />
            </SetupField>
          </div>
        </BankingActionDialog>
      ) : null}
    </div>
  );
}

function BankReconciliationView({ components }: { components: SharedBankingComponents }) {
  const { CloseIcon } = components;
  const [items, setItems] = useState(reconciliationSeed);
  const [actionDialog, setActionDialog] = useState<BankingDialogAction | null>(null);

  const markReconciled = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, difference: 0, bookBalance: item.statementBalance, status: "Reconciled" } : item)));
  };

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Reconciliation</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setActionDialog("export-reconciliation")}>Export reconciliation</button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Statement date</th>
                <th>Statement balance</th>
                <th>Book balance</th>
                <th>Difference</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.account}</strong></td>
                  <td>{item.statementDate}</td>
                  <td>{formatMoney(item.statementBalance)}</td>
                  <td>{formatMoney(item.bookBalance)}</td>
                  <td className={item.difference === 0 ? "banking-amount-positive" : "banking-amount-negative"}>{formatMoney(item.difference)}</td>
                  <td><span className={`admin-pill banking-status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className="chart-page-button chart-page-button-ghost"
                      disabled={item.status === "Reconciled"}
                      onClick={() => markReconciled(item.id)}
                    >
                      Mark reconciled
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {actionDialog === "export-reconciliation" ? (
        <BankingActionDialog
          CloseIcon={CloseIcon}
          closeLabel="Close reconciliation export"
          description="Preview the export package before backend file generation is connected."
          footerCopy={`${items.length} reconciliation records`}
          onClose={() => setActionDialog(null)}
          onSubmit={() => setActionDialog(null)}
          submitLabel="Prepare export"
          title="Export reconciliation"
        >
          <div className="banking-dialog-grid">
            <div className="banking-dialog-card">
              <span>Included records</span>
              <strong>{items.length} accounts</strong>
              <p>{items.filter((item) => item.status === "Open").length} open, {items.filter((item) => item.status === "Reconciled").length} reconciled.</p>
            </div>
            <div className="banking-dialog-card">
              <span>Export format</span>
              <strong>CSV summary</strong>
              <p>Account, statement date, balances, difference, and current status.</p>
            </div>
          </div>
        </BankingActionDialog>
      ) : null}
    </div>
  );
}

export function BankingWorkspace({ companyName, components, view }: BankingWorkspaceProps) {
  if (view === "bank-accounts") {
    return <BankAccountsView accounts={bankAccountsSeed} components={components} />;
  }

  if (view === "bank-transactions") {
    return <BankTransactionsView components={components} initialTransactions={bankTransactionsSeed} />;
  }

  if (view === "bank-rules") {
    return <BankRulesView components={components} />;
  }

  if (view === "bank-reconciliation") {
    return <BankReconciliationView components={components} />;
  }

  return <BankingOverview accounts={bankAccountsSeed} companyName={companyName} components={components} transactions={bankTransactionsSeed} reconciliations={reconciliationSeed} />;
}
