import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Welcome = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🗂",
      title: "Paperless Records",
      desc: "All your medical documents digitally stored, organized and accessible anytime from anywhere."
    },
    {
      icon: "📅",
      title: "Easy Appointments",
      desc: "Book appointments with your doctor in seconds. Track status and get notified instantly."
    },
    {
      icon: "📄",
      title: "Document Requests",
      desc: "Request prescriptions, lab results, referral letters and more with a single click."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      desc: "Your health data is encrypted and only accessible to you and your authorized doctors."
    },
    {
      icon: "🔔",
      title: "Real-time Notifications",
      desc: "Get notified when your doctor uploads a document, approves a request or confirms an appointment."
    },
    {
      icon: "🤖",
      title: "Smart Assistant",
      desc: "Our built-in chatbot answers your questions about appointments, documents and hospital services."
    }
  ];

  const stats = [
    { number: "3", label: "User roles" },
    { number: "7+", label: "Document types" },
    { number: "100%", label: "Paperless" },
    { number: "24/7", label: "Access" }
  ];

  const steps = [
    { step: "01", title: "Register as a patient", desc: "Create your account in under 2 minutes with your personal and insurance details." },
    { step: "02", title: "Book an appointment", desc: "Choose your doctor, pick a date and describe your reason for visiting." },
    { step: "03", title: "Receive your documents", desc: "Your doctor uploads results and prescriptions directly to your account." },
    { step: "04", title: "Track everything", desc: "View your full medical history, request copies and download documents anytime." }
  ];

  return (
    <div style={styles.page}>

      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <div style={styles.brandDot }  />
            DoCare
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#how" style={styles.navLink}>How it works</a>
            <a href="#roles" style={styles.navLink}>Who is it for</a>
          </div>
          <div style={styles.navActions}>
            <button style={styles.navSignIn} onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button style={styles.navSignUp} onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroBg}>
          <div style={styles.circle1} />
          <div style={styles.circle2} />
          <div style={styles.circle3} />
          <div style={styles.grid} />
        </div>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            Kacyiru District Hospital Document Management System
          </div>
          <h1 style={styles.heroTitle}>
            Your health records,
            <span style={styles.heroHighlight}> secure</span> and
            <span style={styles.heroHighlight}> accessible</span>
          </h1>
          <p style={styles.heroSub}>
            DoCare digitizes hospital documents, connects patients with doctors, automates workflows and puts your complete medical history at your fingertips — safely and instantly.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.heroPrimary} onClick={() => navigate("/register")}>
              Create Free Account
              <span style={styles.btnArrow}>→</span>
            </button>
            <button style={styles.heroSecondary} onClick={() => navigate("/login")}>
              Sign In to Dashboard
            </button>
          </div>
          <div style={styles.heroNote}>
            Already a doctor or admin? Your account is created by the hospital administrator.
          </div>
        </div>

        <div style={styles.statsBar}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statItem}>
              <div style={styles.statNumber}>{s.number}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionBadge}>Features</div>
          <h2 style={styles.sectionTitle}>Everything you need in one place</h2>
          <p style={styles.sectionSub}>
            DoCare brings together patients, doctors and administrators in a single secure platform.
          </p>
          <div style={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <div style={styles.featureTitle}>{f.title}</div>
                <div style={styles.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" style={{ ...styles.section, backgroundColor: "#f8faff" }}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionBadge}>How it works</div>
          <h2 style={styles.sectionTitle}>Get started in four steps</h2>
          <p style={styles.sectionSub}>
            From registration to receiving your documents — simple, fast and fully digital.
          </p>
          <div style={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div key={s.step} style={styles.stepCard}>
                <div style={styles.stepNumber}>{s.step}</div>
                {i < steps.length - 1 && <div style={styles.stepConnector} />}
                <div style={styles.stepTitle}>{s.title}</div>
                <div style={styles.stepDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionBadge}>Who is it for</div>
          <h2 style={styles.sectionTitle}>Built for everyone in the hospital</h2>
          <p style={styles.sectionSub}>
            Three tailored dashboards — each designed for how that role actually works.
          </p>
          <div style={styles.rolesGrid}>
            <div style={{ ...styles.roleCard, borderTop: "4px solid #1a73e8" }}>
              <div style={{ ...styles.roleIcon, backgroundColor: "#e8f0fe", color: "#1a73e8" }}>
                P
              </div>
              <div style={styles.roleTitle}>Patient</div>
              <div style={styles.roleDesc}>
                Register, book appointments, view and download documents, request records, track your medical history and chat with the assistant.
              </div>
              <ul style={styles.roleList}>
                {["View medical records", "Download documents", "Book appointments", "Request document copies", "Chat with assistant"].map((item) => (
                  <li key={item} style={styles.roleItem}>
                    <span style={styles.roleCheck}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button style={{ ...styles.roleBtn, backgroundColor: "#1a73e8" }} onClick={() => navigate("/register")}>
                Register as Patient
              </button>
            </div>

            <div style={{ ...styles.roleCard, ...styles.roleCardFeatured, borderTop: "4px solid #00796b" }}>
              <div style={styles.roleFeaturedBadge}>Most used</div>
              <div style={{ ...styles.roleIcon, backgroundColor: "#e0f2f1", color: "#00796b" }}>
                D
              </div>
              <div style={styles.roleTitle}>Doctor</div>
              <div style={styles.roleDesc}>
                Manage patient records, upload documents, handle requests, manage appointments and view complete patient histories.
              </div>
              <ul style={styles.roleList}>
                {["Upload patient documents", "Create medical records", "Handle document requests", "Manage appointments", "Search patient history"].map((item) => (
                  <li key={item} style={styles.roleItem}>
                    <span style={{ ...styles.roleCheck, color: "#00796b" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button style={{ ...styles.roleBtn, backgroundColor: "#00796b" }} onClick={() => navigate("/login")}>
                Doctor Sign In
              </button>
            </div>

            <div style={{ ...styles.roleCard, borderTop: "4px solid #1a237e" }}>
              <div style={{ ...styles.roleIcon, backgroundColor: "#e8eaf6", color: "#1a237e" }}>
                A
              </div>
              <div style={styles.roleTitle}>Administrator</div>
              <div style={styles.roleDesc}>
                Full system control — manage users, create doctor accounts, oversee all documents, appointments and maintain system security.
              </div>
              <ul style={styles.roleList}>
                {["Create staff accounts", "Manage all users", "View system statistics", "Monitor activity logs", "Control all documents"].map((item) => (
                  <li key={item} style={styles.roleItem}>
                    <span style={{ ...styles.roleCheck, color: "#1a237e" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button style={{ ...styles.roleBtn, backgroundColor: "#1a237e" }} onClick={() => navigate("/login")}>
                Admin Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaBg}>
          <div style={styles.ctaCircle1} />
          <div style={styles.ctaCircle2} />
        </div>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to go paperless?</h2>
          <p style={styles.ctaSub}>
            Join DoCare today and experience modern healthcare document management.
          </p>
          <div style={styles.ctaActions}>
            <button style={styles.ctaPrimary} onClick={() => navigate("/register")}>
              Create Your Account
              <span style={styles.btnArrow}>→</span>
            </button>
            <button style={styles.ctaSecondary} onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <div style={styles.brandDot} />
              DoCare
            </div>
            <div style={styles.footerTagline}>
              Secure hospital document management 
            </div>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerCol}>
              <div style={styles.footerColTitle}>Platform</div>
              <div style={styles.footerLink} onClick={() => navigate("/login")}>Sign In</div>
              <div style={styles.footerLink} onClick={() => navigate("/register")}>Register</div>
            </div>
            <div style={styles.footerCol}>
              <div style={styles.footerColTitle}>Roles</div>
              <div style={styles.footerLink}>Patient</div>
              <div style={styles.footerLink}>Doctor</div>
              <div style={styles.footerLink}>Admin</div>
            </div>
            <div style={styles.footerCol}>
              <div style={styles.footerColTitle}>System</div>
              <div style={styles.footerLink}>Features</div>
              <div style={styles.footerLink}>Security</div>
              <div style={styles.footerLink}>Support</div>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <div>© 2026 DoCare — Hospital Document Management System. Academic project.</div>
        </div>
      </footer> 

    </div> 
  );
};

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", color: "#333", overflowX: "hidden" },

  nav: {
    position: "fixed", top: 0, left: 0, right: 0,
    zIndex: 100, padding: "0 40px",
    transition: "all 0.3s ease",
    backgroundColor: "transparent"
  },
  navScrolled: {
    backgroundColor: "rgba(255,255,255,0.97)",
    boxShadow: "0 2px 20px rgba(0,0,0,0.08)"
  },
  navInner: {
    maxWidth: "1100px", margin: "0 auto",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", height: "68px"
  },
  navBrand: {
    fontSize: "22px", fontWeight: "800",
    color: "#fff", letterSpacing: "1px",
    display: "flex", alignItems: "center", gap: "8px"
  },
  brandDot: {
    width: "10px", height: "10px",
    borderRadius: "50%", backgroundColor: "#69f0ae"
  },
  navLinks: { display: "flex", gap: "32px" },
  navLink: {
    color: "rgba(255,255,255,0.85)", fontSize: "14px",
    fontWeight: "500", textDecoration: "none", cursor: "pointer"
  },
  navActions: { display: "flex", gap: "10px" },
  navSignIn: {
    padding: "8px 20px", backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px", fontSize: "14px", fontWeight: "600",
    cursor: "pointer"
  },
  navSignUp: {
    padding: "8px 20px", backgroundColor: "#69f0ae",
    color: "#1a237e", border: "none",
    borderRadius: "8px", fontSize: "14px", fontWeight: "700",
    cursor: "pointer"
  },

  hero: {
    minHeight: "100vh", backgroundColor: "#1a237e",
    position: "relative", display: "flex",
    flexDirection: "column", justifyContent: "center",
    alignItems: "center", overflow: "hidden",
    paddingTop: "68px"
  },
  heroBg: { position: "absolute", inset: 0, overflow: "hidden" },
  circle1: {
    position: "absolute", width: "600px", height: "600px",
    borderRadius: "50%", backgroundColor: "rgba(105,240,174,0.08)",
    top: "-200px", right: "-100px"
  },
  circle2: {
    position: "absolute", width: "400px", height: "400px",
    borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)",
    bottom: "100px", left: "-100px"
  },
  circle3: {
    position: "absolute", width: "200px", height: "200px",
    borderRadius: "50%", backgroundColor: "rgba(105,240,174,0.06)",
    top: "200px", left: "30%"
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "60px 60px"
  },
  heroContent: {
    position: "relative", zIndex: 2,
    textAlign: "center", maxWidth: "780px",
    padding: "60px 24px 40px"
  },
  heroBadge: {
    display: "inline-block",
    backgroundColor: "rgba(105,240,174,0.15)",
    color: "#69f0ae", border: "1px solid rgba(105,240,174,0.3)",
    borderRadius: "20px", padding: "6px 18px",
    fontSize: "13px", fontWeight: "600",
    letterSpacing: "0.05em", marginBottom: "24px"
  },
  heroTitle: {
    fontSize: "56px", fontWeight: "800",
    color: "#fff", lineHeight: "1.15",
    marginBottom: "20px", letterSpacing: "-0.5px"
  },
  heroHighlight: { color: "#69f0ae" },
  heroSub: {
    fontSize: "18px", color: "rgba(255,255,255,0.75)",
    lineHeight: "1.7", marginBottom: "36px",
    maxWidth: "600px", margin: "0 auto 36px"
  },
  heroActions: { display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" },
  heroPrimary: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "15px 32px", backgroundColor: "#69f0ae",
    color: "#1a237e", border: "none", borderRadius: "10px",
    fontSize: "16px", fontWeight: "700", cursor: "pointer"
  },
  heroSecondary: {
    padding: "15px 32px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "10px", fontSize: "16px",
    fontWeight: "600", cursor: "pointer"
  },
  btnArrow: { fontSize: "18px" },
  heroNote: {
    marginTop: "20px", fontSize: "13px",
    color: "rgba(255,255,255,0.5)"
  },
  statsBar: {
    position: "relative", zIndex: 2,
    display: "flex", gap: "0",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    width: "100%", maxWidth: "700px",
    borderRadius: "16px", overflow: "hidden",
    marginBottom: "60px"
  },
  statItem: {
    flex: 1, textAlign: "center", padding: "20px",
    borderRight: "1px solid rgba(255,255,255,0.1)"
  },
  statNumber: { fontSize: "28px", fontWeight: "800", color: "#69f0ae" },
  statLabel: { fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "4px" },

  section: {
    padding: "100px 24px",
    backgroundColor: "#fff"
  },
  sectionInner: { maxWidth: "1100px", margin: "0 auto" },
  sectionBadge: {
    display: "inline-block",
    backgroundColor: "#e8f0fe", color: "#1a73e8",
    borderRadius: "20px", padding: "5px 16px",
    fontSize: "12px", fontWeight: "700",
    letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: "16px"
  },
  sectionTitle: {
    fontSize: "38px", fontWeight: "800",
    color: "#1a237e", marginBottom: "14px",
    lineHeight: "1.2"
  },
  sectionSub: {
    fontSize: "17px", color: "#666",
    lineHeight: "1.7", marginBottom: "56px",
    maxWidth: "560px"
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px"
  },
  featureCard: {
    padding: "28px", borderRadius: "16px",
    border: "1px solid #f0f0f0",
    backgroundColor: "#fafafa",
    transition: "transform 0.2s"
  },
  featureIcon: { fontSize: "32px", marginBottom: "14px" },
  featureTitle: {
    fontSize: "17px", fontWeight: "700",
    color: "#1a237e", marginBottom: "8px"
  },
  featureDesc: { fontSize: "14px", color: "#666", lineHeight: "1.7" },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px", position: "relative"
  },
  stepCard: {
    backgroundColor: "#fff", borderRadius: "16px",
    padding: "28px", border: "1px solid #e8eaf6",
    position: "relative"
  },
  stepNumber: {
    fontSize: "42px", fontWeight: "900",
    color: "#e8eaf6", lineHeight: 1,
    marginBottom: "16px"
  },
  stepConnector: {
    position: "absolute", top: "40px",
    right: "-12px", width: "24px",
    height: "2px", backgroundColor: "#c5cae9",
    zIndex: 1
  },
  stepTitle: {
    fontSize: "16px", fontWeight: "700",
    color: "#1a237e", marginBottom: "8px"
  },
  stepDesc: { fontSize: "14px", color: "#666", lineHeight: "1.7" },

  rolesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px"
  },
  roleCard: {
    padding: "32px", borderRadius: "16px",
    border: "1px solid #f0f0f0",
    backgroundColor: "#fff",
    position: "relative", overflow: "hidden"
  },
  roleCardFeatured: {
    boxShadow: "0 8px 40px rgba(0,121,107,0.12)",
    border: "1px solid #b2dfdb"
  },
  roleFeaturedBadge: {
    position: "absolute", top: "16px", right: "16px",
    backgroundColor: "#00796b", color: "#fff",
    fontSize: "11px", fontWeight: "700",
    padding: "3px 10px", borderRadius: "12px"
  },
  roleIcon: {
    width: "52px", height: "52px", borderRadius: "14px",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "22px",
    fontWeight: "800", marginBottom: "16px"
  },
  roleTitle: {
    fontSize: "20px", fontWeight: "800",
    color: "#1a237e", marginBottom: "10px"
  },
  roleDesc: {
    fontSize: "14px", color: "#666",
    lineHeight: "1.7", marginBottom: "20px"
  },
  roleList: { listStyle: "none", padding: 0, marginBottom: "24px" },
  roleItem: {
    fontSize: "14px", color: "#444",
    padding: "5px 0", display: "flex",
    alignItems: "center", gap: "8px"
  },
  roleCheck: { color: "#1a73e8", fontWeight: "700" },
  roleBtn: {
    width: "100%", padding: "12px",
    color: "#fff", border: "none",
    borderRadius: "10px", fontSize: "14px",
    fontWeight: "700", cursor: "pointer"
  },

  ctaSection: {
    padding: "100px 24px",
    backgroundColor: "#1a237e",
    position: "relative", overflow: "hidden",
    textAlign: "center"
  },
  ctaBg: { position: "absolute", inset: 0 },
  ctaCircle1: {
    position: "absolute", width: "500px", height: "500px",
    borderRadius: "50%", backgroundColor: "rgba(105,240,174,0.06)",
    top: "-200px", right: "-100px"
  },
  ctaCircle2: {
    position: "absolute", width: "300px", height: "300px",
    borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)",
    bottom: "-100px", left: "10%"
  },
  ctaContent: { position: "relative", zIndex: 2 },
  ctaTitle: {
    fontSize: "42px", fontWeight: "800",
    color: "#fff", marginBottom: "16px"
  },
  ctaSub: {
    fontSize: "17px", color: "rgba(255,255,255,0.75)",
    marginBottom: "36px", maxWidth: "500px",
    margin: "0 auto 36px"
  },
  ctaActions: {
    display: "flex", gap: "14px",
    justifyContent: "center", flexWrap: "wrap"
  },
  ctaPrimary: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "15px 32px", backgroundColor: "#69f0ae",
    color: "#1a237e", border: "none", borderRadius: "10px",
    fontSize: "16px", fontWeight: "700", cursor: "pointer"
  },
  ctaSecondary: {
    padding: "15px 32px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "10px", fontSize: "16px",
    fontWeight: "600", cursor: "pointer"
  },

  footer: {
    backgroundColor: "#0f1566",
    padding: "60px 40px 0", color: "rgba(255,255,255,0.7)"
  },
  footerInner: {
    maxWidth: "1100px", margin: "0 auto",
    display: "flex", justifyContent: "space-between",
    flexWrap: "wrap", gap: "40px",
    paddingBottom: "48px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },
  footerBrand: {},
  footerLogo: {
    fontSize: "22px", fontWeight: "800",
    color: "#fff", display: "flex",
    alignItems: "center", gap: "8px",
    marginBottom: "10px"
  },
  footerTagline: { fontSize: "13px", color: "rgba(255,255,255,0.5)" },
  footerLinks: { display: "flex", gap: "60px", flexWrap: "wrap" },
  footerCol: {},
  footerColTitle: {
    fontSize: "12px", fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: "14px"
  },
  footerLink: {
    fontSize: "14px", color: "rgba(255,255,255,0.65)",
    marginBottom: "10px", cursor: "pointer"
  },
  footerBottom: {
    maxWidth: "1100px", margin: "0 auto",
    padding: "20px 0",
    fontSize: "13px", color: "rgba(255,255,255,0.35)"
  }
};

export default Welcome;