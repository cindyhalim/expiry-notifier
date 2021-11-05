import "source-map-support/register";

import { middyfy } from "@utils";
import { dynamoDb } from "@services";

const checkIsNotfied = async ({ id }) => {
  const item = await dynamoDb.getById(id);

  if (!item) {
    console.log(`No records found for item id: ${id}`);
  }

  return Boolean(item);
};

export const main = middyfy(checkIsNotfied);
