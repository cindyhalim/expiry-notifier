import { DateTime } from "luxon";
import { ItemStatus, middyfy, type NotionItem } from "@utils";

const getShouldBeNotified = ({
  notifyBeforeInMonths,
  expiryDateTime,
  currentDate,
}: {
  notifyBeforeInMonths: number;
  expiryDateTime: DateTime;
  currentDate: DateTime;
}) => {
  const { months: diffInMonths } = expiryDateTime
    .diff(currentDate, "months")
    .toObject();
  const roundedDiff = Math.round(diffInMonths);

  return roundedDiff >= 0 && roundedDiff <= notifyBeforeInMonths;
};

export const controller = async (item: NotionItem): Promise<NotionItem> => {
  const { expiryDate, title, notifyBeforeInMonths, status } = item;

  if (!expiryDate || !title) {
    return {
      ...item,
      status: ItemStatus.MISSING_PROPERTIES,
    };
  }

  const expiryDateTime = DateTime.fromFormat(expiryDate, "yyyy-MM-dd");
  const currentDate = DateTime.now();

  if (expiryDateTime <= currentDate) {
    return {
      ...item,
      status: ItemStatus.EXPIRED,
    };
  }

  const shouldBeNotified = getShouldBeNotified({
    expiryDateTime,
    currentDate,
    notifyBeforeInMonths,
  });

  if (status === ItemStatus.NOTIFIED && shouldBeNotified) {
    return item;
  }

  if (shouldBeNotified) {
    return { ...item, status: ItemStatus.EXPIRING_SOON };
  }

  return { ...item, status: ItemStatus.GOOD };
};

export const handler = middyfy(controller);
