import { Serverless } from "@utils";

const functions: Serverless["functions"] = {
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
        http: {
          method: "get",
          path: "/test",
        },
      },
      // {
      //   schedule: {
      //     rate: "cron(0 0 1 * ? *)",
      //     enabled: true,
      //   },
      // },
    ],
  },
  onGetStatus: {
    handler: "src/functions/onGetStatus.handler",
  },
  onUpdateStatus: {
    handler: "src/functions/onUpdateStatus.handler",
  },
  onNotify: {
    handler: "src/functions/onNotify.main",
  },
};

export default functions;
