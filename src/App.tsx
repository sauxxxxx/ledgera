import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type FormEvent, type ReactNode } from "react";
import { AdminWorkspaceRouter } from "./admin/AdminWorkspaceViews";
import { ChartOfAccountsWorkspace } from "./accounting/ChartOfAccountsView";

const MOCK_SESSION_KEY = "ledgera.dev.mock-session";
const SIDEBAR_PREFERENCES_KEY = "ledgera.dashboard-sidebar";
const COMPANY_SETUP_DRAFT_KEY = "ledgera.company-setup-draft";
const MOCK_LOGIN_CREDENTIALS = {
  email: "demo@ledgera.dev",
  password: "Ledgera123!"
} as const;
const isMockAuthEnabled = import.meta.env.DEV;

type AuthMode = "login" | "signup";

type MockSession = {
  companyName: string;
  email: string;
  fullName: string;
  role: string;
};

type AuthTransitionState = {
  detail: string;
  mode: AuthMode;
  title: string;
};

type WorkspaceView =
  | "chart-of-accounts"
  | "company-profile"
  | "users-roles"
  | "system-settings"
  | "audit-trail"
  | "customization"
  | "contribution-tables";

type SidebarIconKind =
  | "overview"
  | "masterData"
  | "salesBilling"
  | "receivables"
  | "accounting"
  | "reports"
  | "payroll"
  | "compliance"
  | "admin";

type SidebarChild = {
  active?: boolean;
  id?: WorkspaceView;
  label: string;
};

type SidebarItem = {
  icon: SidebarIconKind;
  id: string;
  active?: boolean;
  children?: SidebarChild[];
  label: string;
};

type SidebarSection = {
  id: string;
  items: SidebarItem[];
  title: string;
};

type SidebarPreferences = {
  collapsed: boolean;
  openGroupIds: string[];
};

type CompanySetupFormData = {
  addressLine1: string;
  baseCurrency: string;
  bookkeepingMethod: string;
  businessEmail: string;
  city: string;
  contactNumber: string;
  country: string;
  entityType: string;
  fiscalYearStart: string;
  postalCode: string;
  province: string;
  rdoCode: string;
  registrationDate: string;
  registeredBusinessName: string;
  timezone: string;
  tin: string;
  vatStatus: string;
  workspaceName: string;
};

type CompanySetupFieldKey = keyof CompanySetupFormData;

type CompanySetupDraft = {
  completed: boolean;
  formData: CompanySetupFormData;
  stepIndex: number;
  updatedAt: string | null;
};

type CompanySetupStep = {
  description: string;
  helper: string;
  id: string;
  impacts: string[];
  laterItems: string[];
  requiredFields: CompanySetupFieldKey[];
  title: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type ProfileTabId = "company" | "tax" | "contact" | "defaults" | "documents";


const defaultSidebarPreferences: SidebarPreferences = {
  collapsed: false,
  openGroupIds: ["admin"]
};

const companySetupDefaultValues: CompanySetupFormData = {
  addressLine1: "",
  baseCurrency: "php",
  bookkeepingMethod: "accrual",
  businessEmail: "finance@ledgera.dev",
  city: "",
  contactNumber: "",
  country: "Philippines",
  entityType: "corporation",
  fiscalYearStart: "january",
  postalCode: "",
  province: "",
  rdoCode: "",
  registrationDate: "",
  registeredBusinessName: "Ledgera Demo Company Inc.",
  timezone: "asia-manila",
  tin: "",
  vatStatus: "vat",
  workspaceName: "Ledgera Demo Company"
};

const companySetupFieldLabels: Record<CompanySetupFieldKey, string> = {
  addressLine1: "Address line 1",
  baseCurrency: "Base currency",
  bookkeepingMethod: "Bookkeeping method",
  businessEmail: "Business email",
  city: "City / Municipality",
  contactNumber: "Contact number",
  country: "Country",
  entityType: "Entity type",
  fiscalYearStart: "Fiscal year start month",
  postalCode: "Postal code",
  province: "Province / State",
  rdoCode: "RDO code",
  registrationDate: "Registration date",
  registeredBusinessName: "Registered business name",
  timezone: "Timezone",
  tin: "TIN",
  vatStatus: "VAT status",
  workspaceName: "Workspace name"
};

const entityTypeLabels: Record<string, string> = {
  sole: "Sole Proprietorship",
  partnership: "Partnership",
  corporation: "Corporation",
  opc: "One Person Corporation",
  nonprofit: "Nonprofit / Association"
};

const vatStatusLabels: Record<string, string> = {
  vat: "VAT registered",
  "non-vat": "Non-VAT",
  "zero-rated": "Zero-rated"
};

const currencyLabels: Record<string, string> = {
  php: "PHP - Philippine Peso",
  usd: "USD - US Dollar",
  sgd: "SGD - Singapore Dollar"
};

const fiscalYearLabels: Record<string, string> = {
  january: "January",
  april: "April",
  july: "July",
  october: "October"
};

const bookkeepingMethodLabels: Record<string, string> = {
  accrual: "Accrual",
  cash: "Cash"
};

const timezoneLabels: Record<string, string> = {
  "asia-manila": "Asia/Manila",
  "asia-singapore": "Asia/Singapore",
  utc: "UTC"
};

const toSelectOptions = (entries: Record<string, string>): SelectOption[] =>
  Object.entries(entries).map(([value, label]) => ({
    label,
    value
  }));

const entityTypeOptions = toSelectOptions(entityTypeLabels);
const vatStatusOptions = toSelectOptions(vatStatusLabels);
const currencyOptions = toSelectOptions(currencyLabels);
const fiscalYearOptions = toSelectOptions(fiscalYearLabels);
const bookkeepingMethodOptions = toSelectOptions(bookkeepingMethodLabels);
const timezoneOptions = toSelectOptions(timezoneLabels);
const calendarWeekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const calendarMonthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

const parseIsoDate = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const formatIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);

const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addCalendarMonths = (date: Date, offset: number) =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1);

const getCalendarDays = (monthStart: Date, selectedValue: string) => {
  const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - monthStart.getDay());
  const selected = parseIsoDate(selectedValue);
  const todayValue = formatIsoDate(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    const isoValue = formatIsoDate(date);

    return {
      date,
      dayNumber: date.getDate(),
      inCurrentMonth: date.getMonth() === monthStart.getMonth(),
      isSelected: selected ? formatIsoDate(selected) === isoValue : false,
      isToday: isoValue === todayValue,
      isoValue
    };
  });
};

const companySetupSteps: CompanySetupStep[] = [
  {
    id: "identity",
    title: "Company identity",
    description: "Set the company details that appear across your workspace and formal documents.",
    helper: "These names will appear across the workspace and in exported documents.",
    requiredFields: ["workspaceName", "registeredBusinessName", "entityType"],
    impacts: [
      "The workspace name becomes the default company label across the app.",
      "The registered business name is used for official documents and exports.",
      "Entity type affects how later compliance fields are described."
    ],
    laterItems: ["Company logo", "Trade name"]
  },
  {
    id: "tax",
    title: "Tax registration",
    description: "Add the core tax details required for VAT and compliance workflows.",
    helper: "You can add extra registration details later from Company Profile.",
    requiredFields: ["tin", "vatStatus"],
    impacts: [
      "TIN and VAT settings feed BIR reports and invoice tax behavior.",
      "VAT status changes how sales and purchases are classified.",
      "Registration details will be reused in compliance-facing outputs."
    ],
    laterItems: ["RDO code", "Registration date"]
  },
  {
    id: "contact",
    title: "Address and contact",
    description: "Add the address and contact details used across company records and customer-facing documents.",
    helper: "Only the address essentials are required to move forward right now.",
    requiredFields: ["businessEmail", "addressLine1", "city", "province", "country"],
    impacts: [
      "Business email and address can appear on invoices and receipts.",
      "Location data helps standardize profile and document outputs.",
      "These details become the default company contact point in the workspace."
    ],
    laterItems: ["Website", "Address line 2", "Postal code", "Contact number"]
  },
  {
    id: "defaults",
    title: "Accounting defaults",
    description: "Choose the defaults that initialize your books before transactions begin.",
    helper: "These settings can still be reviewed later, but they give the workspace a stable starting point.",
    requiredFields: ["baseCurrency", "fiscalYearStart", "bookkeepingMethod", "timezone"],
    impacts: [
      "Base currency controls report and journal display defaults.",
      "Fiscal year start affects period grouping and year-based reports.",
      "Bookkeeping method and timezone shape how entries are initialized."
    ],
    laterItems: []
  }
];

const companySetupRequiredFields = Array.from(
  new Set(companySetupSteps.flatMap((step) => step.requiredFields))
);

const companyProfileDocuments = [
  {
    actionLabel: "Replace",
    detail: "Primary registration record used for legal company identity and verification.",
    fileName: "SEC-Registration.pdf",
    id: "registration",
    status: "Uploaded",
    tone: "success",
    title: "SEC / DTI registration"
  },
  {
    actionLabel: "Replace",
    detail: "BIR Certificate of Registration or equivalent tax registration record for your company.",
    fileName: "BIR-2303.pdf",
    id: "bir",
    status: "Pending review",
    tone: "pending",
    title: "BIR Certificate of Registration"
  },
  {
    actionLabel: "Browse",
    detail: "Latest utility bill, lease agreement, or another approved proof of business address.",
    fileName: "",
    id: "address-proof",
    status: "Missing",
    tone: "missing",
    title: "Proof of business address"
  },
  {
    actionLabel: "Browse",
    detail: "Upload only if your signing authority or incorporation details need supporting records.",
    fileName: "",
    id: "ownership",
    status: "Optional",
    tone: "neutral",
    title: "Articles of incorporation / board resolution"
  }
] as const;

const SETUP_STEP_TRANSITION_MS = 240;

const readMockSession = (): MockSession | null => {
  if (!isMockAuthEnabled || typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockSession) : null;
  } catch {
    return null;
  }
};

const writeMockSession = (session: MockSession | null) => {
  if (!isMockAuthEnabled || typeof window === "undefined") {
    return;
  }

  if (session) {
    window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    return;
  }

  window.localStorage.removeItem(MOCK_SESSION_KEY);
};

const readSidebarPreferences = (): SidebarPreferences => {
  if (typeof window === "undefined") {
    return defaultSidebarPreferences;
  }

  try {
    const raw = window.localStorage.getItem(SIDEBAR_PREFERENCES_KEY);

    if (!raw) {
      return defaultSidebarPreferences;
    }

    const parsed = JSON.parse(raw) as Partial<SidebarPreferences>;
    const openGroupIds = Array.isArray(parsed.openGroupIds)
      ? parsed.openGroupIds.filter((value): value is string => typeof value === "string")
      : defaultSidebarPreferences.openGroupIds;

    return {
      collapsed: parsed.collapsed === true,
      openGroupIds: openGroupIds.length > 0 ? openGroupIds : defaultSidebarPreferences.openGroupIds
    };
  } catch {
    return defaultSidebarPreferences;
  }
};

const writeSidebarPreferences = (preferences: SidebarPreferences) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SIDEBAR_PREFERENCES_KEY, JSON.stringify(preferences));
};

