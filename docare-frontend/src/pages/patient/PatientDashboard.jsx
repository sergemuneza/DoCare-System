// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const PatientDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [documents, setDocuments] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [docsRes, reqRes, apptRes] = await Promise.all([
//           API.get("/documents/my"),
//           API.get("/requests/my"),
//           API.get("/appointments/my")
//         ]);
//         setDocuments(docsRes.data);
//         setRequests(reqRes.data);
//         setAppointments(apptRes.data);
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

//   if (loading) return <div style={styles.loading}>Loading...</div>;

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.container}>
//         <h2 style={styles.welcome}>Welcome, {user.name}</h2>

//         <div style={styles.statsRow}>
//           <div style={styles.statCard("#1a73e8")}>
//             <div style={styles.statNumber}>{documents.length}</div>
//             <div style={styles.statLabel}>My Documents</div>
//           </div>
//           <div style={styles.statCard("#2e7d32")}>
//             <div style={styles.statNumber}>{requests.length}</div>
//             <div style={styles.statLabel}>My Requests</div>
//           </div>
//           <div style={styles.statCard("#6a1b9a")}>
//             <div style={styles.statNumber}>{appointments.length}</div>
//             <div style={styles.statLabel}>Appointments</div>
//           </div>
//         </div>

//         <div style={styles.actionsRow}>
//           <button style={styles.actionBtn} onClick={() => navigate("/patient/documents")}>
//             View My Documents
//           </button>
//           <button style={styles.actionBtn} onClick={() => navigate("/patient/request")}>
//             Request a Document
//           </button>
//           <button style={styles.actionBtn} onClick={() => navigate("/patient/appointment")}>
//             Book Appointment
//           </button>
//           <button style={styles.actionBtn} onClick={() => navigate("/patient/chatbot")}>
//   Ask Assistant
// </button>
//         </div>

//         <div style={styles.section}>
//           <h3 style={styles.sectionTitle}>Recent Document Requests</h3>
//           {requests.length === 0 ? (
//             <p style={styles.empty}>No requests yet.</p>
//           ) : (
//             requests.slice(0, 5).map((r) => (
//               <div key={r._id} style={styles.listItem}>
//                 <span>{r.documentType}</span>
//                 <span style={{ color: statusColor(r.status), fontWeight: "600" }}>
//                   {r.status}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>

//         <div style={styles.section}>
//           <h3 style={styles.sectionTitle}>Upcoming Appointments</h3>
//           {appointments.length === 0 ? (
//             <p style={styles.empty}>No appointments yet.</p>
//           ) : (
//             appointments.slice(0, 5).map((a) => (
//               <div key={a._id} style={styles.listItem}>
//                 <span>{a.doctor?.name || "Doctor"}</span>
//                 <span>{new Date(a.appointmentDate).toLocaleDateString()}</span>
//                 <span style={{ color: statusColor(a.status), fontWeight: "600" }}>
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
//   loading: { textAlign: "center", marginTop: "60px", fontSize: "18px" },
//   container: { padding: "24px", maxWidth: "960px", margin: "0 auto" },
//   welcome: { fontSize: "22px", marginBottom: "24px", color: "#333" },
//   statsRow: { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
//   statCard: (color) => ({
//     flex: 1,
//     minWidth: "140px",
//     backgroundColor: color,
//     color: "#fff",
//     borderRadius: "10px",
//     padding: "20px",
//     textAlign: "center"
//   }),
//   statNumber: { fontSize: "36px", fontWeight: "700" },
//   statLabel: { fontSize: "14px", marginTop: "4px", opacity: 0.9 },
//   actionsRow: { display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" },
//   actionBtn: {
//     flex: 1,
//     minWidth: "160px",
//     padding: "12px",
//     backgroundColor: "#fff",
//     color: "#1a73e8",
//     border: "2px solid #1a73e8",
//     borderRadius: "8px",
//     fontSize: "14px",
//     fontWeight: "600",
//     cursor: "pointer"
//   },
//   section: {
//     backgroundColor: "#fff",
//     borderRadius: "10px",
//     padding: "20px",
//     marginBottom: "20px",
//     boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
//   },
//   sectionTitle: { fontSize: "16px", marginBottom: "14px", color: "#333" },
//   listItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "10px 0",
//     borderBottom: "1px solid #f0f0f0",
//     fontSize: "14px"
//   },
//   empty: { color: "#999", fontSize: "14px" }
// };

