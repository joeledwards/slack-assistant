module.exports = {
  prod,
  test,
}

async function prod ({ context }) {
  // TODO: init Slack API call to send response via Webhook

  async function sendResponse () {
  }

  return {
    sendResponse
  }
}

async function prod ({ context }) {
  return {
    sendResponse: () => {}
  }
}

