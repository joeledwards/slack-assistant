# slack-assistant

A Slack assistant bot which responds in threads and persists conversation history for context.

## Configuration

The following environment variables are used to configure the Lambda.

* `SLACK_ASSISTANT_DYNAMODB_TABLE`    - The URI of the storage resource (Redis URL or DynamoDB ARN).
* `SLACK_ASSISTANT_OPENAI_API_KEY`    - The URI of the storage resource (Redis URL or DynamoDB ARN).
* `SLACK_ASSISTANT_SLACK_SIGNING_KEY` - The key to use for verifying that events requests source from Slack.
* `SLACK_ASSISTANT_SLACK_WEBHOOK`     - The webhook for sending messages to a specific channel in slack.

## Deployment / Infrastructure

Slack assistant is meant to run on AWS Lambda in function URL mode, persisting conversation context to AWS DynamoDB. You will need to have a local AWS profile configured which has permission to deploy a new Lambda and create a DynamoDB table.

### Lambda

The default name for the lambda is `slack_assistant`. You can customize this in `serverless.yaml`.

### DynamoDB Table

The DynamoDB table is a partition key-only table, which must have the following schema:
- `key`: `S`  - primary key column
- `data`: `S` - payload column

The default name for the table is `slack_assistant`. You can customize this in `serverless.yaml`, but you need also need to update the value in the `SLACK_ASSISTANT_DYNAMODB_TABLE` environment variable sent to the lambda is also updated.

