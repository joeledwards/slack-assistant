module.exports = {
  prod,
  test,
}

const axios = require('axios')

async function prod () {
  async function sendResponse ({ context, event, message }) {
    const url = context.config.slack.webhook

    const {
      channel,
      ts: eventTs,
      thread_ts: threadTs,
    } = event

    const {status, data} = await axios({
      method: 'POST',
      url,
      data: {
        channel,
        response_type: 'in_channel',
        thread_ts: threadTs || eventTs,
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

