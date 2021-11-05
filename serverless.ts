import type { AWS } from "@serverless/typescript";

import {
  checkNotion,
  checkDateRequirements,
  checkIsNotified,
  onNotify,
} from "@functions";
import { notifierTable, notifierStateMachine } from "@resources";

const serverlessConfiguration: AWS = {
  service: "expiry-notifier",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: [
    "serverless-webpack",
    "serverless-step-functions",
    "serverless-iam-roles-per-function",
  ],
  provider: {
    name: "aws",
    region: "us-east-2",
    stage: "dev",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NOTION_TOKEN: "${ssm:/${self:service}/notion-token}",
      NOTION_DATABASE_ID: "${ssm:/${self:service}/notion-database-id}",
      TWILIO_ACCOUNT_SID: "${ssm:/${self:service}/twilio-account-sid}",
      TWILIO_AUTH_TOKEN: "${ssm:/${self:service}/twilio-auth-token}",
      TWILIO_PHONE_NUMBER: "${ssm:/${self:service}/twilio-phone-number}",
      PHONE_NUMBER: "${ssm:/${self:service}/phone-number}",
      NOTIFIER_TABLE_NAME: "notifier-table-${self:provider.stage}",
      // TODO: use reference and avoid circular dep
      NOTIFIER_STATE_MACHINE_ARN:
        "arn:aws:states:us-east-2:807602962743:stateMachine:notifier-state-machine-dev",
    },
    lambdaHashingVersion: "20201221",
  },
  functions: { checkNotion, checkDateRequirements, checkIsNotified, onNotify },
  //@ts-ignore
  stepFunctions: { stateMachines: { notifierStateMachine } },
  resources: {
    Resources: {
      ...notifierTable,
    },
    Outputs: {
      NotifierStateMachineARN: {
        Value: {
          Ref: "NotifierStateMachine",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
