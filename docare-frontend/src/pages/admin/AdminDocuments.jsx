import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const typeColors = {
  prescription:    { bg: "#e8f5e9", color: "#2e7d32" },
  lab_result:      { bg: "#e3f2fd", color: "#1565c0" },
  medical_record:  { bg: "#fce4ec", color: "#880e4f" },
  radiology:       { bg: "#f3e5f5", color: "#6a1b9a" },
  invoice:         { bg: "#fff8e1", color: "#e65100" },
  referral_letter: { bg: "#fbe9e7", color: "#bf360c" }
};

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    API.get("/admin/documents")
      .then(({ data }) => setDocuments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await API.delete(`/admin/documents/${id}`);
      setDocuments(documents.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  const types = [...new Set(documents.map((d) => d.documentType))];

  const filtered = documents.filter((d) => {
    const matchType = filter === "all" || d.documentType === filter;
    const matchSearch =
      d.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.fileName?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) return (
    <div><Navbar /><div style={styles.center}>Loading documents...</div></div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Document Management</h2>
          <p style={styles.sub}>{documents.length} total documents in the system</p>
        </div>

        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by patient name or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.filters}>
          <button
            style={{ ...styles.filterBtn, ...(filter === "all" ? styles.filterActive : {}) }}
            onClick={() => setFilter("all")}
          >
            All ({documents.length})
          </button>
          {types.map((t) => (
            <button
              key={t}
              style={{ ...styles.filterBtn, ...(filter === t ? styles.filterActive : {}) }}
              onClick={() => setFilter(t)}
            >
              {t.replace(/_/g, " ")} ({documents.filter((d) => d.documentType === t).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <div style={styles.emptyTitle}>No documents found</div>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Document</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Uploaded by</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const tc = typeColors[doc.documentType] || { bg: "#f5f5f5", color: "#555" };
                  const filePath = doc.filePath ? doc.filePath.replace(/\\/g, "/") : "";
                  return (
                    <tr key={doc._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.fileName}>{doc.fileName || "document"}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.typeBadge, backgroundColor: tc.bg, color: tc.color }}>
                          {doc.documentType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.personName}>{doc.patient?.name}</div>
                        <div style={styles.personEmail}>{doc.patient?.email}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.personName}>{doc.uploadedBy?.name}</div>
                        <div style={styles.personEmail}>{doc.uploadedBy?.role}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateText}>
                          {new Date(doc.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: doc.status === "active" ? "#e8f5e9" : "#f5f5f5",
                          color: doc.status === "active" ? "#2e7d32" : "#777"
                        }}>
                          {doc.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionBtns}>
                          <a
                            href={"http://localhost:5000/" + filePath}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.viewBtn}
                          >
                            View
                          </a>
                          <button
                            style={{
                              ...styles.deleteBtn,
                              opacity: deleting === doc._id ? 0.6 : 1
                            }}
                            disabled={deleting === doc._id}
                            onClick={() => handleDelete(doc._id)}
                          >
                            {deleting === doc._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  toolbar: { marginBottom: "12px" },
  searchInput: {
    width: "100%", padding: "10px 14px",
    borderRadius: "8px", border: "1px solid #ddd",
    fontSize: "14px", outline: "none",
    boxSizing: "border-box"
  },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  filterBtn: {
    padding: "6px 14px", borderRadius: "20px",
    border: "1px solid #ddd", backgroundColor: "#fff",
    fontSize: "12px", cursor: "pointer",
    color: "#555", textTransform: "capitalize"
  },
  filterActive: { backgroundColor: "#1a237e", color: "#fff", borderColor: "#1a237e" },
  emptyState: {
    textAlign: "center", padding: "60px 20px",
    backgroundColor: "#fff", borderRadius: "12px"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  tableWrap: {
    backgroundColor: "#fff", borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    overflow: "hidden"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f9f9f9" },
  th: {
    padding: "12px 14px", textAlign: "left",
    fontSize: "11px", fontWeight: "600",
    color: "#888", textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #f0f0f0"
  },
  tr: { borderBottom: "1px solid #f9f9f9" },
  td: { padding: "12px 14px", verticalAlign: "middle" },
  fileName: { fontSize: "13px", fontWeight: "500", color: "#333" },
  typeBadge: {
    fontSize: "11px", padding: "3px 8px",
    borderRadius: "10px", fontWeight: "600",
    textTransform: "capitalize", whiteSpace: "nowrap"
  },
  personName: { fontSize: "13px", fontWeight: "500", color: "#333" },
  personEmail: { fontSize: "11px", color: "#999", marginTop: "1px" },
  dateText: { fontSize: "13px", color: "#555" },
  statusBadge: {
    fontSize: "11px", padding: "3px 8px",
    borderRadius: "10px", fontWeight: "600"
  },
  actionBtns: { display: "flex", gap: "6px" },
  viewBtn: {
    padding: "5px 10px", backgroundColor: "#e8f0fe",
    color: "#1a73e8", borderRadius: "6px",
    textDecoration: "none", fontSize: "12px", fontWeight: "600"
  },
  deleteBtn: {
    padding: "5px 10px", backgroundColor: "#fdecea",
    color: "#c62828", border: "none",
    borderRadius: "6px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer"
  }
};

export default AdminDocuments;