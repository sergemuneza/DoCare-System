//AdminDashboard
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { SkeletonDashboard } from "../../components/Skeleton";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reqRes, apptRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/requests"),
          API.get("/admin/appointments")
        ]);
        setStats(statsRes.data);
        setRecentRequests(reqRes.data.slice(0, 5));
        setRecentAppointments(apptRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusBadge = (status) => {
    const map = {
      approved:  { bg: "#e8f5e9", color: "#2e7d32" },
      completed: { bg: "#e3f2fd", color: "#1565c0" },
      rejected:  { bg: "#fdecea", color: "#c62828" },
      cancelled: { bg: "#fdecea", color: "#c62828" },
      pending:   { bg: "#fff8e1", color: "#e65100" },
      uploaded:  { bg: "#e8f0fe", color: "#1a73e8" }
    };
    const s = map[status] || { bg: "#f5f5f5", color: "#777" };
    return (
      <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  // if (loading) return (
  //   <div><Navbar /><div style={styles.center}>Loading dashboard...</div></div>
  // );
  if (loading) return (
  <div style={styles.page}>
    <Navbar />
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <SkeletonDashboard />
    </div>
  </div>
);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        <div style={styles.welcomeBanner}>
          <div>
            <h2 style={styles.welcomeTitle}>Admin Dashboard</h2>
            <p style={styles.welcomeSub}>
              {stats?.pendingRequests} pending requests · {stats?.pendingAppointments} pending appointments
            </p>
          </div>
          <div style={styles.adminBadge}>Administrator</div>
        </div>

        <div style={styles.statsGrid}>
          {[
            { label: "Total patients", count: stats?.totalPatients, color: "#1a73e8", bg: "#e8f0fe", path: "/admin/users?role=patient" },
            { label: "Total doctors", count: stats?.totalDoctors, color: "#00796b", bg: "#e0f2f1", path: "/admin/users?role=doctor" },
            { label: "Documents", count: stats?.totalDocuments, color: "#6a1b9a", bg: "#f3e5f5", path: "/admin/documents" },
            { label: "Requests", count: stats?.totalRequests, color: "#e65100", bg: "#fff8e1", path: "/admin/requests" },
            { label: "Appointments", count: stats?.totalAppointments, color: "#c62828", bg: "#fdecea", path: "/admin/appointments" },
            { label: "Medical records", count: stats?.totalRecords, color: "#00695c", bg: "#e0f7fa", path: "/admin/users" }
          ].map((s) => (
            <div
              key={s.label}
              style={{ ...styles.statCard, backgroundColor: s.bg, cursor: "pointer" }}
              onClick={() => navigate(s.path)}
            >
              <div style={{ ...styles.statNumber, color: s.color }}>{s.count}</div>
              <div style={{ ...styles.statLabel, color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick actions</h3>
          <div style={styles.actionsGrid}>
            {[
              { label: "Manage Users", sub: "View all patients & doctors", path: "/admin/users", color: "#1a73e8" },
              { label: "Documents", sub: "View & delete documents", path: "/admin/documents", color: "#6a1b9a" },
              { label: "Requests", sub: "Handle document requests", path: "/admin/requests", color: "#e65100" },
              { label: "Appointments", sub: "View all appointments", path: "/admin/appointments", color: "#c62828" }
            ].map((a) => (
              <div key={a.label} style={styles.actionCard} onClick={() => navigate(a.path)}>
                <div style={{ ...styles.actionDot, backgroundColor: a.color }} />
                <div>
                  <div style={styles.actionLabel}>{a.label}</div>
                  <div style={styles.actionSub}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.twoCol}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent requests</h3>
              <button style={styles.seeAllBtn} onClick={() => navigate("/admin/requests")}>
                See all
              </button>
            </div>
            {recentRequests.length === 0 ? (
              <p style={styles.empty}>No requests yet.</p>
            ) : (
              recentRequests.map((r) => (
                <div key={r._id} style={styles.listItem}>
                  <div>
                    <div style={styles.itemTitle}>
                      {r.documentType.replace(/_/g, " ")}
                    </div>
                    <div style={styles.itemSub}>{r.patient?.name}</div>
                  </div>
                  {statusBadge(r.status)}
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent appointments</h3>
              <button style={styles.seeAllBtn} onClick={() => navigate("/admin/appointments")}>
                See all
              </button>
            </div>
            {recentAppointments.length === 0 ? (
              <p style={styles.empty}>No appointments yet.</p>
            ) : (
              recentAppointments.map((a) => (
                <div key={a._id} style={styles.listItem}>
                  <div>
                    <div style={styles.itemTitle}>{a.patient?.name}</div>
                    <div style={styles.itemSub}>
                      Dr. {a.doctor?.name} · {new Date(a.appointmentDate).toLocaleDateString()}
                    </div>
                  </div>
                  {statusBadge(a.status)}
                </div>
              ))
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
  welcomeBanner: {
    backgroundColor: "#1a237e", borderRadius: "12px",
    padding: "24px 28px", marginBottom: "24px", color: "#fff",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  },
  welcomeTitle: { fontSize: "22px", fontWeight: "700", margin: 0 },
  welcomeSub: { fontSize: "14px", opacity: 0.8, marginTop: "4px" },
  adminBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: "6px 16px", borderRadius: "20px",
    fontSize: "13px", fontWeight: "600"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px", marginBottom: "24px"
  },
  statCard: { borderRadius: "10px", padding: "18px 16px", textAlign: "center" },
  statNumber: { fontSize: "32px", fontWeight: "700" },
  statLabel: { fontSize: "12px", marginTop: "4px", fontWeight: "500" },
  quickActions: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "12px", marginTop: "12px"
  },
  actionCard: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px", borderRadius: "10px",
    border: "1px solid #e8e8e8", cursor: "pointer",
    backgroundColor: "#fafafa"
  },
  actionDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
  actionLabel: { fontSize: "14px", fontWeight: "600", color: "#333" },
  actionSub: { fontSize: "12px", color: "#888", marginTop: "2px" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px"
  },
  section: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  sectionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "14px"
  },
  sectionTitle: { fontSize: "15px", fontWeight: "600", color: "#333", margin: 0 },
  seeAllBtn: {
    fontSize: "13px", color: "#1a73e8",
    backgroundColor: "transparent", border: "none",
    cursor: "pointer", fontWeight: "500"
  },
  listItem: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "10px 0",
    borderBottom: "1px solid #f5f5f5"
  },
  itemTitle: { fontSize: "14px", fontWeight: "500", color: "#333" },
  itemSub: { fontSize: "12px", color: "#999", marginTop: "2px" },
  badge: { fontSize: "12px", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" },
  empty: { color: "#bbb", fontSize: "14px", textAlign: "center", padding: "16px 0" }
};

export default AdminDashboard;