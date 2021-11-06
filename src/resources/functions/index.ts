import { Serverless } from "step-functions-types";

export const functions: Serverless["functions"] = {
  checkNotion: {
    handler: "src/functions/checkNotion/handler.main",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["states:startExecution"],
        Resource: [{ Ref: "NotifierStateMachine" }],
      },
    ],
    events: [
      {
        schedule: {
          rate: ["cron(0 0 1 * ? *)"],
          enabled: true,
        },
      },
    ],
  },
  onCheckDateRequirements: {
    handler: "src/functions/onCheckDateRequirements/handler.main",
  },
  onNotify: {
    handler: "src/functions/onNotify/handler.main",
  },
};
