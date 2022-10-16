import { Serverless } from "@utils";

export const functions: Serverless["functions"] = {
  checkNotion: {
    handler: "src/functions/checkNotion.main",
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
          rate: "cron(0 0 1 * ? *)",
          enabled: true,
        },
      },
    ],
  },
  onCheckDateRequirements: {
    handler: "src/functions/onCheckDateRequirements.main",
  },
  onNotify: {
    handler: "src/functions/onNotify.main",
  },
};
