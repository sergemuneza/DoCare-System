// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const DoctorDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [apptRes, reqRes] = await Promise.all([
//           API.get("/appointments/doctor"),
//           API.get("/requests")
//         ]);
//         setAppointments(apptRes.data);
//         setRequests(reqRes.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const statusColor = (status) => {
//     if (status === "approved" || status === "completed") return "#2e7d32";
//     if (status === "rejected" || status === "cancelled") return "#c62828";
//     return "#e65100";
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await API.put(`/requests/${id}/status`, { status });
//       setRequests(requests.map((r) => r._id === id ? { ...r, status } : r));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <div style={styles.loading}>Loading...</div>;

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.container}>
//         <h2 style={styles.welcome}>Welcome, Dr. {user.name}</h2>

//         <div style={styles.statsRow}>
//           <div style={styles.statCard("#1a73e8")}>
//             <div style={styles.statNumber}>{appointments.length}</div>
//             <div style={styles.statLabel}>My Appointments</div>
//           </div>
//           <div style={styles.statCard("#e65100")}>
//             <div style={styles.statNumber}>
//               {requests.filter((r) => r.status === "pending").length}
//             </div>
//             <div style={styles.statLabel}>Pending Requests</div>
//           </div>
//           <div style={styles.statCard("#2e7d32")}>
//             <div style={styles.statNumber}>
//               {requests.filter((r) => r.status === "approved").length}
//             </div>
//             <div style={styles.statLabel}>Approved Requests</div>
//           </div>
//         </div>

//         <div style={styles.actionsRow}>
//           <button style={styles.actionBtn} onClick={() => navigate("/doctor/upload")}>
//             Upload Document
//           </button>
//         </div>

//         <div style={styles.section}>
//           <h3 style={styles.sectionTitle}>Document Requests</h3>
//           {requests.length === 0 ? (
//             <p style={styles.empty}>No requests yet.</p>
//           ) : (
//             requests.map((r) => (
//               <div key={r._id} style={styles.listItem}>
//                 <div>
//                   <div style={styles.itemTitle}>{r.documentType.replace("_", " ")}</div>
//                   <div style={styles.itemSub}>
//                     Patient: {r.patient?.name} — {r.reason}
//                   </div>
//                 </div>
//                 <div style={styles.itemRight}>
//                   <span style={{ color: statusColor(r.status), fontWeight: "600", fontSize: "13px" }}>
//                     {r.status}
//                   </span>
//                   {r.status === "pending" && (
//                     <div style={styles.btnGroup}>
//                       <button
//                         style={styles.approveBtn}
//                         onClick={() => updateStatus(r._id, "approved")}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         style={styles.rejectBtn}
//                         onClick={() => updateStatus(r._id, "rejected")}
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div style={styles.section}>
//           <h3 style={styles.sectionTitle}>My Appointments</h3>
//           {appointments.length === 0 ? (
//             <p style={styles.empty}>No appointments yet.</p>
//           ) : (
//             appointments.map((a) => (
//               <div key={a._id} style={styles.listItem}>
//                 <div>
//                   <div style={styles.itemTitle}>{a.patient?.name}</div>
//                   <div style={styles.itemSub}>
//                     {new Date(a.appointmentDate).toLocaleString()} — {a.reason}
//                   </div>
//                 </div>
//                 <span style={{ color: statusColor(a.status), fontWeight: "600", fontSize: "13px" }}>
//                   {a.status}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   loading: { textAlign: "center", marginTop: "60px" },
//   container: { padding: "24px", maxWidth: "960px", margin: "0 auto" },
//   welcome: { fontSize: "22px", marginBottom: "24px", color: "#333" },
//   statsRow: { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
//   statCard: (color) => ({
//     flex: 1, minWidth: "140px", backgroundColor: color,
//     color: "#fff", borderRadius: "10px", padding: "20px", textAlign: "center"
//   }),
//   statNumber: { fontSize: "36px", fontWeight: "700" },
//   statLabel: { fontSize: "14px", marginTop: "4px", opacity: 0.9 },
//   actionsRow: { display: "flex", gap: "12px", marginBottom: "28px" },
//   actionBtn: {
//     padding: "12px 24px", backgroundColor: "#fff",
//     color: "#1a73e8", border: "2px solid #1a73e8",
//     borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer"
//   },
//   section: {
//     backgroundColor: "#fff", borderRadius: "10px",
//     padding: "20px", marginBottom: "20px",
//     boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
//   },
//   sectionTitle: { fontSize: "16px", marginBottom: "14px", color: "#333" },
//   listItem: {
//     display: "flex", justifyContent: "space-between",
//     alignItems: "center", padding: "12px 0",
//     borderBottom: "1px solid #f0f0f0"
//   },
//   itemTitle: { fontWeight: "600", fontSize: "14px" },
//   itemSub: { fontSize: "13px", color: "#777", marginTop: "3px" },
//   itemRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" },
//   btnGroup: { display: "flex", gap: "6px" },
//   approveBtn: {
//     padding: "4px 12px", backgroundColor: "#2e7d32",
//     color: "#fff", border: "none", borderRadius: "4px",
//     fontSize: "12px", cursor: "pointer"
//   },
//   rejectBtn: {
//     padding: "4px 12px", backgroundColor: "#c62828",
//     color: "#fff", border: "none", borderRadius: "4px",
//     fontSize: "12px", cursor: "pointer"
//   },
//   empty: { color: "#999", fontSize: "14px" }
// };

