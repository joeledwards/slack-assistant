module.exports = {
  getContext,
}

async function getContext () {
  const context = {}

  // TODO: load context appropriate for the environment (prod / test)

  context.slack.signingKey = ""
  context.slack.webhook = ""

  return context
}
