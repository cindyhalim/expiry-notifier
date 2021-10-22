import "source-map-support/register";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
  middyfy,
} from "@utils";
import schema from "./schema";
import { notion } from "@services";

const checkNotion: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const items = await notion.getItemsFromDatabase();
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    items,
  });
};

export const main = middyfy(checkNotion);
