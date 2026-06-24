// import { useState, useEffect } from "react";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const statusConfig = {
//   pending:  { bg: "#fff8e1", color: "#e65100" },
//   uploaded: { bg: "#e3f2fd", color: "#1565c0" },
//   approved: { bg: "#e8f5e9", color: "#2e7d32" },
//   rejected: { bg: "#fdecea", color: "#c62828" }
// };

// const DoctorRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [updating, setUpdating] = useState(null);

//   useEffect(() => {
//     API.get("/requests")
//       .then(({ data }) => setRequests(data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const updateStatus = async (id, status) => {
//     setUpdating(id + status);
//     try {
//       await API.put(`/requests/${id}/status`, { status });
//       setRequests(requests.map((r) => r._id === id ? { ...r, status } : r));
//     } catch (err) {
//       alert("Failed to update");
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const filtered = filter === "all"
//     ? requests
//     : requests.filter((r) => r.status === filter);

//   if (loading) return (
//     <div><Navbar /><div style={styles.center}>Loading requests...</div></div>
//   );

//   return (
//     <div style={styles.page}>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.header}>
//           <h2 style={styles.title}>Document Requests</h2>
//           <p style={styles.sub}>{requests.length} total request{requests.length !== 1 ? "s" : ""}</p>
//         </div>

//         <div style={styles.statsRow}>
//           {Object.entries(statusConfig).map(([key, val]) => (
//             <div key={key} style={{ ...styles.statCard, backgroundColor: val.bg }}>
//               <div style={{ ...styles.statNum, color: val.color }}>
//                 {requests.filter((r) => r.status === key).length}
//               </div>
//               <div style={{ ...styles.statLabel, color: val.color }}>
//                 {key.charAt(0).toUpperCase() + key.slice(1)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div style={styles.filters}>
//           {["all", "pending", "uploaded", "approved", "rejected"].map((f) => (
//             <button
//               key={f}
//               style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
//               onClick={() => setFilter(f)}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//               {f !== "all" && (
//                 <span style={styles.filterCount}>
//                   {requests.filter((r) => r.status === f).length}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {filtered.length === 0 ? (
//           <div style={styles.emptyState}>
//             <div style={styles.emptyIcon}>📋</div>
//             <div style={styles.emptyTitle}>No requests found</div>
//             <div style={styles.emptySub}>
//               {filter === "all" ? "No document requests yet" : `No ${filter} requests`}
//             </div>
//           </div>
//         ) : (
//           <div style={styles.list}>
//             {filtered.map((r) => {
//               const sc = statusConfig[r.status] || { bg: "#f5f5f5", color: "#777" };
//               return (
//                 <div key={r._id} style={styles.card}>
//                   <div style={styles.cardTop}>
//                     <div style={styles.patientRow}>
//                       <div style={styles.patientAvatar}>
//                         {(r.patient?.name || "P").charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <div style={styles.patientName}>{r.patient?.name}</div>
//                         <div style={styles.patientEmail}>{r.patient?.email}</div>
//                       </div>
//                     </div>
//                     <span style={{
//                       ...styles.statusBadge,
//                       backgroundColor: sc.bg, color: sc.color
//                     }}>
//                       {r.status}
//                     </span>
//                   </div>

//                   <div style={styles.requestInfo}>
//                     <div style={styles.docTypeBadge}>
//                       {r.documentType.replace(/_/g, " ")}
//                     </div>
//                     {r.reason && (
//                       <div style={styles.reason}>"{r.reason}"</div>
//                     )}
//                     <div style={styles.date}>
//                       Submitted {new Date(r.createdAt).toLocaleDateString("en-US", {
//                         year: "numeric", month: "long", day: "numeric"
//                       })}
//                     </div>
//                   </div>

//                   {r.status === "pending" && (
//                     <div style={styles.actionRow}>
//                       <button
//                         style={styles.approveBtn}
//                         disabled={!!updating}
//                         onClick={() => updateStatus(r._id, "approved")}
//                       >
//                         {updating === r._id + "approved" ? "..." : "Approve Request"}
//                       </button>
//                       <button
//                         style={styles.uploadedBtn}
//                         disabled={!!updating}
//                         onClick={() => updateStatus(r._id, "uploaded")}
//                       >
//                         {updating === r._id + "uploaded" ? "..." : "Mark as Uploaded"}
//                       </button>
//                       <button
//                         style={styles.rejectBtn}
//                         disabled={!!updating}
//                         onClick={() => updateStatus(r._id, "rejected")}
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )}

