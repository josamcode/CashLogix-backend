const admin = require("firebase-admin");

try {
  const serviceAccount = require("../firebase-service-account.json");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const sendPushNotification = async (token, payload) => {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      token: token,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent message:", response);
      return { success: true, response };
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.code === 'messaging/registration-token-not-registered') {
        console.log('FCM Token is no longer valid:', token);
        return { success: false, error: error.message, tokenInvalid: true };
      }

      return { success: false, error: error.message };
    }
  };

  module.exports = sendPushNotification;
} catch (error) {
  console.error("Firebase Admin initialization failed:", error);

  const sendPushNotification = async (token, payload) => {
    console.log("Firebase not configured. Notification not sent:", payload);
    return { success: false, error: "Firebase not configured" };
  };

  module.exports = sendPushNotification;
}