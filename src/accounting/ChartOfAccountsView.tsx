import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

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

type SharedChartComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

type ChartAccountType = "Asset" | "Liability" | "Equity" | "Income" | "Expense";
type ChartAccountStatus = "Active" | "Inactive" | "Locked";
type ChartAccountSource = "System" | "Manual";
type ChartAccountBalance = "Debit" | "Credit";

type ChartAccount = {
  category: string;
  code: string;
  description: string;
  id: string;
  name: string;
  normalBalance: ChartAccountBalance;
  parent: string;
  parentId?: string;
  source: ChartAccountSource;
  status: ChartAccountStatus;
  type: ChartAccountType;
  updatedAt: string;
};

type StandardChartMode = "merge" | "replace";

type StandardChartPreset = {
  accounts: ChartAccount[];
  description: string;
  detail: string;
  id: string;
  label: string;
};

const chartAccountSeed: ChartAccount[] = [
  {
    id: "cash-equivalents",
    code: "1000",
    name: "Cash and Cash Equivalents",
    type: "Asset",
    category: "Current Asset",
    parent: "Top level",
    normalBalance: "Debit",
    status: "Locked",
    source: "System",
    updatedAt: "Today",
    description: "Top-level cash grouping for liquidity accounts."
  },
  {
    id: "cash-on-hand",
    code: "1010",
    name: "Cash on Hand",
    type: "Asset",
    category: "Current Asset",
    parent: "Cash and Cash Equivalents",
    parentId: "cash-equivalents",
    normalBalance: "Debit",
    status: "Active",
    source: "System",
    updatedAt: "2 hours ago",
    description: "Primary petty cash and undeposited collections."
  },
  {
    id: "cash-bank",
    code: "1020",
    name: "Cash in Bank",
    type: "Asset",
    category: "Current Asset",
    parent: "Cash and Cash Equivalents",
    parentId: "cash-equivalents",
    normalBalance: "Debit",
    status: "Active",
    source: "System",
    updatedAt: "2 hours ago",
    description: "Operating bank balances for standard receipts and disbursements."
  },
  {
    id: "accounts-receivable",
    code: "1100",
    name: "Accounts Receivable",
    type: "Asset",
    category: "Current Asset",
    parent: "Top level",
    normalBalance: "Debit",
    status: "Active",
    source: "System",
    updatedAt: "Yesterday",
    description: "Outstanding customer balances from invoiced sales."
  },
  {
    id: "inventory",
    code: "1200",
    name: "Inventory",
    type: "Asset",
    category: "Current Asset",
    parent: "Top level",
    normalBalance: "Debit",
    status: "Inactive",
    source: "Manual",
    updatedAt: "Yesterday",
    description: "Goods available for sale and inventory adjustments."
  },
  {
    id: "trade-payables",
    code: "2000",
    name: "Trade Payables",
    type: "Liability",
    category: "Current Liability",
    parent: "Top level",
    normalBalance: "Credit",
    status: "Locked",
    source: "System",
    updatedAt: "4 hours ago",
    description: "Top-level grouping for supplier obligations."
  },
  {
    id: "accounts-payable",
    code: "2010",
    name: "Accounts Payable",
    type: "Liability",
    category: "Current Liability",
    parent: "Trade Payables",
    parentId: "trade-payables",
    normalBalance: "Credit",
    status: "Active",
    source: "System",
    updatedAt: "4 hours ago",
    description: "Supplier balances awaiting payment."
  },
  {
    id: "taxes-payable",
    code: "2100",
    name: "Taxes Payable",
    type: "Liability",
    category: "Tax Liability",
    parent: "Top level",
    normalBalance: "Credit",
    status: "Locked",
    source: "System",
    updatedAt: "1 day ago",
    description: "Top-level liability group for tax obligations."
  },
  {
    id: "vat-payable",
    code: "2105",
    name: "VAT Payable",
    type: "Liability",
    category: "Tax Liability",
    parent: "Taxes Payable",
    parentId: "taxes-payable",
    normalBalance: "Credit",
    status: "Active",
    source: "System",
    updatedAt: "1 day ago",
    description: "Output VAT less input VAT due to BIR."
  },
  {
    id: "capital",
    code: "3000",
    name: "Capital",
    type: "Equity",
    category: "Equity",
    parent: "Top level",
    normalBalance: "Credit",
    status: "Locked",
    source: "System",
    updatedAt: "3 days ago",
    description: "Top-level equity grouping for ownership and capital."
  },
  {
    id: "owner-capital",
    code: "3010",
    name: "Owner's Capital",
    type: "Equity",
    category: "Equity",
    parent: "Capital",
    parentId: "capital",
    normalBalance: "Credit",
    status: "Locked",
    source: "System",
    updatedAt: "3 days ago",
    description: "Opening capital and ownership contributions."
  },
  {
    id: "operating-revenue",
    code: "4000",
    name: "Operating Revenue",
    type: "Income",
    category: "Revenue",
    parent: "Top level",
    normalBalance: "Credit",
    status: "Locked",
    source: "System",
    updatedAt: "Today",
    description: "Top-level revenue grouping for operating income."
  },
  {
    id: "service-income",
    code: "4010",
    name: "Service Income",
    type: "Income",
    category: "Revenue",
    parent: "Operating Revenue",
    parentId: "operating-revenue",
    normalBalance: "Credit",
    status: "Active",
    source: "System",
    updatedAt: "Today",
    description: "Primary revenue from services rendered."
  },
  {
    id: "sales-income",
    code: "4020",
    name: "Sales Income",
    type: "Income",
    category: "Revenue",
    parent: "Operating Revenue",
    parentId: "operating-revenue",
    normalBalance: "Credit",
    status: "Active",
    source: "Manual",
    updatedAt: "Today",
    description: "Secondary revenue from product or package sales."
  },
  {
    id: "cost-of-revenue",
    code: "5000",
    name: "Cost of Revenue",
    type: "Expense",
    category: "Direct Expense",
    parent: "Top level",
    normalBalance: "Debit",
    status: "Locked",
    source: "System",
    updatedAt: "2 days ago",
    description: "Top-level direct cost grouping tied to income accounts."
  },
  {
    id: "cost-of-sales",
    code: "5010",
    name: "Cost of Sales",
    type: "Expense",
    category: "Direct Expense",
    parent: "Cost of Revenue",
    parentId: "cost-of-revenue",
    normalBalance: "Debit",
    status: "Active",
    source: "System",
    updatedAt: "2 days ago",
    description: "Direct cost associated with revenue recognition."
  },
  {
    id: "operating-expenses",
    code: "6000",
    name: "Operating Expenses",
    type: "Expense",
    category: "Operating Expense",
    parent: "Top level",
    normalBalance: "Debit",
    status: "Locked",
    source: "System",
    updatedAt: "1 day ago",
    description: "Top-level operating expense grouping."
  },
  {
    id: "utilities-expense",
    code: "6020",
    name: "Utilities Expense",
    type: "Expense",
    category: "Operating Expense",
    parent: "Operating Expenses",
    parentId: "operating-expenses",
    normalBalance: "Debit",
    status: "Active",
    source: "Manual",
    updatedAt: "1 day ago",
    description: "Recurring utility and facility operating costs."
  }
];

