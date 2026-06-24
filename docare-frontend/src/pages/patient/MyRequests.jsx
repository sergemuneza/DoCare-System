import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const statusConfig = {
  pending:  { bg: "#fff8e1", color: "#e65100" },
  uploaded: { bg: "#e3f2fd", color: "#1565c0" },
  approved: { bg: "#e8f5e9", color: "#2e7d32" },
  rejected: { bg: "#fdecea", color: "#c62828" }
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/requests/my")
      .then(({ data }) => setRequests(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading requests...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div>
            <h2 style={styles.title}>My Requests</h2>
            <p style={styles.sub}>{requests.length} request{requests.length !== 1 ? "s" : ""} submitted</p>
          </div>
          <button style={styles.newBtn} onClick={() => navigate("/patient/request")}>
            + New Request
          </button>
        </div>

        <div style={styles.filters}>
          {["all", "pending", "uploaded", "approved", "rejected"].map((f) => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span style={styles.filterCount}>
                  {requests.filter((r) => r.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyTitle}>No requests found</div>
            <div style={styles.emptySub}>
              {filter === "all"
                ? "Submit a request to get a copy of your medical documents"
                : `No ${filter} requests`}
            </div>
            {filter === "all" && (
              <button style={styles.emptyBtn} onClick={() => navigate("/patient/request")}>
                Request a Document
              </button>
            )}
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((r) => {
              const sc = statusConfig[r.status] || { bg: "#f5f5f5", color: "#777" };
              return (
                <div key={r._id} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <div style={styles.docType}>
                      {r.documentType.replace(/_/g, " ")}
                    </div>
                    {r.reason && (
                      <div style={styles.reason}>{r.reason}</div>
                    )}
                    <div style={styles.date}>
                      Submitted {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </div>
                  </div>

<div style={styles.cardRight}>
  <span style={{
    ...styles.statusBadge,
    backgroundColor: sc.bg, color: sc.color
  }}>
    {r.status}
  </span>

  {r.status === "approved" && (
    <div style={styles.approvedBox}>
      <div style={styles.approvedMsg}>Your document is ready</div>
      <button
        style={styles.goToDocsBtn}
        onClick={() => navigate("/patient/documents")}
      >
        Go to My Documents →
      </button>
    </div>
  )}

  {r.status === "uploaded" && (
    <div style={styles.uploadedBox}>
      <div style={styles.uploadedMsg}>Document uploaded — awaiting final approval</div>
    </div>
  )}

  {r.status === "rejected" && (
    <div style={styles.rejectedMsg}>
      This request was not fulfilled. You may submit a new request if needed.
    </div>
  )}
</div>

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
  topRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "20px"
  },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  newBtn: {
    padding: "10px 18px", backgroundColor: "#1a73e8",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer"
  },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  filterBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "13px", cursor: "pointer", color: "#555"
  },
  filterActive: { backgroundColor: "#1a73e8", color: "#fff", borderColor: "#1a73e8" },
  filterCount: {
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: "10px", padding: "0 6px",
    fontSize: "11px", fontWeight: "700"
  },
  emptyState: {
    textAlign: "center", padding: "60px 20px",
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  emptySub: { fontSize: "14px", color: "#999", marginTop: "6px", marginBottom: "20px" },
  emptyBtn: {
    padding: "10px 20px", backgroundColor: "#1a73e8",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer"
  },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", gap: "12px"
  },
  cardLeft: { flex: 1 },
  docType: {
    fontSize: "15px", fontWeight: "600",
    color: "#333", textTransform: "capitalize"
  },
  reason: { fontSize: "13px", color: "#666", marginTop: "4px", fontStyle: "italic" },
  date: { fontSize: "12px", color: "#aaa", marginTop: "6px" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" },
  statusBadge: {
    fontSize: "12px", padding: "3px 10px",
    borderRadius: "12px", fontWeight: "600"
  },
  readyNote: {
    fontSize: "11px", color: "#2e7d32",
    fontWeight: "500"
  },
  uploadedNote: {
    fontSize: "11px", color: "#1565c0",
    fontWeight: "500", maxWidth: "160px", textAlign: "right"
  },
  approvedBox: {
  marginTop: "8px", textAlign: "right"
},
approvedMsg: {
  fontSize: "12px", color: "#2e7d32",
  fontWeight: "600", marginBottom: "6px"
},
goToDocsBtn: {
  padding: "7px 14px", backgroundColor: "#2e7d32",
  color: "#fff", border: "none", borderRadius: "7px",
  fontSize: "12px", fontWeight: "700",
  cursor: "pointer"
},
uploadedBox: { marginTop: "6px" },
uploadedMsg: {
  fontSize: "11px", color: "#1565c0",
  fontWeight: "500", maxWidth: "160px",
  textAlign: "right", lineHeight: "1.4"
},
rejectedMsg: {
  fontSize: "11px", color: "#c62828",
  maxWidth: "160px", textAlign: "right",
  lineHeight: "1.4", marginTop: "6px"
}
};

export default MyRequests;