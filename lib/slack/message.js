module.exports = {
  prod,
  test,
}

const axios = require('axios')

async function prod ({ context, event, message }) {
  async function sendResponse () {
    const url = context.config.slack.webhook

    const {
      event: {
        thread_ts: threadTs,
        ts,
        channel,
      }
    } = event

    const {status, data} = await axios({
      method: 'POST',
      url,
      data: {
        channel,
        response_type: 'in_channel',
        thread_ts: threadTs || ts,
        text: message,
      },
      validateStatus: () => true,
    })

    if (status >= 400) {
      context.logger.error('Error sending slack message', error)
    }
  }

  return {
    sendResponse
  }
}

async function test () {
  return {
    sendResponse: () => {}
  }
}

