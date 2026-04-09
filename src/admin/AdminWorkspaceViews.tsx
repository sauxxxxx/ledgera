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

type SharedAdminComponents = {
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

type AdminWorkspaceView =
  | "users-roles"
  | "system-settings"
  | "audit-trail"
  | "customization"
  | "contribution-tables";

type AdminWorkspaceRouterProps = {
  companyName: string;
  components: SharedAdminComponents;
  view: AdminWorkspaceView;
};

type AdminUserStatus = "Active" | "Invited" | "Suspended";
type AdminUserRoleTone = "admin" | "finance" | "operations" | "readonly";

type AdminUserRecord = {
  department: string;
  email: string;
  id: string;
  lastActive: string;
  name: string;
  role: string;
  roleTone: AdminUserRoleTone;
  status: AdminUserStatus;
};

type AdminRoleRecord = {
  description: string;
  id: string;
  memberCount: number;
  name: string;
  permissions: string[];
};

type AuditEventRecord = {
  action: string;
  actor: string;
  id: string;
  ipAddress: string;
  module: string;
  target: string;
  time: string;
};

type ContributionTableStatus = "Current" | "Review due" | "Planned";

type ContributionTableRecord = {
  coverage: string;
  effectiveDate: string;
  id: string;
  label: string;
  note: string;
  status: ContributionTableStatus;
  updateWindow: string;
};

type WorkspaceToggleSetting = {
  description: string;
  enabled: boolean;
  id: string;
  label: string;
};

type CustomModuleRecord = {
  description: string;
  id: string;
  stage: "Live" | "Planned";
  title: string;
};

const adminUserStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Invited", label: "Invited" },
  { value: "Suspended", label: "Suspended" }
];

const adminUserDepartmentOptions: SelectOption[] = [
  { value: "all", label: "All departments" },
  { value: "Accounting", label: "Accounting" },
  { value: "Operations", label: "Operations" },
  { value: "Leadership", label: "Leadership" }
];

const auditModuleOptions: SelectOption[] = [
  { value: "all", label: "All modules" },
  { value: "Admin", label: "Admin" },
  { value: "Accounting", label: "Accounting" },
  { value: "Payroll", label: "Payroll" },
  { value: "Compliance", label: "Compliance" }
];

const contributionStatusOptions: SelectOption[] = [
  { value: "all", label: "All statuses" },
  { value: "Current", label: "Current" },
  { value: "Review due", label: "Review due" },
  { value: "Planned", label: "Planned" }
];

const adminUsersSeed: AdminUserRecord[] = [
  {
    id: "user-1",
    name: "Andrea Ramos",
    email: "andrea@ledgera.dev",
    role: "Administrator",
    roleTone: "admin",
    department: "Leadership",
    status: "Active",
    lastActive: "2 minutes ago"
  },
  {
    id: "user-2",
    name: "Miguel Santos",
    email: "miguel@ledgera.dev",
    role: "Finance Manager",
    roleTone: "finance",
    department: "Accounting",
    status: "Active",
    lastActive: "14 minutes ago"
  },
  {
    id: "user-3",
    name: "Patricia Dela Cruz",
    email: "patricia@ledgera.dev",
    role: "Payroll Officer",
    roleTone: "operations",
    department: "Operations",
    status: "Invited",
    lastActive: "Invitation sent today"
  },
  {
    id: "user-4",
    name: "Leo Garcia",
    email: "leo@ledgera.dev",
    role: "External Auditor",
    roleTone: "readonly",
    department: "Accounting",
    status: "Suspended",
    lastActive: "5 days ago"
  }
];

const adminRolesSeed: AdminRoleRecord[] = [
  {
    id: "role-admin",
    name: "Administrator",
    memberCount: 1,
    description: "Full access across accounting, payroll, compliance, and configuration.",
    permissions: ["Manage users and roles", "Update tax and posting defaults", "Approve workspace-wide changes"]
  },
  {
    id: "role-finance",
    name: "Finance Manager",
    memberCount: 1,
    description: "Owns chart maintenance, journals, reports, and month-end review.",
    permissions: ["Maintain chart of accounts", "Review journal and report outputs", "Lock reporting periods"]
  },
  {
    id: "role-payroll",
    name: "Payroll Officer",
    memberCount: 1,
    description: "Handles payroll schedules, contribution tables, and payslip preparation.",
    permissions: ["Update contribution tables", "Run payroll cycles", "Prepare government remittance exports"]
  }
];

