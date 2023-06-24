module.exports = {
  queryAssistant
}

/**
 * Query the assistant, taking into account conversation context, 
 * and calling any functions requested by the model.
 *
 * context: app context
 * event: slack event
 */
async function queryAssistant ({ context, event }) {
  const { event: { text: prompt } } = event
  const message = { role: 'user', content: prompt }

  return await assistantLoop({ context, message })
}

/**
 * Prompt the assistant until it sends a response.
 * Handles function call requests, and calls itself recursively with function call results.
 *
 * context: app context
 * event: slack event
 * message: the prompt or function result
 */
async function assistantLoop ({ context, event, message }) {
  // Retrieve conversation history
  const key = context.services.persistence.makeKey({ event })
  context.logger.info(`Loading conversation history for key ${key}`)
  const history = await context.services.persistence.load({ key })
  const messages = [ ...history, message ]

  // Prompt Model
  context.logger.info(`Getting completion from the Model`)
  const fullResponse = await context.services.model.engageModel({ messages })
  const responseMessage = fullResponse.slice(-1)[0]

  // Persist updated conversation history
  context.logger.info(`Saving updated conversation history to key ${key}`)
  const updatedHistory = [ ...history, message, responseMessage ]
  await context.services.persistence.save({ key, messages: updatedHistory })

  // TODO: determine if we should send a response, or call the specified function then and 
  //       call this function recursively with the response

  const slackMessage = responseMessage.content
  return { message: slackMessage }
}
