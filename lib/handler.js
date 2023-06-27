module.exports = {
  makeLambdaHandler,
  slackEventHandler
}

const { getContext } = require('./context')
const { validateSignature } = require('./slack/auth')
const { handleChallenge } = require('./slack/challenge')
const { eventSubscriptionHandler } = require('./slack/event')

/**
 * Creates a new Lambda handler, wrapping the inner handler, 
 * translating its result into an HTTP response.
 */
function makeLambdaHandler (options = {}) {
  async function handler (event, lambdaContext) {
    const context = await getContext(options)
    const requestId = context.requestId

    const { status, data } = await slackEventHandler({ event, context })

    return {
      status,
      headers: {
        'content-type': 'application/json',
        'x-request-id': requestId,
      },
      body: JSON.stringify(data),
    }
  }

  return handler
}

/**
 * Handles a Slack subscription event from the Lambda webhook.
 *
 * context: app context
 * event: lambda event (HTTP request)
 */
async function slackEventHandler ({ context, event }) {
  const requestId = context.requestId

  try {
    if (event.httpMethod.toLowerCase() !== 'post') {
      return { status: 405, data: { requestId, message: "Method not allowed" } }
    }

    const { 
      valid: signatureValid,
      reasons = [],
    } = await validateSignature({ context, event })

    if (signatureValid !== true) {
      context.logger.warn(`[RQ=${requestId}] Invalid signature: ${reasons.map(r => `'${r}'`).join(', ')}`)
      return { status: 401, data: { requestId, message: "Invalid signature", reasons }  }
    }

    let slackEvent
    try {
      slackEvent = JSON.parse(Buffer.from(event.body).toString())
    } catch (error) {
      context.logger.warn(`[RQ=${requestId}] Requeset body is not valid JSON`)
      return { status: 400, data: { requestId, message: 'Request body was not valid JSON' } }
    }

    const {
      type: eventType,
      event: { type: subEventType } = {},
    } = slackEvent

    if (eventType === 'url_verification') {
      return await handleChallenge({ context, event: slackEvent })
    } else if (eventType === 'event_callback') {
      if (subEventType === 'app_mention') {
        return await eventSubscriptionHandler({ context, event: slackEvent })
      } else {
        context.logger.warn(`[RQ=${requestId}] Unsupported subscription event type: '${eventType}'`)
        return { status: 400, data: { requestId, message: `Unsupported subscription event type: '${subEventType}'` } }
      }
    } else {
      context.logger.warn(`[RQ=${requestId}] Unsupported event type: '${eventType}'`)
      return { status: 400, data: { requestId, message: `Unsupported event type: '${eventType}'` } }
    }
  } catch (error) {
    console.error(`[RQ=${requestId}] An unknown error occurred while handling a request:`, error)
    return { status: 500, data: { requestId, message: "Internal error" } }
  }
}
