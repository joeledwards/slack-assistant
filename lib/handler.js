module.exports = slackEventHandler

const { getContext } = require('./context')
const { validateSignature } = require('./slack/auth')
const { handleChallenge } = require('./slack/challenge')
const { eventSubscriptionHandler } = require('./slack/event')

/**
 * Handles a Slack subscription event from the Lambda webhook.
 */
async function slackEventHandler ({
  event
}) {
  const requestId = uuid.v4()

  try {
    const context = await getContext({ requestId })

    // TODO: handle invalid signature (return a 401/403)
    const { 
      signatureValid,
    } = await validateSignature({ context, event })

    if (!signatureValid) {
      return { status: 401, message: "Not authorized" }
    }

    // TODO: determine if the event is a challenge or a subscription event
    const {
      isChallenge,
      isEvent,
    } = {} // ???

    if (isChallenge) {
      // TODO: handle invalid challenge (return a 400)
      await handleChallenge({ context, event })
    } else if (isEvent) {
      // TODO: handle invalid payload (return a 400)
      await eventSubscriptionHandler({ context, event })
    } else {
      return { status: 400, message: "Invalid event" }
    }
  } catch (error) {
    console.error(`[RQ=${requestId}] An unknown error occurred while handling a request:`, error)
    return { status: 500, message: "Internal error" }
  }
}
