import { notion } from "@services";
import { ItemStatus, middyfy } from "@utils";

type OnUpdateStatusInput = {
  id: string;
  status: ItemStatus;
};
export const controller = async (input: OnUpdateStatusInput): Promise<void> => {
  const { status, id } = input;

  await notion.updateItemStatus({ pageId: id, newStatus: status });
};

export const handler = middyfy(controller);