// export default PatientDashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { SkeletonDashboard } from "../../components/Skeleton";

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, reqRes, apptRes, recRes] = await Promise.all([
          API.get("/documents/my"),
          API.get("/requests/my"),
          API.get("/appointments/my"),
          API.get("/records/my")
        ]);
        setDocuments(docsRes.data);
        setRequests(reqRes.data);
        setAppointments(apptRes.data);
        setRecords(recRes.data);
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
      approved: { bg: "#e8f5e9", color: "#2e7d32" },
      completed: { bg: "#e8f5e9", color: "#2e7d32" },
      rejected: { bg: "#fdecea", color: "#c62828" },
      cancelled: { bg: "#fdecea", color: "#c62828" },
      pending: { bg: "#fff8e1", color: "#e65100" },
      uploaded: { bg: "#e3f2fd", color: "#1565c0" }
    };
    const s = map[status] || { bg: "#f5f5f5", color: "#777" };
    return (
      <span style={{
        backgroundColor: s.bg, color: s.color,
        padding: "2px 10px", borderRadius: "12px",
        fontSize: "12px", fontWeight: "600"
      }}>
        {status}
      </span>
    );
  };

  // if (loading) return (
  //   <div>
  //     <Navbar />
  //     <div style={styles.loadingContainer}>
  //       <div style={styles.spinner} />
  //       <p style={styles.loadingText}>Loading your dashboard...</p>
  //     </div>
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
            <h2 style={styles.welcomeTitle}>Welcome back, {user.name}</h2>
            <p style={styles.welcomeSub}>Here is a summary of your health records and activities</p>
          </div>
        </div>

        <div style={styles.statsRow}>
          {[
            { label: "Documents", count: documents.length, color: "#1a73e8", bg: "#e8f0fe" },
            { label: "Requests", count: requests.length, color: "#6a1b9a", bg: "#f3e5f5" },
            { label: "Appointments", count: appointments.length, color: "#00796b", bg: "#e0f2f1" },
            { label: "Medical Records", count: records.length, color: "#c62828", bg: "#fdecea" }
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
              { label: "My Documents", sub: "View & download files", path: "/patient/documents", color: "#1a73e8" },
              { label: "Request Document", sub: "Ask for a record copy", path: "/patient/request", color: "#6a1b9a" },
              { label: "Book Appointment", sub: "Schedule with a doctor", path: "/patient/appointment", color: "#00796b" },
              { label: "Medical Records", sub: "View diagnoses & notes", path: "/patient/records", color: "#c62828" },
              { label: "Ask Assistant", sub: "Chat with DoCare bot", path: "/patient/chatbot", color: "#e65100" }
            ].map((a) => (
              <div
                key={a.label}
                style={styles.actionCard}
                onClick={() => navigate(a.path)}
              >
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
            <h3 style={styles.sectionTitle}>Recent requests</h3>
            {requests.length === 0 ? (
              <p style={styles.empty}>No requests yet.</p>
            ) : (
              requests.slice(0, 5).map((r) => (
                <div key={r._id} style={styles.listItem}>
                  <div>
                    <div style={styles.itemTitle}>
                      {r.documentType.replace(/_/g, " ")}
                    </div>
                    <div style={styles.itemSub}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {statusBadge(r.status)}
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Upcoming appointments</h3>
            {appointments.length === 0 ? (
              <p style={styles.empty}>No appointments yet.</p>
            ) : (
              appointments.slice(0, 5).map((a) => (
                <div key={a._id} style={styles.listItem}>
                  <div>
                    <div style={styles.itemTitle}>
                      Dr. {a.doctor?.name || "Unknown"}
                    </div>
                    <div style={styles.itemSub}>
                      {new Date(a.appointmentDate).toLocaleString()}
                    </div>
                  </div>
                  {statusBadge(a.status)}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent medical records</h3>
          {records.length === 0 ? (
            <p style={styles.empty}>No medical records yet.</p>
          ) : (
            records.slice(0, 3).map((r) => (
              <div key={r._id} style={styles.recordItem}>
                <div style={styles.recordLeft}>
                  <div style={styles.itemTitle}>{r.diagnosis}</div>
                  <div style={styles.itemSub}>
                    Dr. {r.doctor?.name} — {new Date(r.visitDate).toLocaleDateString()}
                  </div>
                  {r.notes && (
                    <div style={styles.recordNotes}>{r.notes}</div>
                  )}
                </div>
              </div>
            ))
          )}
          {records.length > 3 && (
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate("/patient/records")}
            >
              View all {records.length} records
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  loadingContainer: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    minHeight: "80vh", gap: "16px"
  },
  spinner: {
    width: "36px", height: "36px",
    border: "3px solid #e0e0e0",
    borderTop: "3px solid #1a73e8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  loadingText: { color: "#777", fontSize: "15px" },
  container: { padding: "24px", maxWidth: "1000px", margin: "0 auto" },
  welcomeBanner: {
    backgroundColor: "#1a73e8",
    borderRadius: "12px",
    padding: "24px 28px",
    marginBottom: "24px",
    color: "#fff"
  },
  welcomeTitle: { fontSize: "22px", fontWeight: "700", margin: 0 },
  welcomeSub: { fontSize: "14px", opacity: 0.85, marginTop: "4px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "14px",
    marginBottom: "24px"
  },
  statCard: {
    borderRadius: "10px", padding: "18px 20px",
    textAlign: "center"
  },
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
    transition: "box-shadow 0.2s",
    backgroundColor: "#fafafa"
  },
  actionDot: {
    width: "10px", height: "10px",
    borderRadius: "50%", flexShrink: 0
  },
  actionLabel: { fontSize: "14px", fontWeight: "600", color: "#333" },
  actionSub: { fontSize: "12px", color: "#888", marginTop: "2px" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px", marginBottom: "16px"
  },
  section: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  sectionTitle: {
    fontSize: "15px", fontWeight: "600",
    color: "#333", marginBottom: "14px"
  },
  listItem: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "10px 0",
    borderBottom: "1px solid #f5f5f5"
  },
  itemTitle: { fontSize: "14px", fontWeight: "500", color: "#333" },
  itemSub: { fontSize: "12px", color: "#999", marginTop: "3px" },
  recordItem: {
    padding: "12px 0", borderBottom: "1px solid #f5f5f5"
  },
  recordLeft: {},
  recordNotes: {
    fontSize: "13px", color: "#555",
    marginTop: "6px", fontStyle: "italic"
  },
  viewAllBtn: {
    marginTop: "12px", padding: "8px 16px",
    backgroundColor: "transparent", color: "#1a73e8",
    border: "1px solid #1a73e8", borderRadius: "6px",
    fontSize: "13px", cursor: "pointer", fontWeight: "500"
  },
  empty: { color: "#bbb", fontSize: "14px", textAlign: "center", padding: "16px 0" }
};

export default PatientDashboard;