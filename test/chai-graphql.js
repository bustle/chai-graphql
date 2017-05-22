const response = Object.freeze({
  data: Object.freeze({
    foo: 'bar'
  })
})

const bigResponse = Object.freeze({
  data: Object.freeze({
    foo: 'bar',
    bar: Object.freeze([ 'zap' ])
  })
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
    assert.deepEqual(assert.graphQL(response), response.data)
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

  it('fails if there is no data', () => {
    assert.throws(() => assert.graphQL({}))
  })

  it('fails if there is null data', () => {
    assert.throws(() => assert.graphQL({ data: null }))
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

describe('graphQLSubset', () => {
  it('matches the data', () => {
    assert.graphQLSubset(bigResponse, bigResponse.data)
  })

  it('matches a subset of the data', () => {
    assert.graphQLSubset(bigResponse, { foo: 'bar' })
  })

  it('returns the data', () => {
    assert.deepEqual(assert.graphQLSubset(bigResponse), bigResponse.data)
  })

  it(`fails if the data doesn't match`, () => {
    assert.throws(() => assert.graphQLSubset(response, { sonic: 'boom' }))
  })

  it('fails if there are errors', () => {
    assert.throws(() => assert.graphQLSubset(badResponse, { foo: 'bar' }))
  })

  it('allows no matched data', () => {
    assert.graphQLSubset(response)
  })

  it('fails if there is an error an no matched data', () => {
    assert.throws(() => assert.graphQLSubset(badResponse))
  })

  it('fails if there is no data', () => {
    assert.throws(() => assert.graphQLSubset({}))
  })

  it('fails if there is null data', () => {
    assert.throws(() => assert.graphQLSubset({ data: null }))
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

  it('matches any errors against a string message', () => {
    assert.graphQLError(badResponse, 'Error message')
    assert.graphQLError(badResponse, 'Regular Error')
  })

  it('matches any errors against a regex message', () => {
    assert.graphQLError(badResponse, /message/)
    assert.graphQLError(badResponse, /Regular/)
  })

  it('matches an array of errors in order', () => {
    assert.graphQLError(badResponse, [
      'Error message',
      /Regular/
    ])
  })

  it('fails if no matching error', () => {
    assert.throws(() => assert.graphQLError(badResponse, 'garbage'))
    assert.throws(() => assert.graphQLError(badResponse, /garbage/))
  })

  it('fails if there was an unexpected number of errors', () => {
    assert.throws(() => assert.graphQLError(badResponse, [
      /message/
    ]))
  })

  it('fails if there was a weird matcher', () => {
    assert.throws(() => assert.graphQLError(badResponse, [
      { message: 'blah balh' },
      { message: 'blah balh' }
    ]))
  })

  it('fails if an array of messages are out of order', () => {
    assert.throws(() => {
      assert.graphQLError(badResponse, [
        /Regular/,
        'Error message'
      ])
    })
  })
})
