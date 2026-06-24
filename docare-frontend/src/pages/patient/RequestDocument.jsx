// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const RequestDocument = () => {
//   const [form, setForm] = useState({ documentType: "prescription", reason: "" });
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     try {
//       await API.post("/requests", form);
//       setSuccess("Request submitted successfully!");
//       setTimeout(() => navigate("/patient"), 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit request");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>Request a Document</h2>
//           {success && <div style={styles.success}>{success}</div>}
//           {error && <div style={styles.error}>{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div style={styles.field}>
//               <label style={styles.label}>Document Type</label>
//               <select
//                 style={styles.input}
//                 value={form.documentType}
//                 onChange={(e) => setForm({ ...form, documentType: e.target.value })}
//               >
//                 <option value="prescription">Prescription</option>
//                 <option value="lab_result">Lab Result</option>
//                 <option value="medical_record">Medical Record</option>
//                 <option value="radiology">Radiology</option>
//                 <option value="invoice">Invoice</option>
//                 <option value="referral_letter">Referral Letter</option>
//               </select>
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Reason</label>
//               <textarea
//                 style={{ ...styles.input, height: "100px", resize: "vertical" }}
//                 value={form.reason}
//                 onChange={(e) => setForm({ ...form, reason: e.target.value })}
//                 placeholder="Why do you need this document?"
//                 required
//               />
//             </div>
//             <button type="submit" style={styles.btn}>Submit Request</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f0f2f5",
//     padding: "40px 24px"
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     padding: "32px",
//     maxWidth: "500px",
//     margin: "0 auto",
//     boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
//   },
//   title: { marginBottom: "24px", color: "#333" },
//   success: {
//     backgroundColor: "#e8f5e9",
//     color: "#2e7d32",
//     padding: "10px",
//     borderRadius: "6px",
//     marginBottom: "16px",
//     fontSize: "14px"
//   },
//   error: {
//     backgroundColor: "#fdecea",
//     color: "#c62828",
//     padding: "10px",
//     borderRadius: "6px",
//     marginBottom: "16px",
//     fontSize: "14px"
//   },
//   field: { marginBottom: "16px" },
//   label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
//   input: {
//     width: "100%",
//     padding: "10px 12px",
//     borderRadius: "6px",
//     border: "1px solid #ddd",
//     fontSize: "14px"
//   },
//   btn: {
//     width: "100%",
//     padding: "12px",
//     backgroundColor: "#1a73e8",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     fontSize: "15px",
//     fontWeight: "600",
//     cursor: "pointer"
//   }
// };

// export default RequestDocument;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const documentTypes = [
  { value: "prescription", label: "Prescription", desc: "Medication prescribed by your doctor" },
  { value: "lab_result", label: "Lab Result", desc: "Blood tests and laboratory reports" },
  { value: "medical_record", label: "Medical Record", desc: "Full visit summary and notes" },
  { value: "radiology", label: "Radiology Report", desc: "X-ray, MRI or scan results" },
  { value: "invoice", label: "Invoice", desc: "Billing and payment record" },
  { value: "referral_letter", label: "Referral Letter", desc: "Specialist referral from your doctor" }
];

const RequestDocument = () => {
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return setError("Please select a document type");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await API.post("/requests", { documentType: selected, reason });
      setSuccess("Your request has been submitted successfully!");
      setTimeout(() => navigate("/patient"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Request a Document</h2>
          <p style={styles.sub}>Select the type of document you need and provide a reason</p>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Select document type</h3>
            <div style={styles.typeGrid}>
              {documentTypes.map((t) => (
                <div
                  key={t.value}
                  style={{
                    ...styles.typeOption,
                    ...(selected === t.value ? styles.typeSelected : {})
                  }}
                  onClick={() => setSelected(t.value)}
                >
                  <div style={styles.typeLabel}>{t.label}</div>
                  <div style={styles.typeDesc}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Reason for request</h3>
            <textarea
              style={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need this document (e.g. for insurance, second opinion, personal records...)"
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
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
  cardTitle: {
    fontSize: "15px", fontWeight: "600",
    color: "#333", marginBottom: "14px"
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
    gap: "10px"
  },
  typeOption: {
    padding: "14px", borderRadius: "10px",
    border: "2px solid #e8e8e8", cursor: "pointer",
    backgroundColor: "#fafafa"
  },
  typeSelected: {
    border: "2px solid #1a73e8",
    backgroundColor: "#e8f0fe"
  },
  typeLabel: { fontSize: "14px", fontWeight: "600", color: "#333" },
  typeDesc: { fontSize: "12px", color: "#888", marginTop: "4px" },
  textarea: {
    width: "100%", padding: "12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", resize: "vertical",
    minHeight: "110px", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box"
  },
  submitBtn: {
    width: "100%", padding: "14px",
    backgroundColor: "#1a73e8", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600",
    cursor: "pointer"
  }
};

export default RequestDocument;