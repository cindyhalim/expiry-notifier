export const notifierStateMachine = {
  id: "NotifierStateMachine",
  name: "notifier-state-machine-${self:provider.stage}",
  definition: {
    Comment: "Orchestrates notify logic from Notion database records",
    StartAt: "CheckAlreadyNotified",
    States: {
      //TODO: replace this to get item directly in state matchine
      CheckAlreadyNotified: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["checkIsNotified", "Arn"] },
        Retry: [
          {
            ErrorEquals: ["States.ALL"],
            IntervalSeconds: 1,
            MaxAttempts: 3,
            BackoffRate: 1.5,
          },
        ],
        ResultPath: "$.isNotified",
        Next: "VerifyAlreadyNotified",
      },
      VerifyAlreadyNotified: {
        Type: "Choice",
        Choices: [
          {
            Variable: "$.isNotified",
            BooleanEquals: false,
            Next: "CheckDateRequirements",
          },
          {
            Variable: "$.isNotified",
            BooleanEquals: true,
            Next: "EndEarly",
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
            Next: "EndEarly",
          },
        ],
      },
      //TODO: give output message so clearer indiciation
      // ex: Already notified, Does not meet date requirements
      EndEarly: {
        Type: "Pass",
        End: true,
      },
      Notify: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["onNotify", "Arn"] },
        Next: "MarkAsNotified",
      },
      MarkAsNotified: {
        Type: "Task",
        Resource: "arn:aws:states:::dynamodb:putItem",
        Paramters: {
          TableName: { Ref: "NotifierTable" },
          Item: {
            itemId: { S: "$.id" },
            isNotified: { BOOL: true },
          },
        },
        End: true,
      },
    },
  },
};
