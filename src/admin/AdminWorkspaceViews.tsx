import { useEffect, useRef, useState, type ReactNode } from "react";

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
  approvalScope: string;
  department: string;
  emergencyContact: string;
  employeeId: string;
  email: string;
  id: string;
  lastActive: string;
  location: string;
  name: string;
  phone: string;
  recentActivity: string[];
  role: string;
  roleTone: AdminUserRoleTone;
  seatType: "Workspace admin" | "Department lead" | "Reviewer";
  status: AdminUserStatus;
  workspaceAccess: { area: string; level: string }[];
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
    phone: "+63 917 801 2201",
    employeeId: "LDG-ADM-001",
    role: "Administrator",
    roleTone: "admin",
    department: "Leadership",
    status: "Active",
    lastActive: "2 minutes ago",
    location: "Makati HQ",
    seatType: "Workspace admin",
    approvalScope: "Can approve chart changes, company profile updates, and payroll release readiness.",
    emergencyContact: "Finance Ops Hotline",
    workspaceAccess: [
      { area: "Admin", level: "Full configuration access" },
      { area: "Accounting", level: "Can review and publish structure changes" },
      { area: "Payroll", level: "Can approve final release checks" },
      { area: "Reports", level: "Can export company-wide reports" }
    ],
    recentActivity: [
      "Updated company VAT registration status this morning.",
      "Reviewed the default chart import before publishing it to accounting.",
      "Confirmed payroll release controls for the current cycle."
    ]
  },
  {
    id: "user-2",
    name: "Miguel Santos",
    email: "miguel@ledgera.dev",
    phone: "+63 917 663 1440",
    employeeId: "LDG-FIN-014",
    role: "Finance Manager",
    roleTone: "finance",
    department: "Accounting",
    status: "Active",
    lastActive: "14 minutes ago",
    location: "Pasig Finance Hub",
    seatType: "Department lead",
    approvalScope: "Owns chart maintenance, closing checks, and accounting review exports.",
    emergencyContact: "Accounting Control Desk",
    workspaceAccess: [
      { area: "Accounting", level: "Full chart and journal review access" },
      { area: "Reports", level: "Can generate and lock month-end packs" },
      { area: "Admin", level: "Read-only company settings" }
    ],
    recentActivity: [
      "Imported the standard chart template for the new workspace.",
      "Reviewed account groupings for current asset and liability structures.",
      "Exported the last draft of the quarter-end finance report."
    ]
  },
  {
    id: "user-3",
    name: "Patricia Dela Cruz",
    email: "patricia@ledgera.dev",
    phone: "+63 998 110 0742",
    employeeId: "LDG-PAY-006",
    role: "Payroll Officer",
    roleTone: "operations",
    department: "Operations",
    status: "Invited",
    lastActive: "Invitation sent today",
    location: "Remote - Cebu",
    seatType: "Department lead",
    approvalScope: "Can prepare contribution updates and pre-release payroll checks after onboarding.",
    emergencyContact: "People Operations Team",
    workspaceAccess: [
      { area: "Payroll", level: "Can prepare runs and contribution updates" },
      { area: "Reports", level: "Can export payroll summaries only" },
      { area: "Admin", level: "No workspace configuration access yet" }
    ],
    recentActivity: [
      "Invitation created for payroll onboarding today.",
      "Pending workspace setup and multi-factor verification.",
      "No in-product activity recorded yet."
    ]
  },
  {
    id: "user-4",
    name: "Leo Garcia",
    email: "leo@ledgera.dev",
    phone: "+63 917 440 8812",
    employeeId: "LDG-AUD-022",
    role: "External Auditor",
    roleTone: "readonly",
    department: "Accounting",
    status: "Suspended",
    lastActive: "5 days ago",
    location: "Ortigas Audit Office",
    seatType: "Reviewer",
    approvalScope: "Read-only reviewer for quarter-end audit packages and compliance exports.",
    emergencyContact: "External Audit Liaison",
    workspaceAccess: [
      { area: "Reports", level: "Can view locked report packages" },
      { area: "Compliance", level: "Can inspect uploaded filings" },
      { area: "Accounting", level: "No edit rights" }
    ],
    recentActivity: [
      "Viewed the quarter-end compliance package yesterday.",
      "Account access was suspended after the review window closed.",
      "No active edit permissions remain on this workspace."
    ]
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

function FilterButtonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chart-filter-button-icon">
      <path d="M4.75 6.75h14.5" />
      <path d="M7.5 11.75h9" />
      <path d="M10 16.75h4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="chart-close-icon">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function getUserInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function AdminPageHero({
  badge,
  title,
  description,
  tone,
  children
}: {
  badge?: string;
  children?: ReactNode;
  description?: string;
  title: string;
  tone: "users" | "settings" | "audit" | "customization" | "contributions";
}) {
  return (
    <section className={`admin-page-hero admin-page-hero-${tone}${children ? "" : " admin-page-hero-solo"}`}>
      <div className="admin-page-hero-copy">
        {badge ? <span className="admin-page-hero-badge">{badge}</span> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children ? <div className="admin-page-hero-side">{children}</div> : null}
    </section>
  );
}

