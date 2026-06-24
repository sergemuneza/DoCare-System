// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// const typeIcons = {
//   request_approved:      { icon: "✓", bg: "#e8f5e9", color: "#2e7d32" },
//   request_rejected:      { icon: "✗", bg: "#fdecea", color: "#c62828" },
//   appointment_approved:  { icon: "📅", bg: "#e8f0fe", color: "#1a73e8" },
//   appointment_cancelled: { icon: "✗", bg: "#fdecea", color: "#c62828" },
//   document_uploaded:     { icon: "📄", bg: "#f3e5f5", color: "#6a1b9a" },
//   general:               { icon: "•",  bg: "#f5f5f5", color: "#555" }
// };

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unread, setUnread] = useState(0);
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUnread();
//     const interval = setInterval(fetchUnread, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const fetchUnread = async () => {
//     try {
//       const { data } = await API.get("/notifications/unread-count");
//       setUnread(data.count);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleOpen = async () => {
//     setOpen(!open);
//     if (!open) {
//       try {
//         const { data } = await API.get("/notifications");
//         setNotifications(data);
//         if (unread > 0) {
//           await API.put("/notifications/read-all");
//           setUnread(0);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   return (
//     <div ref={ref} style={styles.wrap}>
//       <button style={styles.bell} onClick={handleOpen}>
//         <span style={styles.bellIcon}>🔔</span>
//         {unread > 0 && (
//           <span style={styles.badge}>{unread > 9 ? "9+" : unread}</span>
//         )}
//       </button>

//       {open && (
//         <div style={styles.dropdown}>
//           <div style={styles.dropHeader}>
//             <span style={styles.dropTitle}>Notifications</span>
//             {notifications.length > 0 && (
//               <span style={styles.dropCount}>{notifications.length}</span>
//             )}
//           </div>

//           {notifications.length === 0 ? (
//             <div style={styles.empty}>No notifications yet</div>
//           ) : (
//             <div style={styles.list}>
//               {notifications.map((n) => {
//                 const ic = typeIcons[n.type] || typeIcons.general;
//                 return (
//                   <div
//                     key={n._id}
//                     style={{
//                       ...styles.item,
//                       backgroundColor: n.read ? "#fff" : "#f8f9ff"
//                     }}
//                   >
//                     <div style={{ ...styles.iconWrap, backgroundColor: ic.bg }}>
//                       <span style={{ color: ic.color, fontSize: "13px" }}>{ic.icon}</span>
//                     </div>
//                     <div style={styles.itemContent}>
//                       <div style={styles.itemTitle}>{n.title}</div>
//                       <div style={styles.itemMessage}>{n.message}</div>
//                       <div style={styles.itemTime}>
//                         {new Date(n.createdAt).toLocaleDateString("en-US", {
//                           month: "short", day: "numeric",
//                           hour: "2-digit", minute: "2-digit"
//                         })}
//                       </div>
//                     </div>
//                     {!n.read && <div style={styles.unreadDot} />}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   wrap: { position: "relative" },
//   bell: {
//     position: "relative", background: "rgba(255,255,255,0.15)",
//     border: "1px solid rgba(255,255,255,0.3)",
//     borderRadius: "8px", padding: "6px 10px",
//     cursor: "pointer", display: "flex", alignItems: "center"
//   },
//   bellIcon: { fontSize: "16px" },
//   badge: {
//     position: "absolute", top: "-6px", right: "-6px",
//     backgroundColor: "#c62828", color: "#fff",
//     fontSize: "10px", fontWeight: "700",
//     borderRadius: "10px", padding: "1px 5px",
//     minWidth: "16px", textAlign: "center"
//   },
//   dropdown: {
//     position: "absolute", right: 0, top: "calc(100% + 8px)",
//     width: "320px", backgroundColor: "#fff",
//     borderRadius: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
//     zIndex: 1000, overflow: "hidden"
//   },
//   dropHeader: {
//     display: "flex", justifyContent: "space-between",
//     alignItems: "center", padding: "14px 16px",
//     borderBottom: "1px solid #f0f0f0"
//   },
//   dropTitle: { fontSize: "14px", fontWeight: "700", color: "#333" },
//   dropCount: {
//     backgroundColor: "#e8f0fe", color: "#1a73e8",
//     fontSize: "11px", fontWeight: "700",
//     padding: "2px 8px", borderRadius: "10px"
//   },
//   empty: {
//     padding: "32px 16px", textAlign: "center",
//     color: "#aaa", fontSize: "14px"
//   },
//   list: { maxHeight: "360px", overflowY: "auto" },
//   item: {
//     display: "flex", alignItems: "flex-start",
//     gap: "10px", padding: "12px 16px",
//     borderBottom: "1px solid #f9f9f9",
//     cursor: "default"
//   },
//   iconWrap: {
//     width: "32px", height: "32px", borderRadius: "50%",
//     display: "flex", alignItems: "center",
//     justifyContent: "center", flexShrink: 0
//   },
//   itemContent: { flex: 1 },
//   itemTitle: { fontSize: "13px", fontWeight: "600", color: "#333" },
//   itemMessage: { fontSize: "12px", color: "#666", marginTop: "2px", lineHeight: "1.5" },
//   itemTime: { fontSize: "11px", color: "#aaa", marginTop: "4px" },
//   unreadDot: {
//     width: "8px", height: "8px", borderRadius: "50%",
//     backgroundColor: "#1a73e8", flexShrink: 0, marginTop: "4px"
//   }
// };

