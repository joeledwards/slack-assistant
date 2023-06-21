module.exports = {
  function: currentTime,
  descriptor: {
    name: 'currentTime',
    arguments: {
      // TODO: describe
    },
    return: {
      // TODO: describe
    }
  },
}

const moment = require('moment')

/**
 * Fetch the current time
 */
async function currentTime ({ context, data }) {
  const now = moment.utc()
  return {
    utc: {
      isoTimestamp: now.toISOString(),
      isoDate: now.format('YYYY-MM-DD'),
      isoTime: now.format('HH:mm:ss'),
      year: now.year(),
      month: now.month(),
      day: now.date(),
      hour: now.hour(),
      minute: minute.hour(),
      second: second.hour(),
      millisecond: millisecond.hour(),
      dayOfMonth: now.date(),
      dayOfYear: now.dayOfYear(),
      isoWeekday: now.isoWeekday(),
    }
  }
}
