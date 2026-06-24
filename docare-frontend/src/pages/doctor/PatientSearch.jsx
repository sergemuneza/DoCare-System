import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const PatientSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSelected(null);
    try {
      const { data } = await API.get(`/auth/patients/search?q=${query}`);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (patient) => {
    setSelected(patient);
    setActiveTab("documents");
    setLoadingDetail(true);
    try {
      const [docsRes, recsRes, apptsRes] = await Promise.all([
        API.get(`/documents/patient/${patient._id}`),
        API.get(`/records/${patient._id}`),
        API.get("/appointments/doctor")
      ]);
      setDocuments(docsRes.data);
      setRecords(recsRes.data);
      setAppointments(apptsRes.data.filter(
        (a) => a.patient?._id === patient._id || a.patient === patient._id
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const typeColors = {
    prescription:    { bg: "#e8f5e9", color: "#2e7d32" },
    lab_result:      { bg: "#e3f2fd", color: "#1565c0" },
    medical_record:  { bg: "#fce4ec", color: "#880e4f" },
    radiology:       { bg: "#f3e5f5", color: "#6a1b9a" },
    invoice:         { bg: "#fff8e1", color: "#e65100" },
    referral_letter: { bg: "#fbe9e7", color: "#bf360c" }
  };

  const statusBadge = (status) => {
    const map = {
      approved:  { bg: "#e8f5e9", color: "#2e7d32" },
      completed: { bg: "#e3f2fd", color: "#1565c0" },
      pending:   { bg: "#fff8e1", color: "#e65100" },
      cancelled: { bg: "#fdecea", color: "#c62828" }
    };
    const s = map[status] || { bg: "#f5f5f5", color: "#777" };
    return (
      <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Patient Search</h2>
          <p style={styles.sub}>Search for a patient to view their full medical overview</p>
        </div>

        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by patient name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button style={styles.searchBtn} onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {results.length > 0 && !selected && (
          <div style={styles.results}>
            <div style={styles.resultsTitle}>{results.length} patient{results.length !== 1 ? "s" : ""} found</div>
            {results.map((p) => (
              <div key={p._id} style={styles.resultItem} onClick={() => handleSelect(p)}>
                <div style={styles.resultAvatar}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.resultInfo}>
                  <div style={styles.resultName}>{p.name}</div>
                  <div style={styles.resultEmail}>{p.email}</div>
                </div>
                <div style={styles.resultMeta}>
                  Joined {new Date(p.createdAt).toLocaleDateString()}
                </div>
                <button style={styles.viewBtn}>View</button>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && query && !loading && (
          <div style={styles.noResults}>No patients found for "{query}"</div>
        )}

        {selected && (
          <div style={styles.patientView}>
            <div style={styles.patientHeader}>
              <div style={styles.patientLeft}>
                <div style={styles.patientAvatar}>
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={styles.patientName}>{selected.name}</h3>
                  <div style={styles.patientEmail}>{selected.email}</div>
                </div>
              </div>
              <div style={styles.patientActions}>
                <button
                  style={styles.uploadBtn}
                  onClick={() => navigate("/doctor/upload")}
                >
                  Upload Document
                </button>
                <button
                  style={styles.recordBtn}
                  onClick={() => navigate("/doctor/records")}
                >
                  Add Record
                </button>
                <button
                  style={styles.clearBtn}
                  onClick={() => { setSelected(null); setResults([]); setQuery(""); }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div style={styles.summaryRow}>
              {[
                { label: "Documents", count: documents.length, color: "#1a73e8", bg: "#e8f0fe" },
                { label: "Medical records", count: records.length, color: "#00796b", bg: "#e0f2f1" },
                { label: "Appointments", count: appointments.length, color: "#6a1b9a", bg: "#f3e5f5" }
              ].map((s) => (
                <div key={s.label} style={{ ...styles.summaryCard, backgroundColor: s.bg }}>
                  <div style={{ ...styles.summaryCount, color: s.color }}>{s.count}</div>
                  <div style={{ ...styles.summaryLabel, color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={styles.tabs}>
              {["documents", "records", "appointments"].map((tab) => (
                <button
                  key={tab}
                  style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span style={styles.tabCount}>
                    {tab === "documents" ? documents.length
                      : tab === "records" ? records.length
                      : appointments.length}
                  </span>
                </button>
              ))}
            </div>

            {loadingDetail ? (
              <div style={styles.tabLoading}>Loading patient data...</div>
            ) : (
              <div style={styles.tabContent}>
                {activeTab === "documents" && (
                  documents.length === 0 ? (
                    <div style={styles.empty}>No documents uploaded for this patient.</div>
                  ) : (
                    documents.map((doc) => {
                      const tc = typeColors[doc.documentType] || { bg: "#f5f5f5", color: "#555" };
                      const filePath = doc.filePath ? doc.filePath.replace(/\\/g, "/") : "";
                      return (
                        <div key={doc._id} style={styles.itemCard}>
                          <div style={styles.itemLeft}>
                            <span style={{ ...styles.typeBadge, backgroundColor: tc.bg, color: tc.color }}>
                              {doc.documentType.replace(/_/g, " ")}
                            </span>
                            <div style={styles.itemTitle}>{doc.fileName || "document"}</div>
                            <div style={styles.itemSub}>
                              {new Date(doc.createdAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                              })}
                            </div>
                          </div>
                          <a
                            href={"http://localhost:5000/" + filePath}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.downloadLink}
                          >
                            View
                          </a>
                        </div>
                      );
                    })
                  )
                )}

                {activeTab === "records" && (
                  records.length === 0 ? (
                    <div style={styles.empty}>No medical records for this patient.</div>
                  ) : (
                    records.map((r) => (
                      <div key={r._id} style={styles.itemCard}>
                        <div style={styles.itemLeft}>
                          <div style={styles.diagTag}>Diagnosis</div>
                          <div style={styles.itemTitle}>{r.diagnosis}</div>
                          <div style={styles.itemSub}>
                            {new Date(r.visitDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </div>
                          {r.notes && <div style={styles.notes}>{r.notes}</div>}
                        </div>
                      </div>
                    ))
                  )
                )}

                {activeTab === "appointments" && (
                  appointments.length === 0 ? (
                    <div style={styles.empty}>No appointments with this patient.</div>
                  ) : (
                    appointments.map((a) => (
                      <div key={a._id} style={styles.itemCard}>
                        <div style={styles.itemLeft}>
                          <div style={styles.itemTitle}>
                            {new Date(a.appointmentDate).toLocaleDateString("en-US", {
                              weekday: "short", month: "short",
                              day: "numeric", year: "numeric"
                            })}
                          </div>
                          {a.reason && <div style={styles.itemSub}>{a.reason}</div>}
                        </div>
                        {statusBadge(a.status)}
                      </div>
                    ))
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  container: { padding: "24px", maxWidth: "900px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  searchBox: { display: "flex", gap: "10px", marginBottom: "20px" },
  searchInput: {
    flex: 1, padding: "12px 16px",
    borderRadius: "10px", border: "1px solid #ddd",
    fontSize: "14px", outline: "none",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
  },
  searchBtn: {
    padding: "12px 24px", backgroundColor: "#00796b",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer"
  },
  results: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    overflow: "hidden", marginBottom: "20px"
  },
  resultsTitle: {
    padding: "12px 16px", fontSize: "12px",
    fontWeight: "600", color: "#888",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "1px solid #f5f5f5"
  },
  resultItem: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px 16px", borderBottom: "1px solid #f9f9f9",
    cursor: "pointer"
  },
  resultAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    backgroundColor: "#00796b", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "15px",
    fontWeight: "700", flexShrink: 0
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: "14px", fontWeight: "600", color: "#333" },
  resultEmail: { fontSize: "12px", color: "#999", marginTop: "2px" },
  resultMeta: { fontSize: "12px", color: "#aaa" },
  viewBtn: {
    padding: "6px 14px", backgroundColor: "#e0f2f1",
    color: "#00796b", border: "none", borderRadius: "6px",
    fontSize: "12px", fontWeight: "600", cursor: "pointer"
  },
  noResults: {
    textAlign: "center", padding: "40px",
    backgroundColor: "#fff", borderRadius: "12px",
    color: "#aaa", fontSize: "14px"
  },
  patientView: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    overflow: "hidden"
  },
  patientHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "20px",
    borderBottom: "1px solid #f0f0f0",
    flexWrap: "wrap", gap: "12px"
  },
  patientLeft: { display: "flex", alignItems: "center", gap: "14px" },
  patientAvatar: {
    width: "48px", height: "48px", borderRadius: "50%",
    backgroundColor: "#00796b", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "20px", fontWeight: "700"
  },
  patientName: { fontSize: "18px", fontWeight: "700", color: "#333", margin: 0 },
  patientEmail: { fontSize: "13px", color: "#888", marginTop: "3px" },
  patientActions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  uploadBtn: {
    padding: "8px 14px", backgroundColor: "#1a73e8",
    color: "#fff", border: "none", borderRadius: "7px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  recordBtn: {
    padding: "8px 14px", backgroundColor: "#00796b",
    color: "#fff", border: "none", borderRadius: "7px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  clearBtn: {
    padding: "8px 14px", backgroundColor: "#f5f5f5",
    color: "#555", border: "1px solid #ddd",
    borderRadius: "7px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  },
  summaryRow: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0", borderBottom: "1px solid #f0f0f0"
  },
  summaryCard: {
    padding: "16px", textAlign: "center",
    borderRight: "1px solid rgba(0,0,0,0.06)"
  },
  summaryCount: { fontSize: "28px", fontWeight: "700" },
  summaryLabel: { fontSize: "12px", fontWeight: "500", marginTop: "2px" },
  tabs: {
    display: "flex", borderBottom: "1px solid #f0f0f0",
    padding: "0 16px"
  },
  tab: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "12px 16px", border: "none",
    backgroundColor: "transparent", cursor: "pointer",
    fontSize: "13px", fontWeight: "500", color: "#888",
    borderBottom: "2px solid transparent"
  },
  tabActive: { color: "#00796b", borderBottom: "2px solid #00796b" },
  tabCount: {
    backgroundColor: "#f0f0f0", borderRadius: "10px",
    padding: "1px 7px", fontSize: "11px", fontWeight: "700"
  },
  tabLoading: { textAlign: "center", padding: "40px", color: "#aaa", fontSize: "14px" },
  tabContent: { padding: "16px" },
  itemCard: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", padding: "12px",
    borderRadius: "8px", backgroundColor: "#fafafa",
    marginBottom: "8px", border: "1px solid #f0f0f0"
  },
  itemLeft: { flex: 1 },
  typeBadge: {
    fontSize: "11px", padding: "2px 8px",
    borderRadius: "10px", fontWeight: "600",
    textTransform: "capitalize", display: "inline-block",
    marginBottom: "6px"
  },
  diagTag: {
    fontSize: "11px", fontWeight: "600",
    color: "#00796b", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: "4px"
  },
  itemTitle: { fontSize: "14px", fontWeight: "600", color: "#333" },
  itemSub: { fontSize: "12px", color: "#aaa", marginTop: "3px" },
  notes: {
    fontSize: "13px", color: "#555",
    fontStyle: "italic", marginTop: "6px"
  },
  badge: { fontSize: "12px", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" },
  downloadLink: {
    padding: "6px 12px", backgroundColor: "#e3f2fd",
    color: "#1565c0", borderRadius: "6px",
    textDecoration: "none", fontSize: "12px",
    fontWeight: "600", flexShrink: 0
  },
  empty: { textAlign: "center", padding: "40px", color: "#aaa", fontSize: "14px" }
};

export default PatientSearch;