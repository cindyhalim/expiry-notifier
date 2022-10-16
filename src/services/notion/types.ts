import { ItemStatus } from "@utils";

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
      start: string | null; // "2025-01-03"
      end: null;
      time_zone: null;
    };
  };
  "notify in (months before)": {
    id: string;
    type: "number";
    number: number | null;
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
          content: string | null;
          link: null;
        };
      }
    ];
  };
};