function AdminUsersRolesView({ companyName, components }: { companyName: string; components: SharedAdminComponents }) {
  const { CustomSelect, RowOpenIcon, SearchIcon, SetupField } = components;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const filteredUsers = adminUsersSeed.filter((user) => {
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });
  const activeFilterCount = [statusFilter, departmentFilter].filter((value) => value !== "all").length;

  useEffect(() => {
    if (!filterMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterMenuRef.current?.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filterMenuOpen]);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUser]);

  const clearFilters = () => {
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  return (
    <div className="dashboard-content admin-workspace-view admin-view-users">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Users &amp; Roles</h1>
          <div className="chart-accounts-header-actions admin-page-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost">
              Export access list
            </button>
            <button type="button" className="chart-page-button chart-page-button-primary">
              Invite user
            </button>
          </div>
        </div>

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

          <div className="chart-accounts-toolbar-actions">
            <div ref={filterMenuRef} className={`chart-filter-popover ${filterMenuOpen ? "chart-filter-popover-open" : ""}`}>
              <button
                type="button"
                className={`chart-filter-trigger ${activeFilterCount > 0 ? "chart-filter-trigger-active" : ""}`}
                aria-expanded={filterMenuOpen}
                aria-haspopup="dialog"
                onClick={() => setFilterMenuOpen((current) => !current)}
              >
                <FilterButtonIcon />
                <span>Filter</span>
                {activeFilterCount > 0 ? <span className="chart-filter-trigger-count">{activeFilterCount}</span> : null}
              </button>

              {filterMenuOpen ? (
                <div className="chart-filter-panel" role="dialog" aria-label="Filter users">
                  <div className="chart-filter-panel-head">
                    <div>
                      <strong>Filter users</strong>
                      <span>Refine the visible user records without crowding the toolbar.</span>
                    </div>
                    {activeFilterCount > 0 ? (
                      <button type="button" className="chart-filter-clear" onClick={clearFilters}>
                        Clear filters
                      </button>
                    ) : null}
                  </div>

                  <div className="chart-accounts-filters">
                    <SetupField label="Status">
                      <CustomSelect ariaLabel="Filter user status" value={statusFilter} options={adminUserStatusOptions} onChange={setStatusFilter} />
                    </SetupField>
                    <SetupField label="Department">
                      <CustomSelect
                        ariaLabel="Filter user department"
                        value={departmentFilter}
                        options={adminUserDepartmentOptions}
                        onChange={setDepartmentFilter}
                      />
                    </SetupField>
                  </div>
                </div>
              ) : null}
            </div>
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
                  <tr key={user.id} className={selectedUser?.id === user.id ? "chart-table-row-open" : ""} onClick={() => setSelectedUser(user)}>
                    <td>
                      <div className="admin-user-cell">
                        <span className={`admin-user-avatar admin-user-avatar-${user.roleTone}`}>{getUserInitials(user.name)}</span>
                        <div className="admin-primary-cell">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
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
                      <button
                        type="button"
                        className="chart-row-action"
                        aria-label={`Open ${user.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedUser(user);
                        }}
                      >
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
      </section>

      {selectedUser ? (
        <div className="chart-standard-layer admin-user-modal-layer" role="dialog" aria-modal="true" aria-label={`${selectedUser.name} details`}>
          <button
            type="button"
            className="chart-standard-backdrop"
            aria-label="Close user details"
            onClick={() => setSelectedUser(null)}
          />

          <section className="admin-user-modal">
            <button
              type="button"
              className="admin-user-modal-close"
              onClick={() => setSelectedUser(null)}
              aria-label="Close user details"
            >
              <CloseIcon />
            </button>

            <div className="admin-user-modal-main">
              <div className="admin-user-profile">
                <div className={`admin-user-profile-avatar admin-user-avatar-${selectedUser.roleTone}`}>{getUserInitials(selectedUser.name)}</div>
                <div className="admin-user-profile-copy">
                  <span className="admin-user-profile-kicker">{selectedUser.employeeId}</span>
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.role} for {companyName}</p>
                </div>
                <div className="admin-user-profile-pills">
                  <span className={`admin-pill admin-pill-role-${selectedUser.roleTone}`}>{selectedUser.role}</span>
                  <span className={`admin-pill admin-pill-status-${selectedUser.status.toLowerCase().replace(/\s+/g, "-")}`}>{selectedUser.status}</span>
                </div>
              </div>

              <div className="admin-user-modal-form">
                <div className="admin-user-modal-field-grid">
                  <div className="admin-user-modal-field">
                    <span>First name</span>
                    <strong>{selectedUser.name.split(" ")[0]}</strong>
                  </div>
                  <div className="admin-user-modal-field">
                    <span>Last name</span>
                    <strong>{selectedUser.name.split(" ").slice(1).join(" ") || "-"}</strong>
                  </div>
                  <div className="admin-user-modal-field">
                    <span>Department</span>
                    <strong>{selectedUser.department}</strong>
                  </div>
                  <div className="admin-user-modal-field">
                    <span>Seat type</span>
                    <strong>{selectedUser.seatType}</strong>
                  </div>
                  <div className="admin-user-modal-field admin-user-modal-field-full">
                    <span>Email address</span>
                    <strong>{selectedUser.email}</strong>
                  </div>
                  <div className="admin-user-modal-field">
                    <span>Phone number</span>
                    <strong>{selectedUser.phone}</strong>
                  </div>
                  <div className="admin-user-modal-field">
                    <span>Location</span>
                    <strong>{selectedUser.location}</strong>
                  </div>
                </div>

                <div className="admin-user-modal-inline-note">
                  <span>Approval scope</span>
                  <p>{selectedUser.approvalScope}</p>
                </div>
              </div>
            </div>

            <aside className="admin-user-modal-side">
              <div className="admin-user-side-panel">
                <div className="admin-user-side-panel-head">
                  <strong>Workspace access</strong>
                  <span>Current module coverage</span>
                </div>

                <div className="admin-user-access-list">
                  {selectedUser.workspaceAccess.map((access) => (
                    <div key={`${selectedUser.id}-${access.area}`} className="admin-user-access-item">
                      <div>
                        <strong>{access.area}</strong>
                        <span>{access.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-user-side-panel">
                <div className="admin-user-side-panel-head">
                  <strong>Recent activity</strong>
                  <span>Latest signals for this seat</span>
                </div>

                <div className="admin-user-activity-list">
                  {selectedUser.recentActivity.map((entry, index) => (
                    <div key={`${selectedUser.id}-activity-${index}`} className="admin-user-activity-item">
                      <span className="admin-user-activity-index">{index + 1}</span>
                      <p>{entry}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <footer className="admin-user-modal-footer">
              <div className="admin-user-modal-footer-copy">
                <strong>{selectedUser.lastActive}</strong>
                <span>Emergency contact: {selectedUser.emergencyContact}</span>
              </div>
              <div className="admin-user-modal-footer-actions">
                <button type="button" className="chart-page-button chart-page-button-ghost" onClick={() => setSelectedUser(null)}>
                  Cancel
                </button>
                <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => setSelectedUser(null)}>
                  Done
                </button>
              </div>
            </footer>
          </section>
        </div>
      ) : null}
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

  return (
    <div className="dashboard-content admin-workspace-view admin-view-settings">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>System Settings</h1>
          <div className="chart-accounts-header-actions admin-page-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost">
              Reset defaults
            </button>
            <button type="button" className="chart-page-button chart-page-button-primary">
              Save workspace settings
            </button>
          </div>
        </div>

        <div className="admin-two-column-grid admin-page-panel-body">
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
        </div>
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
      <section className="admin-workspace-main admin-audit-main">
        <div className="admin-table-header">
          <h1>Audit Trail</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter audit module" value={moduleFilter} options={auditModuleOptions} onChange={setModuleFilter} />
            </div>
            <button type="button" className="chart-page-button chart-page-button-ghost">
              Export log
            </button>
          </div>
        </div>

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
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Module</th>
                <th>Target</th>
                <th>Time</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td><span className="admin-audit-actor-name">{event.actor}</span></td>
                    <td>{event.action}</td>
                    <td><span className="admin-pill admin-pill-module">{event.module}</span></td>
                    <td>{event.target}</td>
                    <td>{event.time}</td>
                    <td>{event.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="chart-empty-state">
                      <strong>No audit records match the current filters.</strong>
                      <p>Try clearing the module filter or searching for a broader actor or action keyword.</p>
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

function AdminCustomizationView({ companyName, components }: { companyName: string; components: SharedAdminComponents }) {
  const { CustomSelect, SetupField } = components;
  const [workspaceLabel, setWorkspaceLabel] = useState(companyName);
  const [invoiceFooter, setInvoiceFooter] = useState("Thank you for doing business with Ledgera Demo Company.");
  const [accentMode, setAccentMode] = useState("violet");

  return (
    <div className="dashboard-content admin-workspace-view admin-view-customization">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Customization</h1>
          <div className="chart-accounts-header-actions admin-page-actions">
            <button type="button" className="chart-page-button chart-page-button-ghost">
              Preview documents
            </button>
            <button type="button" className="chart-page-button chart-page-button-primary">
              Save customizations
            </button>
          </div>
        </div>

        <div className="admin-two-column-grid admin-page-panel-body">
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
          </section>
        </div>
      </section>
    </div>
  );
}

function AdminContributionTablesView({ components }: { components: SharedAdminComponents }) {
  const { CustomSelect } = components;
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTables = contributionTablesSeed.filter((table) => statusFilter === "all" || table.status === statusFilter);

  return (
    <div className="dashboard-content admin-workspace-view admin-view-contributions">
      <section className="admin-workspace-main">
        <div className="admin-table-header">
          <h1>Contribution Tables</h1>
          <div className="admin-table-header-actions">
            <div className="admin-filter-grid admin-filter-grid-single">
              <CustomSelect ariaLabel="Filter contribution table status" value={statusFilter} options={contributionStatusOptions} onChange={setStatusFilter} />
            </div>
            <button type="button" className="chart-page-button chart-page-button-ghost">
              Import official table
            </button>
            <button type="button" className="chart-page-button chart-page-button-primary">
              Create update draft
            </button>
          </div>
        </div>

        <div className="chart-table-panel">
          <table className="chart-table">
            <thead>
              <tr>
                <th>Table</th>
                <th>Coverage</th>
                <th>Effective date</th>
                <th>Update window</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.length > 0 ? (
                filteredTables.map((table) => (
                  <tr key={table.id}>
                    <td>
                      <div className="admin-primary-cell">
                        <strong>{table.label}</strong>
                        <span>{table.note}</span>
                      </div>
                    </td>
                    <td>{table.coverage}</td>
                    <td>{table.effectiveDate}</td>
                    <td>{table.updateWindow}</td>
                    <td>
                      <span className={`admin-pill admin-pill-status-${table.status.toLowerCase().replace(/\s+/g, "-")}`}>{table.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="chart-empty-state">
                      <strong>No contribution tables match the selected status.</strong>
                      <p>Switch to another status filter to review the rest of the payroll table pipeline.</p>
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
