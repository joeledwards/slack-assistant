const tap = require('tap')

const { getContext } = require('../lib/context')
const { slackEventHandler } = require('../lib/handler')

function baseSlackEvent () {
  return {
    headers: {
      'x-slack-signature': 'v0=29be9d737e96c2a731d916dd2292b83912d58f335e30f30a7af2ebf85d005a6c',
      'x-slack-request-timestamp': '0',
    },
    body: Buffer.from(JSON.stringify({
      type: 'event_callback',
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

  const future = {}
  future.promise = new Promise(resolve => {
    future.resolve = resolve
  })

  context.services.slack = {
    sendResponse: async ({ context, event, message }) => {
      slackData.context = context
      slackData.event = event
      slackData.message = message
      future.resolve()
    }
  }

  const event = baseSlackEvent()

  assert.same(
    await slackEventHandler({ context, event }),
    { status: 201, data: { message: 'Prompt received' } }
  )

  await future.promise

  assert.same(slackData.message, 'howdy')
})

tap.test('slackEventHandler should retain context across multiple conversations', async assert => {
  const context = await getContext({ isTest: true })
  const event = baseSlackEvent()
  const modelData = {}

  const future = {}
  future.promise = new Promise(resolve => {
    future.resolve = resolve
  })

  context.services.model = {
    engageModel: async ({ messages }) => {
      modelData.messages = messages
    }
  }

  context.services.slack = {
    sendResponse: async ({ context, event, message }) => {
      future.resolve()
    }
  }

  await slackEventHandler({ context, event })
  await slackEventHandler({ context, event })
  await future.promise

  assert.same(modelData.messages, [
    {role: 'user', content: 'Are you there?' },
    {role: 'assistant', content: 'hi there' },
    {role: 'user', content: 'Are you there?' },
    {role: 'assistant', content: 'hi there' },
  ])
})
