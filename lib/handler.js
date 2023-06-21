module.exports = makeHandler()

const { getContext } = require('./context')
const { validateSignature } = require('./slack/auth')
const { handleChallenge } = require('./slack/challenge')
const { eventSubscriptionHandler } = require('./slack/event')

/**
 * config - handler configuration
 * config.isTest - true if this is a unit test, otherwise false
 * config.idGen - the request ID generator function
 * config.services - injected services for testing
 * config.services.openai - openai sdk for testing
 * config.services.persistence - persistence for testing
 * config.services.slack - slack sdk for testing
 */
async function makeHandler (config = {}) {
  const {
    idGen = () => uuid.v4(),
  } = config

  async function handler ({ event, context }) {
    const requestId = idGen()

    const { status, data } = await slackHandler({ event, context })

    return {
      status,
      headers: {
        'content-type': 'application/json',
        'x-request-id': requestId,
      },
      body: JSON.stringify(data),
    }
  }

  /**
   * Handles a Slack subscription event from the Lambda webhook.
   */
  async function slackHandler ({ requestId, event, context: lambdaContext }) {

    try {
      const context = await getContext({ requestId, config })

      const { 
        valid: signatureValid,
        reasons = [],
      } = await validateSignature({ context, event })

      if (signatureValid !== true) {
        context.logger.warn(`[RQ=${requestId}] Invalid signature: ${reasons.map(r => `'${r}'`).join(', ')}`)
        return { status: 401, data: { requestId, message: "Invalid signature", reasons }  }
      }

      let raw = event.body
      let json
      try {
        json = JSON.parse(event.body)
      } catch (error) {
        context.logger.warn(`[RQ=${requestId}] Requeset body is not valid JSON`)
        return { status: 400, { requestId, message: 'Request body was not valid JSON' } }
      }

      const {
        type: eventType,
        event: { type: subEventType } = {},
      } = json

      if (eventType === 'url_verification') {
        await handleChallenge({ context, event })
      } else if (eventType === 'event_callback') {
        if (subEventType === 'event_callback') {
          await eventSubscriptionHandler({ context, event })
        } else {
          context.logger.warn(`[RQ=${requestId}] Unsupported subscription event type: '${eventType}'`)
          return { status: 400, { requestId, message: `Unsupported subscription event type: '${subEventType}'` } }
        }
      } else {
        context.logger.warn(`[RQ=${requestId}] Unsupported event type: '${eventType}'`)
        return { status: 400, { requestId, message: `Unsupported event type: '${eventType}'` } }
      }
    } catch (error) {
      console.error(`[RQ=${requestId}] An unknown error occurred while handling a request:`, error)
      return { status: 500, { requestId, message: "Internal error" } }
    }
  }

  return handler
}
