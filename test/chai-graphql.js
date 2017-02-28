const response = Object.freeze({
  data: {
    foo: 'bar'
  }
})

const badResponse = Object.freeze({
  errors: [
    {
      message: 'Error message',
      stack: 'Prints if present'
    },
    new Error('Regular Error')
  ]
})

describe('graphQL', () => {
  it('should match the data', () => {
    assert.graphQL(response, { foo: 'bar' })
  })

  it(`should fail if the data doesn't match`, () => {
    assert.throws(() => assert.graphQL(response, {}))
    assert.throws(() => assert.graphQL({}, {}))
  })

  it('should fail if there are errors', () => {
    assert.throws(() => assert.graphQL(badResponse, { foo: 'bar' }))
  })
})

describe('notGraphQLError', () => {
  it('should pass if there are no errors', () => {
    assert.notGraphQLError(response)
  })

  it('should fail if there are errors', () => {
    assert.throws(() => assert.notGraphQLError(badResponse))
  })
})


describe('graphQLError', () => {
  it('matches on errors', () => {
    assert.graphQLError(badResponse)
  })
  it('failes with no errors', () => {
    assert.throws(() => assert.graphQLError(response))
  })
})
