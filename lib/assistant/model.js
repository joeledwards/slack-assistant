module.exports = {
  prod,
  test,
}

async function prod({ context }) {
  async function engageModel ({ messages }) {
    const prompt = messages.slice(-1)
    const history = messages.slice(0, -1)
    const systemInfo = getSystemInfo()
    const promptMessages = [...history, context.systemInfo, prompt]
    // TODO: add system info to messages and send prompt to model
    // TODO: contact the OpenAI chat completion API
  }

  return {
    engageModel
  }
}

async function test() {

  async function engageModel ({ messages }) {
    return [ ...messages, { role: 'assistant' , content: 'hi there' } ]
  }

  return {
    engageModel
  }
}
