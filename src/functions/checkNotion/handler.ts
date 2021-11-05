import "source-map-support/register";
import * as StepFunctions from "aws-sdk/clients/stepfunctions";
import { v4 as uuidv4 } from "uuid";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
  middyfy,
} from "@utils";
import schema from "./schema";
import { notion } from "@services";

const stepFunctions = new StepFunctions();

const checkNotion: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async () => {
    const items = await notion.getItemsFromDatabase();
    const stateExecutions = items.map((item) =>
      stepFunctions
        .startExecution({
          stateMachineArn: process.env.NOTIFIER_STATE_MACHINE_ARN,
          name: uuidv4(),
          input: JSON.stringify(item),
        })
        .promise()
    );
    await Promise.all(stateExecutions);
    return formatJSONResponse({
      items,
    });
  };

export const main = middyfy(checkNotion);
