// // import { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { useAuth } from "../../context/AuthContext";
// // import API from "../../api/axios";

// // const Login = () => {
// //   const [form, setForm] = useState({ email: "", password: "" });
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const { data } = await API.post("/auth/login", form);
// //       login(data);
// //       if (data.role === "admin") navigate("/admin");
// //       else if (data.role === "doctor") navigate("/doctor");
// //       else navigate("/patient");
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Login failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.card}>
// //         <h2 style={styles.title}>DoCare</h2>
// //         <p style={styles.subtitle}>Sign in to your account</p>
// //         {error && <div style={styles.error}>{error}</div>}
// //         <form onSubmit={handleSubmit}>
// //           <div style={styles.field}>
// //             <label style={styles.label}>Email</label>
// //             <input
// //               style={styles.input}
// //               type="email"
// //               name="email"
// //               value={form.email}
// //               onChange={handleChange}
// //               placeholder="Enter your email"
// //               required
// //             />
// //           </div>
// //           <div style={styles.field}>
// //             <label style={styles.label}>Password</label>
// //             <input
// //               style={styles.input}
// //               type="password"
// //               name="password"
// //               value={form.password}
// //               onChange={handleChange}
// //               placeholder="Enter your password"
// //               required
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             style={styles.btn}
// //             disabled={loading}
// //           >
// //             {loading ? "Signing in..." : "Sign In"}
// //           </button>
// //         </form>
// //         <p style={styles.register}>
// //           Don't have an account?{" "}
// //           <Link to="/register" style={styles.link}>Register</Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: {
// //     minHeight: "100vh",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#f0f2f5"
// //   },
// //   card: {
// //     backgroundColor: "#fff",
// //     padding: "40px",
// //     borderRadius: "12px",
// //     boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
// //     width: "100%",
// //     maxWidth: "400px"
// //   },
// //   title: { textAlign: "center", color: "#1a73e8", fontSize: "28px", marginBottom: "4px" },
// //   subtitle: { textAlign: "center", color: "#666", marginBottom: "24px", fontSize: "14px" },
// //   error: {
// //     backgroundColor: "#fdecea",
// //     color: "#c62828",
// //     padding: "10px",
// //     borderRadius: "6px",
// //     marginBottom: "16px",
// //     fontSize: "14px"
// //   },
// //   field: { marginBottom: "16px" },
// //   label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
// //   input: {
// //     width: "100%",
// //     padding: "10px 12px",
// //     borderRadius: "6px",
// //     border: "1px solid #ddd",
// //     fontSize: "14px",
// //     outline: "none"
// //   },
// //   btn: {
// //     width: "100%",
// //     padding: "12px",
// //     backgroundColor: "#1a73e8",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "6px",
// //     fontSize: "16px",
// //     fontWeight: "600",
// //     cursor: "pointer",
// //     marginTop: "8px"
// //   },
// //   register: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" },
// //   link: { color: "#1a73e8", textDecoration: "none", fontWeight: "600" }
// // };

// // export default Login;
// import { useState } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import API from "../../api/axios";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const justRegistered = location.state?.registered;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const { data } = await API.post("/auth/login", form);
//       login(data);
//       if (data.role === "admin") navigate("/admin");
//       else if (data.role === "doctor") navigate("/doctor");
//       else navigate("/patient");
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.left}>
//         <div style={styles.brand}>DoCare</div>
//         <h1 style={styles.tagline}>Hospital document management, simplified</h1>
//         <p style={styles.taglineSub}>
//           Securely access your medical records, appointments, and documents from anywhere.
//         </p>
//         <div style={styles.rolesInfo}>
//           <div style={styles.roleCard}>
//             <div style={styles.roleTitle}>Patient</div>
//             <div style={styles.roleDesc}>View records, book appointments, request documents</div>
//           </div>
//           <div style={styles.roleCard}>
//             <div style={styles.roleTitle}>Doctor</div>
//             <div style={styles.roleDesc}>Manage patients, upload documents, handle requests</div>
//           </div>
//           <div style={styles.roleCard}>
//             <div style={styles.roleTitle}>Admin</div>
//             <div style={styles.roleDesc}>Full system control, user management, reports</div>
//           </div>
//         </div>
//       </div>

