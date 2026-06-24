import { useState } from "react";
import API from "../api/axios";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({
    current: false, new: false, confirm: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match");
    }
    if (form.currentPassword === form.newPassword) {
      return setError("New password must be different from current password");
    }

    setSaving(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setSuccess("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const strengthScore = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const score = strengthScore(form.newPassword);
  const strengthLabel = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"][score];
  const strengthColor = ["", "#c62828", "#e65100", "#f9a825", "#2e7d32", "#1b5e20"][score];

  const EyeIcon = ({ show, onClick }) => (
    <button type="button" onClick={onClick} style={styles.eyeBtn}>
      {show ? "🙈" : "👁"}
    </button>
  );

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Change password</h3>
      <p style={styles.cardSub}>
        Choose a strong password you haven't used before
      </p>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Current password</label>
          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              type={show.current ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Enter your current password"
              required
            />
            <EyeIcon show={show.current} onClick={() => setShow({ ...show, current: !show.current })} />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>New password</label>
          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              type={show.new ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Enter new password"
              required
            />
            <EyeIcon show={show.new} onClick={() => setShow({ ...show, new: !show.new })} />
          </div>
          {form.newPassword.length > 0 && (
            <div style={styles.strengthRow}>
              <div style={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.strengthSegment,
                      backgroundColor: i <= score ? strengthColor : "#e0e0e0"
                    }}
                  />
                ))}
              </div>
              <span style={{ ...styles.strengthLabel, color: strengthColor }}>
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm new password</label>
          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              type={show.confirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repeat new password"
              required
            />
            <EyeIcon show={show.confirm} onClick={() => setShow({ ...show, confirm: !show.confirm })} />
          </div>
          {form.confirmPassword.length > 0 && (
            <div style={{
              ...styles.matchHint,
              color: form.newPassword === form.confirmPassword ? "#2e7d32" : "#c62828"
            }}>
              {form.newPassword === form.confirmPassword ? "Passwords match" : "Passwords do not match"}
            </div>
          )}
        </div>

        <div style={styles.tips}>
          <div style={styles.tipsTitle}>Strong password tips</div>
          {[
            "At least 6 characters long",
            "Include uppercase letters (A-Z)",
            "Include numbers (0-9)",
            "Include special characters (!@#$)"
          ].map((t) => (
            <div key={t} style={styles.tip}>
              <div style={styles.tipDot} />
              {t}
            </div>
          ))}
        </div>

        <button
          type="submit"
          style={{ ...styles.btn, opacity: saving ? 0.7 : 1 }}
          disabled={saving}
        >
          {saving ? "Changing password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "4px" },
  cardSub: { fontSize: "13px", color: "#888", marginBottom: "16px" },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "14px", fontSize: "14px", fontWeight: "500"
  },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "14px", fontSize: "14px"
  },
  field: { marginBottom: "14px" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#555", marginBottom: "6px" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  input: {
    width: "100%", padding: "10px 40px 10px 12px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", boxSizing: "border-box", outline: "none"
  },
  eyeBtn: {
    position: "absolute", right: "10px",
    background: "none", border: "none",
    cursor: "pointer", fontSize: "14px", padding: "2px"
  },
  strengthRow: { display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" },
  strengthBar: { display: "flex", gap: "4px", flex: 1 },
  strengthSegment: { flex: 1, height: "4px", borderRadius: "2px", transition: "background 0.3s" },
  strengthLabel: { fontSize: "12px", fontWeight: "600", minWidth: "70px" },
  matchHint: { fontSize: "12px", fontWeight: "500", marginTop: "5px" },
  tips: {
    backgroundColor: "#f9f9f9", borderRadius: "8px",
    padding: "12px", marginBottom: "16px"
  },
  tipsTitle: { fontSize: "12px", fontWeight: "600", color: "#555", marginBottom: "8px" },
  tip: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "12px", color: "#777", marginBottom: "4px"
  },
  tipDot: {
    width: "5px", height: "5px", borderRadius: "50%",
    backgroundColor: "#1a73e8", flexShrink: 0
  },
  btn: {
    width: "100%", padding: "12px",
    backgroundColor: "#1a237e", color: "#fff",
    border: "none", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer"
  }
};

export default ChangePassword;