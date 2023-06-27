module.exports = {
  prod,
  test
}

const { makeConversationKey: makeKey } = require('./key')

async function prod ({ context }) {
  const awsSdk = require('@buzuli/aws')
  const aws = await awsSdk.resolve()
  const dynamo = aws.dynamo()

  const table = context.config.dynamodb.tableName
  const keyColumn = 'key'
  const dataColumn = 'data'

  /**
   * Read the messages from the DynamoDB table
   */
  async function load ({ key }) {
    const records = await dynamo.batchGet(dynamo, table, [[keyColumn, key]], [keyColumn, dataColumn])

    if (records.length < 1) {
      return []
    }

    const [{ data }] = records
    const { messages } = JSON.parse(data)

    return messages
  }

  /**
   * Write the messages to the DynamoDB table
   */
  async function save ({ key, messages }) {
    const data = JSON.stringify({ messages })
    await dynamo.batchPut(dynamo, table, [{ key, data }])
  }

  return {
    makeKey,
    load,
    save,
  }
}

async function test () {
  const db = {}

  async function load ({ key }) {
    return db[key] || []
  }

  async function save ({ key, messages }) {
    db[key] = messages
  }

  return {
    makeKey,
    load,
    save,
  }
}
