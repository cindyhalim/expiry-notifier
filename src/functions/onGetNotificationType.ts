import type * as AWS from "aws-sdk";
import { middyfy, NotificationType, NotionItem } from "@utils";

type OnGetNotificationTypeInput = NotionItem & {
  dynamoDb: AWS.DynamoDB.DocumentClient.GetItemOutput;
};

type OnGetNotificationTypeOutput = {
  id: string;
  title: string;
  expiryDate: string;
  notificationType: NotificationType;
};

export const controller = async (
  input: OnGetNotificationTypeInput
): Promise<OnGetNotificationTypeOutput> => {
  const { dynamoDb, ...restofInput } = input;

  if (!dynamoDb.Item?.itemId) {
    return {
      ...restofInput,
      notificationType: NotificationType.FIRST_REMINDER,
    };
  }

  return {
    ...restofInput,
    notificationType: NotificationType.FOLLOW_UP,
  };
};

export const handler = middyfy(controller);
