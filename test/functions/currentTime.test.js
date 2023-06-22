const tap = require('tap')

const { function: currentTime } = require('../../lib/functions/currentTime')

tap.test('currentTime should return details of the current time in UTC', async assert => {
  assert.same(
    await currentTime({ time: () => 0 }),
    {
      utc: {
        isoTimestamp: '1970-01-01T00:00:00.000Z',
        isoDate: '1970-01-01',
        isoTime: '00:00:00',
        year: 1970,
        month: 0,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        dayOfMonth: 1,
        dayOfYear: 1,
        isoWeekday: 4,
        isoWeekOfYear: 1,
        isoWeekYear: 1970,
        quarter: 1,
      }
    }
  )
})
