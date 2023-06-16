# slack-assistant

A Slack assistant bot which responds in threads and persists conversation history for context.

## Configuration

The following environment variables are used to configure the Lambda.

* `ENV` - The environment in which to run. One of `prod`, `test`. Default is `test`.
* `PERSISTENCE_URI` - The URI of the storage resource (Redis URL or DynamoDB ARN).
* `SLACK_SIGNING_KEY` - The key to use for verifying that events requests source from Slack.
