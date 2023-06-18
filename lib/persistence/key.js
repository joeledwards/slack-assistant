module.exports = {
  makeConversationKey
}

function makeConversationKey (options) {
  if (options == null)
    return

  if (options.event == null)
    return

  const { team, channel, thread_ts, ts } = options.event

  let key
  if (team != null && channel != null && (thread_ts != null || ts != null)) {
    key = `conversation/team=${team}/channel=${channel}/thread_ts=${thread_ts == null ? ts : thread_ts }`
  }

  return key
}
