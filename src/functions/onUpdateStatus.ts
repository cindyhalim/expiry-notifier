import { notion } from "@services";
import { ItemStatus, middyfy } from "@utils";

type onUpdateStatusPayload = {
  id: string;
  status: ItemStatus;
};
export const controller = async (
  input: onUpdateStatusPayload
): Promise<void> => {
  const { status, id } = input;

  await notion.updateItemStatus({ pageId: id, newStatus: status });
};

export const handler = middyfy(controller);
