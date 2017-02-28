module.exports = function chaiGraphQL (chai, utils) {
  const Assertion = chai.Assertion

  Assertion.addMethod('graphQL', function (expected) {
    const data = this._obj.data
    const errors = this._obj.errors
    if (errors) {
      this.assert(
        errors === undefined,
        `expected "response.errors" to be undefined but got:\n${printErrors(errors)}`,
        `expected "response.errors" to not be undefined`
      )
    }
    chai.assert.deepEqual(data, expected)
  })

  chai.assert.graphQL = function (val, exp, msg) {
    new chai.Assertion(val, msg).graphQL(exp)
  }
}

function printErrors (errors) {
  errors.forEach(error => {
    if (typeof error.stack.split !== 'function') {
      console.log(error, error.stack, typeof error.stack)
    }
    if (error instanceof Error) {
      Object.defineProperties(error, {
        message: {
          enumerable: true,
          value: error.message
        },
        stack: {
          enumerable: true,
          value: (error.stack || '').split('\n').map(line => line.trim())
        }
      })
    }
  })
  return JSON.stringify(errors, null, 2)
}
