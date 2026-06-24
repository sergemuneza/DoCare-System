//Register Dashboard for patients to create an account and complete their profile in two steps. Step 1 collects basic account details, while Step 2 gathers personal information. The form includes validation, error handling, and a smooth user experience with a progress indicator and styled components.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phoneNumber: "", dateOfBirth: "", address: "",
    nationalId: "", insuranceNumber: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const validateStep2 = () => {
    if (!form.phoneNumber.trim()) return "Phone number is required";
    if (!form.dateOfBirth) return "Date of birth is required";
    if (!form.address.trim()) return "Home address is required";
    if (!form.nationalId.trim()) return "National ID is required";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) return setError(err);
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) return setError(err);
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/register", {
        name: form.name, email: form.email,
        password: form.password, role: "patient"
      });
      await API.post("/auth/complete-profile", {
        userId: data._id, token: data.token,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        nationalId: form.nationalId,
        insuranceNumber: form.insuranceNumber
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}>
        <div style={styles.bgCircle1} />
        <div style={styles.bgCircle2} />
        <div style={styles.bgGrid} />
      </div>

      <div style={styles.topBar}>
        <div style={styles.brand} onClick={() => navigate("/")}>
          <div style={styles.brandDot} />
          DoCare
        </div>
        <div style={styles.topBarRight}>
          <span style={styles.topBarText}>Already have an account?</span>
          <button style={styles.topBarBtn} onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </div>

      <div style={styles.centerWrap}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📋</div>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Patient registration — free and secure</p>

          <div style={styles.stepIndicator}>
            <div style={styles.stepRow}>
              <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepDotActive : {}) }}>
                {step > 1 ? "✓" : "1"}
              </div>
              <div style={{ ...styles.stepLine, ...(step >= 2 ? styles.stepLineActive : {}) }} />
              <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepDotActive : {}) }}>
                2
              </div>
            </div>
            <div style={styles.stepLabels}>
              <span style={{ ...styles.stepLabel, ...(step === 1 ? styles.stepLabelActive : {}) }}>
                Account details
              </span>
              <span style={{ ...styles.stepLabel, ...(step === 2 ? styles.stepLabelActive : {}) }}>
                Personal info
              </span>
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {step === 1 && (
            <div>
              <div style={styles.field}>
                <label style={styles.label}>Full name</label>
                <input
                  style={styles.input} type="text" name="name"
                  value={form.name} onChange={handleChange}
                  placeholder="Enter your full name" required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <input
                  style={styles.input} type="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="Enter your email" required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrap}>
                  <input
                    style={styles.input}
                    type={showPassword ? "text" : "password"}
                    name="password" value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters" required
                  />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm password</label>
                <div style={styles.inputWrap}>
                  <input
                    style={styles.input}
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password" required
                  />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <button style={styles.btn} onClick={handleNext} type="button">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={styles.twoCol}>
                <div style={styles.field}>
                  <label style={styles.label}>Phone number <span style={styles.req}>*</span></label>
                  <input style={styles.input} type="tel" name="phoneNumber"
                    value={form.phoneNumber} onChange={handleChange}
                    placeholder="+250 7XX XXX XXX" required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Date of birth <span style={styles.req}>*</span></label>
                  <input style={styles.input} type="date" name="dateOfBirth"
                    value={form.dateOfBirth} onChange={handleChange} required />
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Home address <span style={styles.req}>*</span></label>
                <input style={styles.input} type="text" name="address"
                  value={form.address} onChange={handleChange}
                  placeholder="Kigali, Gasabo" required />
              </div>
              <div style={styles.twoCol}>
                <div style={styles.field}>
                  <label style={styles.label}>National ID <span style={styles.req}>*</span></label>
                  <input style={styles.input} type="text" name="nationalId"
                    value={form.nationalId} onChange={handleChange}
                    placeholder="Your national ID" required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>
                    Insurance no. <span style={styles.opt}>(optional)</span>
                  </label>
                  <input style={styles.input} type="text" name="insuranceNumber"
                    value={form.insuranceNumber} onChange={handleChange}
                    placeholder="If applicable" />
                </div>
              </div>
              <div style={styles.notice}>
                By registering you confirm you are a patient. Doctor accounts are created by the hospital administrator.
              </div>
              <div style={styles.btnRow}>
                <button
                  type="button" style={styles.backBtn}
                  onClick={() => { setStep(1); setError(""); }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  style={{ ...styles.btn, ...styles.btnFlex, opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p style={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh", backgroundColor: "#1a237e",
    position: "relative", display: "flex", flexDirection: "column"
  },
  bg: { position: "absolute", inset: 0, overflow: "hidden" },
  bgCircle1: {
    position: "absolute", width: "500px", height: "500px",
    borderRadius: "50%", backgroundColor: "rgba(105,240,174,0.07)",
    top: "-150px", right: "-100px"
  },
  bgCircle2: {
    position: "absolute", width: "350px", height: "350px",
    borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)",
    bottom: "-100px", left: "-80px"
  },
  bgGrid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "50px 50px"
  },
  topBar: {
    position: "relative", zIndex: 10,
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "20px 40px"
  },
  brand: {
    fontSize: "22px", fontWeight: "800", color: "#fff",
    letterSpacing: "1px", display: "flex",
    alignItems: "center", gap: "8px", cursor: "pointer"
  },
  brandDot: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#69f0ae" },
  topBarRight: { display: "flex", alignItems: "center", gap: "12px" },
  topBarText: { fontSize: "14px", color: "rgba(255,255,255,0.7)" },
  topBarBtn: {
    padding: "8px 18px", backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer"
  },
  centerWrap: {
    position: "relative", zIndex: 10, flex: 1,
    display: "flex", alignItems: "center",
    justifyContent: "center", padding: "20px"
  },
  card: {
    backgroundColor: "#fff", borderRadius: "20px",
    padding: "40px 36px", width: "100%",
    maxWidth: "480px", boxShadow: "0 24px 80px rgba(0,0,0,0.3)"
  },
  cardIcon: { fontSize: "36px", marginBottom: "10px", textAlign: "center" },
  title: {
    fontSize: "24px", fontWeight: "800",
    color: "#1a237e", margin: "0 0 6px", textAlign: "center"
  },
  subtitle: { fontSize: "14px", color: "#888", marginBottom: "20px", textAlign: "center" },
  stepIndicator: { marginBottom: "20px" },
  stepRow: { display: "flex", alignItems: "center", marginBottom: "8px" },
  stepDot: {
    width: "28px", height: "28px", borderRadius: "50%",
    backgroundColor: "#e0e0e0", color: "#999",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "12px",
    fontWeight: "700", flexShrink: 0
  },
  stepDotActive: { backgroundColor: "#1a237e", color: "#fff" },
  stepLine: { flex: 1, height: "3px", backgroundColor: "#e0e0e0", margin: "0 8px" },
  stepLineActive: { backgroundColor: "#1a237e" },
  stepLabels: { display: "flex", justifyContent: "space-between" },
  stepLabel: { fontSize: "12px", color: "#bbb", fontWeight: "500" },
  stepLabelActive: { color: "#1a237e", fontWeight: "700" },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "14px", fontSize: "13px"
  },
  field: { marginBottom: "13px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "5px" },
  req: { color: "#c62828" },
  opt: { color: "#aaa", fontWeight: "400", fontSize: "12px" },
  inputWrap: { position: "relative" },
  input: {
    width: "100%", padding: "11px 14px",
    borderRadius: "10px", border: "1.5px solid #e8e8e8",
    fontSize: "14px", outline: "none", boxSizing: "border-box"
  },
  eyeBtn: {
    position: "absolute", right: "12px",
    top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", fontSize: "15px"
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  notice: {
    backgroundColor: "#e8f0fe", color: "#1a73e8",
    padding: "10px 12px", borderRadius: "8px",
    fontSize: "12px", marginBottom: "14px", lineHeight: "1.5"
  },
  btnRow: { display: "flex", gap: "10px", marginBottom: "4px" },
  backBtn: {
    padding: "12px 18px", backgroundColor: "#f5f5f5",
    color: "#555", border: "1px solid #ddd",
    borderRadius: "10px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer"
  },
  btn: {
    width: "100%", padding: "13px",
    backgroundColor: "#1a237e", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "700", cursor: "pointer"
  },
  btnFlex: { flex: 1, width: "auto" },
  loginText: { textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#888" },
  link: { color: "#1a73e8", textDecoration: "none", fontWeight: "700" }
};

export default Register;