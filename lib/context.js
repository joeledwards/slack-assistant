module.exports = {
  getContext,
}

const uuid = require('uuid')
const model = require('./assistant/model')
const slack = require('./slack/message')
const systemInfo = require('./systemInfo')
const persistence = require('./persistence')
const { queryAssistant } = require('./assistant')

/**
 * options.isTest - true if this is a unit test, otherwise false
 * options.idGen - the request ID generator function
 * options.config - configuration options
 * options.config.slack - slack config
 * options.config.slack.signingKey - slack signature
 * options.services - injected services for testing
 * options.services.openai - openai sdk for testing
 * options.services.persistence - persistence for testing
 * options.services.slack - slack sdk for testing
 */
async function getContext (options = { }) {
  const {
    isTest,
    idGen = () => uuid.v4(),
    config = {},
    services = {},
  } = options

  const requestId = idGen()

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
      model:        services.model       || await       model.test(),
      persistence:  services.persistence || await persistence.test(),
      slack:        services.slack       || await       slack.test(),
    }
  } else {
    context.config.dynamodb.tableName   = process.env.SLACK_ASSISTANT_DYNAMODB_TABLE_NAME
    context.config.openai.apiKey        = process.env.SLACK_ASSISTANT_OPENAI_API_KEY
    context.config.openai.model         = process.env.SLACK_ASSISTANT_OPENAI_MODEL
    context.config.openai.systemMessage = process.env.SLACK_ASSISTANT_OPENAI_SYSTEM_MESSAGE
    context.config.openai.temperature   = process.env.SLACK_ASSISTANT_OPENAI_TEMPERATURE
    context.config.slack.signingKey     = process.env.SLACK_ASSISTANT_SLACK_SIGNING_KEY
    context.config.slack.webhook        = process.env.SLACK_ASSISTANT_SLACK_WEBHOOK

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
