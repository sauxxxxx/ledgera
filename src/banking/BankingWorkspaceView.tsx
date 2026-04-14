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

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const formatAmountClass = (value: number) => (value < 0 ? "banking-amount-negative" : "banking-amount-positive");

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
  transactions,
  reconciliations
}: {
  accounts: BankAccountRecord[];
  companyName: string;
  transactions: BankTransactionRecord[];
  reconciliations: ReconciliationRecord[];
}) {
  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Banking Overview</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost">Import CSV</button>
            <button type="button" className="chart-page-button chart-page-button-primary">Review transactions</button>
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
    </div>
  );
}

function BankAccountsView({ accounts, components }: { accounts: BankAccountRecord[]; components: SharedBankingComponents }) {
  const { CloseIcon, RowOpenIcon } = components;
  const [selectedAccount, setSelectedAccount] = useState<BankAccountRecord | null>(null);

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Accounts</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost">Import statement</button>
            <button type="button" className="chart-page-button chart-page-button-primary">Add account</button>
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
              {accounts.map((account) => (
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
    </div>
  );
}

function BankTransactionsView({ components, initialTransactions }: { components: SharedBankingComponents; initialTransactions: BankTransactionRecord[] }) {
  const { CustomSelect, SearchIcon } = components;
  const [transactions, setTransactions] = useState(initialTransactions);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
              {filteredTransactions.map((transaction) => (
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
                      <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => updateStatus(transaction.id, "Matched")}>Match</button>
                      <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => updateStatus(transaction.id, "Categorized")}>Categorize</button>
                      <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => updateStatus(transaction.id, "Excluded")}>Exclude</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BankRulesView() {
  const [rules, setRules] = useState(bankRulesSeed);

  const toggleRule = (id: string) => {
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, status: rule.status === "Active" ? "Inactive" : "Active" } : rule)));
  };

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Rules</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-primary">Create rule</button>
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
    </div>
  );
}

function BankReconciliationView() {
  const [items, setItems] = useState(reconciliationSeed);

  const markReconciled = (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, difference: 0, bookBalance: item.statementBalance, status: "Reconciled" } : item)));
  };

  return (
    <div className="dashboard-content banking-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Bank Reconciliation</h1>
          <div className="admin-table-header-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost">Export reconciliation</button>
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
    return <BankRulesView />;
  }

  if (view === "bank-reconciliation") {
    return <BankReconciliationView />;
  }

  return <BankingOverview accounts={bankAccountsSeed} companyName={companyName} transactions={bankTransactionsSeed} reconciliations={reconciliationSeed} />;
}