const chartAccountTypeOptions: SelectOption[] = [
  { value: "all", label: "All types" },
  { value: "Asset", label: "Assets" },
  { value: "Liability", label: "Liabilities" },
  { value: "Equity", label: "Equity" },
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expenses" }
];

const chartAccountCategoryOptions: SelectOption[] = [
  { value: "all", label: "All categories" },
  { value: "Current Asset", label: "Current Asset" },
  { value: "Current Liability", label: "Current Liability" },
  { value: "Tax Liability", label: "Tax Liability" },
  { value: "Equity", label: "Equity" },
  { value: "Revenue", label: "Revenue" },
  { value: "Direct Expense", label: "Direct Expense" },
  { value: "Operating Expense", label: "Operating Expense" }
];

const chartAccountStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Locked", label: "Locked" }
];

const chartAccountSourceOptions: SelectOption[] = [
  { value: "all", label: "System and manual" },
  { value: "System", label: "System" },
  { value: "Manual", label: "Manual" }
];

const chartAccountSortOptions: SelectOption[] = [
  { value: "code", label: "Code" },
  { value: "name", label: "Name" },
  { value: "updated", label: "Recently updated" }
];

const chartAccountBalanceOptions: SelectOption[] = [
  { value: "Debit", label: "Debit" },
  { value: "Credit", label: "Credit" }
];

const chartAccountStructureOptions: SelectOption[] = [
  { value: "top-level", label: "Top-level account" },
  { value: "sub-account", label: "Sub-account" }
];

const buildStandardChartAccounts = (idsToOmit: string[] = []) => {
  const omitSet = new Set(idsToOmit);
  return chartAccountSeed
    .filter((account) => !omitSet.has(account.id))
    .map((account) => ({
      ...account
    }));
};

const chartStandardPresets: StandardChartPreset[] = [
  {
    id: "ph-general",
    label: "Philippine general starter",
    description: "Balanced starter chart for service and trading businesses.",
    detail: "Includes cash, receivables, VAT, payables, equity, revenue, and operating expense accounts.",
    accounts: buildStandardChartAccounts()
  },
  {
    id: "ph-services",
    label: "Service company starter",
    description: "Lean chart with service-income defaults and fewer inventory-specific accounts.",
    detail: "Skips inventory-heavy accounts while keeping VAT, receivables, payables, and core expense groups ready.",
    accounts: buildStandardChartAccounts(["inventory", "sales-income", "cost-of-sales"])
  }
];

