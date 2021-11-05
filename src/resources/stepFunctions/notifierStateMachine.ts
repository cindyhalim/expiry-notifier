export const notifierStateMachine = {
  id: "notifierStateMachine",
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
      },
      CheckDateRequirements: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["checkDateRequirements", "Arn"] },
        Retry: [
          {
            ErrorEquals: ["States.ALL"],
            IntervalSeconds: 1,
            MaxAttempts: 3,
            BackoffRate: 1.5,
          },
        ],
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
        End: true,
      },
    },
  },
};
