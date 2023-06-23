const tap = require('tap')

const { handleChallenge } = require('../../lib/slack/challenge')

tap.test('handleChallenge should return a 200 if a challenge is supplied', async assert => {
  assert.same(
    await handleChallenge({ context: {}, event: { challenge: 'nonce' } }),
    { status: 200, data: { challenge: 'nonce' } }
  )
})

tap.test('handleChallenge should return a 400 if the challenge is missing', async assert => {
  assert.same(
    await handleChallenge({ context: {}, event: { } }),
    { status: 400, data: { message: 'No challenge found' }  }
  )
  assert.same(
    await handleChallenge({ context: {}, event: { challenge: null } }),
    { status: 400, data: { message: 'No challenge found' }  }
  )
  assert.same(
    await handleChallenge({ context: {}, event: { challenge: '' } }),
    { status: 400, data: { message: 'No challenge found' }  }
  )
})
