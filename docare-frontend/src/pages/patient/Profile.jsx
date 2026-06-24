import ChangePassword from "../../components/ChangePassword";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "",
    phoneNumber: "", address: "",
    dateOfBirth: "", insuranceNumber: "", nationalId: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/auth/profile")
      .then(({ data }) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.profile?.phoneNumber || "",
          address: data.profile?.address || "",
          dateOfBirth: data.profile?.dateOfBirth
            ? new Date(data.profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          insuranceNumber: data.profile?.insuranceNumber || "",
          nationalId: data.profile?.nationalId || ""
        });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await API.put("/auth/profile", form);
      login({ ...user, name: data.name });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "name", label: "Full name", type: "text" },
    { key: "email", label: "Email address", type: "email", disabled: true },
    { key: "phoneNumber", label: "Phone number", type: "tel" },
    { key: "dateOfBirth", label: "Date of birth", type: "date" },
    { key: "address", label: "Home address", type: "text" },
    { key: "nationalId", label: "National ID", type: "text" },
    { key: "insuranceNumber", label: "Insurance number", type: "text" }
  ];

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading profile...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <span style={styles.roleBadge}>{user.role}</span>
          </div>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Personal information</h3>
            <div style={styles.formGrid}>
              {fields.map((f) => (
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <input
                    style={{
                      ...styles.input,
                      ...(f.disabled ? styles.inputDisabled : {})
                    }}
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    disabled={f.disabled}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
        <ChangePassword />
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "700px", margin: "0 auto" },
  profileHeader: {
    display: "flex", alignItems: "center", gap: "20px",
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "24px", marginBottom: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  avatar: {
    width: "64px", height: "64px", borderRadius: "50%",
    backgroundColor: "#1a73e8", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "26px",
    fontWeight: "700", flexShrink: 0
  },
  name: { fontSize: "20px", fontWeight: "700", color: "#333", margin: 0 },
  roleBadge: {
    display: "inline-block", marginTop: "6px",
    backgroundColor: "#e8f0fe", color: "#1a73e8",
    padding: "2px 12px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600", textTransform: "capitalize"
  },
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
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "16px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "14px"
  },
  field: {},
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#555", marginBottom: "6px" },
  input: {
    width: "100%", padding: "10px 12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", boxSizing: "border-box",
    outline: "none"
  },
  inputDisabled: { backgroundColor: "#f5f5f5", color: "#aaa", cursor: "not-allowed" },
  saveBtn: {
    width: "100%", padding: "14px",
    backgroundColor: "#1a73e8", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  }
};

export default Profile;