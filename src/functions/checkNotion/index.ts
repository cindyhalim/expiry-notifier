import { handlerPath } from "@utils";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatementsInherit: true,
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
};
