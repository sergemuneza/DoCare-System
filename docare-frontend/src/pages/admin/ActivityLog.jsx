import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const typeConfig = {
  user_created:    { bg: "#e8f5e9", color: "#2e7d32", icon: "+" },
  user_deleted:    { bg: "#fdecea", color: "#c62828", icon: "✗" },
  role_changed:    { bg: "#e8f0fe", color: "#1a73e8", icon: "↑" },
  document_deleted:{ bg: "#fff8e1", color: "#e65100", icon: "✗" },
  status_changed:  { bg: "#f3e5f5", color: "#6a1b9a", icon: "~" },
  general:         { bg: "#f5f5f5", color: "#555",    icon: "•" }
};

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/admin/activity-log")
      .then(({ data }) => setLogs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? logs
    : logs.filter((l) => l.type === filter);

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading activity log...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Activity Log</h2>
          <p style={styles.sub}>{logs.length} recorded actions</p>
        </div>

        <div style={styles.filters}>
          {["all", "user_created", "user_deleted", "role_changed", "document_deleted"].map((f) => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyTitle}>No activity recorded yet</div>
          </div>
        ) : (
          <div style={styles.logList}>
            {filtered.map((log) => {
              const tc = typeConfig[log.type] || typeConfig.general;
              return (
                <div key={log._id} style={styles.logItem}>
                  <div style={{ ...styles.logIcon, backgroundColor: tc.bg }}>
                    <span style={{ color: tc.color, fontWeight: "700", fontSize: "14px" }}>
                      {tc.icon}
                    </span>
                  </div>
                  <div style={styles.logContent}>
                    <div style={styles.logAction}>{log.action}</div>
                    {log.target && (
                      <div style={styles.logTarget}>
                        <span style={styles.logTargetLabel}>Target: </span>
                        {log.target}
                      </div>
                    )}
                    {log.details && (
                      <div style={styles.logDetails}>{log.details}</div>
                    )}
                    <div style={styles.logMeta}>
                      By {log.admin?.name} · {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <span style={{ ...styles.logType, backgroundColor: tc.bg, color: tc.color }}>
                    {log.type.replace(/_/g, " ")}
                  </span>
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
  filters: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  filterBtn: {
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "12px", cursor: "pointer",
    color: "#555", textTransform: "capitalize"
  },
  filterActive: { backgroundColor: "#1a237e", color: "#fff", borderColor: "#1a237e" },
  emptyState: {
    textAlign: "center", padding: "60px",
    backgroundColor: "#fff", borderRadius: "12px"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  logList: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    overflow: "hidden"
  },
  logItem: {
    display: "flex", alignItems: "flex-start",
    gap: "14px", padding: "16px 20px",
    borderBottom: "1px solid #f9f9f9"
  },
  logIcon: {
    width: "36px", height: "36px", borderRadius: "50%",
    display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0
  },
  logContent: { flex: 1 },
  logAction: { fontSize: "14px", fontWeight: "600", color: "#333" },
  logTarget: { fontSize: "13px", color: "#555", marginTop: "3px" },
  logTargetLabel: { fontWeight: "600", color: "#333" },
  logDetails: { fontSize: "12px", color: "#888", marginTop: "2px" },
  logMeta: { fontSize: "12px", color: "#aaa", marginTop: "6px" },
  logType: {
    fontSize: "11px", padding: "3px 10px",
    borderRadius: "10px", fontWeight: "600",
    textTransform: "capitalize", flexShrink: 0,
    alignSelf: "center"
  }
};

export default ActivityLog;