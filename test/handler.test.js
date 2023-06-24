const tap = require('tap')

const { getContext } = require('../lib/context')
const { slackEventHandler } = require('../lib/handler')

function lambdaEvent () {
  return {
    headers: {
      'x-slack-signature': 'v0=4abef3ee8ef9927a0988dc21c0f47240b9c7a737b96695ba7fb2b6f1b7401418',
      'x-slack-request-timestamp': '0',
    },
    body: Buffer.from(JSON.stringify({
      ts: 0.0,
      type: 'event_callback',
      channel: 'C1',
      thread_ts: 0.0,
      event: {
        type: 'app_mention',
        text: 'Are you there?',
      },
    })),
  }
}

tap.test('slackEventHandler should return a 201 for a valid request', async assert => {
  const context = await getContext({ isTest: true })
  const slackData = {}

  context.services.slack = {
    sendResponse: async ({ context, event, message }) => {
      slackData.message = message
    }
  }

  const event = lambdaEvent()
  assert.same(
    await slackEventHandler({ context, event }),
    { status: 201, data: { message: 'Prompt received' } }
  )

  assert.same(slackData.message, 'hi there')
})

tap.test('slackEventHandler should retain context across multiple conversations', async assert => {
  const context = await getContext({ isTest: true })
  const modelData = {}

  context.services.model = {
    engageModel: async ({ messages }) => {
      modelData.messages = messages
      return [ ...messages, { role: 'assistant', content: 'howdy' } ]
    }
  }

  const event = lambdaEvent()
  await slackEventHandler({ context, event })
  await slackEventHandler({ context, event })

  assert.same(modelData.messages, [
    {role: 'user', content: 'Are you there?' },
    {role: 'assistant', content: 'howdy' },
    {role: 'user', content: 'Are you there?' },
  ])
})
