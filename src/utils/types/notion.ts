export type NotificationType = "expiry" | "reminder";

export enum ItemStatus {
  GOOD = "good",
  EXPIRING_SOON = "expiring soon",
  NOTIFIED = "notified",
  RENEWED = "renewed",
  EXPIRED = "expired",
  MISSING_PROPERTIES = "missing properties",
}

export type NotionItem = {
  id: string;
  title: string | null;
  expiryDate: string | null;
  notifyBeforeInMonths: number;
  status: ItemStatus | null;
};
