module.exports = {
  eventSubscriptionHandler
}

const { queryAssistant } = require('../assistant')

async function eventSubscriptionHandler ({ context, event, bgTask }) {
  async function doInBackground () {
    try {
      context.logger.info('Querying the assistant')
      const { message } = await queryAssistant({ context, event })

      context.logger.info('Sending response to ')
      await context.services.slack.sendResponse({ message })
    } catch (error) {
      context.logger.error('An error occurred while querying the assistant', error)
    }
  }

  const doLater = bgTask ? bgTask : doInBackground

  process.nextTick(doLater)

  context.logger.info(`Sending response and engaging the assistant in the background.`)
  return { status: 201, data: { message: "Prompt received" } }
}
