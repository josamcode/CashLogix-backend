const express = require("express");
const router = express.Router();
const { verifyToken, allowAdminOnly } = require("../middlewares/auth");
const User = require("../models/user");
const sendPushNotification = require("../notifications/pushNotifications");

router.post("/send-notification", verifyToken, allowAdminOnly, async (req, res) => {
  const { title, body } = req.body;

  try {
    const users = await User.find({ usertype: "user" });

    for (const user of users) {
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, { title, body });
      }
    }

    res.status(200).json({ message: "Notifications sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/save-fcm-token", verifyToken, async (req, res) => {
  const { fcmToken } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, { fcmToken });
    res.status(200).json({ message: "FCM Token saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

