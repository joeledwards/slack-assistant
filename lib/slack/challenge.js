module.exports = {
  handleChallenge
}

async function handleChallenge ({ context, event: { challenge } }) {
  return { status: 200, data: { challenge } }
}