// export default NotificationBell;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const typeConfig = {
  request_approved:      { icon: "✓", bg: "#e8f5e9", color: "#2e7d32" },
  request_rejected:      { icon: "✗", bg: "#fdecea", color: "#c62828" },
  request_uploaded:      { icon: "📄", bg: "#e8f0fe", color: "#1a73e8" },
  appointment_approved:  { icon: "📅", bg: "#e0f2f1", color: "#00796b" },
  appointment_cancelled: { icon: "✗", bg: "#fdecea", color: "#c62828" },
  document_uploaded:     { icon: "📄", bg: "#f3e5f5", color: "#6a1b9a" },
  general:               { icon: "•",  bg: "#f5f5f5", color: "#555"    }
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchUnread = async () => {
    try {
      const { data } = await API.get("/notifications/unread-count");
      setUnread(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = async () => {
    const nowOpen = !open;
    setOpen(nowOpen);
    if (nowOpen) {
      try {
        const { data } = await API.get("/notifications");
        setNotifications(data);
        if (unread > 0) {
          await API.put("/notifications/read-all");
          setUnread(0);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await API.put(`/notifications/${notification._id}/read`);
      setNotifications((prev) =>
        prev.map((n) => n._id === notification._id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
    if (notification.link) {
      setOpen(false);
      navigate(notification.link);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isActionable = (n) =>
    ["request_approved", "request_uploaded", "document_uploaded"].includes(n.type);

  return (
    <div ref={ref} style={styles.wrap}>
      <button style={styles.bell} onClick={handleOpen}>
        <span style={styles.bellIcon}>🔔</span>
        {unread > 0 && (
          <span style={styles.badge}>{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropHeader}>
            <div>
              <div style={styles.dropTitle}>Notifications</div>
              {unread === 0 && notifications.length > 0 && (
                <div style={styles.allRead}>All caught up</div>
              )}
            </div>
            {notifications.length > 0 && (
              <span style={styles.dropCount}>{notifications.length}</span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔔</div>
              <div style={styles.emptyText}>No notifications yet</div>
              <div style={styles.emptySub}>You will be notified when something needs your attention</div>
            </div>
          ) : (
            <div style={styles.list}>
              {notifications.map((n) => {
                const tc = typeConfig[n.type] || typeConfig.general;
                const actionable = isActionable(n);
                return (
                  <div
                    key={n._id}
                    style={{
                      ...styles.item,
                      backgroundColor: n.read ? "#fff" : "#f0f4ff",
                      cursor: n.link ? "pointer" : "default"
                    }}
                    onClick={() => n.link && handleNotificationClick(n)}
                  >
                    <div style={{ ...styles.iconWrap, backgroundColor: tc.bg }}>
                      <span style={{ color: tc.color, fontSize: "13px", fontWeight: "700" }}>
                        {tc.icon}
                      </span>
                    </div>

                    <div style={styles.itemContent}>
                      <div style={styles.itemTitle}>{n.title}</div>
                      <div style={styles.itemMessage}>{n.message}</div>

                      {actionable && n.link && (
                        <div
                          style={styles.actionLink}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(n);
                          }}
                        >
                          {n.type === "document_uploaded" || n.type === "request_uploaded" || n.type === "request_approved"
                            ? "View & Download Document"
                            : "View Details"}
                          <span style={styles.arrow}>→</span>
                        </div>
                      )}

                      <div style={styles.itemTime}>{timeAgo(n.createdAt)}</div>
                    </div>

                    {!n.read && <div style={styles.unreadDot} />}
                  </div>
                );
              })}
            </div>
          )}

          {notifications.length > 0 && (
            <div style={styles.dropFooter}>
              <button
                style={styles.clearBtn}
                onClick={async () => {
                  await API.put("/notifications/read-all");
                  setNotifications(notifications.map((n) => ({ ...n, read: true })));
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrap: { position: "relative" },
  bell: {
    position: "relative",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px", padding: "6px 10px",
    cursor: "pointer", display: "flex", alignItems: "center"
  },
  bellIcon: { fontSize: "16px" },
  badge: {
    position: "absolute", top: "-6px", right: "-6px",
    backgroundColor: "#c62828", color: "#fff",
    fontSize: "10px", fontWeight: "700",
    borderRadius: "10px", padding: "1px 5px",
    minWidth: "16px", textAlign: "center",
    border: "2px solid #1a237e"
  },
  dropdown: {
    position: "absolute", right: 0,
    top: "calc(100% + 10px)",
    width: "340px", backgroundColor: "#fff",
    borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    zIndex: 1000, overflow: "hidden",
    border: "1px solid #f0f0f0"
  },
  dropHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "16px 18px",
    borderBottom: "1px solid #f5f5f5"
  },
  dropTitle: { fontSize: "15px", fontWeight: "700", color: "#333" },
  allRead: { fontSize: "11px", color: "#2e7d32", marginTop: "2px" },
  dropCount: {
    backgroundColor: "#e8eaf6", color: "#1a237e",
    fontSize: "11px", fontWeight: "700",
    padding: "3px 10px", borderRadius: "12px"
  },
  emptyState: {
    padding: "36px 20px", textAlign: "center"
  },
  emptyIcon: { fontSize: "36px", marginBottom: "10px" },
  emptyText: { fontSize: "15px", fontWeight: "600", color: "#333", marginBottom: "6px" },
  emptySub: { fontSize: "13px", color: "#aaa", lineHeight: "1.5" },
  list: { maxHeight: "400px", overflowY: "auto" },
  item: {
    display: "flex", alignItems: "flex-start",
    gap: "12px", padding: "14px 16px",
    borderBottom: "1px solid #f9f9f9",
    transition: "background 0.15s"
  },
  iconWrap: {
    width: "34px", height: "34px", borderRadius: "50%",
    display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "3px" },
  itemMessage: { fontSize: "12px", color: "#555", lineHeight: "1.55" },
  actionLink: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    marginTop: "8px", fontSize: "12px", fontWeight: "700",
    color: "#1a73e8", backgroundColor: "#e8f0fe",
    padding: "5px 12px", borderRadius: "20px",
    cursor: "pointer"
  },
  arrow: { fontSize: "13px" },
  itemTime: { fontSize: "11px", color: "#bbb", marginTop: "6px" },
  unreadDot: {
    width: "9px", height: "9px", borderRadius: "50%",
    backgroundColor: "#1a73e8", flexShrink: 0,
    marginTop: "5px", border: "2px solid #fff"
  },
  dropFooter: {
    padding: "10px 16px", borderTop: "1px solid #f5f5f5",
    textAlign: "center"
  },
  clearBtn: {
    fontSize: "13px", color: "#888",
    backgroundColor: "transparent", border: "none",
    cursor: "pointer", fontWeight: "500"
  }
};

export default NotificationBell;