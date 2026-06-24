const Skeleton = ({ width = "100%", height = "16px", borderRadius = "6px", style = {} }) => (
  <div style={{
    width, height, borderRadius,
    backgroundColor: "#e0e0e0",
    animation: "pulse 1.5s ease-in-out infinite",
    ...style
  }} />
);

const SkeletonCard = () => (
  <div style={{
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", marginBottom: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  }}>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `}</style>
    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="40%" height="14px" style={{ marginBottom: "8px" }} />
        <Skeleton width="60%" height="12px" />
      </div>
    </div>
    <Skeleton height="12px" style={{ marginBottom: "6px" }} />
    <Skeleton width="80%" height="12px" />
  </div>
);

const SkeletonDashboard = () => (
  <div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `}</style>
    <div style={{ backgroundColor: "#e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "24px", animation: "pulse 1.5s ease-in-out infinite" }}>
      <Skeleton width="30%" height="22px" style={{ marginBottom: "10px", backgroundColor: "#ccc" }} />
      <Skeleton width="50%" height="14px" style={{ backgroundColor: "#ccc" }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ backgroundColor: "#e0e0e0", borderRadius: "10px", padding: "20px", animation: "pulse 1.5s ease-in-out infinite" }}>
          <Skeleton width="50%" height="32px" style={{ margin: "0 auto 8px", backgroundColor: "#ccc" }} />
          <Skeleton width="70%" height="12px" style={{ margin: "0 auto", backgroundColor: "#ccc" }} />
        </div>
      ))}
    </div>
    {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonDashboard };