import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const statusConfig = {
  pending:   { bg: "#fff8e1", color: "#e65100" },
  approved:  { bg: "#e8f5e9", color: "#2e7d32" },
  completed: { bg: "#e3f2fd", color: "#1565c0" },
  cancelled: { bg: "#fdecea", color: "#c62828" }
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [proposing, setProposing] = useState(null);
const [proposedDate, setProposedDate] = useState("");
//----------


  useEffect(() => {
    API.get("/appointments/doctor")
      .then(({ data }) => setAppointments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map((a) =>
        a._id === id ? { ...a, status } : a
      ));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };
//----------
const handlePropose = async (id) => {
  if (!proposedDate) return;
  try {
    await API.put(`/appointments/${id}/propose`, { proposedDate });
    setAppointments(appointments.map((a) =>
      a._id === id ? { ...a, proposedDate, status: "pending" } : a
    ));
    setProposing(null);
    setProposedDate("");
  } catch (err) {
    alert("Failed to propose new date");
  }
};

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading appointments...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Appointments</h2>
          <p style={styles.sub}>{appointments.length} total appointment{appointments.length !== 1 ? "s" : ""}</p>
        </div>

        <div style={styles.statsRow}>
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} style={{ ...styles.statCard, backgroundColor: val.bg }}>
              <div style={{ ...styles.statNum, color: val.color }}>
                {appointments.filter((a) => a.status === key).length}
              </div>
              <div style={{ ...styles.statLabel, color: val.color }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.filters}>
          {["all", "pending", "approved", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span style={styles.filterCount}>
                  {appointments.filter((a) => a.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <div style={styles.emptyTitle}>No appointments found</div>
            <div style={styles.emptySub}>
              {filter === "all" ? "No appointments booked yet" : `No ${filter} appointments`}
            </div>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((a) => {
              const sc = statusConfig[a.status] || { bg: "#f5f5f5", color: "#777" };
              const isExpanded = expanded === a._id;
              return (
                <div key={a._id} style={styles.card}>
                  <div
                    style={styles.cardHeader}
                    onClick={() => setExpanded(isExpanded ? null : a._id)}
                  >
                    <div style={styles.patientRow}>
                      <div style={styles.patientAvatar}>
                        {(a.patient?.name || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.patientName}>{a.patient?.name || "Unknown"}</div>
                        <div style={styles.apptTime}>
                          {new Date(a.appointmentDate).toLocaleDateString("en-US", {
                            weekday: "short", month: "short", day: "numeric", year: "numeric"
                          })}
                          {" · "}
                          {new Date(a.appointmentDate).toLocaleTimeString("en-US", {
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardRight}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: sc.bg, color: sc.color
                      }}>
                        {a.status}
                      </span>
                      <span style={styles.chevron}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.cardBody}>
                      <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Patient name</div>
                          <div style={styles.detailValue}>{a.patient?.name}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Patient email</div>
                          <div style={styles.detailValue}>{a.patient?.email}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Appointment date</div>
                          <div style={styles.detailValue}>
                            {new Date(a.appointmentDate).toLocaleString()}
                          </div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Booked on</div>
                          <div style={styles.detailValue}>
                            {new Date(a.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {a.reason && (
                        <div style={styles.reasonBox}>
                          <div style={styles.detailLabel}>Reason for visit</div>
                          <div style={styles.reasonText}>{a.reason}</div>
                        </div>
                      )}
                      {(a.status === "pending" || a.status === "approved") && (
  <div style={{ marginTop: "10px" }}>
    {proposing === a._id ? (
      <div style={styles.proposeForm}>
        <input
          type="datetime-local"
          style={styles.proposeInput}
          value={proposedDate}
          onChange={(e) => setProposedDate(e.target.value)}
        />
        <button style={styles.proposeBtn} onClick={() => handlePropose(a._id)}>
          Send Proposal
        </button>
        <button style={styles.cancelProposeBtn} onClick={() => setProposing(null)}>
          Cancel
        </button>
      </div>
    ) : (
      <button style={styles.rescheduleBtn} onClick={() => setProposing(a._id)}>
        Propose New Date
      </button>
    )}
  </div>
)}
                      
                      {a.status === "pending" && (
                        <div style={styles.actionRow}>
                          <button
                            style={styles.approveBtn}
                            disabled={!!updating}
                            onClick={() => updateStatus(a._id, "approved")}
                          >
                            {updating === a._id + "approved" ? "..." : "Approve"}
                          </button>
                          <button
                            style={styles.completeBtn}
                            disabled={!!updating}
                            onClick={() => updateStatus(a._id, "completed")}
                          >
                            {updating === a._id + "completed" ? "..." : "Mark Completed"}
                          </button>
                          <button
                            style={styles.cancelBtn}
                            disabled={!!updating}
                            onClick={() => updateStatus(a._id, "cancelled")}
                          >
                            {updating === a._id + "cancelled" ? "..." : "Cancel"}
                          </button>
                        </div>
                      )}

                      {a.status === "approved" && (
                        <div style={styles.actionRow}>
                          <button
                            style={styles.completeBtn}
                            disabled={!!updating}
                            onClick={() => updateStatus(a._id, "completed")}
                          >
                            {updating === a._id + "completed" ? "..." : "Mark as Completed"}
                          </button>
                          <button
                            style={styles.cancelBtn}
                            disabled={!!updating}
                            onClick={() => updateStatus(a._id, "cancelled")}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "860px", margin: "0 auto" },
  header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px", marginBottom: "20px"
  },
  statCard: { borderRadius: "10px", padding: "14px", textAlign: "center" },
  statNum: { fontSize: "24px", fontWeight: "700" },
  statLabel: { fontSize: "12px", fontWeight: "500", marginTop: "2px" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  filterBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "13px", cursor: "pointer", color: "#555"
  },
  filterActive: { backgroundColor: "#00796b", color: "#fff", borderColor: "#00796b" },
  filterCount: {
    backgroundColor: "rgba(0,0,0,0.12)", borderRadius: "10px",
    padding: "0 6px", fontSize: "11px", fontWeight: "700"
  },
  emptyState: {
    textAlign: "center", padding: "60px 20px",
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  emptySub: { fontSize: "14px", color: "#999", marginTop: "6px" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden"
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "16px 20px", cursor: "pointer"
  },
  patientRow: { display: "flex", alignItems: "center", gap: "12px" },
  patientAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    backgroundColor: "#00796b", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "16px",
    fontWeight: "700", flexShrink: 0
  },
  patientName: { fontSize: "15px", fontWeight: "600", color: "#333" },
  apptTime: { fontSize: "13px", color: "#777", marginTop: "2px" },
  cardRight: { display: "flex", alignItems: "center", gap: "10px" },
  statusBadge: {
    fontSize: "12px", padding: "3px 10px",
    borderRadius: "12px", fontWeight: "600"
  },
  chevron: { color: "#aaa", fontSize: "11px" },
  cardBody: {
    borderTop: "1px solid #f0f0f0",
    padding: "16px 20px", backgroundColor: "#fafafa"
  },
  detailGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "12px", marginBottom: "14px"
  },
  detailItem: {},
  detailLabel: {
    fontSize: "11px", color: "#aaa",
    fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em"
  },
  detailValue: { fontSize: "14px", color: "#333", fontWeight: "500", marginTop: "3px" },
  reasonBox: {
    backgroundColor: "#f5f5f5", borderRadius: "8px",
    padding: "12px", marginBottom: "14px"
  },
  reasonText: { fontSize: "14px", color: "#555", marginTop: "6px", lineHeight: "1.6" },
  actionRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  approveBtn: {
    padding: "8px 18px", backgroundColor: "#e8f5e9",
    color: "#2e7d32", border: "1px solid #a5d6a7",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  },
  completeBtn: {
    padding: "8px 18px", backgroundColor: "#e3f2fd",
    color: "#1565c0", border: "1px solid #90caf9",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  },
  cancelBtn: {
    padding: "8px 18px", backgroundColor: "#fdecea",
    color: "#c62828", border: "1px solid #ef9a9a",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  },
  rescheduleBtn: {
  padding: "7px 14px", backgroundColor: "#fff8e1",
  color: "#e65100", border: "1px solid #ffe082",
  borderRadius: "7px", fontSize: "12px",
  fontWeight: "600", cursor: "pointer"
},
proposeForm: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
proposeInput: {
  padding: "7px 10px", borderRadius: "7px",
  border: "1px solid #ddd", fontSize: "13px"
},
proposeBtn: {
  padding: "7px 14px", backgroundColor: "#e65100",
  color: "#fff", border: "none", borderRadius: "7px",
  fontSize: "12px", fontWeight: "600", cursor: "pointer"
},
cancelProposeBtn: {
  padding: "7px 14px", backgroundColor: "#f5f5f5",
  color: "#555", border: "1px solid #ddd",
  borderRadius: "7px", fontSize: "12px",
  fontWeight: "600", cursor: "pointer"
}
};

export default DoctorAppointments;