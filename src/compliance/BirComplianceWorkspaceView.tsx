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

type SharedBirComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

export type BirComplianceWorkspaceView = "bir-reports" | "vat-compliance" | "withholding-taxes";

type BirComplianceWorkspaceProps = {
  companyName: string;
  components: SharedBirComponents;
  view: BirComplianceWorkspaceView;
};

type ComplianceStatus = "Ready" | "Review due" | "Draft" | "Filed";
type FilingFrequency = "Monthly" | "Quarterly" | "Annual";
type TaxLineStatus = "Computed" | "Override" | "Review";

type BirReportRecord = {
  dueDate: string;
  form: string;
  frequency: FilingFrequency;
  id: string;
  period: string;
  status: ComplianceStatus;
  taxDue: number;
};

type VatRecord = {
  id: string;
  label: string;
  netAmount: number;
  overrideAmount?: number;
  status: TaxLineStatus;
  vatAmount: number;
};

type WithholdingRecord = {
  baseAmount: number;
  id: string;
  payee: string;
  rate: string;
  taxAmount: number;
  taxType: "EWT" | "Compensation";
  status: TaxLineStatus;
};

const reportSeed: BirReportRecord[] = [
  {
    id: "bir-2550m-apr",
    form: "BIR Form 2550M",
    period: "April 2026",
    frequency: "Monthly",
    dueDate: "May 20, 2026",
    taxDue: 7560,
    status: "Ready"
  },
  {
    id: "bir-1601eq-q2",
    form: "BIR Form 1601-EQ",
    period: "Q2 2026",
    frequency: "Quarterly",
    dueDate: "July 31, 2026",
    taxDue: 4210,
    status: "Draft"
  },
  {
    id: "bir-1702-annual",
    form: "BIR Form 1702",
    period: "Year 2026",
    frequency: "Annual",
    dueDate: "April 15, 2027",
    taxDue: 0,
    status: "Review due"
  }
];

const vatSeed: VatRecord[] = [
  { id: "vat-output-service", label: "Output VAT - service invoices", netAmount: 63000, vatAmount: 7560, status: "Computed" },
  { id: "vat-input-suppliers", label: "Input VAT - supplier purchases", netAmount: 34800, vatAmount: 4176, status: "Computed" },
  { id: "vat-adjustment", label: "Manual VAT adjustment", netAmount: 0, vatAmount: 0, overrideAmount: 0, status: "Review" }
];

const withholdingSeed: WithholdingRecord[] = [
  { id: "wht-audit", payee: "Santos Audit Support", taxType: "EWT", rate: "10%", baseAmount: 14500, taxAmount: 1450, status: "Computed" },
  { id: "wht-rent", payee: "Makati Tower Leasing Corp.", taxType: "EWT", rate: "5%", baseAmount: 58000, taxAmount: 2900, status: "Computed" },
  { id: "wht-payroll", payee: "Payroll employees", taxType: "Compensation", rate: "Bracket", baseAmount: 122000, taxAmount: 18600, status: "Review" }
];

const frequencyOptions: SelectOption[] = [
  { value: "all", label: "All frequencies" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Annual", label: "Annual" }
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency"
  }).format(value);

