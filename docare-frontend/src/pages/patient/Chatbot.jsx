import { useState } from "react";
import Navbar from "../../components/Navbar";

const responses = {
  appointment_book: "To book an appointment, go to your dashboard and click 'Book Appointment'. Select your doctor, choose a date and time, and describe your reason for visiting.",
  appointment_cancel: "You can cancel a pending appointment from the 'My Appointments' page. Click on the appointment to expand it, then click 'Cancel Appointment'.",
  appointment_reschedule: "Your doctor may propose a new date for your appointment. You will see a notification and can accept or decline the new date from 'My Appointments'.",
  appointment_status: "Your appointment statuses are: Pending (waiting for doctor approval), Approved (confirmed), Completed (visit done), Cancelled.",
  documents_view: "Go to 'My Documents' from the dashboard or navbar. You can filter by document type and click 'View / Download' on any document.",
  documents_types: "DoCare stores these document types: Prescriptions, Lab results, Medical records, Radiology reports, Invoices, and Referral letters.",
  request: "Click 'Request a Document' on your dashboard. Select the document type, write your reason, and submit. Your doctor will review the request.",
  request_status: "Track your requests on the 'My Requests' page. Statuses are: Pending, Uploaded, Approved, Rejected.",
  prescription: "Prescriptions are uploaded by your doctor after a visit. Check 'My Documents' and filter by 'Prescription'.",
  lab: "Lab results are uploaded by your doctor or admin. You can find them under 'My Documents' filtered by 'Lab Result'.",
  records: "Your full medical history is in 'Medical Records'. Each record shows the diagnosis, visit date, your doctor's name and any notes.",
  profile: "Update your personal information from 'My Profile' in the top navigation. You can edit your phone number, address, insurance number and more.",
  password: "You can change your password from your Profile page. Scroll down to the 'Change Password' section.",
  insurance: "Your insurance number can be added or updated from your Profile page under Personal Information.",
  doctor: "Doctors are assigned to you by the hospital. When booking an appointment you can see available doctors, their specialization and experience.",
  emergency: "For medical emergencies please call 112 immediately or go to the nearest emergency room. Do not use this system for emergencies.",
  hours: "The hospital is open Monday to Friday 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 1:00 PM. Emergency services are available 24 hours.",
  contact: "Contact the hospital administration through the front desk or ask your doctor during your next appointment.",
  privacy: "Your medical data is stored securely and is only accessible to you, your assigned doctors, and authorized hospital administrators.",
  hello: "Hello! I am the DoCare assistant. I can help you with appointments, documents, medical records, your profile and more. What do you need help with?",
  help: "I can help you with: appointments, documents, prescriptions, lab results, medical records, profile settings, privacy, hospital hours and contact information. Just ask!"
};

const getResponse = (input) => {
  const t = input.toLowerCase();
  if (t.includes("book") || t.includes("schedule") || (t.includes("appoint") && t.includes("how"))) return responses.appointment_book;
  if (t.includes("cancel") && t.includes("appoint")) return responses.appointment_cancel;
  if (t.includes("reschedule") || t.includes("new date") || t.includes("change date")) return responses.appointment_reschedule;
  if (t.includes("appoint") && (t.includes("status") || t.includes("pending") || t.includes("approved"))) return responses.appointment_status;
  if (t.includes("appoint")) return responses.appointment_book;
  if (t.includes("download") || t.includes("view") && t.includes("doc")) return responses.documents_view;
  if (t.includes("type") && t.includes("doc")) return responses.documents_types;
  if (t.includes("document") || t.includes("file")) return responses.documents_view;
  if (t.includes("request") && t.includes("status")) return responses.request_status;
  if (t.includes("request")) return responses.request;
  if (t.includes("prescription") || t.includes("medicine") || t.includes("medication")) return responses.prescription;
  if (t.includes("lab") || t.includes("blood") || t.includes("test")) return responses.lab;
  if (t.includes("record") || t.includes("history") || t.includes("diagnosis")) return responses.records;
  if (t.includes("profile") || t.includes("information") || t.includes("personal")) return responses.profile;
  if (t.includes("password") || t.includes("change pass")) return responses.password;
  if (t.includes("insurance")) return responses.insurance;
  if (t.includes("doctor") || t.includes("physician") || t.includes("specialist")) return responses.doctor;
  if (t.includes("emergency") || t.includes("urgent")) return responses.emergency;
  if (t.includes("hour") || t.includes("open") || t.includes("time") || t.includes("when")) return responses.hours;
  if (t.includes("contact") || t.includes("phone") || t.includes("reach")) return responses.contact;
  if (t.includes("privacy") || t.includes("secure") || t.includes("data") || t.includes("safe")) return responses.privacy;
  if (t.includes("hello") || t.includes("hi") || t.includes("hey") || t.includes("good")) return responses.hello;
  if (t.includes("help") || t.includes("what can") || t.includes("assist")) return responses.help;
  return "I'm sorry, I didn't quite understand that. Try asking about appointments, documents, prescriptions, lab results, medical records, or your profile. Type 'help' for a full list.";
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I am the DoCare assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const botMessage = { from: "bot", text: getResponse(input) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.chatBox}>
          <div style={styles.header}>
            <div style={styles.dot} />
            <span>DoCare Assistant</span>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={msg.from === "user" ? styles.userRow : styles.botRow}
              >
                {msg.from === "bot" && (
                  <div style={styles.avatar}>DC</div>
                )}
                <div
                  style={
                    msg.from === "user" ? styles.userBubble : styles.botBubble
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.suggestions}>
{["Book appointment", "My documents", "Request record", "Change password", "Hospital hours"].map((s) => (
  <button
    key={s}
    style={styles.suggestion}
    onClick={() => setInput(s)}
  >
    {s}
  </button>
))}
          </div>

          

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button style={styles.sendBtn} onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    padding: "40px 24px"
  },
  chatBox: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "620px"
  },
  header: {
    backgroundColor: "#1a73e8",
    color: "#fff",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: "600"
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#69f0ae"
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  botRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px"
  },
  userRow: {
    display: "flex",
    justifyContent: "flex-end"
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#1a73e8",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    flexShrink: 0
  },
  botBubble: {
    backgroundColor: "#f0f2f5",
    color: "#333",
    padding: "10px 14px",
    borderRadius: "0 10px 10px 10px",
    fontSize: "14px",
    maxWidth: "80%",
    lineHeight: "1.5"
  },
  userBubble: {
    backgroundColor: "#1a73e8",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px 0 10px 10px",
    fontSize: "14px",
    maxWidth: "80%",
    lineHeight: "1.5"
  },
  suggestions: {
    display: "flex",
    gap: "8px",
    padding: "0 20px 12px",
    flexWrap: "wrap"
  },
  suggestion: {
    padding: "6px 14px",
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    border: "none",
    borderRadius: "20px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500"
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid #f0f0f0"
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none"
  },
  sendBtn: {
    padding: "10px 20px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Chatbot;