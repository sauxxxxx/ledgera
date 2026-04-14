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

export type SharedMasterDataComponents = {
  CloseIcon: () => ReactNode;
  CustomSelect: (props: CustomSelectComponentProps) => ReactNode;
  RowOpenIcon: () => ReactNode;
  SearchIcon: () => ReactNode;
  SetupField: (props: SetupFieldComponentProps) => ReactNode;
};

export type MasterDataTone = "ready" | "attention" | "pending" | "neutral" | "accent" | "info";

export type MasterDataBadge = {
  label: string;
  tone: MasterDataTone;
};

export type MasterDataDrawerField = {
  full?: boolean;
  label: string;
  value: string;
};

export type MasterDataDrawerNote = {
  detail: string;
  kicker?: string;
  title: string;
};

export type MasterDataDrawerSection = {
  description: string;
  fields: MasterDataDrawerField[];
  note?: MasterDataDrawerNote;
  title: string;
};

export type MasterDataDrawer = {
  badges: MasterDataBadge[];
  code: string;
  description: string;
  footerActionLabel: string;
  footerActionNotice: string;
  kicker: string;
  sections: MasterDataDrawerSection[];
  summary: Array<{ label: string; value: string }>;
  title: string;
};

export type MasterDataRecordBase = {
  avatarLabel: string;
  avatarTone: "client" | "supplier" | "employee";
  drawer: MasterDataDrawer;
  health: MasterDataBadge;
  id: string;
  name: string;
  sublabel: string;
  updatedAt: string;
};

export type MasterDataColumn<T extends MasterDataRecordBase> = {
  className?: string;
  id: string;
  label: string;
  render: (record: T) => ReactNode;
};

export type MasterDataFilter<T extends MasterDataRecordBase> = {
  defaultValue?: string;
  getValue: (record: T) => string;
  id: string;
  label: string;
  options: SelectOption[];
};

export type MasterDataSort<T extends MasterDataRecordBase> = {
  compare: (left: T, right: T) => number;
  id: string;
  label: string;
};

type MasterDataActionItem = {
  description: string;
  id: string;
  label: string;
  notice: string;
};

type MasterRecordsWorkspaceProps<T extends MasterDataRecordBase> = {
  actionMenuItems: MasterDataActionItem[];
  columns: MasterDataColumn<T>[];
  components: SharedMasterDataComponents;
  emptyState: {
    description: string;
    title: string;
  };
  primaryActionLabel: string;
  primaryActionNotice: string;
  records: T[];
  searchIndex: (record: T) => string;
  searchPlaceholder: string;
  sorts: MasterDataSort<T>[];
  subtitle: string;
  title: string;
  filters: MasterDataFilter<T>[];
  recordOverlayMode?: "drawer" | "modal";
  renderModalWorkspace?: (args: {
    announce: (notice: string) => void;
    close: () => void;
    record: T;
  }) => ReactNode;
  renderDrawerBody?: (record: T) => ReactNode;
};

function FilterButtonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="chart-filter-button-icon">
      <path d="M4.75 6.75h14.5" />
      <path d="M7.5 11.75h9" />
      <path d="M10 16.75h4" />
    </svg>
  );
}

function HeaderActionsChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`chart-header-actions-chevron ${open ? "chart-header-actions-chevron-open" : ""}`}>
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

export function MasterPill({ label, tone }: MasterDataBadge) {
  return <span className={`master-pill master-pill-${tone}`}>{label}</span>;
}

export function MasterPrimaryCell({
  avatarLabel,
  avatarTone,
  subtitle,
  title
}: {
  avatarLabel: string;
  avatarTone: MasterDataRecordBase["avatarTone"];
  subtitle: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="master-record-primary">
      <span className={`master-record-avatar master-record-avatar-${avatarTone}`}>{avatarLabel}</span>
      <div className="master-record-primary-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export function MasterCellStack({
  subtitle,
  title
}: {
  subtitle?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="master-cell-stack">
      <strong>{title}</strong>
      {subtitle ? <span>{subtitle}</span> : null}
    </div>
  );
}

