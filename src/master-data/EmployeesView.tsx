import {
  MasterCellStack,
  type MasterDataColumn,
  type MasterDataFilter,
  type MasterDataRecordBase,
  type MasterDataSort,
  MasterPill,
  MasterPrimaryCell,
  MasterRecordsWorkspace,
  type SharedMasterDataComponents
} from "./MasterRecordsWorkspace";

type EmployeeRecord = MasterDataRecordBase & {
  department: string;
  employmentType: string;
  lastPayout: string;
  manager: string;
  payrollCycle: string;
  payoutMethod: string;
  roleTitle: string;
  workLocation: string;
  updatedRank: number;
};

const employeeDepartmentOptions = [
  { value: "all", label: "All departments" },
  { value: "Accounting", label: "Accounting" },
  { value: "Operations", label: "Operations" },
  { value: "Leadership", label: "Leadership" }
];

const employeeHealthOptions = [
  { value: "all", label: "All readiness states" },
  { value: "Payroll ready", label: "Payroll ready" },
  { value: "Missing IDs", label: "Missing IDs" },
  { value: "Onboarding", label: "Onboarding" }
];

const employeeRecords: EmployeeRecord[] = [
  {
    id: "employee-andrea",
    avatarLabel: "AR",
    avatarTone: "employee",
    name: "Andrea Ramos",
    sublabel: "Finance Director",
    roleTitle: "Finance Director",
    department: "Leadership",
    employmentType: "Regular",
    payrollCycle: "Semi-monthly",
    payoutMethod: "BDO payroll account",
    manager: "Executive office",
    workLocation: "Makati HQ",
    lastPayout: "Released Apr 5",
    updatedAt: "Today",
    updatedRank: 1,
    health: { label: "Payroll ready", tone: "ready" },
    drawer: {
      kicker: "Employee profile",
      code: "EMP-001",
      title: "Andrea Ramos",
      description: "Leadership employee with complete payroll requirements, stable payout routing, and no onboarding gaps.",
      badges: [
        { label: "Payroll ready", tone: "ready" },
        { label: "Leadership", tone: "accent" },
        { label: "Regular", tone: "info" }
      ],
      summary: [
        { label: "Role", value: "Finance Director" },
        { label: "Payroll cycle", value: "Semi-monthly" },
        { label: "Payout method", value: "BDO payroll account" },
        { label: "Last payout", value: "Released Apr 5" }
      ],
      sections: [
        {
          title: "Employment profile",
          description: "Identity, ownership, and work context for payroll and HR operations.",
          fields: [
            { label: "Department", value: "Leadership" },
            { label: "Employment type", value: "Regular" },
            { label: "Manager", value: "Executive office" },
            { label: "Work location", value: "Makati HQ" }
          ]
        },
        {
          title: "Payroll setup",
          description: "The current compensation route and compliance readiness for routine payroll runs.",
          fields: [
            { label: "Payroll cycle", value: "Semi-monthly" },
            { label: "Payout method", value: "BDO payroll account" },
            { label: "Government IDs", value: "TIN, SSS, PhilHealth, Pag-IBIG complete" },
            { label: "Timekeeping route", value: "Leadership fixed payroll" }
          ],
          note: {
            kicker: "Payroll signal",
            title: "Fully ready",
            detail: "Andrea is a clean example of a payroll-ready employee profile with no upstream blockers."
          }
        }
      ],
      footerActionLabel: "Open payroll context",
      footerActionNotice: "Payroll context will connect here next. Andrea is already ready for downstream payroll workflows."
    }
  },
  {
    id: "employee-patricia",
    avatarLabel: "PD",
    avatarTone: "employee",
    name: "Patricia Dela Cruz",
    sublabel: "Payroll Officer",
    roleTitle: "Payroll Officer",
    department: "Operations",
    employmentType: "Regular",
    payrollCycle: "Semi-monthly",
    payoutMethod: "GCash disbursement",
    manager: "Andrea Ramos",
    workLocation: "Remote - Cebu",
    lastPayout: "Awaiting account finalization",
    updatedAt: "2 hours ago",
    updatedRank: 2,
    health: { label: "Missing IDs", tone: "attention" },
    drawer: {
      kicker: "Employee profile",
      code: "EMP-014",
      title: "Patricia Dela Cruz",
      description: "New payroll team member with the role and payout preference ready, but government ID completeness still blocks a fully clean payroll handoff.",
      badges: [
        { label: "Missing IDs", tone: "attention" },
        { label: "Operations", tone: "accent" },
        { label: "Regular", tone: "info" }
      ],
      summary: [
        { label: "Role", value: "Payroll Officer" },
        { label: "Payroll cycle", value: "Semi-monthly" },
        { label: "Payout method", value: "GCash disbursement" },
        { label: "Last payout", value: "Awaiting account finalization" }
      ],
      sections: [
        {
          title: "Employment profile",
          description: "Who owns the role and how Patricia is set up operationally right now.",
          fields: [
            { label: "Department", value: "Operations" },
            { label: "Employment type", value: "Regular" },
            { label: "Manager", value: "Andrea Ramos" },
            { label: "Work location", value: "Remote - Cebu" }
          ]
        },
        {
          title: "Payroll setup",
          description: "The profile is close, but a few compliance details still need to be locked in.",
          fields: [
            { label: "Payroll cycle", value: "Semi-monthly" },
            { label: "Payout method", value: "GCash disbursement" },
            { label: "Government IDs", value: "TIN complete, PhilHealth pending" },
            { label: "Timekeeping route", value: "Operations attendance sync" }
          ],
          note: {
            kicker: "Readiness gap",
            title: "Complete the remaining IDs",
            detail: "Patricia should stay visible in payroll operations, but the screen should make it obvious that she still needs one compliance step before being fully ready."
          }
        }
      ],
      footerActionLabel: "Resolve onboarding",
      footerActionNotice: "Employee onboarding follow-up will connect here next. Patricia is the clearest example of a near-ready payroll profile."
    }
  },
  {
    id: "employee-miguel",
    avatarLabel: "MS",
    avatarTone: "employee",
    name: "Miguel Santos",
    sublabel: "Finance Manager",
    roleTitle: "Finance Manager",
    department: "Accounting",
    employmentType: "Regular",
    payrollCycle: "Semi-monthly",
    payoutMethod: "BPI payroll account",
    manager: "Andrea Ramos",
    workLocation: "Pasig Finance Hub",
    lastPayout: "Released Apr 5",
    updatedAt: "Yesterday",
    updatedRank: 3,
    health: { label: "Payroll ready", tone: "ready" },
    drawer: {
      kicker: "Employee profile",
      code: "EMP-009",
      title: "Miguel Santos",
      description: "Core accounting team lead with a complete payroll profile, standard payout setup, and no compliance blockers.",
      badges: [
        { label: "Payroll ready", tone: "ready" },
        { label: "Accounting", tone: "accent" },
        { label: "Regular", tone: "info" }
      ],
      summary: [
        { label: "Role", value: "Finance Manager" },
        { label: "Payroll cycle", value: "Semi-monthly" },
        { label: "Payout method", value: "BPI payroll account" },
        { label: "Last payout", value: "Released Apr 5" }
      ],
      sections: [
        {
          title: "Employment profile",
          description: "The core employment details used by payroll and role-based operations.",
          fields: [
            { label: "Department", value: "Accounting" },
            { label: "Employment type", value: "Regular" },
            { label: "Manager", value: "Andrea Ramos" },
            { label: "Work location", value: "Pasig Finance Hub" }
          ]
        },
        {
          title: "Payroll setup",
          description: "A straightforward payroll profile with the usual accounting-team routing.",
          fields: [
            { label: "Payroll cycle", value: "Semi-monthly" },
            { label: "Payout method", value: "BPI payroll account" },
            { label: "Government IDs", value: "All mandatory IDs complete" },
            { label: "Timekeeping route", value: "Accounting attendance sync" }
          ]
        }
      ],
      footerActionLabel: "View payroll history",
      footerActionNotice: "Payroll history will connect here next. Miguel is already ready for downstream payroll and reporting flows."
    }
  },
  {
    id: "employee-kyla",
    avatarLabel: "KR",
    avatarTone: "employee",
    name: "Kyla Reyes",
    sublabel: "Operations Associate",
    roleTitle: "Operations Associate",
    department: "Operations",
    employmentType: "Probationary",
    payrollCycle: "Semi-monthly",
    payoutMethod: "Cash card setup",
    manager: "Patricia Dela Cruz",
    workLocation: "Mandaluyong Ops Hub",
    lastPayout: "First payout not scheduled",
    updatedAt: "3 days ago",
    updatedRank: 4,
    health: { label: "Onboarding", tone: "pending" },
    drawer: {
      kicker: "Employee profile",
      code: "EMP-022",
      title: "Kyla Reyes",
      description: "New operations hire still moving through onboarding, with payroll routing drafted but not yet ready for first release.",
      badges: [
        { label: "Onboarding", tone: "pending" },
        { label: "Operations", tone: "accent" },
        { label: "Probationary", tone: "info" }
      ],
      summary: [
        { label: "Role", value: "Operations Associate" },
        { label: "Payroll cycle", value: "Semi-monthly" },
        { label: "Payout method", value: "Cash card setup" },
        { label: "Last payout", value: "First payout not scheduled" }
      ],
      sections: [
        {
          title: "Employment profile",
          description: "The onboarding-stage details that need to settle before payroll becomes routine.",
          fields: [
            { label: "Department", value: "Operations" },
            { label: "Employment type", value: "Probationary" },
            { label: "Manager", value: "Patricia Dela Cruz" },
            { label: "Work location", value: "Mandaluyong Ops Hub" }
          ]
        },
        {
          title: "Payroll setup",
          description: "The operational pieces are moving, but the employee is not yet fully payroll-ready.",
          fields: [
            { label: "Payroll cycle", value: "Semi-monthly" },
            { label: "Payout method", value: "Cash card setup" },
            { label: "Government IDs", value: "TIN pending, SSS filed" },
            { label: "Timekeeping route", value: "Ops onboarding roster" }
          ],
          note: {
            kicker: "Onboarding signal",
            title: "Hold the first release until complete",
            detail: "Kyla should be clearly visible to payroll and people ops, but marked as still onboarding so no one assumes first payout readiness too early."
          }
        }
      ],
      footerActionLabel: "Review readiness",
      footerActionNotice: "Employee readiness review will connect here next. Kyla is a good example of an onboarding-stage payroll profile."
    }
  }
];