export function ChartOfAccountsWorkspace({
  companyName,
  components
}: {
  companyName: string;
  components: SharedChartComponents;
}) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon, SetupField } = components;
  const [accounts, setAccounts] = useState<ChartAccount[]>(chartAccountSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("code");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [editingAccount, setEditingAccount] = useState<ChartAccount | null>(null);
  const [createAccountDraft, setCreateAccountDraft] = useState<ChartAccount | null>(null);
  const [standardChartPresetId, setStandardChartPresetId] = useState(chartStandardPresets[0]?.id ?? "");
  const [standardChartMode, setStandardChartMode] = useState<StandardChartMode>("merge");
  const [standardChartDialogOpen, setStandardChartDialogOpen] = useState(false);
  const [chartNotice, setChartNotice] = useState<string | null>(null);

  const buildNewAccountDraft = (): ChartAccount => ({
    id: `manual-${Date.now()}`,
    code: "",
    name: "",
    type: "Asset",
    category: "Current Asset",
    parent: "",
    parentId: undefined,
    normalBalance: "Debit",
    status: "Active",
    source: "Manual",
    updatedAt: "Just now",
    description: ""
  });

  const updatedRank: Record<string, number> = {
    "Just now": 0,
    "2 hours ago": 1,
    "4 hours ago": 2,
    Today: 3,
    Yesterday: 4,
    "1 day ago": 5,
    "2 days ago": 6,
    "3 days ago": 7
  };

  const sortAccounts = (left: ChartAccount, right: ChartAccount) => {
    if (sortBy === "name") {
      return left.name.localeCompare(right.name);
    }

    if (sortBy === "updated") {
      return (updatedRank[left.updatedAt] ?? 100) - (updatedRank[right.updatedAt] ?? 100);
    }

    return left.code.localeCompare(right.code);
  };

  const buildParentOptions = (excludeId?: string) =>
    accounts
      .filter((account) => !account.parentId && account.id !== excludeId)
      .sort((left, right) => left.code.localeCompare(right.code))
      .map((account) => ({
        label: `${account.code} - ${account.name}`,
        value: account.id
      }));

  const applyParentSelectionToDraft = (draft: ChartAccount, parentId: string) => {
    if (parentId === "none") {
      return {
        ...draft,
        parent: "",
        parentId: undefined
      };
    }

    const parentAccount = accounts.find((account) => account.id === parentId);

    if (!parentAccount) {
      return draft;
    }

    return {
      ...draft,
      category: parentAccount.category,
      normalBalance: parentAccount.normalBalance,
      parent: parentAccount.name,
      parentId: parentAccount.id,
      type: parentAccount.type
    };
  };

  const summaryItems = (["Asset", "Liability", "Equity", "Income", "Expense"] as ChartAccountType[]).map((type) => ({
    count: accounts.filter((account) => account.type === type).length,
    label: type === "Asset" ? "Assets" : type === "Liability" ? "Liabilities" : type === "Expense" ? "Expenses" : type
  }));

  const filteredAccounts = [...accounts]
    .filter((account) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        `${account.code} ${account.name} ${account.parent}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesType = typeFilter === "all" || account.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || account.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || account.status === statusFilter;
      const matchesSource = sourceFilter === "all" || account.source === sourceFilter;

      return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesSource;
    })
    .sort(sortAccounts);

  const groupedAccounts = (["Asset", "Liability", "Equity", "Income", "Expense"] as ChartAccountType[])
    .map((type) => {
      const accountsOfType = filteredAccounts.filter((account) => account.type === type);

      if (accountsOfType.length === 0) {
        return null;
      }

      const accountLookup = new Map(accountsOfType.map((account) => [account.id, account]));
      const childLookup = new Map<string, ChartAccount[]>();

      accountsOfType.forEach((account) => {
        if (!account.parentId || !accountLookup.has(account.parentId)) {
          return;
        }

        const currentChildren = childLookup.get(account.parentId) ?? [];
        currentChildren.push(account);
        childLookup.set(account.parentId, currentChildren);
      });

      const orderedRows: Array<{ account: ChartAccount; depth: number }> = [];
      const visit = (account: ChartAccount, depth: number) => {
        orderedRows.push({ account, depth });
        const children = [...(childLookup.get(account.id) ?? [])].sort(sortAccounts);
        children.forEach((child) => visit(child, depth + 1));
      };

      accountsOfType
        .filter((account) => !account.parentId || !accountLookup.has(account.parentId))
        .sort(sortAccounts)
        .forEach((account) => visit(account, 0));

      return {
        count: accountsOfType.length,
        label: type === "Asset" ? "Assets" : type === "Liability" ? "Liabilities" : type === "Expense" ? "Expenses" : type,
        rows: orderedRows,
        type
      };
    })
    .filter((group): group is { count: number; label: string; rows: Array<{ account: ChartAccount; depth: number }>; type: ChartAccountType } => Boolean(group));

  const visibleIds = filteredAccounts.map((account) => account.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedAccountIds.includes(id));
  const selectedCount = selectedAccountIds.length;
  const editParentAccountOptions = buildParentOptions(editingAccount?.id);
  const createParentAccountOptions = buildParentOptions();
  const selectedStandardChartPreset =
    chartStandardPresets.find((preset) => preset.id === standardChartPresetId) ?? chartStandardPresets[0];
  const selectedPresetSummary = (["Asset", "Liability", "Equity", "Income", "Expense"] as ChartAccountType[]).map((type) => ({
    count: selectedStandardChartPreset.accounts.filter((account) => account.type === type).length,
    label: type === "Asset" ? "Assets" : type === "Liability" ? "Liabilities" : type === "Expense" ? "Expenses" : type
  }));
  const isEditingSubAccount = Boolean(editingAccount?.parentId);
  const isCreatingSubAccount = Boolean(createAccountDraft?.parentId);
  const editSaveDisabled = !editingAccount?.code.trim() || !editingAccount?.name.trim();
  const createSaveDisabled = !createAccountDraft?.code.trim() || !createAccountDraft?.name.trim();

  useEffect(() => {
    if (!editingAccount && !createAccountDraft && !standardChartDialogOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (createAccountDraft) {
        setCreateAccountDraft(null);
        return;
      }

      if (standardChartDialogOpen) {
        setStandardChartDialogOpen(false);
        return;
      }

      if (editingAccount) {
        setEditingAccount(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createAccountDraft, editingAccount, standardChartDialogOpen]);

  useEffect(() => {
    if (!chartNotice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setChartNotice(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [chartNotice]);

  const openAccountDrawer = (account: ChartAccount) => {
    setCreateAccountDraft(null);
    setEditingAccount({ ...account });
  };

  const handleAddAccount = () => {
    setStandardChartDialogOpen(false);
    setEditingAccount(null);
    setCreateAccountDraft(buildNewAccountDraft());
  };

  const handleOpenStandardChart = () => {
    setCreateAccountDraft(null);
    setEditingAccount(null);
    setStandardChartPresetId(chartStandardPresets[0]?.id ?? "");
    setStandardChartMode(accounts.length > 0 ? "merge" : "replace");
    setStandardChartDialogOpen(true);
  };

  const updateEditingField = <Field extends keyof ChartAccount>(field: Field, value: ChartAccount[Field]) => {
    setEditingAccount((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateCreateField = <Field extends keyof ChartAccount>(field: Field, value: ChartAccount[Field]) => {
    setCreateAccountDraft((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateEditingParentAccount = (parentId: string) => {
    setEditingAccount((current) => (current ? applyParentSelectionToDraft(current, parentId) : current));
  };

  const updateCreateParentAccount = (parentId: string) => {
    setCreateAccountDraft((current) => (current ? applyParentSelectionToDraft(current, parentId) : current));
  };

  const handleSaveEditedAccount = () => {
    if (!editingAccount || editSaveDisabled) {
      return;
    }

    setAccounts((current) => current.map((account) => (account.id === editingAccount.id ? { ...editingAccount, updatedAt: "Just now" } : account)));
    setEditingAccount(null);
  };

  const handleCreateAccount = () => {
    if (!createAccountDraft || createSaveDisabled) {
      return;
    }

    setAccounts((current) => [{ ...createAccountDraft, updatedAt: "Just now" }, ...current]);
    setCreateAccountDraft(null);
  };

  const handleApplyStandardChart = () => {
    if (!selectedStandardChartPreset) {
      return;
    }

    const nextPresetAccounts = selectedStandardChartPreset.accounts.map((account) => ({
      ...account,
      updatedAt: "Just now"
    }));

    let addedCount = 0;

    setAccounts((current) => {
      if (standardChartMode === "replace") {
        addedCount = nextPresetAccounts.length;
        return nextPresetAccounts;
      }

      const existingCodes = new Set(current.map((account) => account.code));
      const missingAccounts = nextPresetAccounts.filter((account) => !existingCodes.has(account.code));
      addedCount = missingAccounts.length;
      return [...current, ...missingAccounts];
    });

    setSelectedAccountIds([]);
    setEditingAccount(null);
    setCreateAccountDraft(null);
    setStandardChartDialogOpen(false);
    setChartNotice(
      standardChartMode === "replace"
        ? `${selectedStandardChartPreset.label} applied. ${addedCount} accounts are now loaded in the chart.`
        : addedCount > 0
          ? `${selectedStandardChartPreset.label} merged. ${addedCount} missing standard accounts were added.`
          : `${selectedStandardChartPreset.label} is already reflected in this chart.`
    );
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccountIds((current) => (current.includes(accountId) ? current.filter((id) => id !== accountId) : [...current, accountId]));
  };

  const toggleAllVisible = () => {
    setSelectedAccountIds((current) => (allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...current, ...visibleIds]))));
  };

  const applyBulkStatus = (nextStatus: Extract<ChartAccountStatus, "Active" | "Inactive">) => {
    setAccounts((current) =>
      current.map((account) =>
        selectedAccountIds.includes(account.id) && account.status !== "Locked"
          ? { ...account, status: nextStatus, updatedAt: "Just now" }
          : account
      )
    );
  };

  return (
    <div className={`dashboard-content chart-accounts-view ${createAccountDraft || standardChartDialogOpen ? "chart-accounts-view-sheet-open" : ""}`}>
      <header className="chart-accounts-header">
        <div className="chart-accounts-heading">
          <h1>Chart of Accounts</h1>
          <p>Manage the account structure, defaults, and posting readiness for {companyName}.</p>
        </div>

        <div className="chart-accounts-header-actions">
          <button type="button" className="chart-page-button chart-page-button-ghost">
            Import CSV
          </button>
          <button type="button" className="chart-page-button chart-page-button-secondary" onClick={handleOpenStandardChart}>
            Use standard chart
          </button>
          <button type="button" className="chart-page-button chart-page-button-primary" onClick={handleAddAccount}>
            Add account
          </button>
        </div>
      </header>

      {chartNotice ? <div className="chart-accounts-notice">{chartNotice}</div> : null}

      <section className="chart-accounts-summary" aria-label="Chart summary">
        {summaryItems.map((item) => (
          <div key={item.label} className="chart-summary-item">
            <span>{item.label}</span>
            <strong>{item.count}</strong>
            <small>{item.count === 1 ? "account" : "accounts"}</small>
          </div>
        ))}
      </section>

      <section className="chart-accounts-shell">
        <div className="chart-accounts-main">
          <div className="chart-accounts-toolbar">
            <label className="chart-accounts-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search code, name, or parent account"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="chart-accounts-filters">
              <CustomSelect ariaLabel="Account type filter" value={typeFilter} options={chartAccountTypeOptions} onChange={setTypeFilter} />
              <CustomSelect ariaLabel="Account category filter" value={categoryFilter} options={chartAccountCategoryOptions} onChange={setCategoryFilter} />
              <CustomSelect ariaLabel="Account status filter" value={statusFilter} options={chartAccountStatusOptions} onChange={setStatusFilter} />
              <CustomSelect ariaLabel="Account source filter" value={sourceFilter} options={chartAccountSourceOptions} onChange={setSourceFilter} />
              <CustomSelect ariaLabel="Sort accounts" value={sortBy} options={chartAccountSortOptions} onChange={setSortBy} />
            </div>
          </div>

          {selectedCount > 0 ? (
            <div className="chart-bulkbar">
              <span>{selectedCount} selected</span>
              <div className="chart-bulkbar-actions">
                <button type="button" className="chart-inline-button" onClick={() => applyBulkStatus("Active")}>
                  Mark active
                </button>
                <button type="button" className="chart-inline-button" onClick={() => applyBulkStatus("Inactive")}>
                  Mark inactive
                </button>
                <button type="button" className="chart-inline-button" onClick={() => setSelectedAccountIds([])}>
                  Clear selection
                </button>
              </div>
            </div>
          ) : null}

          <div className="chart-table-panel">
            <table className="chart-table">
              <thead>
                <tr>
                  <th className="chart-table-checkbox">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Select all visible accounts" />
                  </th>
                  <th>Code</th>
                  <th>Account name</th>
                  <th>Type</th>
                  <th>Parent account</th>
                  <th>Normal balance</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th className="chart-table-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedAccounts.length > 0 ? (
                  groupedAccounts.flatMap((group) => [
                    <tr key={`group-${group.type}`} className="chart-group-row">
                      <td colSpan={9}>
                        <div className="chart-group-heading">
                          <strong>{group.label}</strong>
                          <span>{group.count} accounts</span>
                        </div>
                      </td>
                    </tr>,
                    ...group.rows.map(({ account, depth }) => {
                      const rowSelected = selectedAccountIds.includes(account.id);
                      const rowOpen = editingAccount?.id === account.id;
                      const hasChildren = accounts.some((candidate) => candidate.parentId === account.id);

                      return (
                        <tr
                          key={account.id}
                          className={`${rowSelected ? "chart-table-row-selected" : ""} ${rowOpen ? "chart-table-row-open" : ""}`}
                          onClick={() => openAccountDrawer(account)}
                        >
                          <td className="chart-table-checkbox" onClick={(event) => event.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={rowSelected}
                              onChange={() => toggleAccountSelection(account.id)}
                              aria-label={`Select ${account.name}`}
                            />
                          </td>
                          <td className="chart-table-code">{account.code}</td>
                          <td>
                            <div className={`chart-table-name ${depth > 0 ? "chart-table-name-nested" : ""}`} style={{ "--chart-depth": `${depth}` } as CSSProperties}>
                              <strong>{account.name}</strong>
                              <span>{hasChildren ? "Parent account" : depth > 0 ? "Sub-account" : account.category}</span>
                            </div>
                          </td>
                          <td>{account.type}</td>
                          <td>{account.parent || "-"}</td>
                          <td>{account.normalBalance}</td>
                          <td>
                            <span className={`chart-pill chart-pill-status chart-pill-status-${account.status.toLowerCase()}`}>{account.status}</span>
                          </td>
                          <td>
                            <span className={`chart-pill chart-pill-source chart-pill-source-${account.source.toLowerCase()}`}>{account.source}</span>
                          </td>
                          <td className="chart-table-actions-col">
                            <button
                              type="button"
                              className="chart-row-action"
                              aria-label={`Open ${account.name}`}
                              title="Open account"
                              onClick={(event) => {
                                event.stopPropagation();
                                openAccountDrawer(account);
                              }}
                            >
                              <RowOpenIcon />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ])
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="chart-empty-state">
                        <strong>No accounts match this filter set</strong>
                        <p>Clear some filters or add a new account to expand the chart structure.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {editingAccount ? (
        <div className="chart-drawer-layer" role="dialog" aria-modal="true" aria-label="Account details">
          <button
            type="button"
            className="chart-drawer-backdrop"
            aria-label="Close account details"
            onClick={() => setEditingAccount(null)}
          />

          <aside className="chart-inspector chart-inspector-drawer">
            <div className="chart-inspector-head">
              <div className="chart-inspector-head-main">
                <div className="chart-inspector-head-top">
                  <div className="chart-inspector-head-copy">
                    <span className="chart-inspector-kicker">Account details</span>
                    <div className="chart-inspector-title-row">
                      <span className="chart-inspector-code">{editingAccount.code}</span>
                      <h3>{editingAccount.name}</h3>
                    </div>
                    <p>Review core posting behavior and keep protected system accounts aligned.</p>
                  </div>

                  <button
                    type="button"
                    className="chart-inspector-close"
                    onClick={() => setEditingAccount(null)}
                    aria-label="Close account details"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="chart-inspector-head-meta">
                  <span className={`chart-pill chart-pill-status chart-pill-status-${editingAccount.status.toLowerCase()}`}>{editingAccount.status}</span>
                  <span className={`chart-pill chart-pill-source chart-pill-source-${editingAccount.source.toLowerCase()}`}>{editingAccount.source}</span>
                </div>

                <div className="chart-inspector-summary-grid">
                  <div className="chart-inspector-summary-item">
                    <span>Type</span>
                    <strong>{editingAccount.type}</strong>
                  </div>
                  <div className="chart-inspector-summary-item">
                    <span>Category</span>
                    <strong>{editingAccount.category}</strong>
                  </div>
                  <div className="chart-inspector-summary-item">
                    <span>Parent</span>
                    <strong>{editingAccount.parent || "Top level"}</strong>
                  </div>
                  <div className="chart-inspector-summary-item">
                    <span>Updated</span>
                    <strong>{editingAccount.updatedAt}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-inspector-body">
              <section className="chart-inspector-section">
                <div className="chart-inspector-section-head">
                  <strong>Structure</strong>
                  <span>Place this account in the chart and keep hierarchy behavior clear for everyone posting to it.</span>
                </div>

                <div className="chart-inspector-grid">
                  <SetupField label="Account structure">
                    <CustomSelect
                      ariaLabel="Account structure"
                      value={isEditingSubAccount ? "sub-account" : "top-level"}
                      options={chartAccountStructureOptions}
                      onChange={(nextValue) => {
                        if (nextValue === "top-level") {
                          updateEditingParentAccount("none");
                          return;
                        }

                        const firstParent = editParentAccountOptions[0]?.value;

                        if (firstParent) {
                          updateEditingParentAccount(firstParent);
                        }
                      }}
                    />
                  </SetupField>

                  {isEditingSubAccount ? (
                    <SetupField label="Parent account" helper="Type, category, and normal balance follow the selected parent.">
                      <CustomSelect
                        ariaLabel="Parent account"
                        value={editingAccount.parentId ?? "none"}
                        options={[...editParentAccountOptions, { value: "none", label: "Remove parent account" }]}
                        onChange={updateEditingParentAccount}
                      />
                    </SetupField>
                  ) : (
                    <div className="chart-inspector-note">
                      <span className="chart-inspector-note-kicker">Hierarchy guidance</span>
                      <strong>Top-level account</strong>
                      <span>This account appears as a root row and can hold sub-accounts later without changing its reporting role.</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="chart-inspector-section">
                <div className="chart-inspector-section-head">
                  <strong>Classification</strong>
                  <span>Keep naming and reporting labels precise so teams can scan this account quickly across the workspace.</span>
                </div>

                <div className="chart-inspector-grid">
                  <SetupField label="Account code" required>
                    <input
                      type="text"
                      value={editingAccount.code}
                      onChange={(event) => updateEditingField("code", event.target.value)}
                      placeholder="e.g. 1010"
                    />
                  </SetupField>

                  <SetupField label="Account name" required>
                    <input
                      type="text"
                      value={editingAccount.name}
                      onChange={(event) => updateEditingField("name", event.target.value)}
                      placeholder="Enter account name"
                    />
                  </SetupField>

                  <SetupField label="Type">
                    <CustomSelect
                      ariaLabel="Account type"
                      value={editingAccount.type}
                      options={chartAccountTypeOptions.filter((option) => option.value !== "all")}
                      onChange={(nextValue) => updateEditingField("type", nextValue as ChartAccountType)}
                      disabled={isEditingSubAccount}
                    />
                  </SetupField>

                  <SetupField label="Category">
                    <CustomSelect
                      ariaLabel="Account category"
                      value={editingAccount.category}
                      options={chartAccountCategoryOptions.filter((option) => option.value !== "all")}
                      onChange={(nextValue) => updateEditingField("category", nextValue)}
                      disabled={isEditingSubAccount}
                    />
                  </SetupField>
                </div>
              </section>

              <section className="chart-inspector-section">
                <div className="chart-inspector-section-head">
                  <strong>Posting behavior</strong>
                  <span>Control how this account behaves operationally and whether it remains available across posting surfaces.</span>
                </div>

                <div className="chart-inspector-grid">
                  <SetupField label="Normal balance">
                    <CustomSelect
                      ariaLabel="Normal balance"
                      value={editingAccount.normalBalance}
                      options={chartAccountBalanceOptions}
                      onChange={(nextValue) => updateEditingField("normalBalance", nextValue as ChartAccountBalance)}
                      disabled={isEditingSubAccount}
                    />
                  </SetupField>

                  <SetupField label="Status">
                    <CustomSelect
                      ariaLabel="Account status"
                      value={editingAccount.status}
                      options={chartAccountStatusOptions.filter((option) => option.value !== "all")}
                      onChange={(nextValue) => updateEditingField("status", nextValue as ChartAccountStatus)}
                    />
                  </SetupField>

                  <div className="setup-grid-full">
                    <div className="chart-inspector-state-card">
                      <span className="chart-inspector-note-kicker">Posting visibility</span>
                      <strong>
                        {isEditingSubAccount
                          ? `Sub-account under ${editingAccount.parent || "selected parent"}`
                          : `Top-level ${editingAccount.type.toLowerCase()} account`}
                      </strong>
                      <p>
                        {editingAccount.source === "System"
                          ? "System-owned accounts remain protected while staying available across journals, posting flows, and reports."
                          : "Manual accounts stay available across journals, posting selections, and chart maintenance views once saved."}
                      </p>
                      <div className="chart-inspector-state-meta">
                        <span>Source: {editingAccount.source}</span>
                        <span>Balance: {editingAccount.normalBalance}</span>
                        <span>Status: {editingAccount.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="chart-inspector-section">
                <div className="chart-inspector-section-head">
                  <strong>Description</strong>
                  <span>Capture the posting or review context other teammates should understand before they use this account.</span>
                </div>

                <div className="chart-inspector-grid">
                  <div className="setup-grid-full">
                    <SetupField label="Description">
                      <textarea
                        className="chart-inspector-textarea"
                        value={editingAccount.description}
                        onChange={(event) => updateEditingField("description", event.target.value)}
                        placeholder="Add a short description for posting or review context"
                      />
                    </SetupField>
                  </div>
                </div>
              </section>
            </div>

            <footer className="chart-inspector-footer">
              <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setEditingAccount(null)}>
                Cancel
              </button>
              <button type="button" className="chart-page-button chart-page-button-primary" onClick={handleSaveEditedAccount} disabled={editSaveDisabled}>
                Save changes
              </button>
            </footer>
          </aside>
        </div>
      ) : null}

      {createAccountDraft ? (
        <div className="chart-sheet-layer" role="dialog" aria-modal="true" aria-label="Add account">
          <button type="button" className="chart-sheet-backdrop" aria-label="Close add account" onClick={() => setCreateAccountDraft(null)} />

          <div className="chart-sheet-frame">
            <button
              type="button"
              className="chart-sheet-close chart-sheet-close-floating"
              onClick={() => setCreateAccountDraft(null)}
              aria-label="Close add account"
            >
              <CloseIcon />
            </button>

            <section className="chart-sheet">
              <div className="chart-sheet-body">
                <div className="chart-sheet-main">
                  <section className="chart-sheet-section">
                    <div className="chart-sheet-section-head">
                      <strong>Account identity</strong>
                      <span>Define where this account lives in the chart and how your team will find it.</span>
                    </div>

                    <div className="setup-grid">
                      <SetupField label="Account structure">
                        <CustomSelect
                          ariaLabel="New account structure"
                          value={isCreatingSubAccount ? "sub-account" : "top-level"}
                          options={chartAccountStructureOptions}
                          onChange={(nextValue) => {
                            if (nextValue === "top-level") {
                              updateCreateParentAccount("none");
                              return;
                            }

                            const firstParent = createParentAccountOptions[0]?.value;

                            if (firstParent) {
                              updateCreateParentAccount(firstParent);
                            }
                          }}
                        />
                      </SetupField>

                      {isCreatingSubAccount ? (
                        <SetupField label="Parent account" helper="Sub-accounts inherit type, category, and normal balance from the parent.">
                          <CustomSelect
                            ariaLabel="New account parent"
                            value={createAccountDraft.parentId ?? "none"}
                            options={createParentAccountOptions}
                            onChange={updateCreateParentAccount}
                          />
                        </SetupField>
                      ) : (
                        <div className="chart-inspector-note">
                          <strong>Top-level account</strong>
                          <span>This account will appear as a new root row in the selected account type section.</span>
                        </div>
                      )}

                      <SetupField label="Account code" required>
                        <input
                          type="text"
                          value={createAccountDraft.code}
                          onChange={(event) => updateCreateField("code", event.target.value)}
                          placeholder="e.g. 7010"
                        />
                      </SetupField>

                      <SetupField label="Account name" required>
                        <input
                          type="text"
                          value={createAccountDraft.name}
                          onChange={(event) => updateCreateField("name", event.target.value)}
                          placeholder="Enter account name"
                        />
                      </SetupField>

                      <SetupField label="Type">
                        <CustomSelect
                          ariaLabel="New account type"
                          value={createAccountDraft.type}
                          options={chartAccountTypeOptions.filter((option) => option.value !== "all")}
                          onChange={(nextValue) => updateCreateField("type", nextValue as ChartAccountType)}
                          disabled={isCreatingSubAccount}
                        />
                      </SetupField>

                      <SetupField label="Category">
                        <CustomSelect
                          ariaLabel="New account category"
                          value={createAccountDraft.category}
                          options={chartAccountCategoryOptions.filter((option) => option.value !== "all")}
                          onChange={(nextValue) => updateCreateField("category", nextValue)}
                          disabled={isCreatingSubAccount}
                        />
                      </SetupField>

                      <div className="setup-grid-full">
                        <SetupField label="Description">
                          <textarea
                            className="chart-inspector-textarea"
                            value={createAccountDraft.description}
                            onChange={(event) => updateCreateField("description", event.target.value)}
                            placeholder="Add a short note for posting or review context"
                          />
                        </SetupField>
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="chart-sheet-side">
                  <section className="chart-sheet-side-panel">
                    <div className="chart-sheet-section-head">
                      <strong>Posting settings</strong>
                      <span>Keep the operational behavior aligned before this account goes live.</span>
                    </div>

                    <div className="chart-sheet-side-grid">
                      <SetupField label="Normal balance">
                        <CustomSelect
                          ariaLabel="New account normal balance"
                          value={createAccountDraft.normalBalance}
                          options={chartAccountBalanceOptions}
                          onChange={(nextValue) => updateCreateField("normalBalance", nextValue as ChartAccountBalance)}
                          disabled={isCreatingSubAccount}
                        />
                      </SetupField>

                      <SetupField label="Status">
                        <CustomSelect
                          ariaLabel="New account status"
                          value={createAccountDraft.status}
                          options={chartAccountStatusOptions.filter((option) => option.value !== "all")}
                          onChange={(nextValue) => updateCreateField("status", nextValue as ChartAccountStatus)}
                        />
                      </SetupField>

                      <div className="chart-sheet-static-field">
                        <span>Source</span>
                        <strong>Manual account</strong>
                      </div>
                    </div>
                  </section>

                  <section className="chart-sheet-side-panel">
                    <div className="chart-sheet-section-head">
                      <strong>Account preview</strong>
                      <span>What your team will see once this account is added to the chart.</span>
                    </div>

                    <div className="chart-sheet-preview">
                      <span className="chart-sheet-preview-code">{createAccountDraft.code || "0000"}</span>
                      <strong>{createAccountDraft.name || "New account name"}</strong>
                      <p>
                        {createAccountDraft.parentId
                          ? `Sub-account under ${createAccountDraft.parent || "selected parent"}`
                          : `Top-level ${createAccountDraft.type.toLowerCase()} account`}
                      </p>
                      <div className="chart-sheet-preview-pills">
                        <span className={`chart-pill chart-pill-source chart-pill-source-${createAccountDraft.source.toLowerCase()}`}>
                          {createAccountDraft.source}
                        </span>
                        <span className={`chart-pill chart-pill-status chart-pill-status-${createAccountDraft.status.toLowerCase()}`}>
                          {createAccountDraft.status}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="chart-sheet-side-panel">
                    <div className="chart-sheet-section-head">
                      <strong>What this affects</strong>
                      <span>New accounts become available across operational posting surfaces right away.</span>
                    </div>

                    <div className="chart-sheet-list">
                      <div className="chart-sheet-list-item">
                        <span className="chart-sheet-list-dot" />
                        <p>The account appears in journal entry, posting selections, and chart maintenance views.</p>
                      </div>
                      <div className="chart-sheet-list-item">
                        <span className="chart-sheet-list-dot" />
                        <p>Sub-accounts stay grouped under their parent for clearer scanning and report structure.</p>
                      </div>
                      <div className="chart-sheet-list-item">
                        <span className="chart-sheet-list-dot" />
                        <p>Manual accounts remain editable later without affecting protected system accounts.</p>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>

              <footer className="chart-sheet-footer">
                <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setCreateAccountDraft(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="chart-page-button chart-page-button-primary"
                  onClick={handleCreateAccount}
                  disabled={createSaveDisabled}
                >
                  Save account
                </button>
              </footer>
            </section>
          </div>
        </div>
      ) : null}

      {standardChartDialogOpen ? (
        <div className="chart-standard-layer" role="dialog" aria-modal="true" aria-label="Use standard chart">
          <button
            type="button"
            className="chart-standard-backdrop"
            aria-label="Close standard chart flow"
            onClick={() => setStandardChartDialogOpen(false)}
          />

          <section className="chart-standard-dialog">
            <header className="chart-standard-dialog-head">
              <div>
                <strong>Use standard chart</strong>
                <p>Load a ready-made chart and keep working in the same management table.</p>
              </div>

              <button
                type="button"
                className="chart-standard-close"
                onClick={() => setStandardChartDialogOpen(false)}
                aria-label="Close standard chart flow"
              >
                <CloseIcon />
              </button>
            </header>

            <div className="chart-standard-dialog-body">
              <section className="chart-standard-panel">
                <div className="chart-standard-panel-head">
                  <strong>Choose a standard template</strong>
                  <span>Select the closest starting point for this company.</span>
                </div>

                <div className="chart-standard-preset-grid">
                  {chartStandardPresets.map((preset) => {
                    const active = preset.id === standardChartPresetId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`chart-standard-preset ${active ? "chart-standard-preset-active" : ""}`}
                        onClick={() => setStandardChartPresetId(preset.id)}
                      >
                        <strong>{preset.label}</strong>
                        <p>{preset.description}</p>
                        <span>{preset.accounts.length} accounts included</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="chart-standard-panel">
                <div className="chart-standard-panel-head">
                  <strong>Apply mode</strong>
                  <span>Decide how the preset should affect the current chart.</span>
                </div>

                <div className="chart-standard-mode-grid">
                  <button
                    type="button"
                    className={`chart-standard-mode ${standardChartMode === "merge" ? "chart-standard-mode-active" : ""}`}
                    onClick={() => setStandardChartMode("merge")}
                  >
                    <strong>Merge missing accounts</strong>
                    <p>Keep the current table and add only the standard codes that are missing.</p>
                  </button>
                  <button
                    type="button"
                    className={`chart-standard-mode ${standardChartMode === "replace" ? "chart-standard-mode-active" : ""}`}
                    onClick={() => setStandardChartMode("replace")}
                  >
                    <strong>Replace current chart</strong>
                    <p>Reset the table to this standard preset and remove accounts that are not part of it.</p>
                  </button>
                </div>
              </section>

              <section className="chart-standard-panel chart-standard-panel-summary">
                <div className="chart-standard-panel-head">
                  <strong>{selectedStandardChartPreset.label}</strong>
                  <span>{selectedStandardChartPreset.detail}</span>
                </div>

                <div className="chart-standard-summary">
                  {selectedPresetSummary.map((item) => (
                    <div key={item.label} className="chart-standard-summary-item">
                      <span>{item.label}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="chart-standard-dialog-footer">
              <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setStandardChartDialogOpen(false)}>
                Cancel
              </button>
              <button type="button" className="chart-page-button chart-page-button-primary" onClick={handleApplyStandardChart}>
                Apply standard chart
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