const readCompanySetupDraft = (): CompanySetupDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(COMPANY_SETUP_DRAFT_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CompanySetupDraft>;

    return {
      completed: parsed.completed === true,
      formData: {
        ...companySetupDefaultValues,
        ...(parsed.formData ?? {})
      },
      stepIndex:
        typeof parsed.stepIndex === "number"
          ? Math.min(Math.max(parsed.stepIndex, 0), companySetupSteps.length - 1)
          : 0,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null
    };
  } catch {
    return null;
  }
};

const writeCompanySetupDraft = (draft: CompanySetupDraft) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COMPANY_SETUP_DRAFT_KEY, JSON.stringify(draft));
};

const clearCompanySetupDraft = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(COMPANY_SETUP_DRAFT_KEY);
};

function LogoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="brand-glyph" aria-hidden="true">
      <path className="brand-glyph-main" d="M7.5 4.5h4.5v10h5.5v5H7.5z" />
      <rect className="brand-glyph-accent" x="14.75" y="6.25" width="2.75" height="2.75" rx="0.7" />
    </svg>
  );
}

function AppLogo() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <LogoGlyph />
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="password-wrap">
        <input type="password" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
        <button type="button" className="icon-button" aria-label="Toggle password visibility">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1.5 12s4-6.5 10.5-6.5S22.5 12 22.5 12s-4 6.5-10.5 6.5S1.5 12 1.5 12Z" />
            <circle cx="12" cy="12" r="3.25" />
          </svg>
        </button>
      </div>
    </label>
  );
}

function DashboardPreview() {
  return (
    <div className="preview-frame">
      <div className="preview-header">
        <div className="preview-brand">
          <AppLogo />
          <span>Ledgera</span>
        </div>
        <div className="preview-actions">
          <span className="preview-dot" />
          <span className="preview-dot" />
          <span className="preview-pill">Export</span>
        </div>
      </div>

      <div className="preview-body">
        <aside className="preview-sidebar">
          <span className="sidebar-chip sidebar-chip-active" />
          <span className="sidebar-chip" />
          <span className="sidebar-chip" />
          <span className="sidebar-chip" />
          <span className="sidebar-chip" />
          <span className="sidebar-chip" />
        </aside>

        <section className="preview-content">
          <div className="preview-metrics">
            <article>
              <small>Total income</small>
              <strong>$18,200</strong>
              <span>+8.4%</span>
            </article>
            <article>
              <small>Operating expenses</small>
              <strong>$18,200</strong>
              <span>-5.9%</span>
            </article>
            <article>
              <small>Gross profit</small>
              <strong>$18,200</strong>
              <span>+4.6%</span>
            </article>
          </div>

          <div className="preview-chart">
            <div className="chart-bars">
              <span style={{ height: "42%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "51%" }} />
              <span style={{ height: "88%" }} />
              <span style={{ height: "68%" }} />
              <span style={{ height: "39%" }} />
              <span style={{ height: "73%" }} />
            </div>
            <div className="chart-highlight">
              <div className="chart-tooltip">
                <strong>$12,450</strong>
                <small>Monthly revenue</small>
              </div>
            </div>
          </div>

          <div className="preview-table">
            <div className="table-row table-head">
              <span>Client</span>
              <span>Status</span>
              <span>Due</span>
            </div>
            <div className="table-row">
              <span>Brightlane Group</span>
              <span className="status status-paid">Paid</span>
              <span>May 4, 2026</span>
            </div>
            <div className="table-row">
              <span>Northpoint Ventures</span>
              <span className="status status-pending">Pending</span>
              <span>May 12, 2026</span>
            </div>
            <div className="table-row">
              <span>Salcedo Foods</span>
              <span className="status status-paid">Paid</span>
              <span>May 14, 2026</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function OnboardingPreview() {
  const steps = [
    { title: "Company profile", detail: "Business name, tax info, and fiscal defaults", active: true },
    { title: "Accounting defaults", detail: "Currency, fiscal year, and account setup" },
    { title: "Team access", detail: "Invite your accountant and staff later" }
  ];

  return (
    <div className="preview-frame preview-frame-onboarding">
      <div className="preview-header preview-header-onboarding">
        <div className="preview-brand">
          <AppLogo />
          <span>Ledgera setup</span>
        </div>
        <div className="preview-actions">
          <span className="preview-pill">Guided</span>
        </div>
      </div>

      <div className="onboarding-body">
        <section className="onboarding-intro">
          <small>After signup</small>
          <h3>Set up your workspace in a few guided steps.</h3>
          <p>Configure the essentials before you enter the full system.</p>
        </section>

        <section className="setup-progress-card">
          <div className="setup-progress-copy">
            <span>Estimated setup time</span>
            <strong>Under 10 minutes</strong>
          </div>
          <div className="setup-progress-track">
            <span className="setup-progress-fill" />
          </div>
        </section>

        <section className="setup-step-list">
          {steps.map((step, index) => (
            <article key={step.title} className={`setup-step ${step.active ? "setup-step-active" : ""}`}>
              <div className="setup-step-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="setup-step-copy">
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </div>
              <div className={`setup-step-status ${step.active ? "setup-step-status-active" : ""}`} />
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-logo">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.27-2.09 3.57-5.17 3.57-8.65Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.43 1.15-4.06 1.15-3.12 0-5.76-2.1-6.7-4.93H1.3v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.31A7.2 7.2 0 0 1 4.92 12c0-.8.14-1.58.38-2.31V6.6H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4-3.09Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.77l3.44-3.44C17.95 1.15 15.24 0 12 0A12 12 0 0 0 1.3 6.6l4 3.09c.94-2.83 3.58-4.92 6.7-4.92Z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-logo">
      <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.5h3.05V9.39c0-3.03 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24V7.9h-1.52c-1.49 0-1.96.94-1.96 1.9v2.27h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
      <path fill="#FFFFFF" d="M16.68 15.57l.53-3.5h-3.33V9.8c0-.96.47-1.9 1.96-1.9h1.52V4.93s-1.38-.24-2.69-.24c-2.75 0-4.54 1.67-4.54 4.7v2.68H7.08v3.5h3.05V24a12.2 12.2 0 0 0 3.75 0v-8.43h2.8Z" />
    </svg>
  );
}

function SocialButton({ disabled = false, label, icon }: { disabled?: boolean; label: string; icon: ReactNode }) {
  return (
    <button className="social-button" type="button" disabled={disabled}>
      <span className="social-icon">{icon}</span>
      {label}
    </button>
  );
}

function AuthTransitionOverlay({ transition }: { transition: AuthTransitionState }) {
  return (
    <div className="auth-transition" role="status" aria-live="polite" aria-label={transition.title}>
      <div className="auth-transition-card">
        <div className="auth-transition-mark">
          <AppLogo />
        </div>
        <div className="auth-transition-copy">
          <span className="auth-transition-kicker">Ledgera</span>
          <h2>{transition.title}</h2>
          <p>{transition.detail}</p>
        </div>
        <div className="auth-transition-track" aria-hidden="true">
          <span className="auth-transition-fill" />
        </div>
      </div>
    </div>
  );
}

function SetupTransitionOverlay({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="auth-transition setup-transition" role="status" aria-live="polite" aria-label={title}>
      <div className="auth-transition-card">
        <div className="auth-transition-mark">
          <AppLogo />
        </div>
        <div className="auth-transition-copy">
          <span className="auth-transition-kicker">Ledgera</span>
          <h2>{title}</h2>
          <p>{detail}</p>
        </div>
        <div className="auth-transition-track" aria-hidden="true">
          <span className="auth-transition-fill" />
        </div>
      </div>
    </div>
  );
}

function SidebarSectionIcon({ kind }: { kind: SidebarIconKind }) {
  switch (kind) {
    case "overview":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <rect x="4" y="4" width="6" height="6" rx="1.4" />
          <rect x="14" y="4" width="6" height="6" rx="1.4" />
          <rect x="4" y="14" width="6" height="6" rx="1.4" />
          <rect x="14" y="14" width="6" height="6" rx="1.4" />
        </svg>
      );
    case "masterData":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M5 7.25C5 5.73 8.13 4.5 12 4.5s7 1.23 7 2.75S15.87 10 12 10 5 8.77 5 7.25Z" />
          <path d="M5 7.25v4.25C5 13.02 8.13 14.25 12 14.25s7-1.23 7-2.75V7.25" />
          <path d="M5 11.5v5.25C5 18.27 8.13 19.5 12 19.5s7-1.23 7-2.75V11.5" />
        </svg>
      );
    case "salesBilling":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M7.5 4.5h7l4 4v11h-11Z" />
          <path d="M14.5 4.5V9h4" />
          <path d="M9 12h6" />
          <path d="M9 15.5h6" />
        </svg>
      );
    case "receivables":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M6 8.5h9.5" />
          <path d="M12.5 5l3.5 3.5-3.5 3.5" />
          <path d="M18 15.5H8.5" />
          <path d="M11.5 12l-3.5 3.5 3.5 3.5" />
        </svg>
      );
    case "accounting":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M6 5.5h10.5A1.5 1.5 0 0 1 18 7v10.5A1.5 1.5 0 0 1 16.5 19H6Z" />
          <path d="M6 5.5v13" />
          <path d="M9.5 9h5" />
          <path d="M9.5 12h5" />
          <path d="M9.5 15h3.25" />
        </svg>
      );
    case "reports":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M5 18.5h14" />
          <path d="M8 18.5v-6" />
          <path d="M12 18.5V8.5" />
          <path d="M16 18.5v-3.5" />
        </svg>
      );
    case "payroll":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <circle cx="9" cy="8.25" r="2.5" />
          <circle cx="16.5" cy="9.25" r="2" />
          <path d="M5.5 18c.46-2.6 2.28-4 5.12-4 2.7 0 4.4 1.28 4.88 4" />
          <path d="M14.5 18c.24-1.72 1.36-2.75 3.15-2.75.7 0 1.34.15 1.85.44" />
        </svg>
      );
    case "compliance":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M12 4.5 18 7v4.75c0 3.38-2.2 6.5-6 7.75-3.8-1.25-6-4.37-6-7.75V7Z" />
          <path d="m9.25 12.5 1.75 1.75 3.75-4" />
        </svg>
      );
    case "admin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-section-icon">
          <path d="M5.5 7h13" />
          <path d="M5.5 12h13" />
          <path d="M5.5 17h13" />
          <circle cx="9" cy="7" r="1.4" />
          <circle cx="15" cy="12" r="1.4" />
          <circle cx="11" cy="17" r="1.4" />
        </svg>
      );
    default:
      return null;
  }
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`dashboard-nav-chevron ${expanded ? "dashboard-nav-chevron-open" : ""}`}
    >
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-sidebar-toggle-icon">
      <path d="M5 5.5h14v13H5Z" />
      <path d={collapsed ? "M9.5 8.5 13 12l-3.5 3.5" : "M14.5 8.5 11 12l3.5 3.5"} />
      <path d="M8 5.5v13" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="setup-check-icon">
      <path d="m7.5 12.5 3 3 6-7" />
    </svg>
  );
}

function ValidationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="setup-validation-icon">
      <path d="M12 4.5 20 19.5H4Z" />
      <path d="M12 9v4.25" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function SidebarBrandControl({
  collapsed,
  onToggle
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="dashboard-brand-control"
      type="button"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
      onClick={onToggle}
    >
      <span className="dashboard-brand-control-face dashboard-brand-control-logo" aria-hidden="true">
        <span className="brand-mark dashboard-brand-control-mark">
          <LogoGlyph />
        </span>
      </span>

      <span className="dashboard-brand-control-face dashboard-brand-control-toggle" aria-hidden="true">
        <span className="brand-mark dashboard-brand-control-mark dashboard-brand-control-mark-toggle">
          <SidebarToggleIcon collapsed={collapsed} />
        </span>
      </span>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="utility-icon">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="utility-icon">
      <path d="M12 4.5a4.5 4.5 0 0 0-4.5 4.5v2.08c0 .9-.27 1.78-.78 2.52L5 16h14l-1.72-2.4a4.38 4.38 0 0 1-.78-2.52V9A4.5 4.5 0 0 0 12 4.5Z" />
      <path d="M10 18a2.25 2.25 0 0 0 4 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="utility-icon">
      <path d="M12 8.25A3.75 3.75 0 1 0 12 15.75A3.75 3.75 0 1 0 12 8.25Z" />
      <path d="M19.24 15.3l1.05 1.82-1.59 2.76-2.1-.22a7.84 7.84 0 0 1-1.52.88l-.82 1.95H11.1l-.82-1.95a7.84 7.84 0 0 1-1.52-.88l-2.1.22-1.59-2.76 1.05-1.82a7.79 7.79 0 0 1 0-1.76L5.07 11.7l1.59-2.76 2.1.22c.48-.37.99-.67 1.52-.88l.82-1.95h3.16l.82 1.95c.53.21 1.04.51 1.52.88l2.1-.22 1.59 2.76-1.05 1.82c.06.29.1.59.1.88s-.04.59-.1.88Z" />
    </svg>
  );
}

function AvatarChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`dashboard-avatar-chevron ${open ? "dashboard-avatar-chevron-open" : ""}`}>
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

function UserCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-item-icon">
      <circle cx="12" cy="8.25" r="2.75" />
      <path d="M6.5 18c.58-3.02 2.6-4.75 5.5-4.75 2.9 0 4.92 1.73 5.5 4.75" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-item-icon">
      <path d="M5.5 7.5h13" />
      <path d="M5.5 16.5h13" />
      <circle cx="9" cy="7.5" r="1.5" />
      <circle cx="15" cy="16.5" r="1.5" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-item-icon">
      <path d="M10 6H7.5A1.5 1.5 0 0 0 6 7.5v9A1.5 1.5 0 0 0 7.5 18H10" />
      <path d="M13 8.5 16.5 12 13 15.5" />
      <path d="M9.5 12h7" />
    </svg>
  );
}

function RefreshCcwIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-item-icon">
      <path d="M20 6.5v5h-5" />
      <path d="M19.2 11A7.5 7.5 0 1 1 12 4.5c2.1 0 4.04.85 5.45 2.25L20 9.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chart-close-icon">
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function RowOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chart-row-open-icon">
      <path d="M9 6.5 14.5 12 9 17.5" />
    </svg>
  );
}

function CompanyProfileNavIcon({ kind }: { kind: ProfileTabId }) {
  switch (kind) {
    case "company":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="company-profile-nav-icon-svg">
          <path d="M5.5 18.5V8.75L12 5.5l6.5 3.25v9.75" />
          <path d="M9 18.5v-4.75h6v4.75" />
        </svg>
      );
    case "tax":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="company-profile-nav-icon-svg">
          <path d="M6.5 5.5h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" />
          <path d="M8.5 9h7" />
          <path d="M8.5 12h7" />
          <path d="M8.5 15h4.5" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="company-profile-nav-icon-svg">
          <path d="M6.5 8.25A5.5 5.5 0 1 1 17.5 8.25A5.5 5.5 0 1 1 6.5 8.25Z" />
          <path d="M12 13.75v5" />
          <path d="M9 16.75h6" />
        </svg>
      );
    case "defaults":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="company-profile-nav-icon-svg">
          <path d="M7 6.5h10" />
          <path d="M7 12h10" />
          <path d="M7 17.5h10" />
          <circle cx="9.25" cy="6.5" r="1.25" />
          <circle cx="14.75" cy="12" r="1.25" />
          <circle cx="11.25" cy="17.5" r="1.25" />
        </svg>
      );
    case "documents":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="company-profile-nav-icon-svg">
          <path d="M8 4.75h6.5L18 8.25v10A1.5 1.5 0 0 1 16.5 19.75h-8A1.5 1.5 0 0 1 7 18.25v-12A1.5 1.5 0 0 1 8.5 4.75Z" />
          <path d="M14.5 4.75v3.5H18" />
          <path d="M9.5 12h5" />
          <path d="M9.5 15h5" />
        </svg>
      );
  }
}

function UtilityButton({
  children,
  hasIndicator = false,
  label
}: {
  children: ReactNode;
  hasIndicator?: boolean;
  label: string;
}) {
  return (
    <button className="utility-button" type="button" aria-label={label}>
      {children}
      {hasIndicator ? <span className="utility-indicator" /> : null}
    </button>
  );
}

const sidebarSections: SidebarSection[] = [
  {
    id: "navigation",
    title: "Navigation",
    items: [
      {
        id: "overview",
        icon: "overview",
        label: "Overview",
        children: [
          { label: "Dashboard" },
          { label: "Notifications" }
        ]
      }
    ]
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      {
        id: "master-data",
        icon: "masterData",
        label: "Master Data",
        children: [
          { label: "Clients" },
          { label: "Suppliers" },
          { label: "Employees" },
          { id: "chart-of-accounts", label: "Chart of Accounts" }
        ]
      },
      {
        id: "sales-billing",
        icon: "salesBilling",
        label: "Sales & Billing",
        children: [
          { label: "Client Packages" },
          { label: "Invoices" },
          { label: "Acknowledgment Receipts" }
        ]
      },
      {
        id: "receivables-payables",
        icon: "receivables",
        label: "Receivables & Payables",
        children: [
          { label: "Accounts Receivable" },
          { label: "Accounts Payable" },
          { label: "Aging Reports" }
        ]
      },
      {
        id: "accounting",
        icon: "accounting",
        label: "Accounting",
        children: [
          { label: "General Journal Entry" },
          { label: "General Journal" },
          { label: "Cash Receipts Journal" },
          { label: "Cash Disbursements Journal" },
          { label: "Sales Journal" },
          { label: "Purchase Journal" }
        ]
      },
      {
        id: "reports",
        icon: "reports",
        label: "Reports",
        children: [
          { label: "Trial Balance" },
          { label: "Income Statement" },
          { label: "Balance Sheet" },
          { label: "Cash Flow Statement" },
          { label: "Exports" }
        ]
      },
      {
        id: "payroll",
        icon: "payroll",
        label: "Payroll",
        children: [
          { label: "Payroll Runs" },
          { label: "Payslips" }
        ]
      },
      {
        id: "bir-compliance",
        icon: "compliance",
        label: "BIR Compliance",
        children: [
          { label: "BIR Reports" },
          { label: "VAT" },
          { label: "Withholding Taxes" }
        ]
      }
    ]
  },
  {
    id: "administration",
    title: "Administration",
    items: [
      {
        id: "admin",
        icon: "admin",
        label: "Admin",
        children: [
          { id: "company-profile", label: "Company Profile" },
          { id: "users-roles", label: "Users & Roles" },
          { id: "system-settings", label: "System Settings" },
          { id: "audit-trail", label: "Audit Trail" },
          { id: "customization", label: "Customization" },
          { id: "contribution-tables", label: "Contribution Tables" }
        ]
      }
    ]
  }
];