//                   {r.status === "uploaded" && (
//                     <div style={styles.actionRow}>
//                       <button
//                         style={styles.approveBtn}
//                         disabled={!!updating}
//                         onClick={() => updateStatus(r._id, "approved")}
//                       >
//                         Approve & Close
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
//   center: { textAlign: "center", marginTop: "80px", color: "#888" },
//   container: { padding: "24px", maxWidth: "860px", margin: "0 auto" },
//   header: { marginBottom: "20px" },
//   title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
//   sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
//   statsRow: {
//     display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
//     gap: "12px", marginBottom: "20px"
//   },
//   statCard: { borderRadius: "10px", padding: "14px", textAlign: "center" },
//   statNum: { fontSize: "24px", fontWeight: "700" },
//   statLabel: { fontSize: "12px", fontWeight: "500", marginTop: "2px" },
//   filters: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
//   filterBtn: {
//     display: "flex", alignItems: "center", gap: "6px",
//     padding: "6px 14px", borderRadius: "20px",
//     border: "1px solid #ddd", backgroundColor: "#fff",
//     fontSize: "13px", cursor: "pointer", color: "#555"
//   },
//   filterActive: { backgroundColor: "#00796b", color: "#fff", borderColor: "#00796b" },
//   filterCount: {
//     backgroundColor: "rgba(0,0,0,0.12)", borderRadius: "10px",
//     padding: "0 6px", fontSize: "11px", fontWeight: "700"
//   },
//   emptyState: {
//     textAlign: "center", padding: "60px 20px",
//     backgroundColor: "#fff", borderRadius: "12px",
//     boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
//   },
//   emptyIcon: { fontSize: "40px", marginBottom: "12px" },
//   emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
//   emptySub: { fontSize: "14px", color: "#999", marginTop: "6px" },
//   list: { display: "flex", flexDirection: "column", gap: "12px" },
//   card: {
//     backgroundColor: "#fff", borderRadius: "12px",
//     padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
//   },
//   cardTop: {
//     display: "flex", justifyContent: "space-between",
//     alignItems: "center", marginBottom: "12px"
//   },
//   patientRow: { display: "flex", alignItems: "center", gap: "10px" },
//   patientAvatar: {
//     width: "38px", height: "38px", borderRadius: "50%",
//     backgroundColor: "#00796b", color: "#fff",
//     display: "flex", alignItems: "center",
//     justifyContent: "center", fontSize: "15px", fontWeight: "700"
//   },
//   patientName: { fontSize: "14px", fontWeight: "600", color: "#333" },
//   patientEmail: { fontSize: "12px", color: "#999", marginTop: "2px" },
//   statusBadge: {
//     fontSize: "12px", padding: "3px 10px",
//     borderRadius: "12px", fontWeight: "600"
//   },
//   requestInfo: {
//     backgroundColor: "#f9f9f9", borderRadius: "8px",
//     padding: "12px", marginBottom: "12px"
//   },
//   docTypeBadge: {
//     fontSize: "13px", fontWeight: "600",
//     color: "#333", textTransform: "capitalize", marginBottom: "6px"
//   },
//   reason: { fontSize: "13px", color: "#555", fontStyle: "italic", marginBottom: "6px" },
//   date: { fontSize: "12px", color: "#aaa" },
//   actionRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
//   approveBtn: {
//     padding: "8px 16px", backgroundColor: "#e8f5e9",
//     color: "#2e7d32", border: "1px solid #a5d6a7",
//     borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
//   },
//   uploadedBtn: {
//     padding: "8px 16px", backgroundColor: "#e3f2fd",
//     color: "#1565c0", border: "1px solid #90caf9",
//     borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
//   },
//   rejectBtn: {
//     padding: "8px 16px", backgroundColor: "#fdecea",
//     color: "#c62828", border: "1px solid #ef9a9a",
//     borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
//   }
// };