//       <div style={styles.right}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>Welcome back</h2>
//           <p style={styles.subtitle}>Sign in to your DoCare account</p>

//           {justRegistered && (
//             <div style={styles.success}>
//               Account created successfully! You can now sign in.
//             </div>
//           )}

//           {error && <div style={styles.error}>{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <div style={styles.field}>
//               <label style={styles.label}>Email address</label>
//               <input
//                 style={styles.input}
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//             <div style={styles.field}>
//               <label style={styles.label}>Password</label>
//               <input
//                 style={styles.input}
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>

//           <p style={styles.registerLink}>
//             New patient?{" "}
//             <Link to="/register" style={styles.link}>Create an account</Link>
//           </p>

//           <div style={styles.adminNote}>
//             Doctor or admin? Contact your hospital administrator for access.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   page: { display: "flex", minHeight: "100vh" },
//   left: {
//     flex: 1, backgroundColor: "#1a237e",
//     padding: "60px 48px", color: "#fff",
//     display: "flex", flexDirection: "column",
//     justifyContent: "center"
//   },
//   brand: {
//     fontSize: "28px", fontWeight: "800",
//     letterSpacing: "2px", marginBottom: "40px"
//   },
//   tagline: {
//     fontSize: "28px", fontWeight: "700",
//     lineHeight: "1.3", marginBottom: "16px"
//   },
//   taglineSub: {
//     fontSize: "15px", opacity: 0.8,
//     lineHeight: "1.7", marginBottom: "40px"
//   },
//   rolesInfo: { display: "flex", flexDirection: "column", gap: "12px" },
//   roleCard: {
//     backgroundColor: "rgba(255,255,255,0.1)",
//     borderRadius: "10px", padding: "14px 16px"
//   },
//   roleTitle: { fontSize: "14px", fontWeight: "700", marginBottom: "4px" },
//   roleDesc: { fontSize: "13px", opacity: 0.8 },
//   right: {
//     width: "460px", backgroundColor: "#f0f2f5",
//     display: "flex", alignItems: "center",
//     justifyContent: "center", padding: "40px 24px"
//   },
//   card: {
//     backgroundColor: "#fff", borderRadius: "16px",
//     padding: "36px", width: "100%",
//     boxShadow: "0 2px 20px rgba(0,0,0,0.08)"
//   },
//   title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: "0 0 4px" },
//   subtitle: { fontSize: "14px", color: "#888", marginBottom: "24px" },
//   success: {
//     backgroundColor: "#e8f5e9", color: "#2e7d32",
//     padding: "10px 14px", borderRadius: "8px",
//     marginBottom: "16px", fontSize: "14px", fontWeight: "500"
//   },
//   error: {
//     backgroundColor: "#fdecea", color: "#c62828",
//     padding: "10px 14px", borderRadius: "8px",
//     marginBottom: "16px", fontSize: "14px"
//   },
//   field: { marginBottom: "14px" },
//   label: {
//     display: "block", fontSize: "13px",
//     fontWeight: "500", color: "#555", marginBottom: "6px"
//   },
//   input: {
//     width: "100%", padding: "11px 14px",
//     borderRadius: "8px", border: "1px solid #ddd",
//     fontSize: "14px", outline: "none", boxSizing: "border-box"
//   },
//   btn: {
//     width: "100%", padding: "13px",
//     backgroundColor: "#1a237e", color: "#fff",
//     border: "none", borderRadius: "8px",
//     fontSize: "15px", fontWeight: "600", cursor: "pointer",
//     marginTop: "4px"
//   },
//   registerLink: {
//     textAlign: "center", marginTop: "20px",
//     fontSize: "14px", color: "#666"
//   },
//   link: { color: "#1a73e8", textDecoration: "none", fontWeight: "600" },
//   adminNote: {
//     marginTop: "16px", padding: "10px 14px",
//     backgroundColor: "#f9f9f9", borderRadius: "8px",
//     fontSize: "12px", color: "#888", textAlign: "center"
//   }
// };

