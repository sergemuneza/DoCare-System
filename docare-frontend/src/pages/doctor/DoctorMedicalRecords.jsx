import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const DoctorMedicalRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ diagnosis: "", notes: "", visitDate: "" });
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get("/auth/patients")
      .then(({ data }) => setPatients(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadPatientRecords = async (patient) => {
    setSelectedPatient(patient);
    setLoadingRecords(true);
    setRecords([]);
    setShowForm(false);
    try {
      const { data } = await API.get(`/records/${patient._id}`);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await API.post("/records", {
        patientId: selectedPatient._id,
        ...form
      });
      setRecords([data, ...records]);
      setForm({ diagnosis: "", notes: "", visitDate: "" });
      setShowForm(false);
      setSuccess("Medical record created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create record");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading patients...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Medical Records</h2>
          <p style={styles.sub}>Select a patient to view or create records</p>
        </div>

        <div style={styles.layout}>
          <div style={styles.patientList}>
            <div style={styles.listHeader}>
              Patients ({patients.length})
            </div>
            {patients.length === 0 ? (
              <div style={styles.noPatients}>No patients registered yet.</div>
            ) : (
              patients.map((p) => (
                <div
                  key={p._id}
                  style={{
                    ...styles.patientItem,
                    ...(selectedPatient?._id === p._id ? styles.patientItemActive : {})
                  }}
                  onClick={() => loadPatientRecords(p)}
                >
                  <div style={{
                    ...styles.patientAvatar,
                    backgroundColor: selectedPatient?._id === p._id ? "#fff" : "#00796b",
                    color: selectedPatient?._id === p._id ? "#00796b" : "#fff"
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={styles.patientName}>{p.name}</div>
                    <div style={styles.patientEmail}>{p.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.recordsPanel}>
            {!selectedPatient ? (
              <div style={styles.selectPrompt}>
                <div style={styles.promptIcon}>👤</div>
                <div style={styles.promptTitle}>Select a patient</div>
                <div style={styles.promptSub}>Choose a patient from the list to view their medical records</div>
              </div>
            ) : (
              <>
                <div style={styles.panelHeader}>
                  <div>
                    <div style={styles.panelTitle}>{selectedPatient.name}</div>
                    <div style={styles.panelSub}>{records.length} record{records.length !== 1 ? "s" : ""}</div>
                  </div>
                  <button
                    style={styles.newRecordBtn}
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? "Cancel" : "+ New Record"}
                  </button>
                </div>

                {success && <div style={styles.success}>{success}</div>}
                {error && <div style={styles.error}>{error}</div>}

                {showForm && (
                  <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formTitle}>New medical record</div>
                    <div style={styles.field}>
                      <label style={styles.label}>Diagnosis</label>
                      <input
                        style={styles.input}
                        type="text"
                        value={form.diagnosis}
                        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                        placeholder="Enter diagnosis"
                        required
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Visit date</label>
                      <input
                        style={styles.input}
                        type="datetime-local"
                        value={form.visitDate}
                        onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Doctor notes</label>
                      <textarea
                        style={styles.textarea}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Add clinical notes, observations, treatment plan..."
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Record"}
                    </button>
                  </form>
                )}

                {loadingRecords ? (
                  <div style={styles.center}>Loading records...</div>
                ) : records.length === 0 ? (
                  <div style={styles.emptyRecords}>
                    <div style={styles.emptyIcon}>📋</div>
                    <div style={styles.emptyTitle}>No records yet</div>
                    <div style={styles.emptySub}>Create the first medical record for this patient</div>
                  </div>
                ) : (
                  <div style={styles.recordsList}>
                    {records.map((r) => (
                      <div key={r._id} style={styles.recordCard}>
                        <div style={styles.recordHeader}>
                          <div>
                            <div style={styles.diagnosisTag}>Diagnosis</div>
                            <div style={styles.diagnosisText}>{r.diagnosis}</div>
                          </div>
                          <div style={styles.recordDate}>
                            {new Date(r.visitDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </div>
                        </div>
                        {r.notes && (
                          <div style={styles.notesBox}>
                            <div style={styles.notesLabel}>Notes</div>
                            <div style={styles.notesText}>{r.notes}</div>
                          </div>
                        )}
                      </div>
                    ))}
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
  listHeader: {
    padding: "14px 16px", fontSize: "12px",
    fontWeight: "600", color: "#888",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "1px solid #f0f0f0"
  },
  noPatients: { padding: "20px", fontSize: "13px", color: "#aaa", textAlign: "center" },
  patientItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", cursor: "pointer",
    borderBottom: "1px solid #f9f9f9",
    transition: "background 0.15s"
  },
  patientItemActive: { backgroundColor: "#00796b" },
  patientAvatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "14px",
    fontWeight: "700", flexShrink: 0
  },
  patientName: { fontSize: "13px", fontWeight: "600", color: "#333" },
  patientEmail: { fontSize: "11px", color: "#999", marginTop: "1px" },
  recordsPanel: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    padding: "20px", minHeight: "400px"
  },
  selectPrompt: {
    textAlign: "center", padding: "60px 20px"
  },
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
  newRecordBtn: {
    padding: "8px 16px", backgroundColor: "#00796b",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "14px", fontSize: "14px", fontWeight: "500"
  },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "14px", fontSize: "14px"
  },
  form: {
    backgroundColor: "#f9f9f9", borderRadius: "10px",
    padding: "16px", marginBottom: "16px",
    border: "1px solid #e8e8e8"
  },
  formTitle: { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "12px" },
  field: { marginBottom: "12px" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#555", marginBottom: "5px" },
  input: {
    width: "100%", padding: "9px 12px",
    borderRadius: "7px", border: "1px solid #ddd",
    fontSize: "14px", boxSizing: "border-box"
  },
  textarea: {
    width: "100%", padding: "9px 12px",
    borderRadius: "7px", border: "1px solid #ddd",
    fontSize: "14px", resize: "vertical",
    minHeight: "90px", fontFamily: "inherit",
    boxSizing: "border-box"
  },
  saveBtn: {
    padding: "10px 20px", backgroundColor: "#00796b",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer"
  },
  emptyRecords: {
    textAlign: "center", padding: "40px 20px"
  },
  emptyIcon: { fontSize: "36px", marginBottom: "10px" },
  emptyTitle: { fontSize: "15px", fontWeight: "600", color: "#333" },
  emptySub: { fontSize: "13px", color: "#999", marginTop: "4px" },
  recordsList: { display: "flex", flexDirection: "column", gap: "12px" },
  recordCard: {
    border: "1px solid #f0f0f0", borderRadius: "10px",
    padding: "14px", backgroundColor: "#fafafa"
  },
  recordHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "10px"
  },
  diagnosisTag: {
    fontSize: "11px", fontWeight: "600", color: "#00796b",
    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px"
  },
  diagnosisText: { fontSize: "15px", fontWeight: "600", color: "#333" },
  recordDate: { fontSize: "12px", color: "#aaa" },
  notesBox: {
    backgroundColor: "#fff", borderRadius: "7px",
    padding: "10px", borderLeft: "3px solid #00796b"
  },
  notesLabel: { fontSize: "11px", color: "#aaa", fontWeight: "600", marginBottom: "4px" },
  notesText: { fontSize: "13px", color: "#555", lineHeight: "1.6" }
};

export default DoctorMedicalRecords;