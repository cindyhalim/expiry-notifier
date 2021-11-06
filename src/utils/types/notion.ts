export type NotificationType = "expiry" | "reminder";

export interface NotionItem {
  id: string;
  item: string;
  date: string;
  type?: NotificationType | null;
  notifyIn?: number | null;
}
