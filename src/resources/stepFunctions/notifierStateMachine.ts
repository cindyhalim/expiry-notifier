import { ItemStatus, Serverless } from "@utils";

type StateMachine = Serverless["stepFunctions"]["stateMachines"];

const retrier = [
  {
    ErrorEquals: ["States.ALL"],
    IntervalSeconds: 1,
    MaxAttempts: 3,
    BackoffRate: 1.5,
  },
];

export const notifierStateMachine: StateMachine = {
  NotifierStateMachine: {
    id: "NotifierStateMachine",
    name: "notifier-state-machine-${self:provider.stage}",
    definition: {
      Comment: "Orchestrates notify logic from Notion table",
      StartAt: "GetStatus",
      States: {
        GetStatus: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onGetStatus", "Arn"] },
          Retry: retrier,
          Next: "GetNextPath",
        },
        GetNextPath: {
          Type: "Choice",
          Choices: [
            {
              Comment: "Expiring path",
              Variable: "$.status",
              StringEquals: ItemStatus.EXPIRING,
              Next: "CheckLastNotified",
            },
          ],
          Default: "UpdateStatus",
        },
        CheckLastNotified: {
          Type: "Task",
          Resource: "arn:aws:states:::dynamodb:getItem",
          Parameters: {
            TableName: { Ref: "NotifierTable" },
            Key: {
              itemId: {
                "S.$": "$.id",
              },
            },
          },
          ResultPath: "$.dynamoDb",
          Retry: retrier,
          Next: "GetNotificationType",
        },
        GetNotificationType: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onGetNotificationType", "Arn"] },
          Retry: retrier,
          Next: "Notify",
        },
        Notify: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onNotify", "Arn"] },
          Next: "MarkAsNotified",
          Retry: retrier,
        },
        MarkAsNotified: {
          Type: "Task",
          Resource: "arn:aws:states:::dynamodb:putItem",
          Parameters: {
            TableName: { Ref: "NotifierTable" },
            Item: {
              itemId: { "S.$": "$.id" },
              lastNotified: { S: new Date() },
            },
          },
          Retry: retrier,
          ResultPath: "$.dynamoDb",
          Next: "UpdateStatus",
        },
        UpdateStatus: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onUpdateStatus", "Arn"] },
          Parameters: {
            "id.$": "$.id",
            "status.$": "$.status",
          },
          End: true,
        },
      },
    },
  },
};
