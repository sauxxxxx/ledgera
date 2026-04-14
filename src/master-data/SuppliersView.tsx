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

type SupplierRecord = MasterDataRecordBase & {
  bankStatus: string;
  category: string;
  contactPerson: string;
  defaultAccount: string;
  lastBill: string;
  paymentTerms: string;
  payablesOwner: string;
  taxProfile: string;
  updatedRank: number;
};

const supplierCategoryOptions = [
  { value: "all", label: "All categories" },
  { value: "Operations", label: "Operations" },
  { value: "Technology", label: "Technology" },
  { value: "Compliance", label: "Compliance" }
];

const supplierHealthOptions = [
  { value: "all", label: "All readiness states" },
  { value: "Ready to pay", label: "Ready to pay" },
  { value: "Missing tax info", label: "Missing tax info" },
  { value: "Bank details pending", label: "Bank details pending" }
];

const supplierRecords: SupplierRecord[] = [
  {
    id: "supplier-orbit",
    avatarLabel: "OR",
    avatarTone: "supplier",
    name: "Orbit Office Supply",
    sublabel: "Mariel Goco · mariel@orbitoffice.ph",
    contactPerson: "Mariel Goco",
    category: "Operations",
    paymentTerms: "Net 30",
    defaultAccount: "Office supplies expense",
    payablesOwner: "Miguel Santos",
    taxProfile: "VAT supplier",
    bankStatus: "Verified BPI account",
    lastBill: "Received Apr 6",
    updatedAt: "Today",
    updatedRank: 1,
    health: { label: "Ready to pay", tone: "ready" },
    drawer: {
      kicker: "Supplier profile",
      code: "SP-2004",
      title: "Orbit Office Supply",
      description: "Preferred operations supplier with complete payment details, clean tax setup, and no current blockers for AP processing.",
      badges: [
        { label: "Ready to pay", tone: "ready" },
        { label: "Operations", tone: "accent" },
        { label: "VAT supplier", tone: "info" }
      ],
      summary: [
        { label: "Category", value: "Operations" },
        { label: "Terms", value: "Net 30" },
        { label: "Default account", value: "Office supplies expense" },
        { label: "Latest bill", value: "Received Apr 6" }
      ],
      sections: [
        {
          title: "Supplier setup",
          description: "Ownership and source details the AP team depends on when bills start coming in.",
          fields: [
            { label: "Primary contact", value: "Mariel Goco" },
            { label: "Payables owner", value: "Miguel Santos" },
            { label: "Tax profile", value: "VAT supplier" },
            { label: "Bank status", value: "Verified BPI account" }
          ]
        },
        {
          title: "Posting behavior",
          description: "The default expense route and settlement details used during bill capture.",
          fields: [
            { label: "Default expense account", value: "Office supplies expense" },
            { label: "Payment terms", value: "Net 30" },
            { label: "Settlement route", value: "Bank transfer" },
            { label: "Document expectation", value: "Official receipt + sales invoice" }
          ],
          note: {
            kicker: "Payables signal",
            title: "Low-friction processing",
            detail: "Orbit usually sends complete support documents in one email, so AP can move from capture to approval quickly."
          }
        }
      ],
      footerActionLabel: "Prepare bill",
      footerActionNotice: "Bill preparation will connect here next. Orbit is already ready for an AP capture flow."
    }
  },
  {
    id: "supplier-summit",
    avatarLabel: "SM",
    avatarTone: "supplier",
    name: "Summit Cloud Systems",
    sublabel: "Eric Tan · billing@summitcloud.io",
    contactPerson: "Eric Tan",
    category: "Technology",
    paymentTerms: "Net 15",
    defaultAccount: "Software subscriptions",
    payablesOwner: "Andrea Ramos",
    taxProfile: "Foreign service provider",
    bankStatus: "Wire details confirmed",
    lastBill: "Awaiting tax review",
    updatedAt: "2 hours ago",
    updatedRank: 2,
    health: { label: "Missing tax info", tone: "attention" },
    drawer: {
      kicker: "Supplier profile",
      code: "SP-2011",
      title: "Summit Cloud Systems",
      description: "Technology supplier with confirmed payment routing, but tax treatment still needs a clean local policy note before AP uses it regularly.",
      badges: [
        { label: "Missing tax info", tone: "attention" },
        { label: "Technology", tone: "accent" },
        { label: "Foreign service provider", tone: "info" }
      ],
      summary: [
        { label: "Category", value: "Technology" },
        { label: "Terms", value: "Net 15" },
        { label: "Default account", value: "Software subscriptions" },
        { label: "Latest bill", value: "Awaiting tax review" }
      ],
      sections: [
        {
          title: "Supplier setup",
          description: "Who owns the vendor record and where the payment details currently stand.",
          fields: [
            { label: "Primary contact", value: "Eric Tan" },
            { label: "Payables owner", value: "Andrea Ramos" },
            { label: "Tax profile", value: "Foreign service provider" },
            { label: "Bank status", value: "Wire details confirmed" }
          ]
        },
        {
          title: "Tax treatment",
          description: "The AP team needs a more explicit posting note before this supplier becomes low-touch.",
          fields: [
            { label: "Default expense account", value: "Software subscriptions" },
            { label: "Withholding guidance", value: "Pending final memo" },
            { label: "Settlement route", value: "International wire" },
            { label: "Document expectation", value: "Invoice + service agreement" }
          ],
          note: {
            kicker: "Tax blocker",
            title: "Complete the policy note",
            detail: "Once the tax handling note is locked in, Summit can move from exception handling into the normal AP queue."
          }
        }
      ],
      footerActionLabel: "Review tax setup",
      footerActionNotice: "Supplier tax setup review will connect here next. Summit is waiting on a clean AP handling note."
    }
  },
  {
    id: "supplier-praxis",
    avatarLabel: "PX",
    avatarTone: "supplier",
    name: "Praxis Legal Services",
    sublabel: "Daphne Ong · ops@praxislegal.ph",
    contactPerson: "Daphne Ong",
    category: "Compliance",
    paymentTerms: "Due on receipt",
    defaultAccount: "Professional fees",
    payablesOwner: "Leo Garcia",
    taxProfile: "Expanded withholding",
    bankStatus: "Awaiting bank form",
    lastBill: "Pending first bill",
    updatedAt: "Yesterday",
    updatedRank: 3,
    health: { label: "Bank details pending", tone: "pending" },
    drawer: {
      kicker: "Supplier profile",
      code: "SP-2020",
      title: "Praxis Legal Services",
      description: "New compliance supplier with a clean expense route, but payment cannot move until the final bank authorization form arrives.",
      badges: [
        { label: "Bank details pending", tone: "pending" },
        { label: "Compliance", tone: "accent" },
        { label: "Expanded withholding", tone: "info" }
      ],
      summary: [
        { label: "Category", value: "Compliance" },
        { label: "Terms", value: "Due on receipt" },
        { label: "Default account", value: "Professional fees" },
        { label: "Latest bill", value: "Pending first bill" }
      ],
      sections: [
        {
          title: "Supplier setup",
          description: "Ownership and routing details are mostly complete except for the final bank packet.",
          fields: [
            { label: "Primary contact", value: "Daphne Ong" },
            { label: "Payables owner", value: "Leo Garcia" },
            { label: "Tax profile", value: "Expanded withholding" },
            { label: "Bank status", value: "Awaiting bank form" }
          ]
        },
        {
          title: "Payment readiness",
          description: "The vendor can be used operationally once settlement instructions are fully documented.",
          fields: [
            { label: "Default expense account", value: "Professional fees" },
            { label: "Payment terms", value: "Due on receipt" },
            { label: "Settlement route", value: "Bank transfer pending setup" },
            { label: "Document expectation", value: "Invoice + engagement letter" }
          ],
          note: {
            kicker: "Readiness gap",
            title: "Collect the bank packet",
            detail: "Praxis is a good example of a supplier that is operationally approved but not yet payable. The drawer should make that distinction obvious."
          }
        }
      ],
      footerActionLabel: "Request bank form",
      footerActionNotice: "Supplier onboarding follow-up will connect here next. Praxis is waiting on the final bank form."
    }
  },
  {
    id: "supplier-cinder",
    avatarLabel: "CN",
    avatarTone: "supplier",
    name: "Cinder Facilities Group",
    sublabel: "Josef Lim · finance@cinderfacilities.com",
    contactPerson: "Josef Lim",
    category: "Operations",
    paymentTerms: "Net 45",
    defaultAccount: "Repairs and maintenance",
    payablesOwner: "Miguel Santos",
    taxProfile: "VAT supplier",
    bankStatus: "Verified Metrobank account",
    lastBill: "Received Apr 2",
    updatedAt: "4 days ago",
    updatedRank: 4,
    health: { label: "Ready to pay", tone: "ready" },
    drawer: {
      kicker: "Supplier profile",
      code: "SP-2033",
      title: "Cinder Facilities Group",
      description: "Reliable facilities supplier with complete setup and a straightforward monthly bill pattern.",
      badges: [
        { label: "Ready to pay", tone: "ready" },
        { label: "Operations", tone: "accent" },
        { label: "VAT supplier", tone: "info" }
      ],
      summary: [
        { label: "Category", value: "Operations" },
        { label: "Terms", value: "Net 45" },
        { label: "Default account", value: "Repairs and maintenance" },
        { label: "Latest bill", value: "Received Apr 2" }
      ],
      sections: [
        {
          title: "Supplier setup",
          description: "Core profile details and AP ownership for the facilities vendor relationship.",
          fields: [
            { label: "Primary contact", value: "Josef Lim" },
            { label: "Payables owner", value: "Miguel Santos" },
            { label: "Tax profile", value: "VAT supplier" },
            { label: "Bank status", value: "Verified Metrobank account" }
          ]
        },
        {
          title: "Posting behavior",
          description: "The standard posting and payment assumptions used for recurring facilities bills.",
          fields: [
            { label: "Default expense account", value: "Repairs and maintenance" },
            { label: "Payment terms", value: "Net 45" },
            { label: "Settlement route", value: "Bank transfer" },
            { label: "Document expectation", value: "Invoice + service report" }
          ]
        }
      ],
      footerActionLabel: "Open AP context",
      footerActionNotice: "AP context will connect here next. Cinder is already in a clean payable-ready state."
    }
  }
];

