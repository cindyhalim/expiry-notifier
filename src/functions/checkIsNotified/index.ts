import { handlerPath } from "@utils";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatementsInherit: true,
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamoDb:GetItem"],
      Resource: [{ "Fn::GetAtt": ["NotifierTable", "Arn"] }],
    },
  ],
};
