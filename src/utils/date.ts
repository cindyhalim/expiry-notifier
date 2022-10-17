import { DateTime } from "luxon";

const getRoundedDiffInMonths = ({ date }: { date: DateTime }) => {
  const currentDate = DateTime.now();
  const { months: diffInMonths } = date.diff(currentDate, "months").toObject();

  return Math.round(diffInMonths);
};

const expiryDateToDateTime = ({ date }: { date: string }) =>
  DateTime.fromFormat(date, "yyyy-MM-dd");

export const date = {
  getRoundedDiffInMonths,
  expiryDateToDateTime,
};
