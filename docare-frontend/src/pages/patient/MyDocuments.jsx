import { useState, useEffect } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const typeColors = {
  prescription: { bg: "#e8f5e9", color: "#2e7d32" },
  lab_result: { bg: "#e3f2fd", color: "#1565c0" },
  medical_record: { bg: "#fce4ec", color: "#880e4f" },
  radiology: { bg: "#f3e5f5", color: "#6a1b9a" },
  invoice: { bg: "#fff8e1", color: "#e65100" },
  insurance: { bg: "#e0f2f1", color: "#00695c" },
  referral_letter: { bg: "#fbe9e7", color: "#bf360c" }
};

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data } = await API.get("/documents/my");
        setDocuments(data);
      } catch (err) {
        setError("Failed to load documents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const isNew = (date) => {
  const diff = new Date() - new Date(date);
  return diff < 24 * 60 * 60 * 1000;
};

  const filtered =
    filter === "all"
      ? documents
      : documents.filter((d) => d.documentType === filter);

  const types = [...new Set(documents.map((d) => d.documentType))];

  if (loading)
    return (
      <div>
        <Navbar />
        <div style={styles.center}>Loading your documents...</div>
      </div>
    );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>My Documents</h2>
            <p style={styles.sub}>
              {documents.length} document
              {documents.length !== 1 ? "s" : ""} on file
            </p>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {documents.length > 0 && (
          <div style={styles.filters}>
            <button
              style={{
                ...styles.filterBtn,
                ...(filter === "all" ? styles.filterActive : {})
              }}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            {types.map((t) => (
              <button
                key={t}
                style={{
                  ...styles.filterBtn,
                  ...(filter === t ? styles.filterActive : {})
                }}
                onClick={() => setFilter(t)}
              >
                {t.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <div style={styles.emptyTitle}>No documents found</div>
            <div style={styles.emptySub}>
              Documents uploaded by your doctor will appear here
            </div>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((doc) => {
              const tc =
                typeColors[doc.documentType] || {
                  bg: "#f5f5f5",
                  color: "#555"
                };

              const filePath = doc.filePath
                ? doc.filePath.replace(/\\/g, "/")
                : "";

              return (
                <div key={doc._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    {isNew(doc.createdAt) && (
  <div style={styles.newBadge}>New</div>
)}
                    <span
                      style={{
                        ...styles.typeBadge,
                        backgroundColor: tc.bg,
                        color: tc.color
                      }}
                    >
                      {doc.documentType.replace(/_/g, " ")}
                    </span>

                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          doc.status === "active"
                            ? "#e8f5e9"
                            : "#f5f5f5",
                        color:
                          doc.status === "active"
                            ? "#2e7d32"
                            : "#777"
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <div style={styles.cardFileName}>
                    {doc.fileName || "document"}
                    {doc.description && (
  <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontStyle: "italic" }}>
    {doc.description}
  </div>
)}
                  </div>

                  <div style={styles.cardMeta}>
                    Uploaded by {doc.uploadedBy?.name || "Unknown"}
                  </div>

                  <div style={styles.cardMeta}>
                    {new Date(doc.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>

                  <a
                    href={"http://localhost:5000/" + filePath}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.downloadBtn}
                  >
                    View / Download
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: "#f0f2f5", minHeight: "100vh" },
  center: { textAlign: "center", marginTop: "80px", color: "#888" },
  container: { padding: "24px", maxWidth: "1000px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px"
  },
  title: { fontSize: "22px", fontWeight: "700", color: "#333", margin: 0 },
  sub: { fontSize: "14px", color: "#888", marginTop: "4px" },
  error: {
    backgroundColor: "#fdecea",
    color: "#c62828",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px"
  },
  filters: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    color: "#555",
    textTransform: "capitalize"
  },
  filterActive: {
    backgroundColor: "#1a73e8",
    color: "#fff",
    borderColor: "#1a73e8"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#333" },
  emptySub: { fontSize: "14px", color: "#999", marginTop: "6px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px"
  },
  typeBadge: {
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "12px",
    fontWeight: "600",
    textTransform: "capitalize"
  },
  statusBadge: {
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "12px",
    fontWeight: "600"
  },
  cardFileName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },
  cardMeta: { fontSize: "12px", color: "#999" },
  downloadBtn: {
    marginTop: "10px",
    display: "block",
    textAlign: "center",
    backgroundColor: "#1a73e8",
    color: "#fff",
    padding: "9px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600"
  },
  newBadge: {
  display: "inline-block",
  backgroundColor: "#1a73e8", color: "#fff",
  fontSize: "10px", fontWeight: "700",
  padding: "2px 8px", borderRadius: "10px",
  marginBottom: "6px", letterSpacing: "0.05em"
}
};

export default MyDocuments;