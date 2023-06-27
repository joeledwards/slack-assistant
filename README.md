# slack-assistant

A Slack assistant bot which responds in threads and persists conversation history for context.

## Configuration

The following environment variables are used to configure the Lambda.

* `SLACK_ASSISTANT_DYNAMODB_TABLE_NAME`   - The name of the DynamoDB table to use for .
* `SLACK_ASSISTANT_OPENAI_API_KEY`        - The authentication key for the Open AI API.
* `SLACK_ASSISTANT_OPENAI_MODEL`          - The Open AI model to use (default is gpt-3.5-turbo-16k).
* `SLACK_ASSISTANT_OPENAI_SYSTEM_MESSAGE` - An optional, custom system message to tune the behavior of the model's response.
* `SLACK_ASSISTANT_OPENAI_TEMPERATURE`    - A floating-point value between 0 and 2 which adjusts the randomness of the response (higher values are more random).
* `SLACK_ASSISTANT_SLACK_SIGNING_KEY`     - The key to use for verifying that events requests source from Slack.
* `SLACK_ASSISTANT_SLACK_WEBHOOK`         - The webhook for sending messages to a specific channel in slack.

## Deployment / Infrastructure

Slack assistant is meant to run on AWS Lambda in function URL mode, persisting conversation context to AWS DynamoDB table. You will need to have a local AWS profile configured which has permission to deploy a new Lambda and create a DynamoDB table.

### Deploy / Update

To deploy, run

```shell
npm run deploy
```

### Remove deployment

To remove the deployment, and clean up cloud resources

```shell
npm run remove
```


### Config Customization

You can create the `config.yaml` file if you wish to customize your deployment.

### AWS Profile

You can specy which AWS configuration profile to use for deployment via `config.awsProfile` in `config.yml`.

### Lambda

The default name for the lambda is `slack_assistant_<stage>`. You can customize this via `config.lambdaFunctionName` in `config.yml`.

The default timeout for the lambda is `120` seconds. You can customize this via `config.lambdaFunctionTimeout` in `config.yml`

### DynamoDB Table

The DynamoDB table is a partition-key-only table, which must have the following schema:
- `key`: `S` - partition key

The default name for the table is `slack_assistant_conversation_history_<stage>`. You can customize this via `config.dynamodbTableName` in `config.yml`.

