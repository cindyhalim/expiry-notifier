import schema from "./schema";
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
      http: {
        method: "post",
        path: "checkNotion",
        request: {
          schema: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
