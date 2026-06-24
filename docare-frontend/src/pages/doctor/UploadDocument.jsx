// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const UploadDocument = () => {
//   const [patientId, setPatientId] = useState("");
//   const [documentType, setDocumentType] = useState("prescription");
//   const [file, setFile] = useState(null);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     if (!file) return setError("Please select a file");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("documentType", documentType);
//     formData.append("patientId", patientId);

//     try {
//       await API.post("/documents/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setSuccess("Document uploaded successfully!");
//       setTimeout(() => navigate("/doctor"), 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || "Upload failed");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>Upload Document</h2>
//           {success && <div style={styles.success}>{success}</div>}
//           {error && <div style={styles.error}>{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div style={styles.field}>
//               <label style={styles.label}>Patient ID</label>
//               <input
//                 style={styles.input}
//                 type="text"
//                 value={patientId}
//                 onChange={(e) => setPatientId(e.target.value)}
//                 placeholder="Paste the patient's ID"
//                 required
//               />
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Document Type</label>
//               <select
//                 style={styles.input}
//                 value={documentType}
//                 onChange={(e) => setDocumentType(e.target.value)}
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
//               <label style={styles.label}>File (PDF, JPG, PNG)</label>
//               <input
//                 style={styles.input}
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 required
//               />
//             </div>
//             <button type="submit" style={styles.btn}>Upload</button>
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
//     padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px"
//   },
//   error: {
//     backgroundColor: "#fdecea", color: "#c62828",
//     padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px"
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

// export default UploadDocument;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const UploadDocument = () => {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [documentType, setDocumentType] = useState("prescription");
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await API.get("/auth/patients");
        setPatients(data);
      } catch (err) {
        console.error("Failed to load patients", err);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) return setError("Please select a file");
    if (!patientId) return setError("Please select a patient");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    formData.append("patientId", patientId);
    formData.append("description", description);

    try {
      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess("Document uploaded successfully!");
      setTimeout(() => navigate("/doctor"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Upload Document</h2>
          {success && <div style={styles.success}>{success}</div>}
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Select Patient</label>
              <select
                style={styles.input}
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                <option value="">-- Choose a patient --</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {p.email}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Document Type</label>
              <select
                style={styles.input}
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="prescription">Prescription</option>
                <option value="lab_result">Lab Result</option>
                <option value="medical_record">Medical Record</option>
                <option value="radiology">Radiology</option>
                <option value="invoice">Invoice</option>
                <option value="referral_letter">Referral Letter</option>
              </select>
            </div>
            <div style={styles.field}>
  <label style={styles.label}>Description (optional)</label>
  <textarea
    style={{ ...styles.input, height: "80px", resize: "vertical" }}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Add a note for the patient about this document..."
  />
</div>
            <div style={styles.field}>
              <label style={styles.label}>File (PDF, JPG, PNG)</label>
              <input
                style={styles.input}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <button type="submit" style={styles.btn}>Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "40px 24px" },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px",
    maxWidth: "500px",
    margin: "0 auto",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
  },
  title: { marginBottom: "24px", color: "#333" },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "10px", borderRadius: "6px",
    marginBottom: "16px", fontSize: "14px"
  },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "10px", borderRadius: "6px",
    marginBottom: "16px", fontSize: "14px"
  },
  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
  input: {
    width: "100%", padding: "10px 12px",
    borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px"
  },
  btn: {
    width: "100%", padding: "12px", backgroundColor: "#1a73e8",
    color: "#fff", border: "none", borderRadius: "6px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  }
};

export default UploadDocument;