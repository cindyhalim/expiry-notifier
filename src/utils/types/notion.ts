export enum NotificationType {
  FIRST_REMINDER = "first_reminder",
  FOLLOW_UP = "follow_up",
}

export enum ItemStatus {
  GOOD = "good",
  EXPIRING = "expiring",
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
