// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import API from "../../api/axios";
// import Navbar from "../../components/Navbar";

// const DoctorProfile = () => {
//   const { user, login } = useAuth();
//   const [name, setName] = useState(user?.name || "");
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");
//     try {
//       const { data } = await API.put("/auth/profile", { name });
//       login({ ...user, name: data.name });
//       setSuccess("Profile updated successfully!");
//     } catch (err) {
//       setError("Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.profileCard}>
//           <div style={styles.avatar}>
//             {user.name.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <h2 style={styles.name}>{user.name}</h2>
//             <span style={styles.roleBadge}>Doctor</span>
//             <div style={styles.email}>{user.email}</div>
//           </div>
//         </div>

//         {success && <div style={styles.success}>{success}</div>}
//         {error && <div style={styles.error}>{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div style={styles.card}>
//             <h3 style={styles.cardTitle}>Update profile</h3>
//             <div style={styles.field}>
//               <label style={styles.label}>Full name</label>
//               <input
//                 style={styles.input}
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Email address</label>
//               <input
//                 style={{ ...styles.input, ...styles.disabled }}
//                 type="email"
//                 value={user.email}
//                 disabled
//               />
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Role</label>
//               <input
//                 style={{ ...styles.input, ...styles.disabled }}
//                 type="text"
//                 value="Doctor"
//                 disabled
//               />
//             </div>
//           </div>
//           <button
//             type="submit"
//             style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
//             disabled={saving}
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
//   container: { padding: "24px", maxWidth: "600px", margin: "0 auto" },
//   profileCard: {
//     display: "flex", alignItems: "center", gap: "20px",
//     backgroundColor: "#fff", borderRadius: "12px",
//     padding: "24px", marginBottom: "20px",
//     boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
//   },
//   avatar: {
//     width: "64px", height: "64px", borderRadius: "50%",
//     backgroundColor: "#00796b", color: "#fff",
//     display: "flex", alignItems: "center",
//     justifyContent: "center", fontSize: "26px",
//     fontWeight: "700", flexShrink: 0
//   },
//   name: { fontSize: "20px", fontWeight: "700", color: "#333", margin: 0 },
//   roleBadge: {
//     display: "inline-block", marginTop: "6px",
//     backgroundColor: "#e0f2f1", color: "#00796b",
//     padding: "2px 12px", borderRadius: "12px",
//     fontSize: "12px", fontWeight: "600"
//   },
//   email: { fontSize: "13px", color: "#888", marginTop: "6px" },
//   success: {
//     backgroundColor: "#e8f5e9", color: "#2e7d32",
//     padding: "12px", borderRadius: "8px",
//     marginBottom: "16px", fontSize: "14px", fontWeight: "500"
//   },
//   error: {
//     backgroundColor: "#fdecea", color: "#c62828",
//     padding: "12px", borderRadius: "8px",
//     marginBottom: "16px", fontSize: "14px"
//   },
//   card: {
//     backgroundColor: "#fff", borderRadius: "12px",
//     padding: "20px", marginBottom: "16px",
//     boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
//   },
//   cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "16px" },
//   field: { marginBottom: "14px" },
//   label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#555", marginBottom: "6px" },
//   input: {
//     width: "100%", padding: "10px 12px",
//     borderRadius: "8px", border: "1px solid #ddd",
//     fontSize: "14px", boxSizing: "border-box"
//   },
//   disabled: { backgroundColor: "#f5f5f5", color: "#aaa", cursor: "not-allowed" },
//   saveBtn: {
//     width: "100%", padding: "14px",
//     backgroundColor: "#00796b", color: "#fff",
//     border: "none", borderRadius: "10px",
//     fontSize: "15px", fontWeight: "600", cursor: "pointer"
//   }
// };

// export default DoctorProfile;
import ChangePassword from "../../components/ChangePassword";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const specializations = [
  "General Practitioner", "Cardiologist", "Dermatologist",
  "Endocrinologist", "Gastroenterologist", "Neurologist",
  "Obstetrician", "Oncologist", "Ophthalmologist",
  "Orthopedic Surgeon", "Pediatrician", "Psychiatrist",
  "Pulmonologist", "Radiologist", "Surgeon", "Urologist", "Other"
];

