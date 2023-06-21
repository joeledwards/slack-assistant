module.exports = {
  eventSubscriptionHandler
}

const { queryAssistant } = require('../assistant')

async function eventSubscriptionHandler ({ context, event }) {
  async function doInBackground () {
    const { message } = await queryAssistant({ context, event })
    await context.services.slack.sendResponse({ message })
  }

  process.nextTick(doInBackground)

  context.logger.info(`Sending response and engaging the assistant in the background.`)
  return { status: 201, data: { message: "Prompt received" } }
}
