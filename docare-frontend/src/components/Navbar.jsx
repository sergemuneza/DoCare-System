// export default Navbar;
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const patientLinks = [
    { label: "Dashboard", path: "/patient" },
    { label: "Documents", path: "/patient/documents" },
    { label: "Appointments", path: "/patient/appointments" },
    { label: "Requests", path: "/patient/requests" },
    { label: "Records", path: "/patient/records" },
    { label: "Assistant", path: "/patient/chatbot" }
  ];

//   const doctorLinks = [
//     { label: "Dashboard", path: "/doctor" },
//     { label: "Upload", path: "/doctor/upload" }
//   ];
const doctorLinks = [
  { label: "Dashboard", path: "/doctor" },
  { label: "Patient Search", path: "/doctor/search" },
  { label: "Upload", path: "/doctor/upload" },
  { label: "Appointments", path: "/doctor/appointments" },
  { label: "Requests", path: "/doctor/requests" },
  { label: "Records", path: "/doctor/records" },
  { label: "Patients", path: "/doctor/patients" }
];

const adminLinks = [
  { label: "Dashboard", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Create Staff", path: "/admin/create-user" },
  { label: "Documents", path: "/admin/documents" },
  { label: "Requests", path: "/admin/requests" },
  { label: "Appointments", path: "/admin/appointments" },
  { label: "Activity Log", path: "/admin/activity-log" }
];

  const links =
    user?.role === "patient" ? patientLinks :
    user?.role === "doctor" ? doctorLinks :
    user?.role === "admin" ? adminLinks : [];

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.brand} onClick={() => navigate(`/${user?.role}`)}>
          DoCare
        </div>
        <div style={styles.links}>
          {links.map((l) => (
            <span
              key={l.path}
              style={{ ...styles.link, ...(isActive(l.path) ? styles.linkActive : {}) }}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <div style={styles.right}>
        {user && (
          <>
          <NotificationBell />
            <span
              style={styles.profileLink}
              onClick={() => navigate(`/${user.role}/profile`)}
            >
              <div style={styles.avatarSmall}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={styles.userName}>{user.name}</span>
            </span>
            <button onClick={handleLogout} style={styles.btn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", backgroundColor: "#1a73e8",
    padding: "0 24px", height: "60px", color: "#fff"
  },
  left: { display: "flex", alignItems: "center", gap: "24px" },
  brand: {
    fontSize: "20px", fontWeight: "700",
    letterSpacing: "1px", cursor: "pointer"
  },
  links: { display: "flex", gap: "4px" },
  link: {
    padding: "6px 12px", borderRadius: "6px",
    fontSize: "13px", cursor: "pointer",
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500"
  },
  linkActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff"
  },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  profileLink: {
    display: "flex", alignItems: "center", gap: "8px",
    cursor: "pointer", padding: "4px 8px",
    borderRadius: "20px",
    backgroundColor: "rgba(255,255,255,0.15)"
  },
  avatarSmall: {
    width: "26px", height: "26px", borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "12px", fontWeight: "700"
  },
  userName: { fontSize: "13px", fontWeight: "500" },
  btn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
    padding: "6px 14px", borderRadius: "6px",
    cursor: "pointer", fontWeight: "500", fontSize: "13px"
  }
};

export default Navbar;