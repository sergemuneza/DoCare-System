import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Chatbot from "./pages/patient/Chatbot";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import MyDocuments from "./pages/patient/MyDocuments";
import RequestDocument from "./pages/patient/RequestDocument";
import BookAppointment from "./pages/patient/BookAppointment";
import MedicalRecords from "./pages/patient/MedicalRecords";
//----
import MyAppointments from "./pages/patient/MyAppointments";
import MyRequests from "./pages/patient/MyRequests";
import Profile from "./pages/patient/Profile";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import UploadDocument from "./pages/doctor/UploadDocument";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorRequests from "./pages/doctor/DoctorRequests";
import DoctorMedicalRecords from "./pages/doctor/DoctorMedicalRecords";
import PatientDocuments from "./pages/doctor/PatientDocuments";
import DoctorProfile from "./pages/doctor/Profile";
import PatientSearch from "./pages/doctor/PatientSearch";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminProfile from "./pages/admin/AdminProfile";
import CreateUser from "./pages/admin/CreateUser";
import ActivityLog from "./pages/admin/ActivityLog";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>Not Authorized</h2>
          } />

          <Route path="/patient" element={
            <PrivateRoute roles={["patient"]}><PatientDashboard /></PrivateRoute>
          } />
          <Route path="/patient/documents" element={
            <PrivateRoute roles={["patient"]}><MyDocuments /></PrivateRoute>
          } />
          <Route path="/patient/request" element={
            <PrivateRoute roles={["patient"]}><RequestDocument /></PrivateRoute>
          } />
          <Route path="/patient/appointment" element={
            <PrivateRoute roles={["patient"]}><BookAppointment /></PrivateRoute>
          } />
          <Route path="/patient/chatbot" element={
  <PrivateRoute roles={["patient"]}><Chatbot /></PrivateRoute>
} />
<Route path="/patient/records" element={
  <PrivateRoute roles={["patient"]}><MedicalRecords /></PrivateRoute>
} />
<Route path="/patient/appointments" element={
  <PrivateRoute roles={["patient"]}><MyAppointments /></PrivateRoute>
} />
<Route path="/patient/requests" element={
  <PrivateRoute roles={["patient"]}><MyRequests /></PrivateRoute>
} />
<Route path="/patient/profile" element={
  <PrivateRoute roles={["patient", "doctor", "admin"]}><Profile /></PrivateRoute>
} />
          <Route path="/doctor" element={
            <PrivateRoute roles={["doctor"]}><DoctorDashboard /></PrivateRoute>
          } />
          <Route path="/doctor/upload" element={
            <PrivateRoute roles={["doctor"]}><UploadDocument /></PrivateRoute>
          } />
          <Route path="/doctor/appointments" element={
  <PrivateRoute roles={["doctor"]}><DoctorAppointments /></PrivateRoute>
} />
<Route path="/doctor/requests" element={
  <PrivateRoute roles={["doctor"]}><DoctorRequests /></PrivateRoute>
} />
<Route path="/doctor/records" element={
  <PrivateRoute roles={["doctor"]}><DoctorMedicalRecords /></PrivateRoute>
} />
<Route path="/doctor/patients" element={
  <PrivateRoute roles={["doctor"]}><PatientDocuments /></PrivateRoute>
} />
<Route path="/doctor/profile" element={
  <PrivateRoute roles={["doctor"]}><DoctorProfile /></PrivateRoute>
} />
<Route path="/doctor/search" element={
  <PrivateRoute roles={["doctor"]}><PatientSearch /></PrivateRoute>
} />

          <Route path="/admin" element={
            <PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/users" element={
  <PrivateRoute roles={["admin"]}><AdminUsers /></PrivateRoute>
} />
<Route path="/admin/documents" element={
  <PrivateRoute roles={["admin"]}><AdminDocuments /></PrivateRoute>
} />
<Route path="/admin/appointments" element={
  <PrivateRoute roles={["admin"]}><AdminAppointments /></PrivateRoute>
} />
<Route path="/admin/requests" element={
  <PrivateRoute roles={["admin"]}><AdminRequests /></PrivateRoute>
} />
<Route path="/admin/profile" element={
  <PrivateRoute roles={["admin"]}><AdminProfile /></PrivateRoute>
} />
<Route path="/admin/create-user" element={
  <PrivateRoute roles={["admin"]}><CreateUser /></PrivateRoute>
} />
<Route path="/admin/activity-log" element={
  <PrivateRoute roles={["admin"]}><ActivityLog /></PrivateRoute>
} />
<Route path="*" element={<NotFound />} />
<Route path="/" element={<Welcome />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;