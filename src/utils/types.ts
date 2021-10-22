export type ItemType = "expiry" | "reminder";

export interface ItemModel {
  id: string;
  item: string;
  date: string;
  type?: ItemType | null;
  notifyIn?: number | null;
}