const auditEventSeed: AuditEventRecord[] = [
  {
    id: "audit-1",
    actor: "Andrea Ramos",
    action: "Updated company VAT status",
    target: "Company Profile / Tax & Compliance",
    module: "Admin",
    time: "Today, 9:18 AM",
    ipAddress: "203.177.71.24"
  },
  {
    id: "audit-2",
    actor: "Miguel Santos",
    action: "Imported standard chart template",
    target: "Chart of Accounts",
    module: "Accounting",
    time: "Today, 8:42 AM",
    ipAddress: "203.177.71.31"
  },
  {
    id: "audit-3",
    actor: "System",
    action: "Generated contribution reminder",
    target: "Contribution Tables / SSS",
    module: "Payroll",
    time: "Yesterday, 4:15 PM",
    ipAddress: "Automated job"
  },
  {
    id: "audit-4",
    actor: "Leo Garcia",
    action: "Viewed quarter-end compliance package",
    target: "BIR Compliance / Q1 reports",
    module: "Compliance",
    time: "Yesterday, 1:02 PM",
    ipAddress: "136.158.12.90"
  }
];

const contributionTablesSeed: ContributionTableRecord[] = [
  {
    id: "sss",
    label: "SSS contribution table",
    coverage: "Monthly salary credits and employer/employee shares",
    effectiveDate: "January 1, 2026",
    updateWindow: "Review before next payroll run",
    status: "Current",
    note: "Rates are active and used in automated payroll computation."
  },
  {
    id: "philhealth",
    label: "PhilHealth premium table",
    coverage: "Premium floor, ceiling, and split contribution values",
    effectiveDate: "January 1, 2026",
    updateWindow: "Monitor for circular updates",
    status: "Review due",
    note: "Awaiting confirmation for latest published employer share guidance."
  },
  {
    id: "pagibig",
    label: "Pag-IBIG contribution rules",
    coverage: "Employee and employer share with cap handling",
    effectiveDate: "January 1, 2026",
    updateWindow: "No changes expected this quarter",
    status: "Current",
    note: "Current settings follow the latest active contribution cap."
  },
  {
    id: "withholding-tax",
    label: "Withholding tax brackets",
    coverage: "Compensation tax tables and threshold references",
    effectiveDate: "July 1, 2026",
    updateWindow: "Prepare preview before effectivity",
    status: "Planned",
    note: "Draft tables are staged for the next payroll tax update cycle."
  }
];

const customizationModulesSeed: CustomModuleRecord[] = [
  {
    id: "client-billing",
    title: "Client billing profiles",
    description: "Adds package, billing cadence, and one-time fee metadata to each client card.",
    stage: "Live"
  },
  {
    id: "invoice-control",
    title: "Invoice numbering controls",
    description: "Keeps official invoice prefixes, next sequence, and approval thresholds configurable.",
    stage: "Live"
  },
  {
    id: "custom-fields",
    title: "Custom profile fields",
    description: "Reserve extra metadata slots for industry-specific details without changing the base schema.",
    stage: "Planned"
  }
];

function SummaryCards({
  items,
  label
}: {
  items: Array<{ label: string; note: string; value: number | string }>;
  label: string;
}) {
  return (
    <section className="chart-accounts-summary" aria-label={label}>
      {items.map((item) => (
        <div key={item.label} className="chart-summary-item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.note}</small>
        </div>
      ))}
    </section>
  );
}

function AdminPageHero({
  badge,
  title,
  description,
  tone,
  children
}: {
  badge: string;
  children?: ReactNode;
  description?: string;
  title: string;
  tone: "users" | "settings" | "audit" | "customization" | "contributions";
}) {
  return (
    <section className={`admin-page-hero admin-page-hero-${tone}`}>
      <div className="admin-page-hero-copy">
        <span className="admin-page-hero-badge">{badge}</span>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children ? <div className="admin-page-hero-side">{children}</div> : null}
    </section>
  );
}

