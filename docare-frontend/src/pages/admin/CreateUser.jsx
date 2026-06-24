import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const specializations = [
  "General Practitioner", "Cardiologist", "Dermatologist",
  "Endocrinologist", "Gastroenterologist", "Neurologist",
  "Obstetrician", "Oncologist", "Ophthalmologist",
  "Orthopedic Surgeon", "Pediatrician", "Psychiatrist",
  "Pulmonologist", "Radiologist", "Surgeon", "Urologist", "Other"
];

const CreateUser = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    confirmPassword: "", role: "doctor",
    specialization: "", licenseNumber: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const { data } = await API.post("/admin/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      if (form.role === "doctor" && form.specialization) {
        await API.put("/auth/profile", {
          name: form.name,
          specialization: form.specialization,
          licenseNumber: form.licenseNumber,
          phoneNumber: form.phoneNumber
        });
      }

      setSuccess(`${form.role.charAt(0).toUpperCase() + form.role.slice(1)} account created for ${data.name}!`);
      setForm({
        name: "", email: "", password: "",
        confirmPassword: "", role: "doctor",
        specialization: "", licenseNumber: "", phoneNumber: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Staff Account</h2>
          <p style={styles.sub}>Add a new doctor or admin to the system</p>
        </div>

        {success && (
          <div style={styles.success}>
            {success}
            <button style={styles.viewUsersBtn} onClick={() => navigate("/admin/users")}>
              View all users
            </button>
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Account type</h3>
            <div style={styles.roleSelector}>
              {["doctor", "admin"].map((role) => (
                <div
                  key={role}
                  style={{
                    ...styles.roleOption,
                    ...(form.role === role ? styles.roleOptionActive : {})
                  }}
                  onClick={() => setForm({ ...form, role })}
                >
                  <div style={styles.roleOptionTitle}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                  <div style={styles.roleOptionDesc}>
                    {role === "doctor"
                      ? "Can manage patients, upload documents and handle requests"
                      : "Full system access including user management"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Account details</h3>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Full name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm password</label>
                <input
                  style={styles.input}
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
          </div>

          {form.role === "doctor" && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Doctor details</h3>
              <p style={styles.cardSub}>Optional — the doctor can complete these later from their profile</p>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Specialization</label>
                  <select
                    style={styles.input}
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
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
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. RW-MED-2024-0001"
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Phone number</label>
                  <input
                    style={styles.input}
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : `Create ${form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account`}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  container: { padding: "24px", maxWidth: "720px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "14px 16px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px",
    fontWeight: "500", display: "flex",
    justifyContent: "space-between", alignItems: "center"
  },
  viewUsersBtn: {
    padding: "6px 14px", backgroundColor: "#2e7d32",
    color: "#fff", border: "none", borderRadius: "6px",
    fontSize: "12px", fontWeight: "600", cursor: "pointer"
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
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "6px" },
  cardSub: { fontSize: "13px", color: "#888", marginBottom: "14px" },
  roleSelector: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  roleOption: {
    padding: "16px", borderRadius: "10px",
    border: "2px solid #e8e8e8", cursor: "pointer",
    backgroundColor: "#fafafa"
  },
  roleOptionActive: {
    border: "2px solid #1a237e",
    backgroundColor: "#e8eaf6"
  },
  roleOptionTitle: {
    fontSize: "15px", fontWeight: "700",
    color: "#333", marginBottom: "6px"
  },
  roleOptionDesc: { fontSize: "13px", color: "#666", lineHeight: "1.5" },
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
  submitBtn: {
    width: "100%", padding: "14px",
    backgroundColor: "#1a237e", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  }
};

export default CreateUser;