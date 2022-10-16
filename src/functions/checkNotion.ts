import "source-map-support/register";
import * as StepFunctions from "aws-sdk/clients/stepfunctions";
import { v4 as uuidv4 } from "uuid";

import { notion } from "@services";

const stepFunctions = new StepFunctions();

export const main = async () => {
  try {
    const items = await notion.getItems();

    // const stateExecutions = items
    //   .filter((item) => item)
    //   .map((item) =>
    //     stepFunctions
    //       .startExecution({
    //         stateMachineArn: process.env.NOTIFIER_STATE_MACHINE_ARN,
    //         name: uuidv4(),
    //         input: JSON.stringify(item),
    //       })
    //       .promise()
    //   );

    const stateExecutionsTest = items.filter((item) => item);

    const stateExecutions = [stateExecutionsTest[0]].map((item) =>
      stepFunctions
        .startExecution({
          stateMachineArn: process.env.NOTIFIER_STATE_MACHINE_ARN,
          name: uuidv4(),
          input: JSON.stringify(item),
        })
        .promise()
    );

    return await Promise.all(stateExecutions);
  } catch (e) {
    throw new Error(`Error in checkNotion: ${e.message}`);
  }
};