const toStatusClass = (status: string) => status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function BirDialog({
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
      <section className="admin-audit-dialog bir-action-dialog">
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
        <div className="chart-standard-dialog-footer bir-dialog-footer">
          {footerCopy ? <span>{footerCopy}</span> : null}
          <div className="bir-dialog-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost" onClick={onClose}>Cancel</button>
            {onSubmit && submitLabel ? <button type="button" className="chart-page-button chart-page-button-primary" onClick={onSubmit}>{submitLabel}</button> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function BirReportsView({ companyName, components }: { companyName: string; components: SharedBirComponents }) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon } = components;
  const [reports, setReports] = useState(reportSeed);
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<BirReportRecord | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesFrequency = frequencyFilter === "all" || report.frequency === frequencyFilter;
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${report.form} ${report.period} ${report.status}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesFrequency && matchesSearch;
  });

  const markFiled = () => {
    if (!selectedReport) {
      return;
    }

    setReports((current) =>
      current.map((report) => (report.id === selectedReport.id ? { ...report, status: "Filed" } : report))
    );
    setSelectedReport(null);
  };

  return (
    <div className="dashboard-content bir-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>BIR Reports</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter BIR report frequency" value={frequencyFilter} options={frequencyOptions} onChange={setFrequencyFilter} />
            </div>
          </div>
        </div>

        <div className="bir-summary-row">
          <div><span>Ready filings</span><strong>{reports.filter((report) => report.status === "Ready").length}</strong></div>
          <div><span>Total tax due</span><strong>{formatMoney(reports.reduce((total, report) => total + report.taxDue, 0))}</strong></div>
          <div><span>Review items</span><strong>{reports.filter((report) => report.status === "Review due").length}</strong></div>
        </div>

        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search form, period, or status" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr><th>Form</th><th>Period</th><th>Frequency</th><th>Due date</th><th>Tax due</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} onClick={() => setSelectedReport(report)}>
                  <td><strong>{report.form}</strong></td>
                  <td>{report.period}</td>
                  <td>{report.frequency}</td>
                  <td>{report.dueDate}</td>
                  <td>{formatMoney(report.taxDue)}</td>
                  <td><span className={`admin-pill bir-status-${toStatusClass(report.status)}`}>{report.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className="chart-row-action"
                      aria-label={`Open ${report.form}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedReport(report);
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

      {selectedReport ? (
        <BirDialog
          CloseIcon={CloseIcon}
          closeLabel="Close BIR report"
          description="Review the frontend-only filing package before eBIRForms export is connected."
          footerCopy={companyName}
          onClose={() => setSelectedReport(null)}
          onSubmit={selectedReport.status === "Filed" ? undefined : markFiled}
          submitLabel={selectedReport.status === "Filed" ? undefined : "Mark filed"}
          title={selectedReport.form}
        >
          <div className="bir-dialog-grid">
            <div className="bir-dialog-card"><span>Period</span><strong>{selectedReport.period}</strong><p>Filing frequency: {selectedReport.frequency}</p></div>
            <div className="bir-dialog-card"><span>Tax due</span><strong>{formatMoney(selectedReport.taxDue)}</strong><p>Due date: {selectedReport.dueDate}</p></div>
          </div>
        </BirDialog>
      ) : null}
    </div>
  );
}

function VatComplianceView({ components }: { components: SharedBirComponents }) {
  const { CloseIcon, RowOpenIcon, SetupField } = components;
  const [rows, setRows] = useState(vatSeed);
  const [selectedRow, setSelectedRow] = useState<VatRecord | null>(null);
  const [overrideAmount, setOverrideAmount] = useState("0");
  const outputVat = rows.filter((row) => row.vatAmount > 0).reduce((total, row) => total + (row.overrideAmount ?? row.vatAmount), 0);
  const inputVat = 4176;
  const netVatDue = Math.max(outputVat - inputVat, 0);

  const openOverride = (row: VatRecord) => {
    setSelectedRow(row);
    setOverrideAmount(String(row.overrideAmount ?? row.vatAmount));
  };

  const applyOverride = () => {
    if (!selectedRow) {
      return;
    }

    const nextAmount = Math.max(Number(overrideAmount) || 0, 0);
    setRows((current) =>
      current.map((row) => (row.id === selectedRow.id ? { ...row, overrideAmount: nextAmount, status: "Override" } : row))
    );
    setSelectedRow(null);
  };

  return (
    <div className="dashboard-content bir-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header"><h1>VAT</h1></div>
        <div className="bir-summary-row">
          <div><span>Output VAT</span><strong>{formatMoney(outputVat)}</strong></div>
          <div><span>Input VAT</span><strong>{formatMoney(inputVat)}</strong></div>
          <div><span>Net VAT due</span><strong>{formatMoney(netVatDue)}</strong></div>
        </div>
        <div className="chart-table-panel">
          <table className="chart-table">
            <thead><tr><th>Line</th><th>Net amount</th><th>VAT 12%</th><th>Override</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.label}</strong></td>
                  <td>{formatMoney(row.netAmount)}</td>
                  <td>{formatMoney(row.vatAmount)}</td>
                  <td>{row.overrideAmount !== undefined ? formatMoney(row.overrideAmount) : "-"}</td>
                  <td><span className={`admin-pill bir-status-${toStatusClass(row.status)}`}>{row.status}</span></td>
                  <td><button type="button" className="chart-row-action" aria-label={`Override ${row.label}`} onClick={() => openOverride(row)}><RowOpenIcon /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {selectedRow ? (
        <BirDialog CloseIcon={CloseIcon} closeLabel="Close VAT override" description="Apply a frontend-only manual override for VAT review." footerCopy={selectedRow.label} onClose={() => setSelectedRow(null)} onSubmit={applyOverride} submitLabel="Apply override" title="VAT override">
          <div className="bir-form-grid">
            <SetupField label="Override VAT amount" helper="Manual overrides should later write to the audit trail.">
              <input type="number" value={overrideAmount} onChange={(event) => setOverrideAmount(event.target.value)} />
            </SetupField>
          </div>
        </BirDialog>
      ) : null}
    </div>
  );
}

function WithholdingTaxesView({ components }: { components: SharedBirComponents }) {
  const { CloseIcon, RowOpenIcon, SearchIcon, SetupField } = components;
  const [rows, setRows] = useState(withholdingSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<WithholdingRecord | null>(null);
  const [overrideAmount, setOverrideAmount] = useState("0");
  const filteredRows = rows.filter((row) =>
    `${row.payee} ${row.taxType} ${row.rate}`.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const openOverride = (row: WithholdingRecord) => {
    setSelectedRow(row);
    setOverrideAmount(String(row.taxAmount));
  };

  const applyOverride = () => {
    if (!selectedRow) {
      return;
    }

    const nextAmount = Math.max(Number(overrideAmount) || 0, 0);
    setRows((current) =>
      current.map((row) => (row.id === selectedRow.id ? { ...row, taxAmount: nextAmount, status: "Override" } : row))
    );
    setSelectedRow(null);
  };

  return (
    <div className="dashboard-content bir-workspace-view">
      <section className="admin-workspace-main">
        <div className="admin-table-header"><h1>Withholding Taxes</h1></div>
        <div className="bir-summary-row">
          <div><span>EWT due</span><strong>{formatMoney(rows.filter((row) => row.taxType === "EWT").reduce((total, row) => total + row.taxAmount, 0))}</strong></div>
          <div><span>Compensation WHT</span><strong>{formatMoney(rows.filter((row) => row.taxType === "Compensation").reduce((total, row) => total + row.taxAmount, 0))}</strong></div>
          <div><span>Review lines</span><strong>{rows.filter((row) => row.status === "Review").length}</strong></div>
        </div>
        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input type="text" placeholder="Search payee, tax type, or rate" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
        </div>
        <div className="chart-table-panel">
          <table className="chart-table">
            <thead><tr><th>Payee</th><th>Type</th><th>Rate</th><th>Base amount</th><th>Tax amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.payee}</strong></td>
                  <td>{row.taxType}</td>
                  <td>{row.rate}</td>
                  <td>{formatMoney(row.baseAmount)}</td>
                  <td>{formatMoney(row.taxAmount)}</td>
                  <td><span className={`admin-pill bir-status-${toStatusClass(row.status)}`}>{row.status}</span></td>
                  <td><button type="button" className="chart-row-action" aria-label={`Override ${row.payee}`} onClick={() => openOverride(row)}><RowOpenIcon /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {selectedRow ? (
        <BirDialog CloseIcon={CloseIcon} closeLabel="Close withholding override" description="Apply a frontend-only withholding tax override for review." footerCopy={selectedRow.payee} onClose={() => setSelectedRow(null)} onSubmit={applyOverride} submitLabel="Apply override" title="Withholding override">
          <div className="bir-form-grid">
            <SetupField label="Override tax amount" helper="Use only for adjustments that need later audit trail support.">
              <input type="number" value={overrideAmount} onChange={(event) => setOverrideAmount(event.target.value)} />
            </SetupField>
          </div>
        </BirDialog>
      ) : null}
    </div>
  );
}

export function BirComplianceWorkspace({ companyName, components, view }: BirComplianceWorkspaceProps) {
  if (view === "vat-compliance") {
    return <VatComplianceView components={components} />;
  }

  if (view === "withholding-taxes") {
    return <WithholdingTaxesView components={components} />;
  }

  return <BirReportsView companyName={companyName} components={components} />;
}