const employeeColumns: MasterDataColumn<EmployeeRecord>[] = [
  {
    id: "employee",
    label: "Employee",
    render: (record) => (
      <MasterPrimaryCell
        avatarLabel={record.avatarLabel}
        avatarTone={record.avatarTone}
        title={record.name}
        subtitle={record.roleTitle}
      />
    )
  },
  {
    id: "department",
    label: "Department",
    render: (record) => <MasterCellStack title={record.department} subtitle={record.employmentType} />
  },
  {
    id: "cycle",
    label: "Payroll cycle",
    render: (record) => <MasterCellStack title={record.payrollCycle} subtitle={record.payoutMethod} />
  },
  {
    id: "health",
    label: "Readiness",
    render: (record) => <MasterPill label={record.health.label} tone={record.health.tone} />
  },
  {
    id: "manager",
    label: "Manager",
    render: (record) => <MasterCellStack title={record.manager} subtitle={record.workLocation} />
  },
  {
    id: "payout",
    label: "Last payout",
    render: (record) => <MasterCellStack title={record.lastPayout} subtitle={record.updatedAt} />
  }
];

const employeeFilters: MasterDataFilter<EmployeeRecord>[] = [
  {
    id: "department",
    label: "Department",
    options: employeeDepartmentOptions,
    getValue: (record) => record.department
  },
  {
    id: "health",
    label: "Readiness",
    options: employeeHealthOptions,
    getValue: (record) => record.health.label
  }
];

