module.exports = {
  prod,
  test,
}

const axios = require('axios')

async function prod({ context }) {
  async function engageModel ({ messages }) {
    const prompt = messages.slice(-1)[0]
    const history = messages.slice(0, -1)
    const systemInfo = getSystemInfo()
    const promptMessages = [...history, context.systemInfo, prompt]
    const headers = {
      Authorization: `Bearer ${context.config.openai.apiKey}`,
    }
    const requestBody = {
      data: {
        model: context.config.openai.model,
        temperature: Number(context.config.openai.temperature),
        user: appName,
        n: 1,
        messages: promptMessages,
      },
    }

    const { status, data: responseBody } = await axios({
      method: 'POST'.
      url: 'https://api.openai.com/v1/chat/completions',
      data: requestBody,
      validateStatus: () => true,
    })

    if (status < 400) {
      const assistantMessage = data.choices[0].message
      return [...messages, assistantMessage]
    } else {
      let dataStr = data
      try {
        dataStr = JSON.stringify(data)
      } catch (_error) {
        // Ignore if we cannot convert the error response body into JSON
      }
      context.logger.error(`Error engaging OpenAI model: [${status}] ${dataStr}`)
      return
    }
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