const supplierColumns: MasterDataColumn<SupplierRecord>[] = [
  {
    id: "supplier",
    label: "Supplier",
    render: (record) => (
      <MasterPrimaryCell
        avatarLabel={record.avatarLabel}
        avatarTone={record.avatarTone}
        title={record.name}
        subtitle={record.contactPerson}
      />
    )
  },
  {
    id: "category",
    label: "Category",
    render: (record) => <MasterCellStack title={record.category} subtitle={record.taxProfile} />
  },
  {
    id: "terms",
    label: "Payment terms",
    render: (record) => <MasterCellStack title={record.paymentTerms} subtitle={record.defaultAccount} />
  },
  {
    id: "health",
    label: "Readiness",
    render: (record) => <MasterPill label={record.health.label} tone={record.health.tone} />
  },
  {
    id: "owner",
    label: "Payables owner",
    render: (record) => <MasterCellStack title={record.payablesOwner} subtitle={record.bankStatus} />
  },
  {
    id: "bill",
    label: "Latest bill",
    render: (record) => <MasterCellStack title={record.lastBill} subtitle={record.updatedAt} />
  }
];

const supplierFilters: MasterDataFilter<SupplierRecord>[] = [
  {
    id: "category",
    label: "Category",
    options: supplierCategoryOptions,
    getValue: (record) => record.category
  },
  {
    id: "health",
    label: "Readiness",
    options: supplierHealthOptions,
    getValue: (record) => record.health.label
  }
];

