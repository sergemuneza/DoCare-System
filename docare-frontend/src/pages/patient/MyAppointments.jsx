import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom"; 

const statusConfig = {
  pending:   { bg: "#fff8e1", color: "#e65100", label: "Pending" },
  approved:  { bg: "#e8f5e9", color: "#2e7d32", label: "Approved" },
  completed: { bg: "#e3f2fd", color: "#1565c0", label: "Completed" },
  cancelled: { bg: "#fdecea", color: "#c62828", label: "Cancelled" }
};

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/appointments/my");
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(id);
    try {
      await API.put(`/appointments/${id}/cancel`);
      setAppointments(appointments.map((a) =>
        a._id === id ? { ...a, status: "cancelled" } : a
      ));
    } catch (err) {
      alert("Failed to cancel appointment");
    } finally {
      setCancelling(null);
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

<div style={styles.topRow}>
  <div>
    <h2 style={styles.title}>My Appointments</h2>
    <p style={styles.sub}>
      {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} total
    </p>
  </div>
  <button
    style={styles.newBtn}
    onClick={() => navigate("/patient/appointment")}
  >
    + Book Appointment
  </button>
</div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.statsRow}>
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} style={{ ...styles.statCard, backgroundColor: val.bg }}>
              <div style={{ ...styles.statNum, color: val.color }}>
                {appointments.filter((a) => a.status === key).length}
              </div>
              <div style={{ ...styles.statLabel, color: val.color }}>{val.label}</div>
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
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <div style={styles.emptyTitle}>No appointments found</div>
            <div style={styles.emptySub}>
              {filter === "all" ? "Book your first appointment from the dashboard" : `No ${filter} appointments`}
            </div>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((a) => {
              const sc = statusConfig[a.status] || { bg: "#f5f5f5", color: "#777", label: a.status };
              const isExpanded = expanded === a._id;
              return (
                <div key={a._id} style={styles.card}>
                  <div
                    style={styles.cardHeader}
                    onClick={() => setExpanded(isExpanded ? null : a._id)}
                  >
                    <div style={styles.cardLeft}>
                      <div style={styles.doctorRow}>
                        <div style={styles.doctorAvatar}>
                          {(a.doctor?.name || "D").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.doctorName}>
                            Dr. {a.doctor?.name || "Unknown"}
                          </div>
                          <div style={styles.apptDate}>
                            {new Date(a.appointmentDate).toLocaleDateString("en-US", {
                              weekday: "long", year: "numeric",
                              month: "long", day: "numeric"
                            })}
                            {" at "}
                            {new Date(a.appointmentDate).toLocaleTimeString("en-US", {
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardRight}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: sc.bg, color: sc.color
                      }}>
                        {sc.label}
                      </span>
                      <span style={styles.chevron}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.cardBody}>
                      <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Doctor</div>
                          <div style={styles.detailValue}>Dr. {a.doctor?.name}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Doctor email</div>
                          <div style={styles.detailValue}>{a.doctor?.email}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Date booked</div>
                          <div style={styles.detailValue}>
                            {new Date(a.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Status</div>
                          <div style={{ ...styles.detailValue, color: sc.color }}>
                            {sc.label}
                          </div>
                        </div>
                      </div>

{a.proposedDate && (
  <div style={styles.proposalBox}>
    <div style={styles.proposalTitle}>New date proposed by your doctor</div>
    <div style={styles.proposalDate}>
      {new Date(a.proposedDate).toLocaleString("en-US", {
        weekday: "long", month: "long", day: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit"
      })}
    </div>
    <button
      style={styles.acceptBtn}
      onClick={async () => {
        try {
          await API.put(`/appointments/${a._id}/accept-proposal`);
          setAppointments(appointments.map((appt) =>
            appt._id === a._id
              ? { ...appt, appointmentDate: a.proposedDate, proposedDate: null, status: "approved" }
              : appt
          ));
        } catch (err) {
          alert("Failed to accept");
        }
      }}
    >
      Accept New Date
    </button>
  </div>
)}

                      {a.reason && (
                        <div style={styles.reasonBox}>
                          <div style={styles.detailLabel}>Reason for visit</div>
                          <div style={styles.reasonText}>{a.reason}</div>
                        </div>
                      )}

                      {a.status === "pending" && (
                        <button
                          style={{
                            ...styles.cancelBtn,
                            opacity: cancelling === a._id ? 0.6 : 1
                          }}
                          onClick={() => handleCancel(a._id)}
                          disabled={cancelling === a._id}
                        >
                          {cancelling === a._id ? "Cancelling..." : "Cancel Appointment"}
                        </button>
                      )}

                      {a.status === "approved" && (
                        <div style={styles.approvedNote}>
                          Your appointment has been confirmed by the doctor.
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
  container: { padding: "24px", maxWidth: "800px", margin: "0 auto" },
  header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "12px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px"
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px", marginBottom: "20px"
  },
  statCard: { borderRadius: "10px", padding: "14px", textAlign: "center" },
  statNum: { fontSize: "24px", fontWeight: "700" },
  statLabel: { fontSize: "12px", fontWeight: "500", marginTop: "2px" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  filterBtn: {
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "13px", cursor: "pointer", color: "#555"
  },
  filterActive: { backgroundColor: "#1a73e8", color: "#fff", borderColor: "#1a73e8" },
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
  cardLeft: { flex: 1 },
  doctorRow: { display: "flex", alignItems: "center", gap: "12px" },
  doctorAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    backgroundColor: "#1a73e8", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "16px",
    fontWeight: "700", flexShrink: 0
  },
  doctorName: { fontSize: "15px", fontWeight: "600", color: "#333" },
  apptDate: { fontSize: "13px", color: "#777", marginTop: "2px" },
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
  detailLabel: { fontSize: "11px", color: "#aaa", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
  detailValue: { fontSize: "14px", color: "#333", fontWeight: "500", marginTop: "3px" },
  reasonBox: {
    backgroundColor: "#f5f5f5", borderRadius: "8px",
    padding: "12px", marginBottom: "14px"
  },
  reasonText: { fontSize: "14px", color: "#555", marginTop: "6px", lineHeight: "1.6" },
  cancelBtn: {
    padding: "10px 20px", backgroundColor: "#fdecea",
    color: "#c62828", border: "1px solid #ef9a9a",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  }, 
  approvedNote: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "10px 14px", borderRadius: "8px",
    fontSize:
     "13px", fontWeight: "500"
  },
  proposalBox: {
  backgroundColor: "#fff8e1", borderRadius: "8px",
  padding: "12px 14px", marginTop: "12px",
  border: "1px solid #ffe082"
},
proposalTitle: { fontSize: "12px", fontWeight: "600", color: "#e65100", marginBottom: "6px" },
proposalDate: { fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "10px" },
acceptBtn: {
  padding: "8px 16px", backgroundColor: "#e65100",
  color: "#fff", border: "none", borderRadius: "7px",
  fontSize: "13px", fontWeight: "600", cursor: "pointer"
},
topRow: {
  display: "flex", justifyContent: "space-between",
  alignItems: "flex-start", marginBottom: "20px"
},
newBtn: {
  padding: "10px 18px", backgroundColor: "#1a73e8",
  color: "#fff", border: "none", borderRadius: "8px",
  fontSize: "14px", fontWeight: "600", cursor: "pointer"
},topRow: {
  display: "flex", justifyContent: "space-between",
  alignItems: "flex-start", marginBottom: "20px"
},
newBtn: {
  padding: "10px 18px", backgroundColor: "#1a73e8",
  color: "#fff", border: "none", borderRadius: "8px",
  fontSize: "14px", fontWeight: "600", cursor: "pointer"
},
};

export default MyAppointments;