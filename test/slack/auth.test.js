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
      config: {
        slack: {
          signingKey: 'signing-key'
        }
      }
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
      config: {
        slack: {
          signingKey: 'signing-key'
        }
      }
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
      config: {
        slack: {
          signingKey: 'signing-key'
        }
      }
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
      config: {
        slack: {
          signingKey: 'signing-key'
        }
      }
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
      config: {
        slack: {
          signingKey: 'signing-key'
        }
      }
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

tap.test('validateSignature check handler test signature', async assert => {
  assert.same(validateSignature({
    context: {
      config: {
        slack: {
          signingKey: 'slack-signing-key'
        }
      }
    },
    event: {
      headers: {
        'x-slack-signature': 'v0=29be9d737e96c2a731d916dd2292b83912d58f335e30f30a7af2ebf85d005a6c',
        'x-slack-request-timestamp': '0',
      },
      body: Buffer.from(JSON.stringify({
        type: 'event_callback',
        event: {
          type: 'app_mention',
          text: 'Are you there?',
        },
      })),
    }
  }), { valid: true })
})
