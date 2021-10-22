import { Client } from "@notionhq/client";
import { ItemModel } from "@utils";

const client = new Client({ auth: process.env.NOTION_TOKEN });

const getItemsFromDatabase = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const response = await client.databases.query({ database_id: databaseId });

  const items: ItemModel[] = response.results
    .map(({ id, properties }) => ({
      id,
      item: properties.item["title"][0]?.plain_text || null,
      date: properties.date["date"]?.start || null,
      type: properties.type["select"]?.name || null,
      notifyIn: properties.notifyIn["number"],
    }))
    .filter(({ item, date }) => item && date);

  return items;
};

export const notion = {
  getItemsFromDatabase,
};