export function MasterRecordsWorkspace<T extends MasterDataRecordBase>({
  actionMenuItems,
  columns,
  components,
  emptyState,
  filters,
  primaryActionLabel,
  primaryActionNotice,
  records,
  searchIndex,
  searchPlaceholder,
  sorts,
  subtitle,
  title,
  recordOverlayMode = "drawer",
  renderModalWorkspace,
  renderDrawerBody
}: MasterRecordsWorkspaceProps<T>) {
  const { CloseIcon, CustomSelect, RowOpenIcon, SearchIcon, SetupField } = components;
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const headerActionsMenuRef = useRef<HTMLDivElement | null>(null);

  const buildDefaultFilterValues = () =>
    Object.fromEntries(filters.map((filter) => [filter.id, filter.defaultValue ?? "all"])) as Record<string, string>;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => buildDefaultFilterValues());
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [headerActionsMenuOpen, setHeaderActionsMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>(() => sorts[0]?.id ?? "");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [workspaceNotice, setWorkspaceNotice] = useState<string | null>(null);

  const searchNeedle = searchTerm.trim().toLowerCase();
  const activeFilterCount = filters.filter((filter) => filterValues[filter.id] !== (filter.defaultValue ?? "all")).length;
  const selectedSort = sorts.find((sort) => sort.id === sortBy) ?? sorts[0];
  const filteredRecords = [...records]
    .filter((record) => {
      const matchesSearch = searchNeedle.length === 0 || searchIndex(record).toLowerCase().includes(searchNeedle);
      const matchesFilters = filters.every((filter) => {
        const selectedValue = filterValues[filter.id] ?? filter.defaultValue ?? "all";
        return selectedValue === (filter.defaultValue ?? "all") || filter.getValue(record) === selectedValue;
      });

      return matchesSearch && matchesFilters;
    })
    .sort((left, right) => (selectedSort ? selectedSort.compare(left, right) : 0));

  const selectedRecord = records.find((record) => record.id === selectedRecordId) ?? null;

  useEffect(() => {
    if (!workspaceNotice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setWorkspaceNotice(null), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [workspaceNotice]);

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
    if (!headerActionsMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!headerActionsMenuRef.current?.contains(event.target as Node)) {
        setHeaderActionsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHeaderActionsMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [headerActionsMenuOpen]);

  useEffect(() => {
    if (!selectedRecord) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRecordId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRecord]);

  const announce = (notice: string) => {
    setFilterMenuOpen(false);
    setHeaderActionsMenuOpen(false);
    setWorkspaceNotice(notice);
  };

  const clearFilters = () => {
    setFilterValues(buildDefaultFilterValues());
  };

  const updateFilterValue = (filterId: string, value: string) => {
    setFilterValues((current) => ({
      ...current,
      [filterId]: value
    }));
  };

  const openRecord = (recordId: string) => {
    setFilterMenuOpen(false);
    setHeaderActionsMenuOpen(false);
    setSelectedRecordId(recordId);
  };

  const recordPanel = selectedRecord ? (
    <aside
      className={`chart-inspector chart-inspector-drawer master-records-drawer ${
        recordOverlayMode === "modal" ? "master-records-modal-card" : ""
      }`}
      style={recordOverlayMode === "drawer" ? { overflow: "visible" } : undefined}
    >
      {recordOverlayMode === "drawer" ? (
        <button
          type="button"
          className="chart-inspector-close"
          aria-label="Close details panel"
          onClick={() => setSelectedRecordId(null)}
          style={{ left: "-54px", position: "absolute", top: "18px", zIndex: 2 }}
        >
          <CloseIcon />
        </button>
      ) : null}

      <div className="chart-inspector-head">
        <div className="chart-inspector-head-main">
          <div className="chart-inspector-head-top">
            <div className="chart-inspector-head-copy">
              <span className="chart-inspector-kicker">{selectedRecord.drawer.kicker}</span>
              <div className="chart-inspector-title-row">
                <span className="chart-inspector-code">{selectedRecord.drawer.code}</span>
                <h3>{selectedRecord.drawer.title}</h3>
              </div>
              <p>{selectedRecord.drawer.description}</p>
            </div>

            <div className="chart-inspector-head-meta">
              {selectedRecord.drawer.badges.map((badge) => (
                <MasterPill key={`${selectedRecord.id}-${badge.label}`} label={badge.label} tone={badge.tone} />
              ))}
            </div>
          </div>

          <div className="chart-inspector-summary-grid">
            {selectedRecord.drawer.summary.map((item) => (
              <div key={`${selectedRecord.id}-${item.label}`} className="chart-inspector-summary-item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-inspector-body">
        {renderDrawerBody
          ? renderDrawerBody(selectedRecord)
          : selectedRecord.drawer.sections.map((section) => (
              <section key={`${selectedRecord.id}-${section.title}`} className="chart-inspector-section">
                <div className="chart-inspector-section-head">
                  <strong>{section.title}</strong>
                  <span>{section.description}</span>
                </div>

                <div className="chart-inspector-grid master-drawer-fields">
                  {section.fields.map((field) => (
                    <div
                      key={`${selectedRecord.id}-${section.title}-${field.label}`}
                      className={`master-drawer-field ${field.full ? "master-drawer-field-full" : ""}`}
                    >
                      <span>{field.label}</span>
                      <strong>{field.value}</strong>
                    </div>
                  ))}
                </div>

                {section.note ? (
                  <div className="chart-inspector-note">
                    {section.note.kicker ? <span className="chart-inspector-note-kicker">{section.note.kicker}</span> : null}
                    <strong>{section.note.title}</strong>
                    <span>{section.note.detail}</span>
                  </div>
                ) : null}
              </section>
            ))}
      </div>

      <footer className="chart-inspector-footer master-records-footer">
        <div className="master-records-footer-copy">
          <strong>Updated {selectedRecord.updatedAt}</strong>
          <span>Use this panel to review readiness before work moves into downstream billing, payables, or payroll flows.</span>
        </div>

        <div className="master-records-footer-actions">
          <button type="button" className="chart-page-button" onClick={() => setSelectedRecordId(null)}>
            Close
          </button>
          <button
            type="button"
            className="chart-page-button chart-page-button-primary"
            onClick={() => announce(selectedRecord.drawer.footerActionNotice)}
          >
            {selectedRecord.drawer.footerActionLabel}
          </button>
        </div>
      </footer>
    </aside>
  ) : null;

  const modalPanel = selectedRecord ? (
    <div className="chart-standard-layer admin-user-modal-layer master-records-modal-layer" role="dialog" aria-modal="true" aria-label={`${selectedRecord.name} details`}>
      <button
        type="button"
        className="chart-standard-backdrop"
        aria-label="Close details panel"
        onClick={() => setSelectedRecordId(null)}
      />

      <div className="master-records-modal-stage">
        <button
          type="button"
          className="admin-user-modal-close master-records-modal-close"
          aria-label="Close details panel"
          onClick={() => setSelectedRecordId(null)}
        >
          <CloseIcon />
        </button>

        <section className="admin-user-modal master-records-modal-shell">
          <div className="admin-user-modal-main master-records-modal-main">
            <div className="admin-user-profile master-records-modal-profile">
              <div className={`master-record-avatar master-record-avatar-${selectedRecord.avatarTone} master-records-modal-avatar`}>
                {selectedRecord.avatarLabel}
              </div>
              <div className="admin-user-profile-copy">
                <span className="admin-user-profile-kicker">
                  {selectedRecord.drawer.kicker} • {selectedRecord.drawer.code}
                </span>
                <h3>{selectedRecord.name}</h3>
                <p>{selectedRecord.drawer.description}</p>
              </div>
              <div className="admin-user-profile-pills">
                {selectedRecord.drawer.badges.map((badge) => (
                  <MasterPill key={`${selectedRecord.id}-${badge.label}`} label={badge.label} tone={badge.tone} />
                ))}
              </div>
            </div>

            <div className="master-records-modal-body">
              {renderDrawerBody
                ? renderDrawerBody(selectedRecord)
                : selectedRecord.drawer.sections.map((section) => (
                    <section key={`${selectedRecord.id}-${section.title}`} className="chart-inspector-section">
                      <div className="chart-inspector-section-head">
                        <strong>{section.title}</strong>
                        <span>{section.description}</span>
                      </div>

                      <div className="chart-inspector-grid master-drawer-fields">
                        {section.fields.map((field) => (
                          <div
                            key={`${selectedRecord.id}-${section.title}-${field.label}`}
                            className={`master-drawer-field ${field.full ? "master-drawer-field-full" : ""}`}
                          >
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>

                      {section.note ? (
                        <div className="chart-inspector-note">
                          {section.note.kicker ? <span className="chart-inspector-note-kicker">{section.note.kicker}</span> : null}
                          <strong>{section.note.title}</strong>
                          <span>{section.note.detail}</span>
                        </div>
                      ) : null}
                    </section>
                  ))}
            </div>
          </div>

          <aside className="admin-user-modal-side master-records-modal-side">
            <div className="admin-user-side-panel">
              <div className="admin-user-side-panel-head">
                <strong>Profile summary</strong>
                <span>Client package, contract, and billing snapshot</span>
              </div>

              <div className="master-records-modal-summary-grid">
                {selectedRecord.drawer.summary.map((item) => (
                  <div key={`${selectedRecord.id}-summary-${item.label}`} className="master-records-modal-summary-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-user-side-panel">
              <div className="admin-user-side-panel-head">
                <strong>{selectedRecord.health.label}</strong>
                <span>Current payment signal</span>
              </div>

              <div className="master-records-modal-signal">
                <MasterPill label={selectedRecord.health.label} tone={selectedRecord.health.tone} />
                <p>{(selectedRecord as T & { paymentSummary?: string }).paymentSummary ?? selectedRecord.drawer.description}</p>
                <span>{selectedRecord.drawer.footerActionNotice}</span>
              </div>
            </div>
          </aside>

          <footer className="admin-user-modal-footer master-records-modal-footer">
            <div className="admin-user-modal-footer-copy">
              <strong>Updated {selectedRecord.updatedAt}</strong>
              <span>{selectedRecord.drawer.footerActionLabel}</span>
            </div>
            <div className="admin-user-modal-footer-actions">
              <button type="button" className="chart-page-button" onClick={() => setSelectedRecordId(null)}>
                Close
              </button>
              <button
                type="button"
                className="chart-page-button chart-page-button-primary"
                onClick={() => announce(selectedRecord.drawer.footerActionNotice)}
              >
                {selectedRecord.drawer.footerActionLabel}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  ) : null;

  return (
    <div className={`dashboard-content chart-accounts-view master-records-view ${selectedRecord ? "chart-accounts-view-sheet-open" : ""}`}>
      <header className="chart-accounts-header">
        <div className="chart-accounts-heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="chart-accounts-header-actions">
          <div
            ref={headerActionsMenuRef}
            className={`chart-header-actions-menu ${headerActionsMenuOpen ? "chart-header-actions-menu-open" : ""}`}
          >
            <button
              type="button"
              className="chart-page-button chart-page-button-secondary chart-header-actions-trigger"
              aria-expanded={headerActionsMenuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setFilterMenuOpen(false);
                setHeaderActionsMenuOpen((current) => !current);
              }}
            >
              <span>More actions</span>
              <HeaderActionsChevronIcon open={headerActionsMenuOpen} />
            </button>

            {headerActionsMenuOpen ? (
              <div className="chart-header-actions-panel" role="menu" aria-label={`${title} actions`}>
                {actionMenuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="chart-header-actions-item"
                    role="menuitem"
                    onClick={() => announce(item.notice)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button type="button" className="chart-page-button chart-page-button-primary" onClick={() => announce(primaryActionNotice)}>
            {primaryActionLabel}
          </button>
        </div>
      </header>

      {workspaceNotice ? <div className="chart-accounts-notice">{workspaceNotice}</div> : null}

      <section className="chart-accounts-shell">
        <div className="chart-accounts-main master-records-main">
          <div className="chart-accounts-toolbar">
            <label className="chart-accounts-search">
              <SearchIcon />
              <input
                type="text"
                placeholder={searchPlaceholder}
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
                  onClick={() => {
                    setHeaderActionsMenuOpen(false);
                    setFilterMenuOpen((current) => !current);
                  }}
                >
                  <FilterButtonIcon />
                  <span>Filter</span>
                  {activeFilterCount > 0 ? <span className="chart-filter-trigger-count">{activeFilterCount}</span> : null}
                </button>

                {filterMenuOpen ? (
                  <div className="chart-filter-panel" role="dialog" aria-label={`Filter ${title.toLowerCase()}`}>
                    <div className="chart-filter-panel-head">
                      <div>
                        <strong>Filter {title.toLowerCase()}</strong>
                        <span>Refine the visible records without crowding the working surface.</span>
                      </div>
                      {activeFilterCount > 0 ? (
                        <button type="button" className="chart-filter-clear" onClick={clearFilters}>
                          Clear filters
                        </button>
                      ) : null}
                    </div>

                    <div className="chart-accounts-filters">
                      {filters.map((filter) => (
                        <SetupField key={filter.id} label={filter.label}>
                          <CustomSelect
                            ariaLabel={`Filter ${title.toLowerCase()} by ${filter.label.toLowerCase()}`}
                            value={filterValues[filter.id] ?? filter.defaultValue ?? "all"}
                            options={filter.options}
                            onChange={(nextValue) => updateFilterValue(filter.id, nextValue)}
                          />
                        </SetupField>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="chart-sort-select">
                <CustomSelect
                  ariaLabel={`Sort ${title.toLowerCase()}`}
                  value={sortBy}
                  options={sorts.map((sort) => ({ label: sort.label, value: sort.id }))}
                  onChange={setSortBy}
                />
              </div>
            </div>
          </div>

          <div className="chart-table-panel">
            <table className="chart-table master-records-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.id} className={column.className}>
                      {column.label}
                    </th>
                  ))}
                  <th className="chart-table-actions-col">Open</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className={selectedRecord?.id === record.id ? "chart-table-row-open" : undefined}
                      onClick={() => openRecord(record.id)}
                    >
                      {columns.map((column) => (
                        <td key={`${record.id}-${column.id}`} className={column.className}>
                          {column.render(record)}
                        </td>
                      ))}
                      <td className="chart-table-actions-col">
                        <button
                          type="button"
                          className="chart-row-action"
                          aria-label={`Open ${record.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            openRecord(record.id);
                          }}
                        >
                          <RowOpenIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <div className="chart-empty-state">
                        <strong>{emptyState.title}</strong>
                        <p>{emptyState.description}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedRecord ? (
        recordOverlayMode === "modal" ? (
          renderModalWorkspace ? (
            renderModalWorkspace({
              announce,
              close: () => setSelectedRecordId(null),
              record: selectedRecord
            })
          ) : (
            modalPanel
          )
        ) : (
          <div className="chart-drawer-layer" role="dialog" aria-modal="true" aria-label={`${selectedRecord.name} details`}>
            <button type="button" className="chart-drawer-backdrop" aria-label="Close details panel" onClick={() => setSelectedRecordId(null)} />
            {recordPanel}
          </div>
        )
      ) : null}
    </div>
  );
}
