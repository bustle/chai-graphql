const util = require('util')

module.exports = function chaiGraphQL (chai, utils) {
  const Assertion = chai.Assertion
  const showDiff = chai.config.showDiff

  Assertion.addMethod('graphQL', function (expected) {
    const errors = this._obj.errors
    if (errors) {
      this.assert(
        errors === undefined,
        `Expected "response.errors" to be "undefined" but got #{act}`,
        `Expected "response.errors" to not be #{exp} but got "undefined"`,
        [],
        errors,
        showDiff
      )
      return
    }

    const data = this._obj.data
    if (data === null) {
      throw new Error(`Expected "response.data" to be an object found "null"`)
    }

    if (typeof data !== 'object') {
      throw new Error(`Expected "response.data" to be an object found "${typeof data}"`)
    }

    const matchData = data.payload === undefined ? data : data.payload

    if (expected !== undefined) {
      chai.assert.deepEqual(matchData, expected)
    }

    return matchData
  })

  Assertion.addMethod('graphQLSubset', function (expected) {
    const errors = this._obj.errors
    if (errors) {
      this.assert(
        errors === undefined,
        `Expected "response.errors" to be "undefined" but got #{act}`,
        `Expected "response.errors" to not be #{exp} but got "undefined"`,
        [],
        errors,
        showDiff
      )
      return
    }

    const data = this._obj.data
    if (data === null) {
      throw new Error(`Expected "response.data" to be an object found "null"`)
    }

    if (typeof data !== 'object') {
      throw new Error(`Expected "response.data" to be an object found "${typeof data}"`)
    }
    const matchData = data.payload === undefined ? data : data.payload

    if (expected === undefined) {
      return matchData
    }

    this.assert(
      compareSubset(expected, matchData),
      'expected #{act} to contain subset #{exp}',
      'expected #{act} to not contain subset #{exp}',
      expected,
      matchData,
      showDiff
    )
    return matchData
  })

  Assertion.addMethod('graphQLError', function (matchers) {
    const errors = this._obj.errors
    chai.assert.isArray(errors, '"response.errors" has no errors')
    this.assert(errors.length > 0, `Expected there to be at least one error instead received an empty array.`)

    if (Array.isArray(matchers)) {
      if (errors.length !== matchers.length) {
        throw new Error(`Received a ${errors.length} errors and you're trying to match ${matchers.length} errors.\n ${printObject(errors)}`)
      }
      matchers.forEach((matcher, index) => {
        const error = errors[index]
        if (!matchError(error, matcher)) {
          throw new Error(`Expected ${printObject(matcher)} to match ${printObject(error.message)}`)
        }
      })
    } else if (matchers !== undefined) {
      if (!detectMatchingError(errors, matchers)) {
        throw new Error(`Expected ${printObject(matchers)} to match one of the errors.\n${printErrorMessages(errors)}`)
      }
    }
    return errors
  })

  chai.assert.graphQL = (val, exp, msg) => {
    return new chai.Assertion(val, msg).graphQL(exp)
  }

  chai.assert.graphQLSubset = (val, exp, msg) => {
    return new chai.Assertion(val, msg).graphQLSubset(exp)
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

function printErrorMessages (errors) {
  return printObject(errors.map(err => err.message))
}

function printObject (errors) {
  return util.inspect(errors)
}

function matchError (error, matcher) {
  if (!error || !error.message || typeof error.message !== 'string') {
    throw new Error(`Detected an Error with no string message`)
  }
  if (typeof matcher !== 'string' && !(matcher instanceof RegExp)) {
    throw new Error(`Unknown matcher "${matcher}" must be a string or RegExp`)
  }
  return error.message.match(matcher)
}

function detectMatchingError (errors, matcher) {
  return errors.find(err => matchError(err, matcher)) !== undefined
}

// Stolen from chai-subset
function compareSubset (expected, actual) {
  if (expected === actual) {
    return true
  }
  if (typeof actual !== typeof expected) {
    return false
  }
  if (typeof expected !== 'object' || expected === null) {
    return expected === actual
  }
  if (!!expected && !actual) {
    return false
  }

  if (Array.isArray(expected)) {
    if (typeof actual.length !== 'number') {
      return false
    }
    var aa = Array.prototype.slice.call(actual)
    return expected.every(function (exp) {
      return aa.some(function (act) {
        return compareSubset(exp, act)
      })
    })
  }

  if (expected instanceof Date) {
    if (actual instanceof Date) {
      return expected.getTime() === actual.getTime()
    } else {
      return false
    }
  }

  return Object.keys(expected).every(function (key) {
    var eo = expected[key]
    var ao = actual[key]
    if (typeof eo === 'object' && eo !== null && ao !== null) {
      return compareSubset(eo, ao)
    }
    return ao === eo
  })
}
