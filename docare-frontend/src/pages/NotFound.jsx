import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goHome = () => {
    if (user?.role === "admin") navigate("/admin");
    else if (user?.role === "doctor") navigate("/doctor");
    else if (user?.role === "patient") navigate("/patient");
    else navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.code}>404</div>
        <h2 style={styles.title}>Page not found</h2>
        <p style={styles.sub}>
          The page you are looking for doesn't exist or you don't have permission to access it.
        </p>
        <button style={styles.btn} onClick={goHome}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh", backgroundColor: "#f0f2f5",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  card: {
    backgroundColor: "#fff", borderRadius: "16px",
    padding: "48px 40px", textAlign: "center",
    maxWidth: "420px", boxShadow: "0 2px 20px rgba(0,0,0,0.08)"
  },
  code: {
    fontSize: "80px", fontWeight: "800",
    color: "#1a237e", lineHeight: 1, marginBottom: "16px"
  },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", marginBottom: "12px" },
  sub: { fontSize: "14px", color: "#888", lineHeight: "1.7", marginBottom: "28px" },
  btn: {
    padding: "12px 28px", backgroundColor: "#1a237e",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer"
  }
};

export default NotFound;