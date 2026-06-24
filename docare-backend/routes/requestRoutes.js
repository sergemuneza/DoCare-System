const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createRequest
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "doctor"),
  getAllRequests
);

router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  getMyRequests
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "doctor"),
  updateRequestStatus
);

module.exports = router;