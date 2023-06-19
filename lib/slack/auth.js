module.exports = {
  validateSignature
}

const crypto = require('crypto')

function validateSignature ({ context = {}, headers = {}, body }) {
  const reasons = []

  const { slackSigningSecret } = context
  const slackSignature = headers['x-slack-signature']
  const slackTimestamp = headers['x-slack-request-timestamp']

  if (slackSigningSecret == null) {
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
    .createHmac('sha256', slackSigningSecret)
    .update(signatureData)
    .digest('hex')
  const computedSignature = `v0=${hmac}`

  if (slackSignature !== computedSignature) {
    return {
      valid: false,
      reasons: ["Signature does not match"],
    }
  }
  
  return {
    valid: true,
  }
}
