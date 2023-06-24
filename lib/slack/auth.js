module.exports = {
  validateSignature
}

const crypto = require('crypto')

function validateSignature ({ context = {}, event: { headers = {}, body } }) {
  const reasons = []

  const { config: { slack: { signingKey } = {} } = {} } = context
  const slackSignature = headers['x-slack-signature']
  const slackTimestamp = headers['x-slack-request-timestamp']

  if (signingKey == null) {
    reasons.push("No signing key in context")
  }

  if (slackSignature == null) {
    reasons.push("No slack signature header")
  }

  if (slackTimestamp == null) {
    reasons.push("No slack timestamp header")
  }

  if (body == null) {
    reasons.push("No body")
  }

  if (reasons.length > 0) {
    return {
      valid: false,
      reasons,
    }
  }

  const signatureData = Buffer.concat([
    Buffer.from(`v0:${slackTimestamp}:`),
    body
  ])
  const hmac = crypto
    .createHmac('sha256', signingKey)
    .update(signatureData)
    .digest('hex')
  const computedSignature = `v0=${hmac}`

  if (slackSignature !== computedSignature) {
    return {
      //slackSignature,
      //computedSignature,
      valid: false,
      reasons: ["Signature does not match"],
    }
  }
  
  return {
    valid: true,
  }
}