// export default DoctorDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { SkeletonDashboard } from "../../components/Skeleton";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, reqRes] = await Promise.all([
          API.get("/appointments/doctor"),
          API.get("/requests")
        ]);
        setAppointments(apptRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}/status`, { status });
      setRequests(requests.map((r) => r._id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const updateApptStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map((a) => a._id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const statusBadge = (status) => {
    const map = {
      approved:  { bg: "#e8f5e9", color: "#2e7d32" },
      completed: { bg: "#e3f2fd", color: "#1565c0" },
      rejected:  { bg: "#fdecea", color: "#c62828" },
      cancelled: { bg: "#fdecea", color: "#c62828" },
      pending:   { bg: "#fff8e1", color: "#e65100" },
      uploaded:  { bg: "#e3f2fd", color: "#1565c0" }
    };
    const s = map[status] || { bg: "#f5f5f5", color: "#777" };
    return (
      <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  const todayAppts = appointments.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.appointmentDate).toDateString() === today;
  });

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pendingAppts = appointments.filter((a) => a.status === "pending");

  // if (loading) return (
  //   <div>
  //     <Navbar />
  //     <div style={styles.center}>Loading dashboard...</div>
  //   </div>
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
            <h2 style={styles.welcomeTitle}>Good day, Dr. {user.name}</h2>
            <p style={styles.welcomeSub}>
              You have {todayAppts.length} appointment{todayAppts.length !== 1 ? "s" : ""} today
              and {pendingRequests.length} pending document request{pendingRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div style={styles.statsRow}>
          {[
            { label: "Total appointments", count: appointments.length, color: "#1a73e8", bg: "#e8f0fe" },
            { label: "Today's appointments", count: todayAppts.length, color: "#00796b", bg: "#e0f2f1" },
            { label: "Pending requests", count: pendingRequests.length, color: "#e65100", bg: "#fff8e1" },
            { label: "Pending approvals", count: pendingAppts.length, color: "#6a1b9a", bg: "#f3e5f5" }
          ].map((s) => (
            <div key={s.label} style={{ ...styles.statCard, backgroundColor: s.bg }}>
              <div style={{ ...styles.statNumber, color: s.color }}>{s.count}</div>
              <div style={{ ...styles.statLabel, color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}>Quick actions</h3>
          <div style={styles.actionsGrid}>
            {[
              { label: "Upload Document", sub: "Send file to a patient", path: "/doctor/upload", color: "#1a73e8" },
              { label: "Patient Documents", sub: "View patient files", path: "/doctor/patients", color: "#00796b" },
              { label: "Appointments", sub: "Manage your schedule", path: "/doctor/appointments", color: "#6a1b9a" },
              { label: "Document Requests", sub: "Handle patient requests", path: "/doctor/requests", color: "#e65100" },
              { label: "Medical Records", sub: "Create & view records", path: "/doctor/records", color: "#c62828" }
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
              <h3 style={styles.sectionTitle}>Pending requests</h3>
              <button style={styles.seeAllBtn} onClick={() => navigate("/doctor/requests")}>
                See all
              </button>
            </div>
            {pendingRequests.length === 0 ? (
              <p style={styles.empty}>No pending requests.</p>
            ) : (
              pendingRequests.slice(0, 4).map((r) => (
                <div key={r._id} style={styles.listItem}>
                  <div>
                    <div style={styles.itemTitle}>
                      {r.documentType.replace(/_/g, " ")}
                    </div>
                    <div style={styles.itemSub}>
                      {r.patient?.name} — {r.reason || "No reason given"}
                    </div>
                  </div>
                  <div style={styles.btnGroup}>
                    <button
                      style={styles.approveBtn}
                      onClick={() => updateRequestStatus(r._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => updateRequestStatus(r._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Today's appointments</h3>
              <button style={styles.seeAllBtn} onClick={() => navigate("/doctor/appointments")}>
                See all
              </button>
            </div>
            {todayAppts.length === 0 ? (
              <p style={styles.empty}>No appointments today.</p>
            ) : (
              todayAppts.map((a) => (
                <div key={a._id} style={styles.listItem}>
                  <div style={styles.apptLeft}>
                    <div style={styles.apptAvatar}>
                      {(a.patient?.name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.itemTitle}>{a.patient?.name}</div>
                      <div style={styles.itemSub}>
                        {new Date(a.appointmentDate).toLocaleTimeString("en-US", {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
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
    backgroundColor: "#00796b", borderRadius: "12px",
    padding: "24px 28px", marginBottom: "24px", color: "#fff"
  },
  welcomeTitle: { fontSize: "22px", fontWeight: "700", margin: 0 },
  welcomeSub: { fontSize: "14px", opacity: 0.85, marginTop: "4px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "14px", marginBottom: "24px"
  },
  statCard: { borderRadius: "10px", padding: "18px 20px", textAlign: "center" },
  statNumber: { fontSize: "32px", fontWeight: "700" },
  statLabel: { fontSize: "13px", marginTop: "4px", fontWeight: "500" },
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
  apptLeft: { display: "flex", alignItems: "center", gap: "10px" },
  apptAvatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    backgroundColor: "#00796b", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "14px", fontWeight: "700"
  },
  itemTitle: { fontSize: "14px", fontWeight: "500", color: "#333" },
  itemSub: { fontSize: "12px", color: "#999", marginTop: "2px" },
  badge: { fontSize: "12px", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" },
  btnGroup: { display: "flex", gap: "6px" },
  approveBtn: {
    padding: "5px 12px", backgroundColor: "#e8f5e9",
    color: "#2e7d32", border: "1px solid #a5d6a7",
    borderRadius: "6px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer"
  },
  rejectBtn: {
    padding: "5px 12px", backgroundColor: "#fdecea",
    color: "#c62828", border: "1px solid #ef9a9a",
    borderRadius: "6px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer"
  },
  empty: { color: "#bbb", fontSize: "14px", textAlign: "center", padding: "16px 0" }
};

export default DoctorDashboard;