// export default DoctorRequests;
import { useState, useEffect, useRef } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const statusConfig = {
  pending:  { bg: "#fff8e1", color: "#e65100" },
  uploaded: { bg: "#e8f0fe", color: "#1a73e8" },
  approved: { bg: "#e8f5e9", color: "#2e7d32" },
  rejected: { bg: "#fdecea", color: "#c62828" }
};

const DoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef(null);

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

  const handleUploadForRequest = async (request) => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("documentType", request.documentType);
      formData.append("patientId", request.patient._id);
      formData.append("description", uploadDesc || `Uploaded in response to patient request`);
      formData.append("requestId", request._id);

      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setRequests(requests.map((r) =>
        r._id === request._id ? { ...r, status: "uploaded" } : r
      ));
      setUploadingFor(null);
      setUploadFile(null);
      setUploadDesc("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

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
        <div style={styles.header}>
          <h2 style={styles.title}>Document Requests</h2>
          <p style={styles.sub}>{requests.length} total request{requests.length !== 1 ? "s" : ""}</p>
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

        <div style={styles.filters}>
          {["all", "pending", "uploaded", "approved", "rejected"].map((f) => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={styles.filterCount}>
                {f === "all" ? requests.length : requests.filter((r) => r.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyTitle}>No requests found</div>
            <div style={styles.emptySub}>
              {filter === "all" ? "No document requests yet" : `No ${filter} requests`}
            </div>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((r) => {
              const sc = statusConfig[r.status] || { bg: "#f5f5f5", color: "#777" };
              const isUploadOpen = uploadingFor === r._id;
              return (
                <div key={r._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.patientRow}>
                      <div style={styles.patientAvatar}>
                        {(r.patient?.name || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.patientName}>{r.patient?.name}</div>
                        <div style={styles.patientEmail}>{r.patient?.email}</div>
                      </div>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: sc.bg, color: sc.color
                    }}>
                      {r.status}
                    </span>
                  </div>

                  <div style={styles.requestInfo}>
                    <div style={styles.docType}>
                      {r.documentType.replace(/_/g, " ")}
                    </div>
                    {r.reason && (
                      <div style={styles.reason}>"{r.reason}"</div>
                    )}
                    <div style={styles.date}>
                      Submitted {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </div>
                  </div>

                  {r.status === "pending" && !isUploadOpen && (
                    <div style={styles.actionRow}>
                      <button
                        style={styles.uploadTriggerBtn}
                        onClick={() => {
                          setUploadingFor(r._id);
                          setUploadFile(null);
                          setUploadDesc("");
                          setUploadError("");
                        }}
                      >
                        Upload Document
                      </button>
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

                  {r.status === "pending" && isUploadOpen && (
                    <div style={styles.uploadForm}>
                      <div style={styles.uploadFormTitle}>
                        Upload document for {r.patient?.name}
                      </div>
                      <div style={styles.uploadDocType}>
                        Document type: <strong>{r.documentType.replace(/_/g, " ")}</strong>
                      </div>

                      {uploadError && (
                        <div style={styles.uploadError}>{uploadError}</div>
                      )}

                      <div style={styles.uploadField}>
                        <label style={styles.uploadLabel}>Select file (PDF, JPG, PNG)</label>
                        <input
                          ref={fileRef}
                          style={styles.fileInput}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setUploadFile(e.target.files[0])}
                        />
                      </div>

                      {uploadFile && (
                        <div style={styles.selectedFile}>
                          Selected: {uploadFile.name}
                        </div>
                      )}

                      <div style={styles.uploadField}>
                        <label style={styles.uploadLabel}>Note for patient (optional)</label>
                        <textarea
                          style={styles.uploadTextarea}
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                          placeholder="Add a note about this document..."
                        />
                      </div>

                      <div style={styles.uploadActions}>
                        <button
                          style={{
                            ...styles.confirmUploadBtn,
                            opacity: uploading ? 0.7 : 1
                          }}
                          disabled={uploading}
                          onClick={() => handleUploadForRequest(r)}
                        >
                          {uploading ? "Uploading..." : "Confirm Upload"}
                        </button>
                        <button
                          style={styles.cancelUploadBtn}
                          onClick={() => {
                            setUploadingFor(null);
                            setUploadFile(null);
                            setUploadError("");
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {r.status === "uploaded" && (
                    <div style={styles.actionRow}>
                      <div style={styles.uploadedNote}>
                        Document has been uploaded — patient has been notified
                      </div>
                      <button
                        style={styles.approveBtn}
                        disabled={!!updating}
                        onClick={() => updateStatus(r._id, "approved")}
                      >
                        {updating === r._id + "approved" ? "..." : "Approve & Close"}
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
    backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "10px",
    padding: "0 6px", fontSize: "11px", fontWeight: "700"
  },
  emptyState: {
    textAlign: "center", padding: "60px 20px",
    backgroundColor: "#fff", borderRadius: "12px"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  emptySub: { fontSize: "14px", color: "#999", marginTop: "6px" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  cardTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "12px"
  },
  patientRow: { display: "flex", alignItems: "center", gap: "10px" },
  patientAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    backgroundColor: "#00796b", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "15px", fontWeight: "700"
  },
  patientName: { fontSize: "14px", fontWeight: "600", color: "#333" },
  patientEmail: { fontSize: "12px", color: "#999", marginTop: "2px" },
  statusBadge: {
    fontSize: "12px", padding: "3px 10px",
    borderRadius: "12px", fontWeight: "600"
  },
  requestInfo: {
    backgroundColor: "#f9f9f9", borderRadius: "8px",
    padding: "12px", marginBottom: "12px"
  },
  docType: {
    fontSize: "13px", fontWeight: "600",
    color: "#333", textTransform: "capitalize", marginBottom: "4px"
  },
  reason: { fontSize: "13px", color: "#555", fontStyle: "italic", marginBottom: "4px" },
  date: { fontSize: "12px", color: "#aaa" },
  actionRow: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
  uploadTriggerBtn: {
    padding: "8px 16px", backgroundColor: "#1a73e8",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  approveBtn: {
    padding: "8px 16px", backgroundColor: "#e8f5e9",
    color: "#2e7d32", border: "1px solid #a5d6a7",
    borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  rejectBtn: {
    padding: "8px 16px", backgroundColor: "#fdecea",
    color: "#c62828", border: "1px solid #ef9a9a",
    borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  uploadedNote: {
    flex: 1, fontSize: "13px", color: "#1a73e8",
    fontWeight: "500", fontStyle: "italic"
  },
  uploadForm: {
    backgroundColor: "#f0f7ff", borderRadius: "10px",
    padding: "16px", border: "1px solid #bbdefb"
  },
  uploadFormTitle: {
    fontSize: "14px", fontWeight: "700",
    color: "#1a73e8", marginBottom: "4px"
  },
  uploadDocType: {
    fontSize: "13px", color: "#555",
    marginBottom: "12px"
  },
  uploadError: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "8px 12px", borderRadius: "6px",
    fontSize: "13px", marginBottom: "10px"
  },
  uploadField: { marginBottom: "10px" },
  uploadLabel: {
    display: "block", fontSize: "12px",
    fontWeight: "600", color: "#555", marginBottom: "5px"
  },
  fileInput: {
    width: "100%", padding: "8px",
    borderRadius: "7px", border: "1px solid #ddd",
    fontSize: "13px", backgroundColor: "#fff",
    boxSizing: "border-box"
  },
  selectedFile: {
    fontSize: "12px", color: "#1a73e8",
    marginBottom: "8px", fontWeight: "500"
  },
  uploadTextarea: {
    width: "100%", padding: "8px 10px",
    borderRadius: "7px", border: "1px solid #ddd",
    fontSize: "13px", resize: "vertical",
    minHeight: "70px", fontFamily: "inherit",
    boxSizing: "border-box"
  },
  uploadActions: { display: "flex", gap: "8px", marginTop: "4px" },
  confirmUploadBtn: {
    padding: "9px 20px", backgroundColor: "#1a73e8",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer"
  },
  cancelUploadBtn: {
    padding: "9px 16px", backgroundColor: "#f5f5f5",
    color: "#555", border: "1px solid #ddd",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer"
  }
};

export default DoctorRequests;