const DoctorProfile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    phoneNumber: "",
    officeAddress: "",
    licenseNumber: "",
    yearsOfExperience: "",
    workingHours: "",
    biography: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    API.get("/auth/profile")
      .then(({ data }) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          specialization: data.profile?.specialization || "",
          phoneNumber: data.profile?.phoneNumber || "",
          officeAddress: data.profile?.officeAddress || "",
          licenseNumber: data.profile?.licenseNumber || "",
          yearsOfExperience: data.profile?.yearsOfExperience || "",
          workingHours: data.profile?.workingHours || "",
          biography: data.profile?.biography || ""
        });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await API.put("/auth/profile", form);
      login({ ...user, name: data.name });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const completeness = () => {
    const fields = [
      form.name, form.specialization, form.phoneNumber,
      form.officeAddress, form.licenseNumber,
      form.yearsOfExperience, form.workingHours, form.biography
    ];
    const filled = fields.filter((f) => f && f.toString().trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  const pct = completeness();

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading profile...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        <div style={styles.profileCard}>
          <div style={styles.avatarWrap}>
            <div style={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{form.name}</h2>
            <div style={styles.specLine}>
              {form.specialization
                ? form.specialization
                : "Specialization not set"}
            </div>
            <div style={styles.tagRow}>
              <span style={styles.roleTag}>Doctor</span>
              {form.licenseNumber && (
                <span style={styles.licTag}>License: {form.licenseNumber}</span>
              )}
              {form.yearsOfExperience && (
                <span style={styles.expTag}>{form.yearsOfExperience} yrs experience</span>
              )}
            </div>
            {form.biography && (
              <p style={styles.bioPreview}>{form.biography}</p>
            )}
          </div>
          <div style={styles.completenessWrap}>
            <div style={styles.completenessLabel}>Profile completeness</div>
            <div style={styles.completenessBar}>
              <div style={{
                ...styles.completenessProgress,
                width: pct + "%",
                backgroundColor: pct < 40 ? "#e65100" : pct < 80 ? "#f9a825" : "#2e7d32"
              }} />
            </div>
            <div style={{
              ...styles.completenessNum,
              color: pct < 40 ? "#e65100" : pct < 80 ? "#f9a825" : "#2e7d32"
            }}>
              {pct}% complete
            </div>
          </div>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.tabs}>
          {["personal", "professional", "schedule", "biography"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {activeTab === "personal" && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Personal information</h3>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Full name</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email address</label>
                  <input
                    style={{ ...styles.input, ...styles.disabledInput }}
                    type="email"
                    value={form.email}
                    disabled
                  />
                  <span style={styles.hint}>Email cannot be changed</span>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Phone number</label>
                  <input
                    style={styles.input}
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Office address</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={form.officeAddress}
                    onChange={(e) => handleChange("officeAddress", e.target.value)}
                    placeholder="Room / Floor / Building"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "professional" && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Professional details</h3>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Specialization</label>
                  <select
                    style={styles.input}
                    value={form.specialization}
                    onChange={(e) => handleChange("specialization", e.target.value)}
                  >
                    <option value="">-- Select specialization --</option>
                    {specializations.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>License number</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={form.licenseNumber}
                    onChange={(e) => handleChange("licenseNumber", e.target.value)}
                    placeholder="e.g. RW-MED-2024-0001"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Years of experience</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max="60"
                    value={form.yearsOfExperience}
                    onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Working hours</h3>
              <p style={styles.scheduleHint}>
                Let patients know when you are available
              </p>
              <div style={styles.dayGrid}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} style={styles.dayRow}>
                    <div style={styles.dayName}>{day}</div>
                    <input
                      style={styles.timeInput}
                      type="time"
                      placeholder="Start"
                    />
                    <span style={styles.timeSep}>to</span>
                    <input
                      style={styles.timeInput}
                      type="time"
                      placeholder="End"
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px" }}>
                <label style={styles.label}>Or enter custom schedule note</label>
                <input
                  style={styles.input}
                  type="text"
                  value={form.workingHours}
                  onChange={(e) => handleChange("workingHours", e.target.value)}
                  placeholder="e.g. Mon-Fri 8:00 AM - 5:00 PM, Sat 9:00 AM - 1:00 PM"
                />
              </div>
            </div>
          )}

          {activeTab === "biography" && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Biography</h3>
              <p style={styles.scheduleHint}>
                Write a short professional summary about yourself for patients
              </p>
              <textarea
                style={styles.bioTextarea}
                value={form.biography}
                onChange={(e) => handleChange("biography", e.target.value)}
                placeholder="E.g. Dr. John is a board-certified cardiologist with over 10 years of experience treating cardiovascular diseases. He completed his training at..."
              />
              <div style={styles.charCount}>
                {form.biography.length} / 500 characters
              </div>
            </div>
          )}

          <div style={styles.saveRow}>
            <button
              type="submit"
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <span style={styles.saveHint}>
              All tabs are saved together when you click Save
            </span>
          </div>
        </form>
        <ChangePassword />
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "800px", margin: "0 auto" },
  profileCard: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "24px", marginBottom: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    display: "flex", gap: "20px", alignItems: "flex-start",
    flexWrap: "wrap"
  },
  avatarWrap: { flexShrink: 0 },
  avatar: {
    width: "72px", height: "72px", borderRadius: "50%",
    backgroundColor: "#00796b", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "28px", fontWeight: "700"
  },
  profileInfo: { flex: 1, minWidth: "180px" },
  profileName: { fontSize: "20px", fontWeight: "700", color: "#333", margin: "0 0 4px" },
  specLine: { fontSize: "14px", color: "#00796b", fontWeight: "500", marginBottom: "8px" },
  tagRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" },
  roleTag: {
    backgroundColor: "#e0f2f1", color: "#00796b",
    padding: "2px 10px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600"
  },
  licTag: {
    backgroundColor: "#e8f0fe", color: "#1a73e8",
    padding: "2px 10px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600"
  },
  expTag: {
    backgroundColor: "#fff8e1", color: "#e65100",
    padding: "2px 10px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600"
  },
  bioPreview: {
    fontSize: "13px", color: "#666",
    lineHeight: "1.6", marginTop: "6px",
    maxWidth: "400px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  completenessWrap: { minWidth: "140px" },
  completenessLabel: { fontSize: "12px", color: "#888", marginBottom: "6px" },
  completenessBar: {
    height: "6px", backgroundColor: "#f0f0f0",
    borderRadius: "3px", overflow: "hidden"
  },
  completenessProgress: {
    height: "100%", borderRadius: "3px",
    transition: "width 0.4s ease"
  },
  completenessNum: { fontSize: "13px", fontWeight: "600", marginTop: "6px" },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "12px 16px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px", fontWeight: "500"
  },
  errorBox: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "12px 16px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px"
  },
  tabs: {
    display: "flex", gap: "4px",
    backgroundColor: "#fff", borderRadius: "10px",
    padding: "6px", marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  tab: {
    flex: 1, padding: "9px",
    border: "none", borderRadius: "7px",
    fontSize: "13px", fontWeight: "500",
    cursor: "pointer", backgroundColor: "transparent",
    color: "#777"
  },
  tabActive: {
    backgroundColor: "#00796b",
    color: "#fff"
  },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "16px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "14px"
  },
  field: {},
  label: {
    display: "block", fontSize: "13px",
    fontWeight: "500", color: "#555", marginBottom: "6px"
  },
  input: {
    width: "100%", padding: "10px 12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", boxSizing: "border-box", outline: "none"
  },
  disabledInput: { backgroundColor: "#f5f5f5", color: "#aaa", cursor: "not-allowed" },
  hint: { fontSize: "11px", color: "#aaa", marginTop: "4px", display: "block" },
  scheduleHint: { fontSize: "13px", color: "#888", marginBottom: "16px" },
  dayGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  dayRow: { display: "flex", alignItems: "center", gap: "10px" },
  dayName: { width: "90px", fontSize: "13px", fontWeight: "500", color: "#555" },
  timeInput: {
    padding: "8px 10px", borderRadius: "7px",
    border: "1px solid #ddd", fontSize: "13px", flex: 1
  },
  timeSep: { fontSize: "13px", color: "#888" },
  bioTextarea: {
    width: "100%", padding: "12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", resize: "vertical",
    minHeight: "160px", fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
    lineHeight: "1.6"
  },
  charCount: { fontSize: "12px", color: "#aaa", textAlign: "right", marginTop: "6px" },
  saveRow: {
    display: "flex", alignItems: "center", gap: "16px"
  },
  saveBtn: {
    padding: "13px 32px", backgroundColor: "#00796b",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  },
  saveHint: { fontSize: "13px", color: "#aaa" }
};

export default DoctorProfile;