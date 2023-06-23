const tap = require('tap')

const { validateSignature } = require('../../lib/slack/auth')

tap.test('validateSignature invalid if signing key is missing', async assert => {
  assert.same(validateSignature({
    context: {
    },
    event: {
      headers: {
        'x-slack-signature': 'deadbeef',
        'x-slack-request-timestamp': '100',
      },
      body: Buffer.from('{"message":"test"}'),
    }
  }), { valid: false, reasons: ['No signing key in context'] })
})

tap.test('validateSignature invalid if slack signature is missing', async assert => {
  assert.same(validateSignature({
    context: {
      slackSigningSecret: 'signing-key',
    },
    event: {
      headers: {
        'x-slack-request-timestamp': '100',
      },
      body: Buffer.from('{"message":"test"}'),
    }
  }), { valid: false, reasons: ['No slack signature header'] })
})

tap.test('validateSignature invalid if slack timestamp is missing', async assert => {
  assert.same(validateSignature({
    context: {
      slackSigningSecret: 'signing-key',
    },
    event: {
      headers: {
        'x-slack-signature': 'deadbeef',
      },
      body: Buffer.from('{"message":"test"}'),
    }
  }), { valid: false, reasons: ['No slack timestamp header'] })
})

tap.test('validateSignature invalid if there is no body', async assert => {
  assert.same(validateSignature({
    context: {
      slackSigningSecret: 'signing-key',
    },
    event: {
      headers: {
        'x-slack-signature': 'deadbeef',
        'x-slack-request-timestamp': '100',
      },
    }
  }), { valid: false, reasons: ['No body'] })
})

tap.test('validateSignature invalid if signature does not match', async assert => {
  assert.same(validateSignature({
    context: {
      slackSigningSecret: 'signing-key',
    },
    event: {
      headers: {
        'x-slack-signature': 'v0=57570c6717f7ca57f9053dbee135abc66fe507b23ac9a173c7a70db1ef7e94dd',
        'x-slack-request-timestamp': '100',
      },
      body: Buffer.from('{"message":"unexpected"}'),
    }
  }), { valid: false, reasons: ['Signature does not match'] })
})

tap.test('validateSignature valid if signature matches', async assert => {
  assert.same(validateSignature({
    context: {
      slackSigningSecret: 'signing-key',
    },
    event: {
      headers: {
        'x-slack-signature': 'v0=57570c6717f7ca57f9053dbee135abc66fe507b23ac9a173c7a70db1ef7e94dd',
        'x-slack-request-timestamp': '100',
      },
      body: Buffer.from('{"message":"expected"}'),
    }
  }), { valid: true })
})
