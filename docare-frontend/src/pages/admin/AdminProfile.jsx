import ChangePassword from "../../components/ChangePassword";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const AdminProfile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await API.put("/auth/profile", { name });
      login({ ...user, name: data.name });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <span style={styles.roleBadge}>Administrator</span>
            <div style={styles.email}>{user.email}</div>
          </div>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Update profile</h3>
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                style={{ ...styles.input, ...styles.disabled }}
                type="email"
                value={user.email}
                disabled
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Role</label>
              <input
                style={{ ...styles.input, ...styles.disabled }}
                value="Administrator"
                disabled
              />
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
  container: { padding: "24px", maxWidth: "600px", margin: "0 auto" },
  profileCard: {
    display: "flex", alignItems: "center", gap: "20px",
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "24px", marginBottom: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  avatar: {
    width: "64px", height: "64px", borderRadius: "50%",
    backgroundColor: "#1a237e", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "26px", fontWeight: "700"
  },
  name: { fontSize: "20px", fontWeight: "700", color: "#333", margin: 0 },
  roleBadge: {
    display: "inline-block", marginTop: "6px",
    backgroundColor: "#e8eaf6", color: "#1a237e",
    padding: "2px 12px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600"
  },
  email: { fontSize: "13px", color: "#888", marginTop: "6px" },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "12px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px", fontWeight: "500"
  },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "12px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "14px"
  },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "16px" },
  field: { marginBottom: "14px" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#555", marginBottom: "6px" },
  input: {
    width: "100%", padding: "10px 12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", boxSizing: "border-box"
  },
  disabled: { backgroundColor: "#f5f5f5", color: "#aaa", cursor: "not-allowed" },
  saveBtn: {
    width: "100%", padding: "14px",
    backgroundColor: "#1a237e", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  }
};

export default AdminProfile;