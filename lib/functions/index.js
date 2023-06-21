module.exports = {
  describeFunctions,
  invokeFunction
}

const currentTime = require('./currentTime')

const functions = {
  currentTime,
}

/**
 * Describe the functions that are available to the model.
 */
async function describeFunctions ({ context }) {
  return functions.map(f => f.descriptor)
}

/**
 * Invoke a specific function (if it exists).
 */
async function invokeFunction ({ context, functionName, data }) {
  const functionInfo = functions[functionName]

  if (functionInfo == null) {
    return { success: false, reasons: [`Function ${functionName} not found`] }
  }

  let result
  try {
    result = await functionInfo.func({ context, data })
  } catch (error) {
    return { success: false, reasons: [`Function failed: ${error}`], error}
  }

  // TODO: Result should be in a format consumable by the model

  return { success: true, result }
}
