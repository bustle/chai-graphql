module.exports = function chaiGraphQL (chai, utils) {
  const Assertion = chai.Assertion

  Assertion.addMethod('graphQL', function (expected) {
    const data = this._obj.data
    if (data === null) {
      throw new Error(`expected "response.data" to be an object found "null"`)
    }

    if (typeof data !== 'object') {
      throw new Error(`expected "response.data" to be an object found "${typeof data}"`)
    }

    const errors = this._obj.errors
    if (errors) {
      this.assert(
        errors === undefined,
        `expected "response.errors" to be undefined but got:\n${printErrors(errors)}`,
        `expected "response.errors" to not be undefined`
      )
      return
    }

    if (expected !== undefined) {
      chai.assert.deepEqual(data, expected)
    }
    return data
  })

  Assertion.addMethod('graphQLError', function (expected) {
    const errors = this._obj.errors
    this.assert(
      Array.isArray(errors),
      `expected "response.errors" to be an array`,
      `expected "response.errors" to not be an array`
    )
    return errors
  })

  chai.assert.graphQL = (val, exp, msg) => {
    return new chai.Assertion(val, msg).graphQL(exp)
  }

  chai.assert.graphQLError = (val, exp, msg) => {
    return new chai.Assertion(val, msg).graphQLError(exp)
  }

  chai.assert.graphQLErrors = chai.assert.graphQLError

  chai.assert.notGraphQLError = (val, exp, msg) => {
    return new chai.Assertion(val, msg).graphQL(exp)
  }

  chai.assert.notGraphQLErrors = chai.assert.notGraphQLError
}

function printErrors (errors) {
  (errors || []).forEach(error => {
    if (error instanceof Error) {
      if (typeof error.stack === 'string') {
        error.stack = error.stack.split('\n').map(line => line.trim())
      }

      Object.defineProperties(error, {
        message: {
          enumerable: true,
          value: error.message
        },
        stack: {
          enumerable: true,
          value: error.stack
        }
      })
    }
  })
  return JSON.stringify(errors, null, 2)
}
