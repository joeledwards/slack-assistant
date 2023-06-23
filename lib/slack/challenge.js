module.exports = {
  handleChallenge
}

async function handleChallenge ({ context, event: { challenge } }) {
  if (!challenge) {
    return { status: 400, data: { message: 'No challenge found' } }
  }

  return { status: 200, data: { challenge } }
}