const supplierSorts: MasterDataSort<SupplierRecord>[] = [
  {
    id: "name",
    label: "Sort by name",
    compare: (left, right) => left.name.localeCompare(right.name)
  },
  {
    id: "owner",
    label: "Sort by payables owner",
    compare: (left, right) => left.payablesOwner.localeCompare(right.payablesOwner)
  },
  {
    id: "recent",
    label: "Sort by recent activity",
    compare: (left, right) => left.updatedRank - right.updatedRank
  }
];

export function SuppliersWorkspace({
  companyName,
  components
}: {
  companyName: string;
  components: SharedMasterDataComponents;
}) {
  return (
    <MasterRecordsWorkspace
      title="Suppliers"
      subtitle={`Track payment readiness, tax handling, and payables ownership for ${companyName}.`}
      components={components}
      records={supplierRecords}
      columns={supplierColumns}
      filters={supplierFilters}
      sorts={supplierSorts}
      searchPlaceholder="Search supplier, contact, category, or payables owner"
      searchIndex={(record) =>
        `${record.name} ${record.contactPerson} ${record.category} ${record.payablesOwner} ${record.defaultAccount} ${record.taxProfile}`
      }
      primaryActionLabel="Add supplier"
      primaryActionNotice="Supplier creation will connect here next. This workspace is ready to carry vendor onboarding and payables context."
      actionMenuItems={[
        {
          id: "import-suppliers",
          label: "Import supplier list",
          description: "Load your current vendor roster from procurement or payables onboarding sheets.",
          notice: "Supplier import will connect here next. The shared workspace shell is now ready for a vendor CSV flow."
        },
        {
          id: "export-suppliers",
          label: "Export AP roster",
          description: "Create a quick view of vendor readiness for the payables or compliance team.",
          notice: "Supplier roster export will connect here next. This menu now holds lower-frequency AP actions."
        }
      ]}
      emptyState={{
        title: "No suppliers match the current filters.",
        description: "Try a broader search or clear the category and readiness filters."
      }}
    />
  );
}
