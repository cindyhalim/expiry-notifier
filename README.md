# Expiry Notifier

### Description

Simple notification tool that sends early reminders via text message based on items from a Notion table. The primary use case is to remind events that can expire and is tedious/time consuming to renew. Built using Serverless with AWS (Step Functions, DynamoDB, Lambda), Notion API, and Twilio API.

### Installation/deployment instructions

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

**Notion Setup**:

- Create a Notion table with the following properties:
  ! [Notion Table Template](assets/notion-table-sample.png) - `item`: Text property | the event you want to be reminded for. - `type`: Select property | `expiry` or `reminder`; default is `expiry` - `date`: Date property | due date/expiry date of item - `notifyIn`: Number property | remind me in X months; default is `1`.

**Dev Setup**:

The following parameters are required in AWS Systems Manager Parameter Store prior to stack deployment:

- `notion-token`: Notion's integration token. Refer to their API docs on how to set this up.
- `notion-database-id`: the unique identifier of the Notion table
- `twilio-auth-token`
- `twilio-account-sid`
- `twilio-phone-number`: the number used to send the text message
- `phone-number`: the number that will receive the text message

#### Using NPM:

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

#### Using Yarn:

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Notion Table Setup:

### Notifier State Machine Orchestrator

1. On the first day of the month, `checkNotion` handler queries the Notion table

### Improvements
