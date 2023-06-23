module.exports = {
  getContext,
}

const persistence = require('./persistence')
const model = require('./assistant/model')
const slack = require('./slack/message')
const systemInfo = require('./systemInfo')

async function getContext ({ requestId, isTest, config = { } }) {
  const context = {
    requestId,
    isTest,
    config: {
      model: {
        openai: {
        }
      },
      persistence: {
        dynamodb: {
        }
      },
      slack: {
      },
    }
  }

  if (isTest) {
    context.config.slack.signingKey = (config.slack || {}).signingKey || 'slack-signing-key'
    context.systemInfo = await systemInfo.test()
    context.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
      trace: () => {}
    }
    context.services = {
      model:        (config.services || {}).model       || await       model.test(),
      persistence:  (config.services || {}).persistence || await persistence.test(),
      slack:        (config.services || {}).slack       || await       slack.test(),
    }
  } else {
    context.config.model.openai.apiKey        = process.env.SLACK_ASSISTANT_OPENAI_API_KEY
    context.config.persistence.dynamodb.table = process.env.SLACK_ASSISTANT_DYNAMODB_TABLE
    context.config.slack.signingKey           = process.env.SLACK_ASSISTANT_SLACK_SIGNING_KEY
    context.config.slack.webhook              = process.env.SLACK_ASSISTANT_SLACK_WEBHOOK
    context.config.systemMessage              = process.env.SLACK_ASSISTANT_SYSTEM_MESSAGE

    context.systemInfo = await systemInfo.prod({ context })
    context.logger     = console

    context.services   = {
      model:       await       model.prod({ context }),
      persistence: await persistence.prod({ context }),
      slack:       await       slack.prod({ context }),
    }
  }

  return context
}
