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
  it('matches the data', () => {
    assert.graphQL(response, { foo: 'bar' })
  })

  it('returns the data', () => {
    assert.deepEqual(assert.graphQL(response), { foo: 'bar' })
  })

  it(`fails if the data doesn't match`, () => {
    assert.throws(() => assert.graphQL(response, {}))
    assert.throws(() => assert.graphQL({}, {}))
  })

  it('fails if there are errors', () => {
    assert.throws(() => assert.graphQL(badResponse, { foo: 'bar' }))
  })

  it('allows no matched data', () => {
    assert.graphQL(response)
  })

  it('fails if there is an error an no matched data', () => {
    assert.throws(() => assert.graphQL(badResponse))
  })
})

describe('notGraphQLError', () => {
  it('passes if there are no errors', () => {
    assert.notGraphQLError(response)
  })

  it('fails if there are errors', () => {
    assert.throws(() => assert.notGraphQLError(badResponse))
  })
})

describe('graphQLError', () => {
  it('matches on errors', () => {
    assert.graphQLError(badResponse)
  })
  it('fails with no errors', () => {
    assert.throws(() => assert.graphQLError(response))
  })
  it('returns the errors', () => {
    assert.deepEqual(assert.graphQLError(badResponse), badResponse.errors)
  })
})
