module.exports = {
  prod,
  test,
}

const defaultSystemMessage = `
Respond as if you are a helpful assistant.
`

async function loadFunctionDefinitions () {
  return []
}

async function prod ({ context }) {
  const functions = await loadFunctionDefinitions()
  const systemMessage = context.config.openai.systemMessage || defaultSystemMessage

  return [
    ...functions,
    {
      role: 'system',
      content: systemMessage,
    },
  ]
}

async function test () {
  return [
    {
      role: 'system',
      content: 'Respond as if you are a helpful assistant.',
    },
  ]
}
