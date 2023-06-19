const tap = require('tap')
const { makeConversationKey } =  require('../../lib/persistence/key')

tap.test('makeConversationKey should return null given an invalid input event', async assert => {
  assert.equal(makeConversationKey(), undefined)
  assert.equal(makeConversationKey(null), undefined)
  assert.equal(makeConversationKey({}), undefined)

  assert.equal(makeConversationKey({ event: null }), undefined)
  assert.equal(makeConversationKey({ event: {} }), undefined)

  assert.equal(makeConversationKey({ event: { team: 'A', channel: '1'               } }), undefined)
  assert.equal(makeConversationKey({ event: { team: 'A',               thread_ts: 0 } }), undefined)
  assert.equal(makeConversationKey({ event: { team: 'A',               ts: 0        } }), undefined)
  assert.equal(makeConversationKey({ event: {            channel: '1', thread_ts: 0 } }), undefined)
  assert.equal(makeConversationKey({ evnet: {            channel: '1', ts: 0        } }), undefined)
})

tap.test('makeConversationKey should create a valid conversation key given a valid event', async assert => {
  assert.equal(makeConversationKey({ event: { team: 'A', channel: '1', thread_ts: 0, ts: 1 } }), 'conversation/team=A/channel=1/thread_ts=0')
  assert.equal(makeConversationKey({ event: { team: 'A', channel: '1', thread_ts: 0 } }), 'conversation/team=A/channel=1/thread_ts=0')
})
