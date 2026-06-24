const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      reason
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "name email")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Notification = require("../models/Notification");

// const updateAppointmentStatus = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)
//       .populate("patient", "name")
//       .populate("doctor", "name");
//     if (!appointment) return res.status(404).json({ message: "Appointment not found" });

//     appointment.status = req.body.status;
//     await appointment.save();

//     const messages = {
//       approved: {
//         title: "Appointment confirmed",
//         message: `Your appointment with Dr. ${appointment.doctor.name} has been confirmed.`,
//         type: "appointment_approved"
//       },
//       cancelled: {
//         title: "Appointment cancelled",
//         message: `Your appointment with Dr. ${appointment.doctor.name} has been cancelled.`,
//         type: "appointment_cancelled"
//       },
//       completed: {
//         title: "Appointment completed",
//         message: `Your appointment with Dr. ${appointment.doctor.name} has been marked as completed.`,
//         type: "appointment_approved"
//       }
//     };

//     if (messages[req.body.status]) {
//       await Notification.create({
//         user: appointment.patient._id,
//         ...messages[req.body.status]
//       });
//     }

//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name")
      .populate("doctor", "name");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = req.body.status;
    await appointment.save();

    const notificationMap = {
      approved: {
        title: "Appointment confirmed",
        message: `Your appointment with Dr. ${appointment.doctor.name} on ${new Date(appointment.appointmentDate).toLocaleDateString()} has been confirmed.`,
        type: "appointment_approved",
        link: "/patient/appointments"
      },
      cancelled: {
        title: "Appointment cancelled",
        message: `Your appointment with Dr. ${appointment.doctor.name} on ${new Date(appointment.appointmentDate).toLocaleDateString()} has been cancelled.`,
        type: "appointment_cancelled",
        link: "/patient/appointments"
      },
      completed: {
        title: "Appointment completed",
        message: `Your visit with Dr. ${appointment.doctor.name} has been marked as completed. Check your documents for any new uploads.`,
        type: "appointment_approved",
        link: "/patient/appointments"
      }
    };

    if (notificationMap[req.body.status]) {
      await Notification.create({
        user: appointment.patient._id,
        ...notificationMap[req.body.status]
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};