module.exports = {
  getContext,
}

const persistence = require('lib/persistence')
const model = require('lib/assistant/model')
const systemInfo = require('lib/systemInfo')

async function getContext ({ requestId, isTest, config }) {
  const context = {}

  context.requestId = requestId
  context.isTest    = isTest
  context.logger    = console

  if (isTest) {
    context.config.slack.signingKey = config.slack.signingKey || 'slack-signing-key'
    context.systemInfo = await systemInfo.test()
    context.services = {
      model       = config.services.model       || await       model.test(),
      persistence = config.services.persistence || await persistence.test(),
      slack       = config.services.slack       || await       slack.test(),
    }
  } else {
    context.config.model.openai.apiKey        = process.env.SLACK_ASSISTANT_OPENAI_API_KEY
    context.config.persistence.dynamodb.table = process.env.SLACK_ASSISTANT_DYNAMODB_TABLE
    context.config.slack.signingKey           = process.env.SLACK_ASSISTANT_SLACK_SIGNING_KEY
    context.config.slack.webhook              = process.env.SLACK_ASSISTANT_SLACK_WEBHOOK
    context.config.systemMessage              = process.env.SLACK_ASSISTANT_SYSTEM_MESSAGE

    context.systemInfo = await systemInfo.prod({ context })

    context.services = {
      model:       await       model.prod({ context }),
      persistence: await persistence.prod({ context }),
      slack:       await       slack.prod({ context }),
    }
  }

  return context
}
