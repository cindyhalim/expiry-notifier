import { DateTime } from "luxon";

import { NotificationType, middyfy, NotionItem } from "@utils";
import { twilio } from "@services";

const formatTextMessageBody = ({
  item,
  date,
  type,
}: {
  item: string;
  date: string;
  type: NotificationType;
}) => {
  const formattedDate = DateTime.fromFormat(date, "yyyy-MM-dd").toFormat("DDD");
  switch (type) {
    case "reminder":
      return `\nāļø Reminder: upcoming event ${item} on ${formattedDate} `;
    case "expiry":
    default:
      return `š± ${item} is expiring on ${formattedDate}ā make sure to renew on time!!`;
  }
};

const onNotify = async ({ item, date, type }: NotionItem) => {
  try {
    const messageBody = formatTextMessageBody({ item, date, type });
    await twilio.sendTextMessage(messageBody);
    return true;
  } catch (e) {
    console.error("Error sending text message");
    throw new Error(`Error sending text message: ${e.message}`);
  }
};

export default middyfy(onNotify);