// export default Login;
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "doctor") navigate("/doctor");
      else navigate("/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
          <span style={styles.topBarText}>Don't have an account?</span>
          <button style={styles.topBarBtn} onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>

      <div style={styles.centerWrap}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🏥</div>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your DoCare account</p>

          {justRegistered && (
            <div style={styles.success}>
              Account created successfully! You can now sign in.
            </div>
          )}
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <p style={styles.registerText}>
            New patient?{" "}
            <Link to="/register" style={styles.link}>Create a free account</Link>
          </p>

          <div style={styles.adminNote}>
            Doctor or admin? Please contact your hospital administrator for access.
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh", backgroundColor: "#1a237e",
    position: "relative", display: "flex",
    flexDirection: "column"
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
    fontSize: "22px", fontWeight: "800",
    color: "#fff", letterSpacing: "1px",
    display: "flex", alignItems: "center",
    gap: "8px", cursor: "pointer"
  },
  brandDot: {
    width: "10px", height: "10px",
    borderRadius: "50%", backgroundColor: "#69f0ae"
  },
  topBarRight: { display: "flex", alignItems: "center", gap: "12px" },
  topBarText: { fontSize: "14px", color: "rgba(255,255,255,0.7)" },
  topBarBtn: {
    padding: "8px 18px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer"
  },
  centerWrap: {
    position: "relative", zIndex: 10,
    flex: 1, display: "flex",
    alignItems: "center", justifyContent: "center",
    padding: "20px"
  },
  card: {
    backgroundColor: "#fff", borderRadius: "20px",
    padding: "44px 40px", width: "100%",
    maxWidth: "440px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.3)"
  },
  cardIcon: { fontSize: "36px", marginBottom: "12px", textAlign: "center" },
  title: {
    fontSize: "26px", fontWeight: "800",
    color: "#1a237e", margin: "0 0 6px",
    textAlign: "center"
  },
  subtitle: {
    fontSize: "14px", color: "#888",
    marginBottom: "24px", textAlign: "center"
  },
  success: {
    backgroundColor: "#e8f5e9", color: "#2e7d32",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "13px", fontWeight: "500"
  },
  error: {
    backgroundColor: "#fdecea", color: "#c62828",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "16px", fontSize: "13px"
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block", fontSize: "13px",
    fontWeight: "600", color: "#444", marginBottom: "6px"
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%", padding: "12px 14px",
    borderRadius: "10px", border: "1.5px solid #e8e8e8",
    fontSize: "14px", outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s"
  },
  eyeBtn: {
    position: "absolute", right: "12px",
    top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none",
    cursor: "pointer", fontSize: "15px"
  },
  btn: {
    width: "100%", padding: "13px",
    backgroundColor: "#1a237e", color: "#fff",
    border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: "700",
    cursor: "pointer", marginTop: "4px"
  },
  divider: {
    display: "flex", alignItems: "center",
    gap: "12px", margin: "20px 0"
  },
  dividerLine: { flex: 1, height: "1px", backgroundColor: "#f0f0f0" },
  dividerText: { fontSize: "12px", color: "#bbb", fontWeight: "500" },
  registerText: {
    textAlign: "center", fontSize: "14px",
    color: "#666", marginBottom: "14px"
  },
  link: { color: "#1a73e8", textDecoration: "none", fontWeight: "700" },
  adminNote: {
    backgroundColor: "#f9f9f9", borderRadius: "8px",
    padding: "10px 14px", fontSize: "12px",
    color: "#888", textAlign: "center",
    lineHeight: "1.5", marginBottom: "16px"
  },
  rolesRow: { display: "flex", gap: "8px", justifyContent: "center" },
  roleChip: {
    padding: "4px 14px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "600"
  }
};

export default Login;