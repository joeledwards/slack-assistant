module.exports = {
  getContext,
}

async function getContext () {
  const context = {}

  // TODO: load context appropriate for the environment (prod / test)
  //       - environment
  //       - services:
  //         - dynamodb (load conversation history, save conversation history)
  //         - openai (chat completions)
  //         - slack (send message)

  context.dynamodb.storageUri = ""
  context.openai.uri = ""
  context.openai.apiKey = ""
  context.slack.signingKey = ""
  context.slack.webhook = ""

  return context
}