const employeeSorts: MasterDataSort<EmployeeRecord>[] = [
  {
    id: "name",
    label: "Sort by name",
    compare: (left, right) => left.name.localeCompare(right.name)
  },
  {
    id: "department",
    label: "Sort by department",
    compare: (left, right) => left.department.localeCompare(right.department)
  },
  {
    id: "recent",
    label: "Sort by recent activity",
    compare: (left, right) => left.updatedRank - right.updatedRank
  }
];

export function EmployeesWorkspace({
  companyName,
  components
}: {
  companyName: string;
  components: SharedMasterDataComponents;
}) {
  return (
    <MasterRecordsWorkspace
      title="Employees"
      subtitle={`Review payroll readiness, onboarding gaps, and ownership signals for ${companyName}.`}
      components={components}
      records={employeeRecords}
      columns={employeeColumns}
      filters={employeeFilters}
      sorts={employeeSorts}
      searchPlaceholder="Search employee, role, department, or manager"
      searchIndex={(record) =>
        `${record.name} ${record.roleTitle} ${record.department} ${record.manager} ${record.workLocation} ${record.payoutMethod}`
      }
      primaryActionLabel="Add employee"
      primaryActionNotice="Employee creation will connect here next. This workspace is ready to hold onboarding and payroll-readiness states."
      actionMenuItems={[
        {
          id: "import-employees",
          label: "Import employee roster",
          description: "Load current employee profiles from your people ops or payroll onboarding sheet.",
          notice: "Employee import will connect here next. The shared workspace shell is now ready for a people roster CSV flow."
        },
        {
          id: "export-payroll-roster",
          label: "Export payroll roster",
          description: "Generate a quick readiness list for payroll checks and release preparation.",
          notice: "Payroll roster export will connect here next. This menu now holds lower-frequency HR and payroll actions."
        }
      ]}
      emptyState={{
        title: "No employees match the current filters.",
        description: "Try a broader search or clear the department and readiness filters."
      }}
    />
  );
}
