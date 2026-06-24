import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const typeColors = {
  prescription:   { bg: "#e8f5e9", color: "#2e7d32" },
  lab_result:     { bg: "#e3f2fd", color: "#1565c0" },
  medical_record: { bg: "#fce4ec", color: "#880e4f" },
  radiology:      { bg: "#f3e5f5", color: "#6a1b9a" },
  invoice:        { bg: "#fff8e1", color: "#e65100" },
  referral_letter:{ bg: "#fbe9e7", color: "#bf360c" }
};

const PatientDocuments = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/auth/patients")
      .then(({ data }) => setPatients(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadDocs = async (patient) => {
    setSelectedPatient(patient);
    setLoadingDocs(true);
    setDocuments([]);
    try {
      const { data } = await API.get(`/documents/patient/${patient._id}`);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Patient Documents</h2>
          <p style={styles.sub}>Select a patient to view their uploaded documents</p>
        </div>

        <div style={styles.layout}>
          <div style={styles.patientList}>
            <div style={styles.searchWrap}>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filteredPatients.length === 0 ? (
              <div style={styles.noPatients}>No patients found.</div>
            ) : (
              filteredPatients.map((p) => (
                <div
                  key={p._id}
                  style={{
                    ...styles.patientItem,
                    ...(selectedPatient?._id === p._id ? styles.patientItemActive : {})
                  }}
                  onClick={() => loadDocs(p)}
                >
                  <div style={{
                    ...styles.patientAvatar,
                    backgroundColor: selectedPatient?._id === p._id ? "#fff" : "#1a73e8",
                    color: selectedPatient?._id === p._id ? "#1a73e8" : "#fff"
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{
                      ...styles.patientName,
                      color: selectedPatient?._id === p._id ? "#fff" : "#333"
                    }}>
                      {p.name}
                    </div>
                    <div style={{
                      ...styles.patientEmail,
                      color: selectedPatient?._id === p._id ? "rgba(255,255,255,0.75)" : "#999"
                    }}>
                      {p.email}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.docsPanel}>
            {!selectedPatient ? (
              <div style={styles.selectPrompt}>
                <div style={styles.promptIcon}>📁</div>
                <div style={styles.promptTitle}>Select a patient</div>
                <div style={styles.promptSub}>Choose a patient to view their documents</div>
              </div>
            ) : loadingDocs ? (
              <div style={styles.center}>Loading documents...</div>
            ) : (
              <>
                <div style={styles.panelHeader}>
                  <div>
                    <div style={styles.panelTitle}>{selectedPatient.name}</div>
                    <div style={styles.panelSub}>
                      {documents.length} document{documents.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {documents.length === 0 ? (
                  <div style={styles.emptyDocs}>
                    <div style={styles.emptyIcon}>📄</div>
                    <div style={styles.emptyTitle}>No documents yet</div>
                    <div style={styles.emptySub}>No files have been uploaded for this patient</div>
                  </div>
                ) : (
                  <div style={styles.docsGrid}>
                    {documents.map((doc) => {
                      const tc = typeColors[doc.documentType] || { bg: "#f5f5f5", color: "#555" };
                      const filePath = doc.filePath ? doc.filePath.replace(/\\/g, "/") : "";
                      return (
                        <div key={doc._id} style={styles.docCard}>
                          <div style={styles.docCardTop}>
                            <span style={{ ...styles.typeBadge, backgroundColor: tc.bg, color: tc.color }}>
                              {doc.documentType.replace(/_/g, " ")}
                            </span>
                            <span style={{
                              ...styles.statusDot,
                              backgroundColor: doc.status === "active" ? "#4caf50" : "#bbb"
                            }} />
                          </div>
                          <div style={styles.docName}>{doc.fileName || "document"}</div>
                          <div style={styles.docMeta}>
                            {new Date(doc.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </div>
                          <a
                            href={"http://localhost:5000/" + filePath}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.viewBtn}
                          >
                            View / Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "1000px", margin: "0 auto" },
  header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: "16px", alignItems: "start" },
  patientList: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden"
  },
  searchWrap: { padding: "10px" },
  searchInput: {
    width: "100%", padding: "8px 12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "13px", boxSizing: "border-box", outline: "none"
  },
  noPatients: { padding: "20px", fontSize: "13px", color: "#aaa", textAlign: "center" },
  patientItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 14px", cursor: "pointer",
    borderTop: "1px solid #f9f9f9"
  },
  patientItemActive: { backgroundColor: "#1a73e8" },
  patientAvatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "14px",
    fontWeight: "700", flexShrink: 0
  },
  patientName: { fontSize: "13px", fontWeight: "600" },
  patientEmail: { fontSize: "11px", marginTop: "1px" },
  docsPanel: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    padding: "20px", minHeight: "400px"
  },
  selectPrompt: { textAlign: "center", padding: "60px 20px" },
  promptIcon: { fontSize: "40px", marginBottom: "12px" },
  promptTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  promptSub: { fontSize: "14px", color: "#999", marginTop: "6px" },
  panelHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "16px",
    paddingBottom: "14px", borderBottom: "1px solid #f0f0f0"
  },
  panelTitle: { fontSize: "16px", fontWeight: "700", color: "#333" },
  panelSub: { fontSize: "13px", color: "#888", marginTop: "2px" },
  emptyDocs: { textAlign: "center", padding: "40px 20px" },
  emptyIcon: { fontSize: "36px", marginBottom: "10px" },
  emptyTitle: { fontSize: "15px", fontWeight: "600", color: "#333" },
  emptySub: { fontSize: "13px", color: "#999", marginTop: "4px" },
  docsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px"
  },
  docCard: {
    border: "1px solid #f0f0f0", borderRadius: "10px",
    padding: "14px", backgroundColor: "#fafafa",
    display: "flex", flexDirection: "column", gap: "6px"
  },
  docCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  typeBadge: {
    fontSize: "11px", padding: "3px 8px",
    borderRadius: "10px", fontWeight: "600", textTransform: "capitalize"
  },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%" },
  docName: { fontSize: "13px", fontWeight: "600", color: "#333" },
  docMeta: { fontSize: "12px", color: "#aaa" },
  viewBtn: {
    marginTop: "6px", display: "block", textAlign: "center",
    backgroundColor: "#1a73e8", color: "#fff",
    padding: "8px", borderRadius: "7px",
    textDecoration: "none", fontSize: "12px", fontWeight: "600"
  }
};

export default PatientDocuments;