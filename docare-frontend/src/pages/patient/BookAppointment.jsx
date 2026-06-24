// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import API from "../../api/axios";
// // import Navbar from "../../components/Navbar";

// // const BookAppointment = () => {
// //   const [form, setForm] = useState({ doctorId: "", appointmentDate: "", reason: "" });
// //   const [success, setSuccess] = useState("");
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");
// //     try {
// //       await API.post("/appointments", form);
// //       setSuccess("Appointment booked successfully!");
// //       setTimeout(() => navigate("/patient"), 1500);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to book appointment");
// //     }
// //   };

// //   return (
// //     <div>
// //       <Navbar />
// //       <div style={styles.container}>
// //         <div style={styles.card}>
// //           <h2 style={styles.title}>Book an Appointment</h2>
// //           {success && <div style={styles.success}>{success}</div>}
// //           {error && <div style={styles.error}>{error}</div>}
// //           <form onSubmit={handleSubmit}>
// //             <div style={styles.field}>
// //               <label style={styles.label}>Doctor ID</label>
// //               <input
// //                 style={styles.input}
// //                 type="text"
// //                 value={form.doctorId}
// //                 onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
// //                 placeholder="Paste the doctor's ID"
// //                 required
// //               />
// //             </div>
// //             <div style={styles.field}>
// //               <label style={styles.label}>Appointment Date</label>
// //               <input
// //                 style={styles.input}
// //                 type="datetime-local"
// //                 value={form.appointmentDate}
// //                 onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
// //                 required
// //               />
// //             </div>
// //             <div style={styles.field}>
// //               <label style={styles.label}>Reason</label>
// //               <textarea
// //                 style={{ ...styles.input, height: "100px", resize: "vertical" }}
// //                 value={form.reason}
// //                 onChange={(e) => setForm({ ...form, reason: e.target.value })}
// //                 placeholder="Reason for appointment"
// //                 required
// //               />
// //             </div>
// //             <button type="submit" style={styles.btn}>Book Appointment</button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: { minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "40px 24px" },
// //   card: {
// //     backgroundColor: "#fff",
// //     borderRadius: "12px",
// //     padding: "32px",
// //     maxWidth: "500px",
// //     margin: "0 auto",
// //     boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
// //   },
// //   title: { marginBottom: "24px", color: "#333" },
// //   success: {
// //     backgroundColor: "#e8f5e9", color: "#2e7d32",
// //     padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px"
// //   },
// //   error: {
// //     backgroundColor: "#fdecea", color: "#c62828",
// //     padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px"
// //   },
// //   field: { marginBottom: "16px" },
// //   label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
// //   input: {
// //     width: "100%", padding: "10px 12px",
// //     borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px"
// //   },
// //   btn: {
// //     width: "100%", padding: "12px", backgroundColor: "#1a73e8",
// //     color: "#fff", border: "none", borderRadius: "6px",
// //     fontSize: "15px", fontWeight: "600", cursor: "pointer"
// //   }
// // };

