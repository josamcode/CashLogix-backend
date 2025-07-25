const express = require("express");
const router = express.Router();
const { verifyToken, allowAdminOnly } = require("../middlewares/auth");
const User = require("../models/user");
const sendPushNotification = require("../notifications/pushNotifications");

router.post("/send-notification", verifyToken, async (req, res) => {
  const { title, body } = req.body;

  try {
    const users = await User.find({ usertype: "user" });
    let successCount = 0;
    let failedCount = 0;

    for (const user of users) {
      if (user.fcmToken) {
        const result = await sendPushNotification(user.fcmToken, { title, body });

        if (result.success) {
          successCount++;
        } else {
          failedCount++;
          if (result.tokenInvalid) {
            try {
              await User.findByIdAndUpdate(user._id, { $unset: { fcmToken: "" } });
              console.log(`Removed invalid FCM token for user ${user._id}`);
            } catch (dbError) {
              console.error(`Error removing FCM token for user ${user._id}:`, dbError);
            }
          }
        }
      }
    }

    res.status(200).json({
      message: "Notifications processed!",
      success: successCount,
      failed: failedCount
    });
  } catch (err) {
    console.error("Error in send-notification route:", err);
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
    console.error("Error saving FCM token:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;