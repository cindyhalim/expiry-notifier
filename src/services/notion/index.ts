import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { ItemStatus, type NotionItem } from "@utils";
import { type ExpiryNotifierItemProperties } from "./types";

const client = new Client({ auth: process.env.NOTION_TOKEN });

const getItems = async (): Promise<(NotionItem | null)[]> => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const response = await client.databases.query({ database_id: databaseId });
  const items = response.results.map((page: PageObjectResponse) => {
    const properties =
      page.properties as unknown as ExpiryNotifierItemProperties;

    if (!properties) return null;

    return {
      id: page.id,
      title: properties.item.title[0].text.content || null,
      expiryDate: properties["expiry date"].date.start || null,
      notifyBeforeInMonths: properties["notify in (months before)"].number || 1,
      status: properties["status"].select?.name || null,
    };
  });

  return items;
};

const updateItemStatus = async ({
  pageId,
  newStatus,
}: {
  pageId: string;
  newStatus: ItemStatus;
}) => {
  try {
    await client.pages.update({
      page_id: pageId,
      properties: {
        status: {
          select: {
            name: newStatus,
          },
        },
      },
    });
  } catch (e) {
    console.log(`Error updating item ${pageId} status`, e);
  }
};

export const notion = {
  getItems,
  updateItemStatus,
};