// // export default BookAppointment;
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const BookAppointment = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [form, setForm] = useState({
//     doctorId: "", appointmentDate: "", reason: ""
//   });
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const { data } = await API.get("/auth/doctors");
//         setDoctors(data);
//       } catch (err) {
//         console.error("Failed to load doctors", err);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     try {
//       await API.post("/appointments", form);
//       setSuccess("Appointment booked successfully!");
//       setTimeout(() => navigate("/patient"), 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to book appointment");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>Book an Appointment</h2>
//           {success && <div style={styles.success}>{success}</div>}
//           {error && <div style={styles.error}>{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div style={styles.field}>
//               <label style={styles.label}>Select Doctor</label>
//               <select
//                 style={styles.input}
//                 value={form.doctorId}
//                 onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
//                 required
//               >
//                 <option value="">-- Choose a doctor --</option>
//                 {doctors.map((d) => (
//                   <option key={d._id} value={d._id}>
//                     Dr. {d.name} — {d.email}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Appointment Date</label>
//               <input
//                 style={styles.input}
//                 type="datetime-local"
//                 value={form.appointmentDate}
//                 onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
//                 required
//               />
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Reason</label>
//               <textarea
//                 style={{ ...styles.input, height: "100px", resize: "vertical" }}
//                 value={form.reason}
//                 onChange={(e) => setForm({ ...form, reason: e.target.value })}
//                 placeholder="Reason for appointment"
//                 required
//               />
//             </div>
//             <button type="submit" style={styles.btn}>Book Appointment</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "40px 24px" },
//   card: {
//     backgroundColor: "#fff", borderRadius: "12px",
//     padding: "32px", maxWidth: "500px",
//     margin: "0 auto", boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
//   },
//   title: { marginBottom: "24px", color: "#333" },
//   success: {
//     backgroundColor: "#e8f5e9", color: "#2e7d32",
//     padding: "10px", borderRadius: "6px",
//     marginBottom: "16px", fontSize: "14px"
//   },
//   error: {
//     backgroundColor: "#fdecea", color: "#c62828",
//     padding: "10px", borderRadius: "6px",
//     marginBottom: "16px", fontSize: "14px"
//   },
//   field: { marginBottom: "16px" },
//   label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
//   input: {
//     width: "100%", padding: "10px 12px",
//     borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px"
//   },
//   btn: {
//     width: "100%", padding: "12px", backgroundColor: "#1a73e8",
//     color: "#fff", border: "none", borderRadius: "6px",
//     fontSize: "15px", fontWeight: "600", cursor: "pointer"
//   }
// };

// export default BookAppointment;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: "", appointmentDate: "", reason: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

//   useEffect(() => {
//     API.get("/auth/doctors")
//       .then(({ data }) => setDoctors(data))
//       .catch((err) => console.error("Failed to load doctors", err));
//   }, []);

  useEffect(() => {
  API.get("/auth/doctors/details")
    .then(({ data }) => setDoctors(data))
    .catch((err) => console.error("Failed to load doctors", err));
}, []);

  const selectedDoctor = doctors.find((d) => d._id === form.doctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctorId) return setError("Please select a doctor");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await API.post("/appointments", form);
      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/patient"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Book an Appointment</h2>
          <p style={styles.sub}>Choose a doctor and pick a date and time</p>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Select a doctor</h3>
            {doctors.length === 0 ? (
              <p style={styles.noData}>No doctors registered yet.</p>
            ) : (
              <div style={styles.doctorGrid}>
{doctors.map((d) => (
  <div
    key={d._id}
    style={{
      ...styles.doctorCard,
      ...(form.doctorId === d._id ? styles.doctorSelected : {})
    }}
    onClick={() => setForm({ ...form, doctorId: d._id })}
  >
    <div style={styles.doctorAvatar}>
      {d.name.charAt(0).toUpperCase()}
    </div>
    <div>
      <div style={styles.doctorName}>Dr. {d.name}</div>
      {d.profile?.specialization && (
        <div style={styles.doctorSpec}>{d.profile.specialization}</div>
      )}
      <div style={styles.doctorEmail}>{d.email}</div>
      {d.profile?.yearsOfExperience > 0 && (
        <div style={styles.doctorExp}>
          {d.profile.yearsOfExperience} years experience
        </div>
      )}
      {d.profile?.workingHours && (
        <div style={styles.doctorHours}>{d.profile.workingHours}</div>
      )}
    </div>
  </div>
))}
              </div>
            )}
          </div>

          {selectedDoctor && (
            <div style={styles.selectedInfo}>
              Booking with Dr. {selectedDoctor.name}
            </div>
          )}

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Date and time</h3>
            <input
              style={styles.input}
              type="datetime-local"
              value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              required
            />
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Reason for visit</h3>
            <textarea
              style={styles.textarea}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Briefly describe your symptoms or reason for the visit..."
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  container: { padding: "24px", maxWidth: "700px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "12px 16px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px", fontWeight: "500"
  },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "12px 16px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px"
  },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "14px" },
  noData: { color: "#999", fontSize: "14px" },
  doctorGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  doctorCard: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "14px", borderRadius: "10px",
    border: "2px solid #e8e8e8", cursor: "pointer",
    backgroundColor: "#fafafa"
  },
  doctorSelected: {
    border: "2px solid #1a73e8",
    backgroundColor: "#e8f0fe"
  },
  doctorAvatar: {
    width: "42px", height: "42px", borderRadius: "50%",
    backgroundColor: "#1a73e8", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "18px",
    fontWeight: "700", flexShrink: 0
  },
  doctorName: { fontSize: "14px", fontWeight: "600", color: "#333" },
  doctorEmail: { fontSize: "12px", color: "#888", marginTop: "2px" },
  doctorSpec: { fontSize: "12px", color: "#00796b", fontWeight: "600", marginTop: "2px" },
doctorExp:  { fontSize: "11px", color: "#888", marginTop: "2px" },
doctorHours:{ fontSize: "11px", color: "#e65100", marginTop: "2px" },
  selectedInfo: {
    backgroundColor: "#e8f0fe", color: "#1a73e8",
    padding: "10px 16px", borderRadius: "8px",
    fontSize: "14px", fontWeight: "500",
    marginBottom: "16px"
  },
  input: {
    width: "100%", padding: "10px 12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", boxSizing: "border-box"
  },
  textarea: {
    width: "100%", padding: "12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", resize: "vertical",
    minHeight: "100px", fontFamily: "inherit",
    boxSizing: "border-box"
  },
  submitBtn: {
    width: "100%", padding: "14px",
    backgroundColor: "#1a73e8", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  }
};

export default BookAppointment;