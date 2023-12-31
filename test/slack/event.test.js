const tap = require('tap')

const { getContext } = require('../../lib/context')
const { eventSubscriptionHandler } = require('../../lib/slack/event')

tap.test('eventSubscriptionHandler should query the model, then send a 201 response', async assert => {
  const context = await getContext({ isTest: true })
  const event = {
    ts: 0.0,
    type: 'event_callback',
    channel: 'C1',
    thread_ts: 0.0,
    event: {
      type: 'app_mention',
      text: 'Are you there?',
    },
  }

  assert.same(
    await eventSubscriptionHandler({ context, event }),
    { status: 201, data: { message: 'Prompt received' } }
  )
})
