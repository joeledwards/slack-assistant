module.exports = {
  eventSubscriptionHandler
}

const { queryAssistant } = require('../assistant')

/**
 * Queries the assistant and sends the response to slack.
 *
 * context: app context
 * event: slack event
 */
async function eventSubscriptionHandler ({ context, event }) {
  context.logger.info('Querying the assistant')
  const { message } = await queryAssistant({ context, event })

  context.logger.info('Sending response to Slack')
  await context.services.slack.sendResponse({ context, event, message })

  context.logger.info(`Sending receipt.`)
  return { status: 201, data: { message: "Prompt received" } }
}
