const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointment
);

router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  getMyAppointments
);

router.get(
  "/doctor",
  protect,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("doctor", "admin"),
  updateAppointmentStatus
);

//---------
router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("patient"),
  async (req, res) => {
    try {
      const appointment = await require("../models/Appointment").findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Not found" });
      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
      appointment.status = "cancelled";
      await appointment.save();
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("doctor", "admin"),
  async (req, res) => {
    try {
      const appointment = await require("../models/Appointment").findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Not found" });
      appointment.status = req.body.status;
      await appointment.save();
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
//-----
router.put("/:id/propose", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const Notification = require("../models/Notification");

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name")
      .populate("doctor", "name");

    if (!appointment) return res.status(404).json({ message: "Not found" });

    appointment.proposedDate = req.body.proposedDate;
    appointment.proposedBy = req.user._id;
    appointment.status = "pending";
    await appointment.save();

    await Notification.create({
      user: appointment.patient._id,
      title: "Appointment reschedule proposed",
      message: `Dr. ${appointment.doctor.name} has proposed a new date for your appointment.`,
      type: "appointment_approved"
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/accept-proposal", protect, authorizeRoles("patient"), async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Not found" });
    appointment.appointmentDate = appointment.proposedDate;
    appointment.proposedDate = null;
    appointment.status = "approved";
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;