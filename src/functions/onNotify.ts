import { middyfy, NotionItem } from "@utils";
// import { twilio } from "@services";

// const formatTextMessageBody = ({
//   item,
//   date,
//   type,
// }: {
//   item: string;
//   date: string;
//   type: NotificationType;
// }) => {
//   const formattedDate = DateTime.fromFormat(date, "yyyy-MM-dd").toFormat("DDD");
//   switch (type) {
//     case "reminder":
//       return `\n❗️ Reminder: upcoming event ${item} on ${formattedDate} `;
//     case "expiry":
//     default:
//       return `😱 ${item} is expiring on ${formattedDate}– make sure to renew on time!!`;
//   }
// };

const onNotify = async ({ title, expiryDate }: NotionItem) => {
  console.log("in onNotify", { title, expiryDate });
  // try {
  //   const messageBody = formatTextMessageBody({ item, date, type });
  //   await twilio.sendTextMessage(messageBody);
  //   return true;
  // } catch (e) {
  //   console.error("Error sending text message");
  //   throw new Error(`Error sending text message: ${e.message}`);
  // }
};

export default middyfy(onNotify);
