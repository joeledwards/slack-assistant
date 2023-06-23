const tap = require('tap')

const { getContext } = require('../../lib/context')
const { eventSubscriptionHandler } = require('../../lib/slack/event')

tap.test('eventSubscriptionHandler should send a 201 response prior to querying the model', async assert => {
  const context = await getContext({ isTest: true })

  let taskComplete = false
  assert.same(
    await eventSubscriptionHandler({ context, event: {}, bgTask: () => { taskComplete = true } }),
    { status: 201, data: { message: 'Prompt received' } }
  )

  await new Promise(success => setImmediate(success))

  assert.equal(taskComplete, true)
})
