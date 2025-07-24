const cron = require("node-cron");
const User = require("../models/user");
const sendPushNotification = require("./pushNotifications");

const sendDailyReminders = async (timeLabel) => {
  console.log(`Sending daily reminder to users... (${timeLabel})`);

  try {
    const users = await User.find({ usertype: "user" });

    for (const user of users) {
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, {
          title: "CashLogix",
          body: "متنساش تسجل مصاريفك النهاردة ❤️",
        });
      }
    }
  } catch (err) {
    console.error(`Error sending daily notifications (${timeLabel}):`, err);
  }
};

cron.schedule("0 20 * * *", () => sendDailyReminders("8:00 PM"));

// cron.schedule("30 6 * * *", () => sendDailyReminders("6:30 PM"));