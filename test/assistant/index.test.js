const tap = require('tap')

const { getContext } = require('../../lib/context')
const { queryAssistant } = require('../../lib/assistant')

tap.test('queryAssistant should ', async assert => {
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

  const result = await queryAssistant({ context, event })

  assert.same(result, { message: 'hi there' })
})
