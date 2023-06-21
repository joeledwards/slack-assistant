module.exports = {
  queryAssistant
}

async function queryAssistant ({ context, event }) {
  const { message: prompt } = event // TODO: pull the correct field
  const message = { role: 'user', content: prompt }

  return await assistantLoop({ context, message })
}

async function assistantLoop ({ context, message }) {
  // Retrieve conversation history
  const key = context.services.persistence.makeKey({ event })
  context.logger.info(`Loading conversation history for key ${key}`)
  const history = await context.services.persistence.load({ key })
  const messages = [...history, ]

  // Prompt Model
  context.logger.info(`Getting completion from the Model`)
  const fullResponse = await context.services.model.engageModel({ messages })
  const responseMessage = fullResponse.slice(-1)

  // Persist updated conversation history
  context.logger.info(`Saving updated conversation history to key ${key}`)
  const updatedHistory = [...history, message, responseMessage]
  await context.services.persistence.save({ key, messages: updatedHistory })

  // TODO: determine if we should send a response, or call the specified function then and 
  //       call this function recursively with the response

  const slackMessage = responseMessage.content
  return { message: slackMessage }
}