function SidebarNavigation({
  activeWorkspaceView,
  collapsed,
  onSelectWorkspaceView,
  onExpandGroup,
  onToggleGroup,
  openGroupIds
}: {
  activeWorkspaceView: WorkspaceView;
  collapsed: boolean;
  onSelectWorkspaceView: (view: WorkspaceView) => void;
  onExpandGroup: (groupId: string, sectionId: string) => void;
  onToggleGroup: (groupId: string, sectionId: string) => void;
  openGroupIds: string[];
}) {
  return (
    <div className="dashboard-sidebar-shell">
      {sidebarSections.map((section) => (
        <section
          key={section.id}
          className={`dashboard-sidebar-group ${collapsed ? "dashboard-sidebar-group-collapsed" : ""}`}
          aria-label={section.title}
        >
          {collapsed ? null : <p className="dashboard-nav-heading">{section.title}</p>}

          <div className={`dashboard-nav-tree ${collapsed ? "dashboard-nav-tree-collapsed" : ""}`}>
            {section.items.map((item) => {
              const isOpen = openGroupIds.includes(item.id);
              const isActive =
                item.active ||
                item.children?.some((child) => child.active || child.id === activeWorkspaceView) ||
                false;

              if (collapsed) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`dashboard-icon-rail-button ${isActive ? "dashboard-icon-rail-button-active" : ""}`}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => onExpandGroup(item.id, section.id)}
                  >
                    <SidebarSectionIcon kind={item.icon} />
                  </button>
                );
              }

              return item.children ? (
                <div key={item.id} className="dashboard-nav-cluster">
                  <button
                    type="button"
                    className={`dashboard-nav-parent-button ${
                      isActive ? "dashboard-nav-parent-button-active" : ""
                    } ${isOpen ? "dashboard-nav-parent-button-open" : ""}`}
                    aria-expanded={isOpen}
                    onClick={() => onToggleGroup(item.id, section.id)}
                  >
                    <span className="dashboard-nav-parent-main">
                      <span className="dashboard-nav-parent-icon">
                        <SidebarSectionIcon kind={item.icon} />
                      </span>
                      <span className="dashboard-nav-parent">{item.label}</span>
                    </span>
                    <ChevronIcon expanded={isOpen} />
                  </button>

                  <div className={`dashboard-nav-children ${isOpen ? "dashboard-nav-children-open" : ""}`}>
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        type="button"
                        className={`dashboard-nav-child ${
                          child.active || child.id === activeWorkspaceView ? "dashboard-nav-child-active" : ""
                        }`}
                        aria-current={child.active || child.id === activeWorkspaceView ? "page" : undefined}
                        onClick={() => {
                          if (child.id) {
                            onSelectWorkspaceView(child.id);
                          }
                        }}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  className={`dashboard-nav-item ${item.active ? "dashboard-nav-item-active" : ""}`}
                  aria-current={item.active ? "page" : undefined}
                >
                  <span className="dashboard-nav-parent-main">
                    <span className="dashboard-nav-parent-icon">
                      <SidebarSectionIcon kind={item.icon} />
                    </span>
                    <span className="dashboard-nav-parent">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function SetupField({
  children,
  error,
  helper,
  invalid = false,
  label,
  labelHint,
  required = false
}: {
  children: ReactNode;
  error?: string;
  helper?: string;
  invalid?: boolean;
  label: string;
  labelHint?: string;
  required?: boolean;
}) {
  return (
    <div className={`setup-field ${invalid ? "setup-field-invalid" : ""}`}>
      <span className="setup-field-label">
        {label}
        {required ? <span className="setup-required">*</span> : null}
        {labelHint ? <span className="setup-field-hint">{labelHint}</span> : null}
      </span>
      {children}
      {error ? <span className="setup-field-note setup-field-note-error">{error}</span> : null}
      {!error && helper ? <span className="setup-field-note">{helper}</span> : null}
    </div>
  );
}

function SelectChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`setup-select-chevron ${open ? "setup-select-chevron-open" : ""}`}>
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="setup-date-icon">
      <path d="M7 4.75V7" />
      <path d="M17 4.75V7" />
      <path d="M4.75 9.25h14.5" />
      <path d="M6.75 6.25h10.5A1.5 1.5 0 0 1 18.75 7.75v9.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

function CalendarNavIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="setup-date-nav-icon">
      <path d={direction === "previous" ? "m14 7-5 5 5 5" : "m10 7 5 5-5 5"} />
    </svg>
  );
}

function CustomSelect({
  ariaLabel,
  disabled = false,
  invalid = false,
  onChange,
  options,
  value
}: {
  ariaLabel: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  );
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    setHighlightedIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (disabled && open) {
      setOpen(false);
    }
  }, [disabled, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current || !(event.target instanceof Node)) {
        return;
      }

      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePlacement = () => {
      if (!containerRef.current) {
        return;
      }

      const triggerRect = containerRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 240;
      const gap = 8;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const shouldOpenTop = spaceBelow < menuHeight + gap && spaceAbove > spaceBelow;

      setPlacement(shouldOpenTop ? "top" : "bottom");
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open]);

  const toggleOpen = () => {
    setOpen((current) => !current);
    setHighlightedIndex(selectedIndex);
  };

  const commitSelection = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const moveHighlight = (direction: 1 | -1) => {
    setOpen(true);
    setHighlightedIndex((current) => {
      const nextIndex = current + direction;

      if (nextIndex < 0) {
        return options.length - 1;
      }

      if (nextIndex >= options.length) {
        return 0;
      }

      return nextIndex;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`setup-select ${open ? "setup-select-open" : ""} ${invalid ? "setup-select-invalid" : ""} ${
        disabled ? "setup-select-disabled" : ""
      } ${
        placement === "top" ? "setup-select-open-top" : "setup-select-open-bottom"
      }`}
    >
      <button
        type="button"
        className="setup-select-trigger"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={toggleOpen}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveHighlight(1);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveHighlight(-1);
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (open) {
              commitSelection(options[highlightedIndex]?.value ?? value);
            } else {
              setOpen(true);
            }
          }
        }}
      >
        <span className="setup-select-value">{selectedOption?.label ?? ""}</span>
        <SelectChevronIcon open={open} />
      </button>

      {open ? (
        <div ref={menuRef} className="setup-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`setup-select-option ${isSelected ? "setup-select-option-selected" : ""} ${
                  isHighlighted ? "setup-select-option-highlighted" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => commitSelection(option.value)}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <span className="setup-select-option-check" aria-hidden="true">
                    <CheckIcon />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function CustomDatePicker({
  ariaLabel,
  invalid = false,
  onChange,
  placeholder = "Select date",
  value
}: {
  ariaLabel: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = parseIsoDate(value);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => getMonthStart(selectedDate ?? new Date()));
  const calendarDays = getCalendarDays(visibleMonth, value);

  useEffect(() => {
    setVisibleMonth(getMonthStart(selectedDate ?? new Date()));
  }, [selectedDate?.getFullYear(), selectedDate?.getMonth(), value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current || !(event.target instanceof Node)) {
        return;
      }

      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePlacement = () => {
      if (!containerRef.current) {
        return;
      }

      const triggerRect = containerRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 318;
      const gap = 8;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const shouldOpenTop = spaceBelow < menuHeight + gap && spaceAbove > spaceBelow;

      setPlacement(shouldOpenTop ? "top" : "bottom");
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open]);

  const openCalendar = () => {
    setVisibleMonth(getMonthStart(selectedDate ?? new Date()));
    setOpen(true);
  };

  const toggleCalendar = () => {
    if (open) {
      setOpen(false);
      return;
    }

    openCalendar();
  };

  const commitDate = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const goToMonth = (offset: number) => {
    setVisibleMonth((current) => addCalendarMonths(current, offset));
  };

  const selectToday = () => {
    const today = new Date();
    setVisibleMonth(getMonthStart(today));
    commitDate(formatIsoDate(today));
  };

  return (
    <div
      ref={containerRef}
      className={`setup-date-picker ${open ? "setup-date-open" : ""} ${invalid ? "setup-date-invalid" : ""} ${
        placement === "top" ? "setup-date-open-top" : "setup-date-open-bottom"
      }`}
    >
      <button
        type="button"
        className="setup-date-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={toggleCalendar}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            openCalendar();
          }
        }}
      >
        <span className={`setup-date-value ${selectedDate ? "" : "setup-date-value-placeholder"}`}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <CalendarIcon />
      </button>

      {open ? (
        <div ref={menuRef} className="setup-date-menu" role="dialog" aria-label={ariaLabel}>
          <header className="setup-date-header">
            <strong className="setup-date-month">
              {calendarMonthLabels[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </strong>

            <div className="setup-date-nav">
              <button
                type="button"
                className="setup-date-nav-button"
                aria-label="Previous month"
                onClick={() => goToMonth(-1)}
              >
                <CalendarNavIcon direction="previous" />
              </button>
              <button type="button" className="setup-date-nav-button" aria-label="Next month" onClick={() => goToMonth(1)}>
                <CalendarNavIcon direction="next" />
              </button>
            </div>
          </header>

          <div className="setup-date-weekdays" aria-hidden="true">
            {calendarWeekdays.map((weekday) => (
              <span key={weekday} className="setup-date-weekday">
                {weekday}
              </span>
            ))}
          </div>

          <div className="setup-date-grid">
            {calendarDays.map((day) => (
              <button
                key={day.isoValue}
                type="button"
                className={`setup-date-day ${day.isSelected ? "setup-date-day-selected" : ""} ${
                  !day.inCurrentMonth ? "setup-date-day-muted" : ""
                } ${day.isToday ? "setup-date-day-today" : ""}`}
                aria-pressed={day.isSelected}
                aria-current={day.isToday ? "date" : undefined}
                onClick={() => commitDate(day.isoValue)}
              >
                {day.dayNumber}
              </button>
            ))}
          </div>

          <footer className="setup-date-footer">
            <button type="button" className="setup-date-footer-button" onClick={() => commitDate("")} disabled={!value}>
              Clear
            </button>
            <button type="button" className="setup-date-footer-button setup-date-footer-button-primary" onClick={selectToday}>
              Today
            </button>
          </footer>
        </div>
      ) : null}
    </div>
  );
}

