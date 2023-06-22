module.exports = {
  function: currentTime,
  descriptor: {
    name: 'currentTime',
    description: `
This function determines the current timestamp in UTC and returns an object 
containing the full timestamp, date, time, and various components of the 
date and time to permit for flexible display. The source for the timestamp
and extracted fields is the moment.js Javascript library.
    `,
    parameters: {
      type: 'object',
      properties: {
      },
      required: [],
    }
  },
}

const moment = require('moment')

/**
 * Fetch the current time
 */
async function currentTime ({ time = () => moment.utc().getTime() } = {}) {
  const now = moment.utc(time())
  return {
    utc: {
      isoTimestamp: now.toISOString(),
      isoDate: now.format('YYYY-MM-DD'),
      isoTime: now.format('HH:mm:ss'),
      year: now.year(),
      month: now.month(),
      day: now.date(),
      hour: now.hour(),
      minute: now.minute(),
      second: now.second(),
      millisecond: now.millisecond(),
      dayOfMonth: now.date(),
      dayOfYear: now.dayOfYear(),
      isoWeekday: now.isoWeekday(),
      isoWeekOfYear: now.isoWeek(),
      isoWeekYear: now.isoWeekYear(),
      quarter: now.quarter(),
    }
  }
}
