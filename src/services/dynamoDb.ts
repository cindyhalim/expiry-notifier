import { DocumentClient } from "aws-sdk/clients/dynamodb";

const db = new DocumentClient();
const tableName = process.env.NOTIFIER_TABLE_NAME;

const getById = async (itemId: string) => {
  try {
    const { Item } = await db
      .get({
        TableName: tableName,
        Key: { itemId },
        ConsistentRead: true,
      })
      .promise();

    if (Item) return Item;

    return null;
  } catch (error) {
    console.error(`Error getting id from ${tableName}`);
    return null;
  }
};

export const dynamoDb = {
  getById,
};
