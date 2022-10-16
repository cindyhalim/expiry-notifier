export enum ItemStatus {
  GOOD = "good",
  EXPIRING_SOON = "expiring soon",
  NOTIFIED = "notified",
  RENEWED = "renewed",
  EXPIRED = "expired",
}

type INotionItemStatus = {
  id: string;
  name: ItemStatus;
  color: string;
};

export type ExpiryNotifierItemProperties = {
  "expiry date": {
    id: string;
    type: "date";
    date: {
      start: string; // "2025-01-03"
      end: null;
      time_zone: null;
    };
  };
  "notify in (months before)": {
    id: string;
    type: "number";
    number: number;
  };
  status: {
    id: string;
    type: "select";
    select: INotionItemStatus | null;
  };
  item: {
    id: "title";
    type: "title";
    title: [
      {
        type: "text";
        text: {
          content: string;
          link: null;
        };
      }
    ];
  };
};
