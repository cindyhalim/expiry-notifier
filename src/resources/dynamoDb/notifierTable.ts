import { AWS } from "@serverless/typescript";

export const notifierTable: AWS["resources"]["Resources"] = {
  NotifierTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "${self:provider.environment.NOTIFIER_TABLE_NAME}",
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [
        {
          AttributeName: "itemId",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "itemId",
          KeyType: "HASH",
        },
      ],
    },
  },
};
