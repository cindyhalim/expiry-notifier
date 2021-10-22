import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";

const serverlessConfiguration: AWS = {
  service: "expiry-notifier",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
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
      NOTION_TOKEN_SSM_NAME: "/${self:service}/notion-token",
      NOTION_DATABASE_ID_SSM_NAME: "/${self:service}/notion-database-id",
      NOTION_TOKEN: "${ssm:${self:provider.environment.NOTION_TOKEN_SSM_NAME}}",
      NOTION_DATABASE_ID:
        "${ssm:${self:provider.environment.NOTION_DATABASE_ID_SSM_NAME}}",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { hello },
};

module.exports = serverlessConfiguration;
