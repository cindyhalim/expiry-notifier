import { ItemStatus, middyfy, NotificationType } from "@utils";
import { twilio } from "@services";
import { date as dateUtils } from "@utils";

type OnNotifyInput = {
  id: string;
  title: string;
  expiryDate: string;
  notificationType: NotificationType;
};

type OnNotifyOutput = {
  id: string;
  status: ItemStatus;
};

const formatTextMessageBody = ({
  title,
  date,
  type,
}: {
  title: string;
  date: string;
  type: NotificationType;
}) => {
  const expiryDate = dateUtils.expiryDateToDateTime({ date });
  const formattedDate = expiryDate.toFormat("DDD");
  const monthsRemaining = dateUtils.getRoundedDiffInMonths({
    date: expiryDate,
  });
  const monthsRemainingCopy = `${monthsRemaining} month${
    monthsRemaining > 1 ? "s" : ""
  }`;
  switch (type) {
    case NotificationType.FOLLOW_UP:
      return `\n❗️ Reminder: ${title} is expiring on ${formattedDate}. You have ${monthsRemainingCopy} remaining `;
    case NotificationType.FIRST_REMINDER:
    default:
      return `${title} is expiring on ${formattedDate} 😱. make sure to renew on time!!`;
  }
};

export const controller = async (
  input: OnNotifyInput
): Promise<OnNotifyOutput> => {
  const { notificationType, title, expiryDate, id } = input;
  try {
    const messageBody = formatTextMessageBody({
      title,
      date: expiryDate,
      type: notificationType,
    });
    await twilio.sendTextMessage(messageBody);
    return {
      id,
      status: ItemStatus.NOTIFIED,
    };
  } catch (e) {
    console.error("Error sending text message:", e);
    return {
      id,
      status: ItemStatus.EXPIRING,
    };
  }
};

export const handler = middyfy(controller);
