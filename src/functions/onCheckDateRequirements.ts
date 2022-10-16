import { DateTime } from "luxon";
import { middyfy, NotionItem } from "@utils";

const checkDateRequirements = async ({ date, notifyIn }: NotionItem) => {
  const deadline = DateTime.fromFormat(date, "yyyy-MM-dd");
  const currentDate = DateTime.now();
  const notifyInMonths = notifyIn || 1;
  const { months: diffInMonths } = deadline
    .diff(currentDate, "months")
    .toObject();
  const roundedDiff = Math.ceil(diffInMonths);

  return Boolean(roundedDiff > 0 && roundedDiff <= notifyInMonths);
};

export default middyfy(checkDateRequirements);
