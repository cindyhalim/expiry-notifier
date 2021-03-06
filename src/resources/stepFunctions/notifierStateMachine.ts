import { Serverless } from "@utils";

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
      StartAt: "CheckAlreadyNotified",
      States: {
        CheckAlreadyNotified: {
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
          Next: "VerifyAlreadyNotified",
        },
        VerifyAlreadyNotified: {
          Type: "Choice",
          Choices: [
            {
              Variable: "$.dynamoDb.Item.itemId",
              IsPresent: false,
              Next: "CheckDateRequirements",
            },
            {
              Variable: "$.dynamoDb.Item.itemId",
              IsPresent: true,
              Next: "SkipNotify",
            },
          ],
          Retry: retrier,
        },
        CheckDateRequirements: {
          Type: "Task",
          Resource: { "Fn::GetAtt": ["onCheckDateRequirements", "Arn"] },
          Retry: retrier,
          ResultPath: "$.meetsDateRequirements",
          Next: "VerifyDateRequirements",
        },
        VerifyDateRequirements: {
          Type: "Choice",
          Choices: [
            {
              Variable: "$.meetsDateRequirements",
              BooleanEquals: true,
              Next: "Notify",
            },
            {
              Variable: "$.meetsDateRequirements",
              BooleanEquals: false,
              Next: "SkipNotify",
            },
          ],
          Retry: retrier,
        },
        SkipNotify: {
          Type: "Pass",
          End: true,
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
              isNotified: { "BOOL.$": "$.isNotified" },
              timestamp: { S: new Date() },
            },
          },
          Retry: retrier,
          End: true,
        },
      },
    },
  },
};
