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
              Comment: "Expiring soon path",
              Variable: "$.status",
              StringEquals: ItemStatus.EXPIRING_SOON,
              Next: "Notify",
            },
            {
              Comment: "Notified path",
              Variable: "$.status",
              StringEquals: ItemStatus.NOTIFIED,
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
          Retry: retrier,
          ResultPath: "$.dynamoDb",
          Next: "ShouldNotify",
        },
        ShouldNotify: {
          Type: "Choice",
          Choices: [
            {
              Variable: "$.dynamoDb.Item.lastNotified",
              IsPresent: false,
              Next: "Notify",
            },
            {
              Variable: "$.dynamoDb.Item.lastNotified",
              IsPresent: true,
              Next: "SkipNotify",
            },
          ],
        },
        Notify: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onNotify", "Arn"] },
          ResultPath: "$.isNotified",
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
        SkipNotify: {
          Type: "Pass",
          End: true,
        },
      },
    },
  },
};
