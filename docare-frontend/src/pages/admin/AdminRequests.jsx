import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const statusConfig = {
  pending:  { bg: "#fff8e1", color: "#e65100" },
  uploaded: { bg: "#e8f0fe", color: "#1a73e8" },
  approved: { bg: "#e8f5e9", color: "#2e7d32" },
  rejected: { bg: "#fdecea", color: "#c62828" }
};

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    API.get("/requests")
      .then(({ data }) => setRequests(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await API.put(`/requests/${id}/status`, { status });
      setRequests(requests.map((r) => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert("Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = requests.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch =
      r.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.documentType?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading requests...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Document Requests</h2>
          <p style={styles.sub}>{requests.length} total requests</p>
        </div>

        <div style={styles.statsRow}>
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} style={{ ...styles.statCard, backgroundColor: val.bg }}>
              <div style={{ ...styles.statNum, color: val.color }}>
                {requests.filter((r) => r.status === key).length}
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
            placeholder="Search by patient name or document type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={styles.filters}>
            {["all", "pending", "uploaded", "approved", "rejected"].map((f) => (
              <button
                key={f}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && (
                  <span style={styles.count}>
                    {requests.filter((r) => r.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyTitle}>No requests found</div>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((r) => {
              const sc = statusConfig[r.status] || { bg: "#f5f5f5", color: "#777" };
              return (
                <div key={r._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.patientRow}>
                      <div style={styles.avatar}>
                        {(r.patient?.name || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.patientName}>{r.patient?.name}</div>
                        <div style={styles.patientEmail}>{r.patient?.email}</div>
                      </div>
                    </div>
                    <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.color }}>
                      {r.status}
                    </span>
                  </div>

                  <div style={styles.requestInfo}>
                    <span style={styles.docType}>
                      {r.documentType.replace(/_/g, " ")}
                    </span>
                    {r.reason && (
                      <span style={styles.reason}>· "{r.reason}"</span>
                    )}
                    <div style={styles.date}>
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </div>
                  </div>

                  {r.status === "pending" && (
                    <div style={styles.actionRow}>
                      <button
                        style={styles.approveBtn}
                        disabled={!!updating}
                        onClick={() => updateStatus(r._id, "approved")}
                      >
                        {updating === r._id + "approved" ? "..." : "Approve"}
                      </button>
                      <button
                        style={styles.rejectBtn}
                        disabled={!!updating}
                        onClick={() => updateStatus(r._id, "rejected")}
                      >
                        Reject
                      </button>
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
  container: { padding: "24px", maxWidth: "900px", margin: "0 auto" },
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
    display: "flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "13px", cursor: "pointer", color: "#555"
  },
  filterActive: { backgroundColor: "#1a237e", color: "#fff", borderColor: "#1a237e" },
  count: {
    backgroundColor: "rgba(0,0,0,0.12)", borderRadius: "10px",
    padding: "0 6px", fontSize: "11px", fontWeight: "700"
  },
  emptyState: {
    textAlign: "center", padding: "60px 20px",
    backgroundColor: "#fff", borderRadius: "12px"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "16px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  cardTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "10px"
  },
  patientRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    backgroundColor: "#1a237e", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "14px", fontWeight: "700"
  },
  patientName: { fontSize: "14px", fontWeight: "600", color: "#333" },
  patientEmail: { fontSize: "12px", color: "#999", marginTop: "1px" },
  statusBadge: {
    fontSize: "12px", padding: "3px 10px",
    borderRadius: "12px", fontWeight: "600"
  },
  requestInfo: {
    backgroundColor: "#f9f9f9", borderRadius: "8px",
    padding: "10px 12px", marginBottom: "12px"
  },
  docType: {
    fontSize: "13px", fontWeight: "600",
    color: "#333", textTransform: "capitalize"
  },
  reason: { fontSize: "13px", color: "#777", fontStyle: "italic", marginLeft: "6px" },
  date: { fontSize: "12px", color: "#aaa", marginTop: "4px" },
  actionRow: { display: "flex", gap: "8px" },
  approveBtn: {
    padding: "7px 16px", backgroundColor: "#e8f5e9",
    color: "#2e7d32", border: "1px solid #a5d6a7",
    borderRadius: "7px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  },
  rejectBtn: {
    padding: "7px 16px", backgroundColor: "#fdecea",
    color: "#c62828", border: "1px solid #ef9a9a",
    borderRadius: "7px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  }
};

export default AdminRequests;