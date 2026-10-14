import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "../services/api";
import "./LeadsDashboard.css";

const value = (field) => String(field ?? "").trim();
const normalized = (field) => value(field).toLowerCase();
const display = (field) => value(field) || "—";
const LEAD_STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Closed"];

function LeadFollowUps({ leadId }) {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadFollowUps = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = await api.getLeadFollowUps(leadId);
      if (currentRequest === requestId.current) setFollowUps(result.data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(err.message || "Unable to load follow-ups from Salesforce.");
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadFollowUps();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      requestId.current += 1;
    };
  }, [loadFollowUps]);

  const formatFollowUpDate = (date) => {
    if (!date) return "Not provided";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? "Not provided"
      : parsed.toLocaleString();
  };

  return (
    <section
      className="leads-dashboard__follow-ups"
      aria-labelledby="lead-follow-ups-title"
    >
      <div className="leads-dashboard__follow-ups-heading">
        <div>
          <p className="leads-dashboard__eyebrow">Next steps</p>
          <h3 id="lead-follow-ups-title">Follow-ups</h3>
        </div>
        {!loading && !error && (
          <span>
            {followUps.length} {followUps.length === 1 ? "record" : "records"}
          </span>
        )}
      </div>
      {loading ? (
        <p className="leads-dashboard__follow-ups-state" role="status">
          Loading follow-ups…
        </p>
      ) : error ? (
        <div className="leads-dashboard__follow-ups-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadFollowUps} disabled={loading}>
            Retry
          </button>
        </div>
      ) : followUps.length === 0 ? (
        <p className="leads-dashboard__follow-ups-state">
          No follow-ups found for this lead.
        </p>
      ) : (
        <ul className="leads-dashboard__follow-up-list">
          {followUps.map((followUp) => (
            <li className="leads-dashboard__follow-up" key={followUp.Id}>
              <div className="leads-dashboard__follow-up-top">
                <h4>{display(followUp.Name)}</h4>
                <time>{formatFollowUpDate(followUp.Follow_Up_Date__c)}</time>
              </div>
              <dl className="leads-dashboard__follow-up-fields">
                <div>
                  <dt>Status</dt>
                  <dd>{display(followUp.Status__c)}</dd>
                </div>
                <div>
                  <dt>Priority</dt>
                  <dd>{display(followUp.Priority__c)}</dd>
                </div>
                <div className="leads-dashboard__follow-up-assignee">
                  <dt>Assigned user ID</dt>
                  <dd>
                    {display(followUp.Assigned_To__c) === "—"
                      ? "Not assigned"
                      : display(followUp.Assigned_To__c)}
                  </dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{display(followUp.Follow_Up_Type__c)}</dd>
                </div>
              </dl>
              <p className="leads-dashboard__follow-up-notes">
                {value(followUp.Notes__c) || "No notes provided."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [source, setSource] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusDraft, setStatusDraft] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusSaveFeedback, setStatusSaveFeedback] = useState(null);
  const requestId = useRef(0);
  const dialogContentRef = useRef(null);
  const closeButtonRef = useRef(null);
  const detailsTriggerRef = useRef(null);

  const loadLeads = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = await api.getLeads();
      if (currentRequest === requestId.current) {
        setLeads(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(
          err.message ||
            "Unable to load leads from Salesforce. Please try again.",
        );
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadLeads();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      requestId.current += 1;
    };
  }, [loadLeads]);

  useLayoutEffect(() => {
    if (selectedLead) dialogContentRef.current?.scrollTo({ top: 0 });
  }, [selectedLead?.Id]);

  useEffect(() => {
    if (!selectedLead) return undefined;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedLead(null);
      if (event.key === "Tab") {
        const dialog = document.getElementById("lead-details-dialog");
        const focusable = dialog?.querySelectorAll(
          "button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      detailsTriggerRef.current?.focus();
    };
  }, [selectedLead]);

  const options = useMemo(
    () => ({
      statuses: [
        ...new Set(leads.map((lead) => value(lead.Status__c)).filter(Boolean)),
      ].sort(),
      types: [
        ...new Set(
          leads.map((lead) => value(lead.Enquiry_Type__c)).filter(Boolean),
        ),
      ].sort(),
      sources: [
        ...new Set(
          leads.map((lead) => value(lead.Lead_Source__c)).filter(Boolean),
        ),
      ].sort(),
    }),
    [leads],
  );

  const counts = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => normalized(lead.Status__c) === "new").length,
      testDrive: leads.filter(
        (lead) =>
          normalized(lead.Enquiry_Type__c).includes("test") &&
          normalized(lead.Enquiry_Type__c).includes("drive"),
      ).length,
      website: leads.filter((lead) =>
        normalized(lead.Lead_Source__c).includes("website"),
      ).length,
    }),
    [leads],
  );

  const filteredLeads = useMemo(() => {
    const query = normalized(search);
    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        [lead.Customer_Name__c, lead.Email__c, lead.Phone__c, lead.Name].some(
          (field) => normalized(field).includes(query),
        );
      return (
        matchesSearch &&
        (!status || value(lead.Status__c) === status) &&
        (!enquiryType || value(lead.Enquiry_Type__c) === enquiryType) &&
        (!source || value(lead.Lead_Source__c) === source)
      );
    });
  }, [leads, search, status, enquiryType, source]);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setEnquiryType("");
    setSource("");
  };
  const hasFilters = search || status || enquiryType || source;
  const openLeadDetails = (lead, event) => {
    detailsTriggerRef.current = event.currentTarget;
    setStatusDraft(value(lead.Status__c));
    setStatusSaveFeedback(null);
    setSelectedLead(lead);
  };
  const cancelStatusEdit = () => {
    setStatusDraft(value(selectedLead?.Status__c));
    setStatusSaveFeedback(null);
  };
  const saveLeadStatus = async () => {
    if (
      !selectedLead ||
      statusSaving ||
      !LEAD_STATUS_OPTIONS.includes(statusDraft) ||
      statusDraft === value(selectedLead.Status__c)
    ) return;

    const leadId = selectedLead.Id;
    const previousStatus = value(selectedLead.Status__c);
    setStatusSaving(true);
    setStatusSaveFeedback(null);
    try {
      const result = await api.updateLeadStatus(leadId, statusDraft);
      const savedStatus = value(result.data?.Status__c) || statusDraft;
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.Id === leadId ? { ...lead, Status__c: savedStatus } : lead,
        ),
      );
      setSelectedLead((currentLead) =>
        currentLead?.Id === leadId
          ? { ...currentLead, Status__c: savedStatus }
          : currentLead,
      );
      setStatusDraft(savedStatus);
      setStatus((currentStatus) =>
        currentStatus === previousStatus ? "" : currentStatus,
      );
      setStatusSaveFeedback({
        type: "success",
        message: "Lead status saved to Salesforce.",
      });
    } catch (err) {
      setStatusSaveFeedback({
        type: "error",
        message: err.message || "Unable to update the lead status.",
      });
    } finally {
      setStatusSaving(false);
    }
  };
  const detailValue = (field) => value(field) || "Not provided";
  const createdDate =
    selectedLead?.CreatedDate &&
    !Number.isNaN(new Date(selectedLead.CreatedDate).getTime())
      ? new Date(selectedLead.CreatedDate).toLocaleString()
      : "Not provided";

  return (
    <main className="leads-dashboard">
      <header className="leads-dashboard__header">
        <div className="leads-dashboard__intro">
          <p className="leads-dashboard__eyebrow">
            DrivingForce Motors · Admin
          </p>
          <h1>Leads Dashboard</h1>
          <p className="leads-dashboard__description">
            Customer enquiries synced from Salesforce.
          </p>
        </div>
        <button
          className="leads-dashboard__refresh"
          type="button"
          onClick={loadLeads}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>{" "}
          {loading ? "Refreshing…" : "Refresh leads"}
        </button>
      </header>

      <section className="leads-dashboard__cards" aria-label="Lead summaries">
        {[
          ["Total leads", counts.total, "leads-dashboard__card-value--accent"],
          ["New leads", counts.new, ""],
          ["Test-drive enquiries", counts.testDrive, ""],
          ["Website enquiries", counts.website, ""],
        ].map(([label, number, modifier]) => (
          <article className="leads-dashboard__card" key={label}>
            <p>{label}</p>
            <strong className={modifier}>{number}</strong>
          </article>
        ))}
      </section>

      {error && (
        <div
          className="leads-dashboard__message leads-dashboard__message--error"
          role="alert"
        >
          <div>
            <strong>Unable to load leads</strong>
            <p>{error}</p>
          </div>
          <button
            className="leads-dashboard__retry"
            type="button"
            onClick={loadLeads}
            disabled={loading}
          >
            Try again
          </button>
        </div>
      )}

      <section className="leads-dashboard__panel" aria-label="Lead records">
        <div className="leads-dashboard__toolbar">
          <label className="leads-dashboard__search-wrap">
            <span className="sr-only">Search leads</span>
            <span aria-hidden="true">⌕</span>
            <input
              className="leads-dashboard__search"
              type="search"
              placeholder="Search name, email, phone or lead number"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="leads-dashboard__filters">
            <label>
              <span className="sr-only">Filter by status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">All statuses</option>
                {options.statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by enquiry type</span>
              <select
                value={enquiryType}
                onChange={(event) => setEnquiryType(event.target.value)}
              >
                <option value="">All enquiry types</option>
                {options.types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by lead source</span>
              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                <option value="">All sources</option>
                {options.sources.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            {hasFilters && (
              <button
                type="button"
                className="leads-dashboard__clear"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
        <div className="leads-dashboard__table-meta">
          <h2>All leads</h2>
          <span>
            {filteredLeads.length}{" "}
            {filteredLeads.length === 1 ? "record" : "records"}
          </span>
        </div>
        {loading && leads.length === 0 ? (
          <div className="leads-dashboard__message" role="status">
            Loading leads from Salesforce…
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="leads-dashboard__message" role="status">
            {leads.length
              ? "No leads match these filters."
              : "No leads found in Salesforce."}
          </div>
        ) : (
          <div className="leads-dashboard__table-wrap">
            <table>
              <thead>
                <tr>
                  {[
                    "Salesforce Lead Number",
                    "Customer Name",
                    "Email",
                    "Phone",
                    "Enquiry Type",
                    "Lead Source",
                    "Status",
                    "Created Date",
                  ].map((heading) => (
                    <th scope="col" key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.Id}>
                    <td className="leads-dashboard__lead-id">
                      <button
                        className="leads-dashboard__details-trigger"
                        type="button"
                        onClick={(event) => openLeadDetails(lead, event)}
                        aria-label={`View details for lead ${display(lead.Name)}`}
                      >
                        {display(lead.Name)}
                      </button>
                    </td>
                    <td className="leads-dashboard__customer">
                      {display(lead.Customer_Name__c)}
                    </td>
                    <td>{display(lead.Email__c)}</td>
                    <td>{display(lead.Phone__c)}</td>
                    <td>{display(lead.Enquiry_Type__c)}</td>
                    <td>{display(lead.Lead_Source__c)}</td>
                    <td>
                      <span className="leads-dashboard__status">
                        {display(lead.Status__c)}
                      </span>
                    </td>
                    <td>
                      {lead.CreatedDate &&
                      !Number.isNaN(new Date(lead.CreatedDate).getTime())
                        ? new Date(lead.CreatedDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {selectedLead && (
        <div
          className="leads-dashboard__dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedLead(null);
          }}
        >
          <section
            className="leads-dashboard__dialog"
            id="lead-details-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-details-title"
            aria-describedby="lead-details-description"
            tabIndex={-1}
          >
            <header className="leads-dashboard__dialog-header">
              <div>
                <p className="leads-dashboard__eyebrow">Lead record</p>
                <h2 id="lead-details-title">
                  {detailValue(selectedLead.Name)}
                </h2>
                <p id="lead-details-description">
                  Full enquiry details from the selected Salesforce record.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                className="leads-dashboard__dialog-close"
                type="button"
                onClick={() => setSelectedLead(null)}
                aria-label="Close lead details"
              >
                ×
              </button>
            </header>
            <div
              className="leads-dashboard__dialog-content"
              ref={dialogContentRef}
            >
              <dl className="leads-dashboard__details-grid">
                {[
                  ["Salesforce lead number", selectedLead.Name],
                  ["Customer name", selectedLead.Customer_Name__c],
                  ["Email", selectedLead.Email__c],
                  ["Phone", selectedLead.Phone__c],
                  ["Enquiry type", selectedLead.Enquiry_Type__c],
                  ["Lead source", selectedLead.Lead_Source__c],
                  ["Status", selectedLead.Status__c],
                  ["Created date", createdDate],
                ].map(([label, field]) => (
                  <div className="leads-dashboard__detail-item" key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {label === "Created date" ? field : detailValue(field)}
                    </dd>
                  </div>
                ))}
                <div className="leads-dashboard__detail-item">
                  <dt>Related vehicle</dt>
                  <dd>
                    {value(selectedLead.Vehicle__c)
                      ? detailValue(selectedLead.Vehicle__r?.Name) !==
                        "Not provided"
                        ? detailValue(selectedLead.Vehicle__r?.Name)
                        : value(selectedLead.Vehicle__c)
                      : "No vehicle associated"}
                  </dd>
                  {value(selectedLead.Vehicle__c) &&
                    (value(selectedLead.Vehicle__r?.Brand__c) ||
                      value(selectedLead.Vehicle__r?.Model__c)) && (
                      <dd className="leads-dashboard__vehicle-meta">
                        {[
                          selectedLead.Vehicle__r?.Brand__c,
                          selectedLead.Vehicle__r?.Model__c,
                        ]
                          .filter((part) => value(part))
                          .join(" · ")}
                      </dd>
                    )}
                </div>
                {value(selectedLead.Vehicle__c) && (
                  <div className="leads-dashboard__detail-item">
                    <dt>Vehicle Salesforce ID</dt>
                    <dd>{value(selectedLead.Vehicle__c)}</dd>
                  </div>
                )}
                <div className="leads-dashboard__detail-item leads-dashboard__detail-item--notes">
                  <dt>Enquiry notes</dt>
                  <dd>{detailValue(selectedLead.Notes__c)}</dd>
                </div>
              </dl>
              <section
                className="leads-dashboard__status-editor"
                aria-labelledby="lead-status-editor-title"
              >
                <div className="leads-dashboard__status-editor-heading">
                  <div>
                    <p className="leads-dashboard__eyebrow">Salesforce record</p>
                    <h3 id="lead-status-editor-title">Update lead status</h3>
                  </div>
                  <label className="leads-dashboard__status-select-label">
                    <span>Status</span>
                    <select
                      value={statusDraft}
                      disabled={statusSaving}
                      onChange={(event) => {
                        setStatusDraft(event.target.value);
                        setStatusSaveFeedback(null);
                      }}
                    >
                      {!statusDraft && (
                        <option value="" disabled>Select a status</option>
                      )}
                      {statusDraft && !LEAD_STATUS_OPTIONS.includes(statusDraft) && (
                        <option value={statusDraft} disabled>
                          Existing status: {statusDraft}
                        </option>
                      )}
                      {LEAD_STATUS_OPTIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="leads-dashboard__status-editor-actions">
                  <button
                    type="button"
                    className="leads-dashboard__status-cancel"
                    onClick={cancelStatusEdit}
                    disabled={statusSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="leads-dashboard__status-save"
                    onClick={saveLeadStatus}
                    disabled={
                      statusSaving ||
                      !LEAD_STATUS_OPTIONS.includes(statusDraft) ||
                      statusDraft === value(selectedLead.Status__c)
                    }
                  >
                    {statusSaving ? "Saving…" : "Save status"}
                  </button>
                </div>
                {statusSaveFeedback && (
                  <p
                    className={`leads-dashboard__status-feedback leads-dashboard__status-feedback--${statusSaveFeedback.type}`}
                    role={statusSaveFeedback.type === "error" ? "alert" : "status"}
                  >
                    {statusSaveFeedback.message}
                  </p>
                )}
              </section>
              <LeadFollowUps key={selectedLead.Id} leadId={selectedLead.Id} />
            </div>
            <footer className="leads-dashboard__dialog-footer">
              <button
                type="button"
                className="leads-dashboard__refresh"
                onClick={() => setSelectedLead(null)}
              >
                Close details
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

export default LeadsDashboard;
