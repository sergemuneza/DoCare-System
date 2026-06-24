import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const roleColors = {
  patient: { bg: "#e8f0fe", color: "#1a73e8" },
  doctor:  { bg: "#e0f2f1", color: "#00796b" },
  admin:   { bg: "#fce4ec", color: "#880e4f" }
};

const DetailPanel = ({ selected, onDelete, onRoleChange, deleting, updatingRole }) => {
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/admin/users/${selected._id}`)
      .then(({ data }) => setFullData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected._id]);

  const roleColors = {
    patient: { bg: "#e8f0fe", color: "#1a73e8" },
    doctor:  { bg: "#e0f2f1", color: "#00796b" },
    admin:   { bg: "#fce4ec", color: "#880e4f" }
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
      Loading user details...
    </div>
  );

  if (!fullData) return null;

  const p = fullData.profile;

  const patientFields = [
    { label: "Phone number", value: p?.phoneNumber },
    { label: "Date of birth", value: p?.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null },
    { label: "Home address", value: p?.address },
    { label: "National ID", value: p?.nationalId },
    { label: "Insurance number", value: p?.insuranceNumber }
  ];

  const doctorFields = [
    { label: "Specialization", value: p?.specialization },
    { label: "Phone number", value: p?.phoneNumber },
    { label: "Office address", value: p?.officeAddress },
    { label: "License number", value: p?.licenseNumber },
    { label: "Years of experience", value: p?.yearsOfExperience ? `${p.yearsOfExperience} years` : null },
    { label: "Working hours", value: p?.workingHours },
    { label: "Biography", value: p?.biography }
  ];

  const fields = fullData.role === "patient" ? patientFields
    : fullData.role === "doctor" ? doctorFields : [];

  const rc = roleColors[fullData.role] || { bg: "#f5f5f5", color: "#777" };

  return (
    <div>
      <div style={dpStyles.header}>
        <div style={dpStyles.avatar}>
          {fullData.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={dpStyles.name}>{fullData.name}</div>
          <div style={dpStyles.email}>{fullData.email}</div>
          <span style={{ ...dpStyles.roleBadge, backgroundColor: rc.bg, color: rc.color }}>
            {fullData.role}
          </span>
        </div>
      </div>

      <div style={dpStyles.section}>
        <div style={dpStyles.sectionTitle}>Account info</div>
        <div style={dpStyles.row}>
          <span style={dpStyles.label}>Joined</span>
          <span style={dpStyles.value}>
            {new Date(fullData.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </span>
        </div>
        <div style={dpStyles.row}>
          <span style={dpStyles.label}>Role</span>
          <span style={dpStyles.value}>{fullData.role}</span>
        </div>
      </div>

      {fields.length > 0 && (
        <div style={dpStyles.section}>
          <div style={dpStyles.sectionTitle}>
            {fullData.role === "patient" ? "Patient details" : "Doctor details"}
          </div>
          {fields.map((f) => (
            <div key={f.label} style={dpStyles.row}>
              <span style={dpStyles.label}>{f.label}</span>
              <span style={{ ...dpStyles.value, color: f.value ? "#333" : "#ccc" }}>
                {f.value || "Not provided"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={dpStyles.section}>
        <div style={dpStyles.sectionTitle}>Change role</div>
        <div style={dpStyles.roleButtons}>
          {["patient", "doctor", "admin"].map((role) => (
            <button
              key={role}
              style={{
                ...dpStyles.roleBtn,
                ...(fullData.role === role ? dpStyles.roleBtnActive : {}),
                opacity: updatingRole === fullData._id ? 0.6 : 1
              }}
              disabled={fullData.role === role || !!updatingRole}
              onClick={() => onRoleChange(fullData._id, role)}
            >
              {updatingRole === fullData._id ? "..." : role}
            </button>
          ))}
        </div>
      </div>

      <div style={dpStyles.section}>
        <div style={dpStyles.sectionTitle}>Danger zone</div>
        <div style={dpStyles.dangerBox}>
          <div>
            <div style={dpStyles.dangerTitle}>Delete this account</div>
            <div style={dpStyles.dangerSub}>
              Permanently removes the user. Cannot be undone.
            </div>
          </div>
          <button
            style={{ ...dpStyles.deleteBtn, opacity: deleting === fullData._id ? 0.6 : 1 }}
            disabled={deleting === fullData._id}
            onClick={() => onDelete(fullData._id)}
          >
            {deleting === fullData._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const dpStyles = {
  header: {
    display: "flex", alignItems: "center", gap: "14px",
    marginBottom: "20px", paddingBottom: "16px",
    borderBottom: "1px solid #f0f0f0"
  },
  avatar: {
    width: "52px", height: "52px", borderRadius: "50%",
    backgroundColor: "#1a237e", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "20px",
    fontWeight: "700", flexShrink: 0
  },
  name: { fontSize: "17px", fontWeight: "700", color: "#333" },
  email: { fontSize: "13px", color: "#888", margin: "3px 0 6px" },
  roleBadge: {
    fontSize: "11px", padding: "2px 10px",
    borderRadius: "10px", fontWeight: "600"
  },
  section: {
    marginBottom: "18px", paddingBottom: "14px",
    borderBottom: "1px solid #f5f5f5"
  },
  sectionTitle: {
    fontSize: "11px", fontWeight: "600",
    color: "#aaa", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: "10px"
  },
  row: {
    display: "flex", justifyContent: "space-between",
    fontSize: "13px", padding: "5px 0",
    borderBottom: "1px solid #fafafa"
  },
  label: { color: "#888", flexShrink: 0, marginRight: "12px" },
  value: {
    color: "#333", fontWeight: "500",
    textAlign: "right", wordBreak: "break-word"
  },
  roleButtons: { display: "flex", gap: "8px" },
  roleBtn: {
    flex: 1, padding: "8px",
    borderRadius: "8px", border: "1px solid #ddd",
    backgroundColor: "#f9f9f9", fontSize: "13px",
    fontWeight: "500", cursor: "pointer",
    textTransform: "capitalize", color: "#555"
  },
  roleBtnActive: {
    backgroundColor: "#1a237e", color: "#fff", borderColor: "#1a237e"
  },
  dangerBox: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", backgroundColor: "#fff5f5",
    border: "1px solid #ffcdd2", borderRadius: "8px",
    padding: "12px 14px", gap: "12px"
  },
  dangerTitle: { fontSize: "14px", fontWeight: "600", color: "#c62828" },
  dangerSub: { fontSize: "12px", color: "#e57373", marginTop: "3px" },
  deleteBtn: {
    padding: "8px 16px", backgroundColor: "#c62828",
    color: "#fff", border: "none", borderRadius: "7px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer",
    flexShrink: 0
  }
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/users")
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleChange = async (id, role) => {
    setUpdatingRole(id);
    try {
      const { data } = await API.put(`/admin/users/${id}/role`, { role });
      setUsers(users.map((u) => u._id === id ? { ...u, role: data.role } : u));
      if (selected?._id === id) setSelected({ ...selected, role: data.role });
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = filter === "all" || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading users...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

<div style={styles.header}>
  <div>
    <h2 style={styles.title}>User Management</h2>
    <p style={styles.sub}>{users.length} total users registered</p>
  </div>
  <button
    style={styles.createBtn}
    onClick={() => navigate("/admin/create-user")}
  >
    + Create Staff Account
  </button>
</div>

        <div style={styles.statsRow}>
          {["patient", "doctor", "admin"].map((role) => {
            const rc = roleColors[role];
            return (
              <div key={role} style={{ ...styles.statCard, backgroundColor: rc.bg }}>
                <div style={{ ...styles.statNum, color: rc.color }}>
                  {users.filter((u) => u.role === role).length}
                </div>
                <div style={{ ...styles.statLabel, color: rc.color }}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={styles.filters}>
            {["all", "patient", "doctor", "admin"].map((f) => (
              <button
                key={f}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.userList}>
            {filtered.length === 0 ? (
              <div style={styles.empty}>No users found.</div>
            ) : (
              filtered.map((u) => {
                const rc = roleColors[u.role] || { bg: "#f5f5f5", color: "#777" };
                return (
                  <div
                    key={u._id}
                    style={{
                      ...styles.userItem,
                      ...(selected?._id === u._id ? styles.userItemActive : {})
                    }}
                    onClick={() => setSelected(u)}
                  >
                    <div style={styles.userAvatar}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.userInfo}>
                      <div style={styles.userName}>{u.name}</div>
                      <div style={styles.userEmail}>{u.email}</div>
                    </div>
                    <span style={{ ...styles.roleBadge, backgroundColor: rc.bg, color: rc.color }}>
                      {u.role}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div style={styles.detailPanel}>
{!selected ? (
  <div style={styles.selectPrompt}>
    <div style={styles.promptIcon}>👤</div>
    <div style={styles.promptTitle}>Select a user</div>
    <div style={styles.promptSub}>
      Click any user to view their full details
    </div>
  </div>
) : (
  <DetailPanel
    selected={selected}
    onDelete={handleDelete}
    onRoleChange={handleRoleChange}
    deleting={deleting}
    updatingRole={updatingRole}
  />
)}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "1000px", margin: "0 auto" },
  // header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px", marginBottom: "20px"
  },
  statCard: { borderRadius: "10px", padding: "16px", textAlign: "center" },
  statNum: { fontSize: "28px", fontWeight: "700" },
  statLabel: { fontSize: "13px", fontWeight: "500", marginTop: "2px" },
  toolbar: {
    display: "flex", gap: "12px",
    alignItems: "center", flexWrap: "wrap",
    marginBottom: "16px"
  },
  searchInput: {
    flex: 1, minWidth: "200px", padding: "9px 14px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", outline: "none"
  },
  filters: { display: "flex", gap: "6px" },
  filterBtn: {
    padding: "7px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "13px", cursor: "pointer", color: "#555"
  },
  filterActive: { backgroundColor: "#1a237e", color: "#fff", borderColor: "#1a237e" },
  layout: {
    display: "grid", gridTemplateColumns: "300px 1fr",
    gap: "16px", alignItems: "start"
  },
  userList: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    maxHeight: "600px", overflowY: "auto"
  },
  empty: { padding: "24px", textAlign: "center", color: "#aaa", fontSize: "14px" },
  userItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 14px", cursor: "pointer",
    borderBottom: "1px solid #f9f9f9"
  },
  userItemActive: { backgroundColor: "#e8f0fe" },
  userAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    backgroundColor: "#1a237e", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "14px",
    fontWeight: "700", flexShrink: 0
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: {
    fontSize: "13px", fontWeight: "600",
    color: "#333", whiteSpace: "nowrap",
    overflow: "hidden", textOverflow: "ellipsis"
  },
  userEmail: {
    fontSize: "11px", color: "#999",
    whiteSpace: "nowrap", overflow: "hidden",
    textOverflow: "ellipsis"
  },
  roleBadge: {
    fontSize: "11px", padding: "2px 8px",
    borderRadius: "10px", fontWeight: "600", flexShrink: 0
  },
  detailPanel: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    padding: "20px", minHeight: "400px"
  },
  selectPrompt: { textAlign: "center", padding: "60px 20px" },
  promptIcon: { fontSize: "40px", marginBottom: "12px" },
  promptTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  promptSub: { fontSize: "14px", color: "#999", marginTop: "6px" },
  detailHeader: {
    display: "flex", alignItems: "center", gap: "16px",
    marginBottom: "20px", paddingBottom: "16px",
    borderBottom: "1px solid #f0f0f0"
  },
  detailAvatar: {
    width: "52px", height: "52px", borderRadius: "50%",
    backgroundColor: "#1a237e", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "20px",
    fontWeight: "700", flexShrink: 0
  },
  detailName: { fontSize: "17px", fontWeight: "700", color: "#333" },
  detailEmail: { fontSize: "13px", color: "#888", margin: "3px 0 6px" },
  detailSection: {
    marginBottom: "20px", paddingBottom: "16px",
    borderBottom: "1px solid #f5f5f5"
  },
  detailSectionTitle: {
    fontSize: "11px", fontWeight: "600",
    color: "#aaa", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: "10px"
  },
  detailRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "14px", padding: "6px 0"
  },
  detailLabel: { color: "#888" },
  detailValue: { color: "#333", fontWeight: "500" },
  roleButtons: { display: "flex", gap: "8px" },
  roleBtn: {
    flex: 1, padding: "9px",
    borderRadius: "8px", border: "1px solid #ddd",
    backgroundColor: "#f9f9f9", fontSize: "13px",
    fontWeight: "500", cursor: "pointer",
    textTransform: "capitalize", color: "#555"
  },
  roleBtnActive: {
    backgroundColor: "#1a237e", color: "#fff",
    borderColor: "#1a237e"
  },
  dangerBox: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", backgroundColor: "#fff5f5",
    border: "1px solid #ffcdd2", borderRadius: "8px",
    padding: "12px 14px", gap: "12px"
  },
  dangerTitle: { fontSize: "14px", fontWeight: "600", color: "#c62828" },
  dangerSub: { fontSize: "12px", color: "#e57373", marginTop: "3px" },
  deleteBtn: {
    padding: "8px 16px", backgroundColor: "#c62828",
    color: "#fff", border: "none", borderRadius: "7px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer",
    flexShrink: 0
  },
  header: {
  display: "flex", justifyContent: "space-between",
  alignItems: "flex-start", marginBottom: "20px"
},
  createBtn: {
  padding: "10px 18px", backgroundColor: "#1a237e",
  color: "#fff", border: "none", borderRadius: "8px",
  fontSize: "14px", fontWeight: "600", cursor: "pointer"
},
};

export default AdminUsers;