import { DateTime } from "luxon";
import { date, ItemStatus, middyfy, type NotionItem } from "@utils";

const getShouldBeNotified = ({
  notifyBeforeInMonths,
  expiryDateTime,
}: {
  notifyBeforeInMonths: number;
  expiryDateTime: DateTime;
}) => {
  const roundedDiff = date.getRoundedDiffInMonths({ date: expiryDateTime });
  return roundedDiff >= 0 && roundedDiff <= notifyBeforeInMonths;
};

export const controller = async (item: NotionItem): Promise<NotionItem> => {
  const { expiryDate, title, notifyBeforeInMonths } = item;

  if (!expiryDate || !title) {
    return {
      ...item,
      status: ItemStatus.MISSING_PROPERTIES,
    };
  }

  const expiryDateTime = date.expiryDateToDateTime({ date: expiryDate });
  const currentDate = DateTime.now();

  if (expiryDateTime <= currentDate) {
    return {
      ...item,
      status: ItemStatus.EXPIRED,
    };
  }

  const shouldBeNotified = getShouldBeNotified({
    expiryDateTime,
    notifyBeforeInMonths,
  });

  if (shouldBeNotified) {
    return { ...item, status: ItemStatus.EXPIRING };
  }

  return { ...item, status: ItemStatus.GOOD };
};

export const handler = middyfy(controller);