function CompanySetupScreen({
  activeWorkspaceView,
  onActivateWorkspaceView,
  onSetupModeChange
}: {
  activeWorkspaceView: WorkspaceView;
  onActivateWorkspaceView: (view: WorkspaceView) => void;
  onSetupModeChange: (isSetupMode: boolean) => void;
}) {
  const initialDraftRef = useRef<CompanySetupDraft | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const stepStageContentRef = useRef<HTMLElement | null>(null);
  const autoSaveReadyRef = useRef(false);
  const skipNextAutoSaveRef = useRef(false);
  const logoDragDepthRef = useRef(0);
  const stepTransitionTimeoutRef = useRef<number | null>(null);
  const setupTransitionTimeoutRef = useRef<number | null>(null);

  if (initialDraftRef.current === null) {
    initialDraftRef.current = readCompanySetupDraft();
  }

  const [formData, setFormData] = useState<CompanySetupFormData>(
    () => initialDraftRef.current?.formData ?? companySetupDefaultValues
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => initialDraftRef.current?.stepIndex ?? 0);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(() => initialDraftRef.current?.updatedAt ?? null);
  const [validatedStepIds, setValidatedStepIds] = useState<string[]>([]);
  const [setupComplete, setSetupComplete] = useState<boolean>(() => initialDraftRef.current?.completed ?? false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);
  const [stepTransitionState, setStepTransitionState] = useState<"idle" | "exiting" | "entering">("idle");
  const [stepTransitionDirection, setStepTransitionDirection] = useState<"forward" | "backward">("forward");
  const [stepperVisualIndex, setStepperVisualIndex] = useState<number>(() => initialDraftRef.current?.stepIndex ?? 0);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTabId>("company");
  const [stepStageHeight, setStepStageHeight] = useState<number | null>(null);
  const [autoSaveState, setAutoSaveState] = useState<"idle" | "saving" | "saved">(
    () => (initialDraftRef.current?.updatedAt ? "saved" : "idle")
  );
  const [setupTransition, setSetupTransition] = useState<{ detail: string; title: string } | null>(null);

  const currentStep = companySetupSteps[currentStepIndex];
  const currentValidationVisible = validatedStepIds.includes(currentStep.id);

  useEffect(() => {
    onSetupModeChange(!setupComplete);
  }, [onSetupModeChange, setupComplete]);

  useEffect(
    () => () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    },
    [logoPreviewUrl]
  );

  useEffect(
    () => () => {
      if (stepTransitionTimeoutRef.current !== null) {
        window.clearTimeout(stepTransitionTimeoutRef.current);
      }

      if (setupTransitionTimeoutRef.current !== null) {
        window.clearTimeout(setupTransitionTimeoutRef.current);
      }
    },
    []
  );

  useLayoutEffect(() => {
    if (!stepStageContentRef.current) {
      return;
    }

    if (stepTransitionState === "idle") {
      setStepStageHeight(null);
      return;
    }

    const nextHeight = stepStageContentRef.current.offsetHeight;

    if (nextHeight > 0) {
      setStepStageHeight(nextHeight);
    }
  }, [currentStepIndex, stepTransitionState]);

  useEffect(() => {
    if (!autoSaveReadyRef.current) {
      autoSaveReadyRef.current = true;
      return;
    }

    if (skipNextAutoSaveRef.current || setupTransition) {
      skipNextAutoSaveRef.current = false;
      return;
    }

    setAutoSaveState("saving");
    const timeoutId = window.setTimeout(() => {
      persistDraft();
      setAutoSaveState("saved");
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, formData, setupComplete, setupTransition]);

  const isFilled = (field: CompanySetupFieldKey) => formData[field].trim().length > 0;
  const formatValue = (value: string) => (value.trim().length > 0 ? value : "Not added yet");
  const formatDateValue = (value: string) => {
    const parsedDate = parseIsoDate(value);
    return parsedDate ? formatDisplayDate(parsedDate) : "Not added yet";
  };
  const isStepTransitioning = stepTransitionState !== "idle";
  const isFinalizingSetup = Boolean(setupTransition);

  const missingCurrentFields = currentStep.requiredFields.filter((field) => !isFilled(field));
  const completedCurrentRequired = currentStep.requiredFields.filter((field) => isFilled(field)).length;
  const completedRequiredCount = companySetupRequiredFields.filter((field) => isFilled(field)).length;
  const completionPercent = Math.round((completedRequiredCount / companySetupRequiredFields.length) * 100);

  const persistDraft = (nextStepIndex = currentStepIndex, nextCompleted = setupComplete) => {
    const updatedAt = new Date().toISOString();

    writeCompanySetupDraft({
      completed: nextCompleted,
      formData,
      stepIndex: nextStepIndex,
      updatedAt
    });

    setDraftSavedAt(updatedAt);
  };

  const clearStepTransitionTimeout = () => {
    if (stepTransitionTimeoutRef.current !== null) {
      window.clearTimeout(stepTransitionTimeoutRef.current);
      stepTransitionTimeoutRef.current = null;
    }
  };

  const markStepValidated = () => {
    setValidatedStepIds((current) => (current.includes(currentStep.id) ? current : [...current, currentStep.id]));
  };

  const updateField = (field: CompanySetupFieldKey, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const openLogoPicker = () => {
    logoInputRef.current?.click();
  };

  const updateLogoFile = (file: File) => {
    setLogoPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return URL.createObjectURL(file);
    });
    setLogoFileName(file.name);
    setIsLogoDragActive(false);
    logoDragDepthRef.current = 0;
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateLogoFile(file);
    event.target.value = "";
  };

  const handleLogoDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) {
      return;
    }

    event.preventDefault();
    logoDragDepthRef.current += 1;
    setIsLogoDragActive(true);
  };

  const handleLogoDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    if (!isLogoDragActive) {
      setIsLogoDragActive(true);
    }
  };

  const handleLogoDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) {
      return;
    }

    event.preventDefault();
    logoDragDepthRef.current = Math.max(logoDragDepthRef.current - 1, 0);

    if (logoDragDepthRef.current === 0) {
      setIsLogoDragActive(false);
    }
  };

  const handleLogoDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.files.length) {
      return;
    }

    event.preventDefault();
    logoDragDepthRef.current = 0;
    setIsLogoDragActive(false);
    const [file] = Array.from(event.dataTransfer.files);

    if (file) {
      updateLogoFile(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return null;
    });
    setLogoFileName("");
    setIsLogoDragActive(false);
    logoDragDepthRef.current = 0;
  };

  const startStepTransition = (nextStepIndex: number, direction: "forward" | "backward") => {
    if (isStepTransitioning || nextStepIndex === currentStepIndex) {
      return;
    }

    const currentHeight = stepStageContentRef.current?.offsetHeight ?? 0;

    clearStepTransitionTimeout();
    if (currentHeight > 0) {
      setStepStageHeight(currentHeight);
    }
    setStepTransitionDirection(direction);
    setStepperVisualIndex(nextStepIndex);
    setStepTransitionState("exiting");

    stepTransitionTimeoutRef.current = window.setTimeout(() => {
      setCurrentStepIndex(nextStepIndex);
      setStepTransitionState("entering");

      stepTransitionTimeoutRef.current = window.setTimeout(() => {
        setStepTransitionState("idle");
        stepTransitionTimeoutRef.current = null;
      }, SETUP_STEP_TRANSITION_MS);
    }, SETUP_STEP_TRANSITION_MS);
  };

  const handleContinue = () => {
    if (isStepTransitioning || isFinalizingSetup) {
      return;
    }

    if (missingCurrentFields.length > 0) {
      markStepValidated();
      return;
    }

    if (currentStepIndex === companySetupSteps.length - 1) {
      skipNextAutoSaveRef.current = true;
      persistDraft(currentStepIndex, true);
      setAutoSaveState("saved");
      setSetupTransition({
        detail: "Creating your default chart and unlocking your workspace.",
        title: "Finalizing your workspace"
      });
      setupTransitionTimeoutRef.current = window.setTimeout(() => {
        setupTransitionTimeoutRef.current = null;
        setSetupComplete(true);
        setSetupTransition(null);
        onActivateWorkspaceView("chart-of-accounts");
      }, 1050);
      return;
    }

    const nextStepIndex = currentStepIndex + 1;
    startStepTransition(nextStepIndex, "forward");
  };

  const handleBack = () => {
    if (currentStepIndex === 0 || isStepTransitioning) {
      return;
    }

    startStepTransition(currentStepIndex - 1, "backward");
  };

  const handleProfileSave = () => {
    persistDraft();
    setAutoSaveState("saved");
  };

  const getFieldError = (field: CompanySetupFieldKey) =>
    currentValidationVisible && missingCurrentFields.includes(field) ? "Required before you continue." : undefined;

  const savedLabel = draftSavedAt
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date(draftSavedAt))
    : null;

  const autoSaveLabel =
    autoSaveState === "saving"
      ? "Saving changes..."
      : savedLabel
        ? `All changes saved ${savedLabel}.`
        : "Changes save automatically.";
  const profileAutoSaveLabel =
    autoSaveState === "saving" ? "Saving..." : savedLabel ? `Saved ${savedLabel}.` : "Saved automatically.";
  const autoSaveToneClass = autoSaveState === "saving" ? "setup-page-note-saving" : "setup-page-note-saved";
  const stepTransitionClass =
    stepTransitionState === "idle" ? "" : `setup-step-stage-${stepTransitionState} setup-step-stage-${stepTransitionDirection}`;

  const profileTabs: Array<{
    description: string;
    id: ProfileTabId;
    icon: ProfileTabId;
    label: string;
  }> = [
    { id: "company", icon: "company", label: "Your company", description: "Names, logo, and legal company identity" },
    { id: "tax", icon: "tax", label: "Tax & compliance", description: "Registration, VAT, and BIR-facing details" },
    { id: "contact", icon: "contact", label: "Address & contact", description: "Business address and company contact details" },
    { id: "defaults", icon: "defaults", label: "Accounting defaults", description: "Currency, fiscal year, and bookkeeping rules" },
    { id: "documents", icon: "documents", label: "Documents", description: "Company files and verification records" }
  ];
  const activeProfileTabConfig = profileTabs.find((tab) => tab.id === activeProfileTab) ?? profileTabs[0];

  let stepBody: ReactNode;

  if (currentStep.id === "identity") {
    stepBody = (
      <>
        <input ref={logoInputRef} type="file" accept="image/*" className="setup-logo-input" onChange={handleLogoChange} />

        <div
          className={`setup-logo-block ${isLogoDragActive ? "setup-logo-block-active" : ""} ${
            logoPreviewUrl ? "setup-logo-block-filled" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={openLogoPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openLogoPicker();
            }
          }}
          onDragEnter={handleLogoDragEnter}
          onDragOver={handleLogoDragOver}
          onDragLeave={handleLogoDragLeave}
          onDrop={handleLogoDrop}
        >
          <div className={`setup-logo-upload ${logoPreviewUrl ? "setup-logo-upload-has-image" : ""}`}>
            {logoPreviewUrl ? <img src={logoPreviewUrl} alt="Company logo preview" className="setup-logo-image" /> : <AppLogo />}
          </div>

          <div className="setup-logo-copy">
            <strong>Company logo</strong>
            <p>{logoPreviewUrl ? "Drag a new logo here or click to replace it." : "Drop your logo here or click to upload."}</p>
            <span className="setup-logo-meta">
              {logoFileName ? logoFileName : "PNG, JPG, or SVG - Optional for this step"}
            </span>
          </div>

          <div className="setup-logo-actions">
            <button
              type="button"
              className="setup-upload-button"
              onClick={(event) => {
                event.stopPropagation();
                openLogoPicker();
              }}
            >
              {logoPreviewUrl ? "Replace" : "Upload"}
            </button>

            {logoPreviewUrl ? (
              <button
                type="button"
                className="setup-upload-button setup-upload-button-ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveLogo();
                }}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>

        <div className="setup-grid">
          <SetupField
            label="Workspace name"
            required
            invalid={!!getFieldError("workspaceName")}
            error={getFieldError("workspaceName")}
          >
            <input type="text" value={formData.workspaceName} onChange={(event) => updateField("workspaceName", event.target.value)} />
          </SetupField>

          <SetupField
            label="Registered business name"
            required
            invalid={!!getFieldError("registeredBusinessName")}
            error={getFieldError("registeredBusinessName")}
          >
            <input
              type="text"
              value={formData.registeredBusinessName}
              onChange={(event) => updateField("registeredBusinessName", event.target.value)}
            />
          </SetupField>

          <SetupField
            label="Entity type"
            labelHint="Legal structure"
            required
            invalid={!!getFieldError("entityType")}
            error={getFieldError("entityType")}
          >
            <CustomSelect
              ariaLabel="Entity type"
              invalid={!!getFieldError("entityType")}
              value={formData.entityType}
              options={entityTypeOptions}
              onChange={(nextValue) => updateField("entityType", nextValue)}
            />
          </SetupField>
        </div>

      </>
    );
  } else if (currentStep.id === "tax") {
    stepBody = (
      <>
        <div className="setup-grid">
          <SetupField
            label="TIN"
            required
            invalid={!!getFieldError("tin")}
            error={getFieldError("tin")}
            helper="Use your registered TIN. Example: 000-000-000-000."
          >
            <input type="text" value={formData.tin} onChange={(event) => updateField("tin", event.target.value)} placeholder="000-000-000-000" />
          </SetupField>

          <SetupField label="RDO code" helper="Optional for now. Example: 044.">
            <input type="text" value={formData.rdoCode} onChange={(event) => updateField("rdoCode", event.target.value)} placeholder="e.g. 044" />
          </SetupField>

          <SetupField
            label="VAT status"
            labelHint="Affects tax calculations"
            required
            invalid={!!getFieldError("vatStatus")}
            error={getFieldError("vatStatus")}
          >
            <CustomSelect
              ariaLabel="VAT status"
              invalid={!!getFieldError("vatStatus")}
              value={formData.vatStatus}
              options={vatStatusOptions}
              onChange={(nextValue) => updateField("vatStatus", nextValue)}
            />
          </SetupField>

          <SetupField label="Registration date">
            <CustomDatePicker
              ariaLabel="Registration date"
              value={formData.registrationDate}
              placeholder="Select a registration date"
              onChange={(nextValue) => updateField("registrationDate", nextValue)}
            />
          </SetupField>
        </div>
      </>
    );
  } else if (currentStep.id === "contact") {
    stepBody = (
      <>
        <div className="setup-grid">
          <SetupField
            label="Business email"
            labelHint="Shown on documents"
            required
            invalid={!!getFieldError("businessEmail")}
            error={getFieldError("businessEmail")}
          >
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(event) => updateField("businessEmail", event.target.value)}
            />
          </SetupField>

          <SetupField label="Contact number">
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(event) => updateField("contactNumber", event.target.value)}
              placeholder="+63 900 000 0000"
            />
          </SetupField>

          <div className="setup-grid-full">
            <SetupField
              label="Address line 1"
              required
              invalid={!!getFieldError("addressLine1")}
              error={getFieldError("addressLine1")}
            >
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(event) => updateField("addressLine1", event.target.value)}
                placeholder="Street number, building, subdivision"
              />
            </SetupField>
          </div>

          <SetupField
            label="City / Municipality"
            required
            invalid={!!getFieldError("city")}
            error={getFieldError("city")}
          >
            <input type="text" value={formData.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City / Municipality" />
          </SetupField>

          <SetupField
            label="Province / State"
            required
            invalid={!!getFieldError("province")}
            error={getFieldError("province")}
          >
            <input
              type="text"
              value={formData.province}
              onChange={(event) => updateField("province", event.target.value)}
              placeholder="Province / State"
            />
          </SetupField>

          <SetupField label="Postal code">
            <input
              type="text"
              value={formData.postalCode}
              onChange={(event) => updateField("postalCode", event.target.value)}
              placeholder="Postal code"
            />
          </SetupField>

          <SetupField
            label="Country"
            required
            invalid={!!getFieldError("country")}
            error={getFieldError("country")}
          >
            <input type="text" value={formData.country} onChange={(event) => updateField("country", event.target.value)} />
          </SetupField>
        </div>

        <p className="setup-inline-note">Optional contact details can be added later from Company Profile.</p>
      </>
    );
  } else {
    stepBody = (
      <div className="setup-grid">
        <SetupField
          label="Base currency"
          required
          invalid={!!getFieldError("baseCurrency")}
          error={getFieldError("baseCurrency")}
        >
          <CustomSelect
            ariaLabel="Base currency"
            invalid={!!getFieldError("baseCurrency")}
            value={formData.baseCurrency}
            options={currencyOptions}
            onChange={(nextValue) => updateField("baseCurrency", nextValue)}
          />
        </SetupField>

          <SetupField
            label="Fiscal year start month"
            labelHint="Groups reports"
            required
            invalid={!!getFieldError("fiscalYearStart")}
            error={getFieldError("fiscalYearStart")}
          >
          <CustomSelect
            ariaLabel="Fiscal year start month"
            invalid={!!getFieldError("fiscalYearStart")}
            value={formData.fiscalYearStart}
            options={fiscalYearOptions}
            onChange={(nextValue) => updateField("fiscalYearStart", nextValue)}
          />
        </SetupField>

        <SetupField
          label="Bookkeeping method"
          required
          invalid={!!getFieldError("bookkeepingMethod")}
          error={getFieldError("bookkeepingMethod")}
        >
          <CustomSelect
            ariaLabel="Bookkeeping method"
            invalid={!!getFieldError("bookkeepingMethod")}
            value={formData.bookkeepingMethod}
            options={bookkeepingMethodOptions}
            onChange={(nextValue) => updateField("bookkeepingMethod", nextValue)}
          />
        </SetupField>

          <SetupField
            label="Timezone"
            labelHint="Used for dated records"
            required
            invalid={!!getFieldError("timezone")}
            error={getFieldError("timezone")}
          >
          <CustomSelect
            ariaLabel="Timezone"
            invalid={!!getFieldError("timezone")}
            value={formData.timezone}
            options={timezoneOptions}
            onChange={(nextValue) => updateField("timezone", nextValue)}
          />
        </SetupField>
      </div>
    );
  }

  let profileTabContent: ReactNode;

  if (activeProfileTab === "company") {
    profileTabContent = (
      <>
        <section className="company-profile-section-card">
          <input ref={logoInputRef} type="file" accept="image/*" className="setup-logo-input" onChange={handleLogoChange} />

          <div
            className={`setup-logo-block company-profile-logo-block ${isLogoDragActive ? "setup-logo-block-active" : ""} ${
              logoPreviewUrl ? "setup-logo-block-filled" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={openLogoPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLogoPicker();
              }
            }}
            onDragEnter={handleLogoDragEnter}
            onDragOver={handleLogoDragOver}
            onDragLeave={handleLogoDragLeave}
            onDrop={handleLogoDrop}
          >
            <div className={`setup-logo-upload ${logoPreviewUrl ? "setup-logo-upload-has-image" : ""}`}>
              {logoPreviewUrl ? <img src={logoPreviewUrl} alt="Company logo preview" className="setup-logo-image" /> : <AppLogo />}
            </div>

            <div className="setup-logo-copy">
              <strong>Company mark</strong>
              <p>{logoPreviewUrl ? "Drag a new logo here or click to replace it." : "Drop your logo here or click to upload."}</p>
              <span className="setup-logo-meta">{logoFileName ? logoFileName : "PNG, JPG, or SVG"}</span>
            </div>

            <div className="setup-logo-actions">
              <button
                type="button"
                className="setup-upload-button"
                onClick={(event) => {
                  event.stopPropagation();
                  openLogoPicker();
                }}
              >
                {logoPreviewUrl ? "Replace" : "Upload"}
              </button>

              {logoPreviewUrl ? (
                <button
                  type="button"
                  className="setup-upload-button setup-upload-button-ghost"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveLogo();
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>

          <div className="setup-grid">
            <SetupField label="Workspace name" required>
              <input type="text" value={formData.workspaceName} onChange={(event) => updateField("workspaceName", event.target.value)} />
            </SetupField>

            <SetupField label="Registered business name" required>
              <input
                type="text"
                value={formData.registeredBusinessName}
                onChange={(event) => updateField("registeredBusinessName", event.target.value)}
              />
            </SetupField>

            <SetupField label="Entity type" labelHint="Legal structure" required>
              <CustomSelect
                ariaLabel="Entity type"
                value={formData.entityType}
                options={entityTypeOptions}
                onChange={(nextValue) => updateField("entityType", nextValue)}
              />
            </SetupField>
          </div>
        </section>
      </>
    );
  } else if (activeProfileTab === "tax") {
    profileTabContent = (
      <>
        <section className="company-profile-section-card">
          <div className="setup-grid">
            <SetupField label="TIN" helper="Use your registered TIN.">
              <input type="text" value={formData.tin} onChange={(event) => updateField("tin", event.target.value)} placeholder="000-000-000-000" />
            </SetupField>

            <SetupField label="RDO code" helper="Optional when you are still gathering records.">
              <input type="text" value={formData.rdoCode} onChange={(event) => updateField("rdoCode", event.target.value)} placeholder="e.g. 044" />
            </SetupField>

            <SetupField label="VAT status" labelHint="Affects tax calculations">
              <CustomSelect
                ariaLabel="VAT status"
                value={formData.vatStatus}
                options={vatStatusOptions}
                onChange={(nextValue) => updateField("vatStatus", nextValue)}
              />
            </SetupField>

            <SetupField label="Registration date">
              <CustomDatePicker
                ariaLabel="Registration date"
                value={formData.registrationDate}
                placeholder="Select a registration date"
                onChange={(nextValue) => updateField("registrationDate", nextValue)}
              />
            </SetupField>
          </div>
        </section>
      </>
    );
  } else if (activeProfileTab === "contact") {
    profileTabContent = (
      <>
        <section className="company-profile-section-card">
          <div className="setup-grid">
            <SetupField label="Business email" labelHint="Shown on documents">
              <input type="email" value={formData.businessEmail} onChange={(event) => updateField("businessEmail", event.target.value)} />
            </SetupField>

            <SetupField label="Contact number">
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(event) => updateField("contactNumber", event.target.value)}
                placeholder="+63 900 000 0000"
              />
            </SetupField>

            <div className="setup-grid-full">
              <SetupField label="Address line 1">
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(event) => updateField("addressLine1", event.target.value)}
                  placeholder="Street number, building, subdivision"
                />
              </SetupField>
            </div>

            <SetupField label="City / Municipality">
              <input type="text" value={formData.city} onChange={(event) => updateField("city", event.target.value)} placeholder="City / Municipality" />
            </SetupField>

            <SetupField label="Province / State">
              <input type="text" value={formData.province} onChange={(event) => updateField("province", event.target.value)} placeholder="Province / State" />
            </SetupField>

            <SetupField label="Postal code">
              <input type="text" value={formData.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} placeholder="Postal code" />
            </SetupField>

            <SetupField label="Country">
              <input type="text" value={formData.country} onChange={(event) => updateField("country", event.target.value)} />
            </SetupField>
          </div>
        </section>
      </>
    );
  } else if (activeProfileTab === "defaults") {
    profileTabContent = (
      <>
        <section className="company-profile-section-card">
          <div className="setup-grid">
            <SetupField label="Base currency">
              <CustomSelect
                ariaLabel="Base currency"
                value={formData.baseCurrency}
                options={currencyOptions}
                onChange={(nextValue) => updateField("baseCurrency", nextValue)}
              />
            </SetupField>

            <SetupField label="Fiscal year start month" labelHint="Groups reports">
              <CustomSelect
                ariaLabel="Fiscal year start month"
                value={formData.fiscalYearStart}
                options={fiscalYearOptions}
                onChange={(nextValue) => updateField("fiscalYearStart", nextValue)}
              />
            </SetupField>

            <SetupField label="Bookkeeping method">
              <CustomSelect
                ariaLabel="Bookkeeping method"
                value={formData.bookkeepingMethod}
                options={bookkeepingMethodOptions}
                onChange={(nextValue) => updateField("bookkeepingMethod", nextValue)}
              />
            </SetupField>

            <SetupField label="Timezone" labelHint="Used for dated records">
              <CustomSelect
                ariaLabel="Timezone"
                value={formData.timezone}
                options={timezoneOptions}
                onChange={(nextValue) => updateField("timezone", nextValue)}
              />
            </SetupField>
          </div>
        </section>
      </>
    );
  } else {
    profileTabContent = (
      <>
        <section className="company-profile-section-card">
          <div className="company-profile-document-list">
            {companyProfileDocuments.map((document) => (
              <div key={document.id} className="company-profile-document-row">
                <div className="company-profile-document-main">
                  <span className="company-profile-document-icon">
                    <CompanyProfileNavIcon kind="documents" />
                  </span>
                  <div className="company-profile-document-copy">
                    <strong>{document.title}</strong>
                    <p>{document.detail}</p>
                  </div>
                </div>

                <div className="company-profile-document-meta">
                  <strong>{document.fileName || "No file uploaded yet"}</strong>
                  <span className={`company-profile-document-status company-profile-document-status-${document.tone}`}>{document.status}</span>
                </div>

                <button type="button" className="setup-upload-button">
                  {document.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  if (setupComplete) {
    if (activeWorkspaceView === "chart-of-accounts") {
      return (
        <ChartOfAccountsWorkspace
          companyName={formData.workspaceName}
          components={{ CloseIcon, CustomSelect, RowOpenIcon, SearchIcon, SetupField }}
        />
      );
    }

    if (activeWorkspaceView === "users-roles") {
      return (
        <AdminWorkspaceRouter
          companyName={formData.workspaceName}
          view="users-roles"
          components={{ CustomSelect, RowOpenIcon, SearchIcon, SetupField }}
        />
      );
    }

    if (activeWorkspaceView === "system-settings") {
      return (
        <AdminWorkspaceRouter
          companyName={formData.workspaceName}
          view="system-settings"
          components={{ CustomSelect, RowOpenIcon, SearchIcon, SetupField }}
        />
      );
    }

    if (activeWorkspaceView === "audit-trail") {
      return (
        <AdminWorkspaceRouter
          companyName={formData.workspaceName}
          view="audit-trail"
          components={{ CustomSelect, RowOpenIcon, SearchIcon, SetupField }}
        />
      );
    }

    if (activeWorkspaceView === "customization") {
      return (
        <AdminWorkspaceRouter
          companyName={formData.workspaceName}
          view="customization"
          components={{ CustomSelect, RowOpenIcon, SearchIcon, SetupField }}
        />
      );
    }

    if (activeWorkspaceView === "contribution-tables") {
      return (
        <AdminWorkspaceRouter
          companyName={formData.workspaceName}
          view="contribution-tables"
          components={{ CustomSelect, RowOpenIcon, SearchIcon, SetupField }}
        />
      );
    }

    return (
      <div className="dashboard-content company-profile-view">
        <section className="company-profile-workspace">
          <aside className="company-profile-nav-panel">
            <nav className="company-profile-subnav" aria-label="Company profile sections">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`company-profile-subnav-item ${activeProfileTab === tab.id ? "company-profile-subnav-item-active" : ""}`}
                  aria-current={activeProfileTab === tab.id ? "page" : undefined}
                  onClick={() => setActiveProfileTab(tab.id)}
                >
                  <span className="company-profile-subnav-icon">
                    <CompanyProfileNavIcon kind={tab.icon} />
                  </span>
                  <span className="company-profile-subnav-copy">
                    <strong>{tab.label}</strong>
                    <span>{tab.description}</span>
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          <article className="company-profile-panel company-profile-editor">
            <header className="company-profile-editor-header">
              <h3>{activeProfileTabConfig.label}</h3>
            </header>

            <section className="company-profile-editor-body">
              {profileTabContent}
            </section>

            <footer className="company-profile-savebar">
              <span className={`setup-page-note company-profile-save-note ${autoSaveToneClass}`}>{profileAutoSaveLabel}</span>
              <button type="button" className="setup-action-button setup-action-button-primary" onClick={handleProfileSave}>
                Save changes
              </button>
            </footer>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className={`dashboard-content company-setup-view ${isFinalizingSetup ? "company-setup-view-transitioning" : ""}`}>
      <header className="dashboard-topbar setup-page-header">
        <div>
          <p className="dashboard-eyebrow">First-time setup</p>
          <h1>Company setup</h1>
          <p className="dashboard-subtitle">Finish the essentials now. You can refine the rest later from Company Profile.</p>
        </div>

        <div className="setup-page-meta">
          <span className="setup-step-badge">
            {completedRequiredCount} of {companySetupRequiredFields.length} required fields ready
          </span>
          <span className={`setup-page-note ${autoSaveToneClass}`} aria-live="polite">
            {autoSaveLabel}
          </span>
        </div>
      </header>

      <section className="setup-stepper" aria-label="Company setup progress">
        {companySetupSteps.map((step, index) => {
          const isComplete = index < stepperVisualIndex;
          const isCurrent = index === stepperVisualIndex;
          const beforeLineState =
            index === 0 ? "hidden" : index <= stepperVisualIndex ? "setup-stepper-line-fill-complete" : "setup-stepper-line-fill-idle";
          const afterLineState =
            index === companySetupSteps.length - 1
              ? "hidden"
              : index < stepperVisualIndex
                ? "setup-stepper-line-fill-complete"
                : index === stepperVisualIndex
                  ? "setup-stepper-line-fill-current"
                  : "setup-stepper-line-fill-idle";

          return (
            <div
              key={step.id}
              className={`setup-stepper-item ${isComplete ? "setup-stepper-item-complete" : ""} ${
                isCurrent ? "setup-stepper-item-current" : ""
              }`}
            >
              <div className="setup-stepper-track">
                <span className={`setup-stepper-line setup-stepper-line-before ${beforeLineState === "hidden" ? "setup-stepper-line-hidden" : ""}`}>
                  <span className={`setup-stepper-line-fill ${beforeLineState === "hidden" ? "" : beforeLineState}`} />
                </span>
                <span className="setup-stepper-node">{isComplete ? <CheckIcon /> : index + 1}</span>
                <span className={`setup-stepper-line setup-stepper-line-after ${afterLineState === "hidden" ? "setup-stepper-line-hidden" : ""}`}>
                  <span className={`setup-stepper-line-fill ${afterLineState === "hidden" ? "" : afterLineState}`} />
                </span>
              </div>
              <div className="setup-stepper-copy">
                <span>Step {index + 1}</span>
                <strong>{step.title}</strong>
              </div>
            </div>
          );
        })}
      </section>

      <section className="setup-stepper-mobile" aria-label="Current setup step">
        <div className="setup-stepper-mobile-head">
          <span>
            Step {currentStepIndex + 1} of {companySetupSteps.length}
          </span>
          <strong>{currentStep.title}</strong>
        </div>
        <div className="setup-progress-track">
          <span className="setup-progress-fill" style={{ width: `${completionPercent}%` }} />
        </div>
      </section>

      <section className="company-setup-shell">
        <article className="company-setup-panel">
          <div
            className={`setup-step-stage ${stepTransitionClass} ${isStepTransitioning ? "setup-step-stage-clipped" : ""}`}
            style={stepStageHeight ? { height: `${stepStageHeight}px` } : undefined}
          >
            <section ref={stepStageContentRef} className="setup-section setup-section-current">
              <div className="setup-section-head">
                <div>
                  <span className="setup-section-kicker">{`Step ${currentStepIndex + 1}`}</span>
                  <h2>{currentStep.title}</h2>
                  <p>{currentStep.description}</p>
                </div>
                <span className="setup-inline-progress">
                  {completedCurrentRequired}/{currentStep.requiredFields.length} required ready
                </span>
              </div>

              {currentValidationVisible && missingCurrentFields.length > 0 ? (
                <div className="setup-validation-banner" role="alert">
                  <div className="setup-validation-banner-head">
                    <ValidationIcon />
                    <div>
                      <strong>Complete these before you continue</strong>
                      <p>Only the required fields for this step are blocking the next screen.</p>
                    </div>
                  </div>
                  <div className="setup-validation-pills">
                    {missingCurrentFields.map((field) => (
                      <span key={field} className="setup-validation-pill">
                        {companySetupFieldLabels[field]}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {stepBody}
            </section>
          </div>

          <footer className="setup-footer">
            <div className="setup-footer-copy">
              <p className={`setup-page-note ${autoSaveToneClass}`} aria-live="polite">
                {autoSaveLabel}
              </p>
            </div>
            <div className="setup-footer-actions">
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  className="setup-action-button setup-action-button-ghost"
                  onClick={handleBack}
                  disabled={isStepTransitioning || isFinalizingSetup}
                >
                  Back
                </button>
              ) : null}
              <button
                type="button"
                className="setup-action-button setup-action-button-primary"
                onClick={handleContinue}
                disabled={isStepTransitioning || isFinalizingSetup}
              >
                {isFinalizingSetup
                  ? "Setting up workspace..."
                  : currentStepIndex === companySetupSteps.length - 1
                    ? "Finish setup"
                    : "Continue"}
              </button>
            </div>
          </footer>
        </article>

        <aside className="company-setup-rail">
          <section className="setup-rail-card">
            <div className="setup-rail-head">
              <strong>This step affects</strong>
            </div>

            <div className="setup-rail-list">
              {currentStep.impacts.map((note) => (
                <div key={note} className="setup-rail-list-item">
                  <span className="setup-rail-dot" />
                  <p>{note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="setup-rail-card">
            <div className="setup-rail-head">
              <strong>Still needed now</strong>
            </div>

            <div className="setup-status-grid">
              {missingCurrentFields.length > 0 ? (
                <div className="setup-needed-list">
                  {missingCurrentFields.map((field) => (
                    <div key={field} className="setup-needed-item">
                      <span className="setup-rail-dot" />
                      <p>{companySetupFieldLabels[field]}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="setup-status-item setup-status-item-positive">
                  <span className="setup-status-label">Ready to continue</span>
                  <strong>
                    {currentStepIndex === companySetupSteps.length - 1
                      ? "This final step is complete. Finish setup when ready."
                      : `You can continue to ${companySetupSteps[currentStepIndex + 1].title}.`}
                  </strong>
                </div>
              )}
            </div>
          </section>

        </aside>
      </section>

      {setupTransition ? <SetupTransitionOverlay title={setupTransition.title} detail={setupTransition.detail} /> : null}
    </div>
  );
}

function AuthFormPanel({
  isAuthenticating,
  mode,
  onAuthenticate,
  onSwitchMode
}: {
  isAuthenticating: boolean;
  mode: AuthMode;
  onAuthenticate: (session: MockSession) => Promise<void>;
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const isSignup = mode === "signup";
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>(MOCK_LOGIN_CREDENTIALS.email);
  const [password, setPassword] = useState<string>(MOCK_LOGIN_CREDENTIALS.password);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");

    if (mode === "login") {
      setFullName("");
      setEmail(MOCK_LOGIN_CREDENTIALS.email);
      setPassword(MOCK_LOGIN_CREDENTIALS.password);
      setConfirmPassword("");
      setAcceptedTerms(false);
      setRememberMe(true);
      return;
    }

    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAcceptedTerms(false);
  }, [mode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isMockAuthEnabled) {
      setError("Mock access is available only while running the app locally with npm run dev.");
      return;
    }

    if (isSignup) {
      if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError("Complete all fields to create the local demo account.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!acceptedTerms) {
        setError("Accept the Terms and Privacy Policy to continue.");
        return;
      }

      setError("");
      await onAuthenticate({
        companyName: "New Ledgera Workspace",
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        role: "Admin"
      });
      return;
    }

    if (email.trim().toLowerCase() !== MOCK_LOGIN_CREDENTIALS.email || password !== MOCK_LOGIN_CREDENTIALS.password) {
      setError("Use the development demo credentials above to enter the dashboard.");
      return;
    }

    setError("");
    await onAuthenticate({
      companyName: "Ledgera Demo Company",
      email: MOCK_LOGIN_CREDENTIALS.email,
      fullName: "Demo Admin",
      role: "Administrator"
    });
  };

  return (
    <section className="login-panel">
      <div className={`form-wrap ${isSignup ? "form-wrap-signup" : ""}`}>
        <AppLogo />

        <header className="login-copy">
          <h1>
            {isSignup ? (
              <>
                Create <span>Ledgera</span> account
              </>
            ) : (
              <>
                Welcome back to <span>Ledgera</span>
              </>
            )}
          </h1>
          <p>
            {isSignup
              ? "Set up Ledgera to manage your accounting operations."
              : "Log in with your email and password to access your accounting workspace and company records."}
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} aria-busy={isAuthenticating}>
          <fieldset className="auth-fieldset" disabled={isAuthenticating}>
            {isSignup ? (
              <>
                <label className="field">
                  <span>Full name</span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Work email</span>
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
              </>
            ) : (
              <label className="field">
                <span>Email</span>
                <input type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
            )}

            <PasswordField
              label="Password"
              placeholder={isSignup ? "Create your password" : "Enter your password"}
              value={password}
              onChange={setPassword}
            />

            {isSignup ? (
              <PasswordField
                label="Confirm password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            ) : null}

            <div className="form-row">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={isSignup ? acceptedTerms : rememberMe}
                  onChange={(event) =>
                    isSignup ? setAcceptedTerms(event.target.checked) : setRememberMe(event.target.checked)
                  }
                />
                <span>{isSignup ? "I agree to the Terms and Privacy Policy" : "Keep me sign-in to Ledgera"}</span>
              </label>

              {!isSignup ? (
                <button type="button" className="text-link" disabled={isAuthenticating}>
                  Forgot password?
                </button>
              ) : null}
            </div>

            {error ? <p className="helper-error">{error}</p> : null}

            <button className="primary-button" type="submit" disabled={isAuthenticating}>
              <span className="primary-button-content">
                {isAuthenticating ? <span className="button-spinner" aria-hidden="true" /> : null}
                <span>{isAuthenticating ? (isSignup ? "Creating workspace..." : "Signing in...") : isSignup ? "Create account" : "Login now"}</span>
              </span>
            </button>
          </fieldset>
        </form>

        <div className="divider">
          <span>Or Continue with</span>
        </div>

        <div className="social-grid">
          <SocialButton disabled={isAuthenticating} label="Google" icon={<GoogleLogo />} />
          <SocialButton disabled={isAuthenticating} label="Facebook" icon={<FacebookLogo />} />
        </div>

        <p className="signup-line">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
            disabled={isAuthenticating}
          >
            {isSignup ? "Login" : "Create account"}
          </button>
        </p>
      </div>
    </section>
  );
}

function DashboardShell({
  onLogout,
  session
}: {
  onLogout: () => void;
  session: MockSession;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => readSidebarPreferences().collapsed);
  const [openGroupIds, setOpenGroupIds] = useState<string[]>(() => readSidebarPreferences().openGroupIds);
  const [isCompactViewport, setIsCompactViewport] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 1100 : false
  );
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement | null>(null);
  const [setupRenderKey, setSetupRenderKey] = useState(0);

  const initials = session.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const isSidebarCollapsed = !isCompactViewport && sidebarCollapsed;
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<WorkspaceView>("chart-of-accounts");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setIsCompactViewport(window.innerWidth <= 1100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    writeSidebarPreferences({
      collapsed: sidebarCollapsed,
      openGroupIds
    });
  }, [openGroupIds, sidebarCollapsed]);

  useEffect(() => {
    setOpenGroupIds((current) => (current.includes("admin") ? current : [...current, "admin"]));
  }, []);

  useEffect(() => {
    const nextGroupId = activeWorkspaceView === "chart-of-accounts" ? "master-data" : "admin";

    setOpenGroupIds((current) => (current.includes(nextGroupId) ? current : [...current, nextGroupId]));
  }, [activeWorkspaceView]);

  useEffect(() => {
    if (!avatarMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!avatarMenuRef.current || !(event.target instanceof Node)) {
        return;
      }

      if (!avatarMenuRef.current.contains(event.target)) {
        setAvatarMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAvatarMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [avatarMenuOpen]);

  const toggleSidebarGroup = (groupId: string, sectionId: string) => {
    setOpenGroupIds((current) => {
      const sectionGroupIds = sidebarSections.find((section) => section.id === sectionId)?.items.map((item) => item.id) ?? [];
      const nextWithoutSectionGroups = current.filter((id) => !sectionGroupIds.includes(id));

      if (current.includes(groupId)) {
        return nextWithoutSectionGroups;
      }

      return [...nextWithoutSectionGroups, groupId];
    });
  };

  const expandSidebarGroup = (groupId: string, sectionId: string) => {
    setSidebarCollapsed(false);
    setOpenGroupIds((current) => {
      const sectionGroupIds = sidebarSections.find((section) => section.id === sectionId)?.items.map((item) => item.id) ?? [];
      const nextWithoutSectionGroups = current.filter((id) => !sectionGroupIds.includes(id));
      return [...nextWithoutSectionGroups, groupId];
    });
  };

  const handleResetSetup = () => {
    clearCompanySetupDraft();
    setAvatarMenuOpen(false);
    setIsSetupMode(true);
    setSetupRenderKey((current) => current + 1);
  };

  return (
    <main
      className={`dashboard-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${
        isSetupMode ? "dashboard-shell-setup" : ""
      }`}
    >
      <aside className={`dashboard-sidebar ${isSetupMode ? "dashboard-sidebar-setup" : ""}`}>
        <div className="dashboard-sidebar-top">
          <div className="dashboard-brand">
            {!isCompactViewport ? (
              <SidebarBrandControl
                collapsed={isSidebarCollapsed}
                onToggle={() => setSidebarCollapsed((current) => !current)}
              />
            ) : (
              <AppLogo />
            )}
            <div className="dashboard-brand-copy">
              <strong>Ledgera</strong>
              <span>Accounting workspace</span>
            </div>
          </div>
        </div>

        <SidebarNavigation
          activeWorkspaceView={activeWorkspaceView}
          collapsed={isSidebarCollapsed}
          onSelectWorkspaceView={setActiveWorkspaceView}
          openGroupIds={openGroupIds}
          onExpandGroup={expandSidebarGroup}
          onToggleGroup={toggleSidebarGroup}
        />
      </aside>

      <section className="dashboard-main">
        <header className={`dashboard-utility-bar ${isSetupMode ? "dashboard-utility-bar-setup" : ""}`}>
          <label className={`dashboard-search ${isSetupMode ? "dashboard-search-disabled" : ""}`}>
            <SearchIcon />
            <input
              type="text"
              placeholder={isSetupMode ? "Search unlocks after company setup" : "Search clients, journals, reports, or settings"}
              disabled={isSetupMode}
            />
          </label>

          <div className={`dashboard-utility-actions ${isSetupMode ? "dashboard-utility-actions-muted" : ""}`}>
            <UtilityButton label="Notifications" hasIndicator>
              <BellIcon />
            </UtilityButton>
            <UtilityButton label="Settings">
              <SettingsIcon />
            </UtilityButton>
            <div className="dashboard-avatar-menu" ref={avatarMenuRef}>
              <button
                className={`dashboard-avatar ${avatarMenuOpen ? "dashboard-avatar-active" : ""}`}
                type="button"
                aria-label="Open account menu"
                aria-expanded={avatarMenuOpen}
                aria-haspopup="menu"
                onClick={() => setAvatarMenuOpen((current) => !current)}
              >
                <span className="dashboard-avatar-mark">{initials}</span>
                <span className="dashboard-avatar-copy">
                  <strong>{session.fullName}</strong>
                  <span>{session.email}</span>
                </span>
                <AvatarChevronIcon open={avatarMenuOpen} />
              </button>

              {avatarMenuOpen ? (
                <div className="dashboard-avatar-popover" role="menu" aria-label="Account menu">
                  <div className="dashboard-avatar-popover-head">
                    <strong>{session.fullName}</strong>
                    <span>{session.email}</span>
                    <small>{session.role}</small>
                  </div>

                  <div className="dashboard-avatar-popover-actions">
                    <button
                      className="dashboard-avatar-menu-item"
                      type="button"
                      role="menuitem"
                      onClick={() => setAvatarMenuOpen(false)}
                    >
                      <span className="dashboard-avatar-menu-item-main">
                        <UserCircleIcon />
                        <span>Profile</span>
                      </span>
                      <span className="dashboard-avatar-menu-pill">Soon</span>
                    </button>

                    <button
                      className="dashboard-avatar-menu-item"
                      type="button"
                      role="menuitem"
                      onClick={() => setAvatarMenuOpen(false)}
                    >
                      <span className="dashboard-avatar-menu-item-main">
                        <SlidersIcon />
                        <span>Account settings</span>
                      </span>
                      <span className="dashboard-avatar-menu-pill">Soon</span>
                    </button>

                    {isMockAuthEnabled ? (
                      <button
                        className="dashboard-avatar-menu-item dashboard-avatar-menu-item-dev"
                        type="button"
                        role="menuitem"
                        onClick={handleResetSetup}
                      >
                        <span className="dashboard-avatar-menu-item-main">
                          <RefreshCcwIcon />
                          <span>Reset setup</span>
                        </span>
                        <span className="dashboard-avatar-menu-pill">Dev</span>
                      </button>
                    ) : null}

                    <button
                      className="dashboard-avatar-menu-item dashboard-avatar-menu-item-danger"
                      type="button"
                      role="menuitem"
                      onClick={onLogout}
                    >
                      <span className="dashboard-avatar-menu-item-main">
                        <LogOutIcon />
                        <span>Log out</span>
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <CompanySetupScreen
          key={setupRenderKey}
          activeWorkspaceView={activeWorkspaceView}
          onActivateWorkspaceView={setActiveWorkspaceView}
          onSetupModeChange={setIsSetupMode}
        />
      </section>
    </main>
  );
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [session, setSession] = useState<MockSession | null>(() => readMockSession());
  const [authTransition, setAuthTransition] = useState<AuthTransitionState | null>(null);
  const authTimeoutRef = useRef<number | null>(null);
  const isSignup = mode === "signup";

  useEffect(() => {
    writeMockSession(session);
  }, [session]);

  useEffect(() => {
    return () => {
      if (authTimeoutRef.current !== null) {
        window.clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  const handleAuthenticate = async (nextSession: MockSession) => {
    const nextTransition: AuthTransitionState =
      mode === "signup"
        ? {
            detail: "Setting up your Ledgera workspace and loading company setup.",
            mode,
            title: "Creating your workspace"
          }
        : {
            detail: "Signing in securely and preparing your accounting workspace.",
            mode,
            title: "Preparing your workspace"
          };

    setAuthTransition(nextTransition);

    await new Promise<void>((resolve) => {
      authTimeoutRef.current = window.setTimeout(
        () => {
          authTimeoutRef.current = null;
          resolve();
        },
        mode === "signup" ? 1100 : 850
      );
    });

    setSession(nextSession);
    setAuthTransition(null);
  };

  if (session) {
    return (
      <DashboardShell
        session={session}
        onLogout={() => {
          setAuthTransition(null);
          setSession(null);
        }}
      />
    );
  }

  return (
    <main className={`login-screen auth-mode-${mode} ${authTransition ? "auth-transition-active" : ""}`}>
      <section className="panel-slot panel-form-slot">
        <AuthFormPanel
          isAuthenticating={Boolean(authTransition)}
          mode={mode}
          onAuthenticate={handleAuthenticate}
          onSwitchMode={setMode}
        />
      </section>

      <section className="panel-slot panel-showcase-slot">
        <section className={`showcase-panel ${isSignup ? "showcase-panel-signup" : ""}`}>
          <div className="showcase-orb orb-top" />
          <div className="showcase-orb orb-bottom" />

          <div className="floating-badge badge-large">
            <AppLogo />
          </div>

          {isSignup ? <OnboardingPreview /> : <DashboardPreview />}

          {!isSignup ? (
            <div className="floating-card">
              <span>Total sales</span>
              <strong>$18,200</strong>
              <small>10.2% this month</small>
            </div>
          ) : null}
        </section>
      </section>

      {authTransition ? <AuthTransitionOverlay transition={authTransition} /> : null}
    </main>
  );
}

