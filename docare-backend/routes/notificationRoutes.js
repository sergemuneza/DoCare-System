const express = require("express");
const router = express.Router();
const {
  getMyNotifications, markAsRead,
  markOneAsRead, getUnreadCount
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read-all", protect, markAsRead);
router.put("/:id/read", protect, markOneAsRead);

module.exports = router;