function AdminUsersRolesView({ companyName, components }: { companyName: string; components: SharedAdminComponents }) {
  const { CustomSelect, RowOpenIcon, SearchIcon } = components;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredUsers = adminUsersSeed.filter((user) => {
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const summaryItems = [
    { label: "Workspace users", value: adminUsersSeed.length, note: "Seats configured across admin and finance" },
    { label: "Active users", value: adminUsersSeed.filter((user) => user.status === "Active").length, note: "Can work in the live workspace right now" },
    { label: "Pending invites", value: adminUsersSeed.filter((user) => user.status === "Invited").length, note: "Awaiting first sign-in and profile setup" },
    { label: "Role templates", value: adminRolesSeed.length, note: "Reusable access bundles for accounting operations" }
  ];

  return (
    <div className="dashboard-content admin-workspace-view admin-view-users">
      <AdminPageHero
        badge="Access control"
        title="Users & Roles"
        description={`Control who can work inside ${companyName} and what each role can approve, edit, or review.`}
        tone="users"
      >
        <div className="admin-hero-presence">
          <div className="admin-hero-presence-stack">
            {adminUsersSeed.slice(0, 3).map((user) => (
              <span key={user.id} className={`admin-user-orb admin-user-orb-${user.roleTone}`}>
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            ))}
          </div>
          <div className="admin-hero-presence-copy">
            <strong>{adminUsersSeed.filter((user) => user.status === "Active").length} active operators</strong>
            <span>Leadership, accounting, and payroll seats mapped to distinct approval roles.</span>
          </div>
        </div>
      </AdminPageHero>

      <div className="chart-accounts-header-actions admin-page-actions">
        <button type="button" className="chart-page-button chart-page-button-ghost">
          Export access list
        </button>
        <button type="button" className="chart-page-button chart-page-button-primary">
          Invite user
        </button>
      </div>

      <SummaryCards items={summaryItems} label="User and role summary" />

      <section className="admin-workspace-shell">
        <div className="admin-workspace-main">
          <div className="chart-accounts-toolbar">
            <label className="chart-accounts-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search user, email, or role"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="admin-filter-grid admin-filter-grid-two">
              <CustomSelect ariaLabel="Filter user status" value={statusFilter} options={adminUserStatusOptions} onChange={setStatusFilter} />
              <CustomSelect
                ariaLabel="Filter user department"
                value={departmentFilter}
                options={adminUserDepartmentOptions}
                onChange={setDepartmentFilter}
              />
            </div>
          </div>

          <div className="chart-table-panel">
            <table className="chart-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last active</th>
                  <th className="chart-table-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-primary-cell">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-pill admin-pill-role-${user.roleTone}`}>{user.role}</span>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`admin-pill admin-pill-status-${user.status.toLowerCase().replace(/\s+/g, "-")}`}>{user.status}</span>
                      </td>
                      <td>{user.lastActive}</td>
                      <td className="chart-table-actions-col">
                        <button type="button" className="chart-row-action" aria-label={`Open ${user.name}`}>
                          <RowOpenIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="chart-empty-state">
                        <strong>No users match the current filters.</strong>
                        <p>Try a broader search or reset the department and status filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="admin-side-stack">
          <section className="dashboard-panel admin-panel-compact">
            <div className="chart-sheet-section-head">
              <strong>Role templates</strong>
              <span>Keep permissions predictable as the team grows.</span>
            </div>

            <div className="admin-card-stack">
              {adminRolesSeed.map((role) => (
                <article key={role.id} className="admin-role-card">
                  <div className="admin-role-card-head">
                    <strong>{role.name}</strong>
                    <span>{role.memberCount} assigned</span>
                  </div>
                  <p>{role.description}</p>
                  <div className="admin-bullet-list">
                    {role.permissions.map((permission) => (
                      <div key={permission} className="chart-sheet-list-item">
                        <span className="chart-sheet-list-dot" />
                        <p>{permission}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-panel admin-panel-compact">
            <div className="chart-sheet-section-head">
              <strong>Admin notes</strong>
              <span>Front-end planning cues based on the current system requirements.</span>
            </div>

            <div className="admin-bullet-list">
              <div className="chart-sheet-list-item">
                <span className="chart-sheet-list-dot" />
                <p>External auditor access should stay read-only and time-bound.</p>
              </div>
              <div className="chart-sheet-list-item">
                <span className="chart-sheet-list-dot" />
                <p>Payroll roles need access to contribution tables without changing chart defaults.</p>
              </div>
              <div className="chart-sheet-list-item">
                <span className="chart-sheet-list-dot" />
                <p>Approval-sensitive actions should surface in the audit trail immediately after save.</p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function AdminSystemSettingsView({ companyName, components }: { companyName: string; components: SharedAdminComponents }) {
  const { CustomSelect, SetupField } = components;
  const [workflowSettings, setWorkflowSettings] = useState<WorkspaceToggleSetting[]>([
    {
      id: "period-lock",
      label: "Require month-end lock approval",
      description: "Prevent accidental posting once a reporting period has been reviewed.",
      enabled: true
    },
    {
      id: "journal-validation",
      label: "Block unbalanced journal entries",
      description: "Keep double-entry validation enforced across manual posting flows.",
      enabled: true
    },
    {
      id: "tax-reminders",
      label: "Send BIR deadline reminders",
      description: "Trigger deadline nudges for monthly, quarterly, and annual compliance calendars.",
      enabled: true
    },
    {
      id: "payroll-notice",
      label: "Notify payroll approvers before release",
      description: "Warn designated admins before payslips and remittance files are finalized.",
      enabled: false
    }
  ]);
  const [invoiceSeries, setInvoiceSeries] = useState("LDG-2026");
  const [lockSchedule, setLockSchedule] = useState("monthly");
  const [defaultApprover, setDefaultApprover] = useState("finance-manager");
  const [deadlineMode, setDeadlineMode] = useState("staggered");

  const toggleSetting = (id: string) => {
    setWorkflowSettings((current) =>
      current.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting))
    );
  };

  const summaryItems = [
    { label: "Live safeguards", value: workflowSettings.filter((setting) => setting.enabled).length, note: "Policies currently enforced in the workspace" },
    { label: "Default approver", value: "1", note: "Primary approval owner for admin-sensitive flows" },
    { label: "Invoice prefix", value: invoiceSeries, note: "Current official invoice numbering series" },
    { label: "Tax reminder mode", value: deadlineMode === "staggered" ? "Staggered" : "Manual", note: "How compliance deadlines notify the team" }
  ];

  return (
    <div className="dashboard-content admin-workspace-view admin-view-settings">
      <AdminPageHero
        badge="Workspace policy"
        title="System Settings"
        description={`Set the operational defaults, approval rules, and numbering behavior for ${companyName}.`}
        tone="settings"
      >
        <div className="admin-settings-signal">
          <div className="admin-settings-signal-line">
            <span>Approval cadence</span>
            <strong>{lockSchedule}</strong>
          </div>
          <div className="admin-settings-signal-line">
            <span>Reminder mode</span>
            <strong>{deadlineMode === "staggered" ? "Staggered" : "Manual"}</strong>
          </div>
        </div>
      </AdminPageHero>

      <div className="chart-accounts-header-actions admin-page-actions">
        <button type="button" className="chart-page-button chart-page-button-ghost">
          Reset defaults
        </button>
        <button type="button" className="chart-page-button chart-page-button-primary">
          Save workspace settings
        </button>
      </div>

      <SummaryCards items={summaryItems} label="System settings summary" />

      <section className="admin-two-column-grid">
        <section className="dashboard-panel">
          <div className="chart-sheet-section-head">
            <strong>Operational safeguards</strong>
            <span>These switches control how strict the workspace behaves before data reaches reports and compliance outputs.</span>
          </div>

          <div className="admin-toggle-list">
            {workflowSettings.map((setting) => (
              <button
                key={setting.id}
                type="button"
                className={`admin-toggle-row ${setting.enabled ? "admin-toggle-row-enabled" : ""}`}
                onClick={() => toggleSetting(setting.id)}
                aria-pressed={setting.enabled}
              >
                <div className="admin-toggle-copy">
                  <strong>{setting.label}</strong>
                  <span>{setting.description}</span>
                </div>
                <span className={`admin-toggle-control ${setting.enabled ? "admin-toggle-control-enabled" : ""}`}>
                  <span className="admin-toggle-knob" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="chart-sheet-section-head">
            <strong>Default admin configuration</strong>
            <span>Front-end scaffolding for the controls the admin team will eventually persist.</span>
          </div>

          <div className="setup-grid">
            <SetupField label="Invoice prefix">
              <input type="text" value={invoiceSeries} onChange={(event) => setInvoiceSeries(event.target.value)} />
            </SetupField>

            <SetupField label="Period lock cadence">
              <CustomSelect
                ariaLabel="Period lock cadence"
                value={lockSchedule}
                options={[
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" }
                ]}
                onChange={setLockSchedule}
              />
            </SetupField>

            <SetupField label="Default approver">
              <CustomSelect
                ariaLabel="Default approver"
                value={defaultApprover}
                options={[
                  { value: "finance-manager", label: "Finance Manager" },
                  { value: "administrator", label: "Administrator" },
                  { value: "controller", label: "Controller" }
                ]}
                onChange={setDefaultApprover}
              />
            </SetupField>

            <SetupField label="Deadline reminder mode">
              <CustomSelect
                ariaLabel="Deadline reminder mode"
                value={deadlineMode}
                options={[
                  { value: "staggered", label: "Staggered reminders" },
                  { value: "manual", label: "Manual reminders only" }
                ]}
                onChange={setDeadlineMode}
              />
            </SetupField>
          </div>
        </section>
      </section>
    </div>
  );
}

function AdminAuditTrailView({ companyName, components }: { companyName: string; components: SharedAdminComponents }) {
  const { CustomSelect, SearchIcon } = components;
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const filteredEvents = auditEventSeed.filter((event) => {
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${event.actor} ${event.action} ${event.target}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesModule = moduleFilter === "all" || event.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  return (
    <div className="dashboard-content admin-workspace-view admin-view-audit">
      <AdminPageHero
        badge="Event ledger"
        title="Audit Trail"
        tone="audit"
      >
        <div className="admin-audit-hero-card">
          <strong>Latest monitored window</strong>
          <span>Today, 9:18 AM to now</span>
          <small>Every admin, payroll, and accounting touchpoint should remain reviewable.</small>
        </div>
      </AdminPageHero>

      <div className="chart-accounts-header-actions admin-page-actions">
        <button type="button" className="chart-page-button chart-page-button-ghost">
          Export log
        </button>
      </div>

      <section className="admin-workspace-main admin-audit-main">
        <div className="chart-accounts-toolbar">
          <label className="chart-accounts-search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search actor, action, or target"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className="admin-filter-grid admin-filter-grid-single">
            <CustomSelect ariaLabel="Filter audit module" value={moduleFilter} options={auditModuleOptions} onChange={setModuleFilter} />
          </div>
        </div>

        <div className="admin-audit-timeline">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <article key={event.id} className="admin-audit-event">
                <div className="admin-audit-rail" aria-hidden="true">
                  <span className="admin-audit-dot" />
                  {index < filteredEvents.length - 1 ? <span className="admin-audit-line" /> : null}
                </div>
                <div className="admin-audit-card">
                  <div className="admin-audit-card-head">
                    <div className="admin-audit-card-meta">
                      <span className="admin-audit-actor">{event.actor}</span>
                      <strong>{event.action}</strong>
                    </div>
                    <span className="admin-pill admin-pill-module">{event.module}</span>
                  </div>
                  <p className="admin-audit-target">{event.target}</p>
                  <div className="admin-audit-card-footer">
                    <span>{event.time}</span>
                    <span>{event.ipAddress}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="chart-empty-state">
              <strong>No audit records match the current filters.</strong>
              <p>Try clearing the module filter or searching for a broader actor or action keyword.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AdminCustomizationView({ companyName, components }: { companyName: string; components: SharedAdminComponents }) {
  const { CustomSelect, SetupField } = components;
  const [workspaceLabel, setWorkspaceLabel] = useState(companyName);
  const [invoiceFooter, setInvoiceFooter] = useState("Thank you for doing business with Ledgera Demo Company.");
  const [accentMode, setAccentMode] = useState("violet");

  const summaryItems = [
    { label: "Live custom modules", value: customizationModulesSeed.filter((module) => module.stage === "Live").length, note: "Extensions already reflected in the dashboard" },
    { label: "Planned custom blocks", value: customizationModulesSeed.filter((module) => module.stage === "Planned").length, note: "Reserved UI surfaces for future upgrades" },
    { label: "Document templates", value: "3", note: "Invoice, receipt, and payroll-facing output templates" },
    { label: "Workspace brand", value: workspaceLabel, note: "Current customer-facing workspace label" }
  ];

  return (
    <div className="dashboard-content admin-workspace-view admin-view-customization">
      <AdminPageHero
        badge="Brand surface"
        title="Customization"
        description={`Adjust the front-end presentation of ${companyName} while keeping the current Ledgera dashboard style intact.`}
        tone="customization"
      >
        <div className={`admin-customization-swatches admin-customization-swatches-${accentMode}`}>
          <span />
          <span />
          <span />
        </div>
      </AdminPageHero>

      <div className="chart-accounts-header-actions admin-page-actions">
        <button type="button" className="chart-page-button chart-page-button-ghost">
          Preview documents
        </button>
        <button type="button" className="chart-page-button chart-page-button-primary">
          Save customizations
        </button>
      </div>

      <SummaryCards items={summaryItems} label="Customization summary" />

      <section className="admin-two-column-grid">
        <section className="dashboard-panel">
          <div className="chart-sheet-section-head">
            <strong>Workspace presentation</strong>
            <span>These are visual and copy-facing controls only for now.</span>
          </div>

          <div className="setup-grid">
            <SetupField label="Workspace label">
              <input type="text" value={workspaceLabel} onChange={(event) => setWorkspaceLabel(event.target.value)} />
            </SetupField>

            <SetupField label="Accent preset">
              <CustomSelect
                ariaLabel="Accent preset"
                value={accentMode}
                options={[
                  { value: "violet", label: "Current Ledgera violet" },
                  { value: "ink", label: "Neutral ink" },
                  { value: "ocean", label: "Ocean blue" }
                ]}
                onChange={setAccentMode}
              />
            </SetupField>

            <div className="setup-grid-full">
              <SetupField label="Invoice footer">
                <input type="text" value={invoiceFooter} onChange={(event) => setInvoiceFooter(event.target.value)} />
              </SetupField>
            </div>
          </div>
        </section>

        <section className="dashboard-panel admin-customization-preview-panel">
          <div className="chart-sheet-section-head">
            <strong>Live preview</strong>
            <span>A front-end composition preview so this page reads differently from the settings console.</span>
          </div>

          <div className={`admin-customization-preview admin-customization-preview-${accentMode}`}>
            <div className="admin-customization-preview-head">
              <span>{workspaceLabel}</span>
              <strong>Invoice and client-facing document preview</strong>
            </div>
            <div className="admin-customization-preview-body">
              <div className="admin-customization-preview-line" />
              <div className="admin-customization-preview-line admin-customization-preview-line-short" />
              <div className="admin-customization-preview-grid">
                <span />
                <span />
                <span />
              </div>
            </div>
            <p>{invoiceFooter}</p>
          </div>

          <div className="chart-sheet-section-head">
            <strong>Modular extensions</strong>
            <span>Future-proof front-end placeholders aligned with the requirements document.</span>
          </div>

          <div className="admin-card-stack">
            {customizationModulesSeed.map((module) => (
              <article key={module.id} className="admin-module-card">
                <div className="admin-module-card-head">
                  <strong>{module.title}</strong>
                  <span className={`admin-pill ${module.stage === "Live" ? "admin-pill-stage-live" : "admin-pill-stage-planned"}`}>
                    {module.stage}
                  </span>
                </div>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function AdminContributionTablesView({ components }: { components: SharedAdminComponents }) {
  const { CustomSelect } = components;
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTables = contributionTablesSeed.filter((table) => statusFilter === "all" || table.status === statusFilter);

  const summaryItems = [
    { label: "Contribution tables", value: contributionTablesSeed.length, note: "Core payroll-linked government tables tracked in admin" },
    { label: "Current", value: contributionTablesSeed.filter((table) => table.status === "Current").length, note: "Already reflected in payroll logic" },
    { label: "Review due", value: contributionTablesSeed.filter((table) => table.status === "Review due").length, note: "Need admin validation before the next cycle" },
    { label: "Planned", value: contributionTablesSeed.filter((table) => table.status === "Planned").length, note: "Prepared for the next effective date" }
  ];

  return (
    <div className="dashboard-content admin-workspace-view admin-view-contributions">
      <AdminPageHero
        badge="Payroll reference"
        title="Contribution Tables"
        description="Manage the payroll-linked government contribution references used in salary and remittance calculations."
        tone="contributions"
      >
        <div className="admin-contribution-hero-card">
          <strong>Next review checkpoint</strong>
          <span>PhilHealth premium table</span>
          <small>Review due before the next payroll cycle closes.</small>
        </div>
      </AdminPageHero>

      <div className="chart-accounts-header-actions admin-page-actions">
        <button type="button" className="chart-page-button chart-page-button-ghost">
          Import official table
        </button>
        <button type="button" className="chart-page-button chart-page-button-primary">
          Create update draft
        </button>
      </div>

      <SummaryCards items={summaryItems} label="Contribution table summary" />

      <section className="admin-workspace-shell">
        <div className="admin-workspace-main">
          <div className="chart-accounts-toolbar">
            <div className="admin-toolbar-copy">
              <strong>Contribution schedule references</strong>
              <span>Front-end coverage for SSS, PhilHealth, Pag-IBIG, and withholding-tax maintenance.</span>
            </div>

            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter contribution table status" value={statusFilter} options={contributionStatusOptions} onChange={setStatusFilter} />
            </div>
          </div>

          <div className="admin-contribution-board">
            {filteredTables.length > 0 ? (
              filteredTables.map((table) => (
                <article key={table.id} className="admin-contribution-card">
                  <div className="admin-contribution-card-head">
                    <div className="admin-primary-cell">
                      <strong>{table.label}</strong>
                      <span>{table.note}</span>
                    </div>
                    <span className={`admin-pill admin-pill-status-${table.status.toLowerCase().replace(/\s+/g, "-")}`}>{table.status}</span>
                  </div>
                  <div className="admin-contribution-card-grid">
                    <div>
                      <span>Coverage</span>
                      <strong>{table.coverage}</strong>
                    </div>
                    <div>
                      <span>Effective date</span>
                      <strong>{table.effectiveDate}</strong>
                    </div>
                    <div>
                      <span>Update window</span>
                      <strong>{table.updateWindow}</strong>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="chart-empty-state">
                <strong>No contribution tables match the selected status.</strong>
                <p>Switch to another status filter to review the rest of the payroll table pipeline.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="admin-side-stack">
          <section className="dashboard-panel admin-panel-compact">
            <div className="chart-sheet-section-head">
              <strong>Update checklist</strong>
              <span>What the final connected workflow will need after the frontend is approved.</span>
            </div>

            <div className="admin-bullet-list">
              <div className="chart-sheet-list-item">
                <span className="chart-sheet-list-dot" />
                <p>Version each table by effectivity date so payroll reruns remain historically accurate.</p>
              </div>
              <div className="chart-sheet-list-item">
                <span className="chart-sheet-list-dot" />
                <p>Preview the impact on sample payslips before publishing new contribution rates.</p>
              </div>
              <div className="chart-sheet-list-item">
                <span className="chart-sheet-list-dot" />
                <p>Log every publish action to the audit trail for later compliance review.</p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export function AdminWorkspaceRouter({ companyName, components, view }: AdminWorkspaceRouterProps) {
  if (view === "users-roles") {
    return <AdminUsersRolesView companyName={companyName} components={components} />;
  }

  if (view === "system-settings") {
    return <AdminSystemSettingsView companyName={companyName} components={components} />;
  }

  if (view === "audit-trail") {
    return <AdminAuditTrailView companyName={companyName} components={components} />;
  }

  if (view === "customization") {
    return <AdminCustomizationView companyName={companyName} components={components} />;
  }

  return <AdminContributionTablesView components={components} />;
}
