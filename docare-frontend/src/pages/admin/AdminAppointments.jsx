import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const statusConfig = {
  pending:   { bg: "#fff8e1", color: "#e65100" },
  approved:  { bg: "#e8f5e9", color: "#2e7d32" },
  completed: { bg: "#e3f2fd", color: "#1565c0" },
  cancelled: { bg: "#fdecea", color: "#c62828" }
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get("/admin/appointments")
      .then(({ data }) => setAppointments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch =
      a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading appointments...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>All Appointments</h2>
          <p style={styles.sub}>{appointments.length} total appointments</p>
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

        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by patient or doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <div style={styles.emptyTitle}>No appointments found</div>
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
                    <div style={styles.cardLeft}>
                      <div style={styles.nameRow}>
                        <div style={styles.avatarSmall}>
                          {(a.patient?.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.patientName}>{a.patient?.name}</div>
                          <div style={styles.doctorName}>Dr. {a.doctor?.name}</div>
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardMid}>
                      {new Date(a.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "short", month: "short",
                        day: "numeric", year: "numeric"
                      })}
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
                          <div style={styles.detailLabel}>Patient</div>
                          <div style={styles.detailValue}>{a.patient?.name}</div>
                          <div style={styles.detailSub}>{a.patient?.email}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Doctor</div>
                          <div style={styles.detailValue}>Dr. {a.doctor?.name}</div>
                          <div style={styles.detailSub}>{a.doctor?.email}</div>
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
                          <div style={styles.detailLabel}>Reason</div>
                          <div style={styles.reasonText}>{a.reason}</div>
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
  container: { padding: "24px", maxWidth: "960px", margin: "0 auto" },
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
  toolbar: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
  searchInput: {
    width: "100%", padding: "10px 14px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", outline: "none", boxSizing: "border-box"
  },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "13px", cursor: "pointer", color: "#555"
  },
  filterActive: { backgroundColor: "#1a237e", color: "#fff", borderColor: "#1a237e" },
  emptyState: {
    textAlign: "center", padding: "60px 20px",
    backgroundColor: "#fff", borderRadius: "12px"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden"
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "14px 18px", cursor: "pointer"
  },
  cardLeft: { flex: 1 },
  nameRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatarSmall: {
    width: "34px", height: "34px", borderRadius: "50%",
    backgroundColor: "#1a237e", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "13px",
    fontWeight: "700", flexShrink: 0
  },
  patientName: { fontSize: "14px", fontWeight: "600", color: "#333" },
  doctorName: { fontSize: "12px", color: "#888", marginTop: "2px" },
  cardMid: { fontSize: "13px", color: "#555", flex: 1, textAlign: "center" },
  cardRight: { display: "flex", alignItems: "center", gap: "10px" },
  statusBadge: {
    fontSize: "12px", padding: "3px 10px",
    borderRadius: "12px", fontWeight: "600"
  },
  chevron: { color: "#aaa", fontSize: "11px" },
  cardBody: {
    borderTop: "1px solid #f0f0f0",
    padding: "14px 18px", backgroundColor: "#fafafa"
  },
  detailGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px", marginBottom: "12px"
  },
  detailItem: {},
  detailLabel: {
    fontSize: "11px", color: "#aaa",
    fontWeight: "600", textTransform: "uppercase",
    letterSpacing: "0.05em", marginBottom: "3px"
  },
  detailValue: { fontSize: "14px", fontWeight: "500", color: "#333" },
  detailSub: { fontSize: "12px", color: "#999", marginTop: "2px" },
  reasonBox: {
    backgroundColor: "#f5f5f5", borderRadius: "8px",
    padding: "10px 12px"
  },
  reasonText: { fontSize: "13px", color: "#555", marginTop: "4px", lineHeight: "1.6" }
};

export default AdminAppointments;