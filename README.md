chai-graphql
[![npm version](https://badge.fury.io/js/chai-graphql.svg)](https://badge.fury.io/js/chai-graphql)
[![Build Status](https://travis-ci.org/bustlelabs/chai-graphql.svg?branch=master)](https://travis-ci.org/bustlelabs/chai-graphql)
[![devDependency Status](https://david-dm.org/bustlelabs/chai-graphql/dev-status.svg)](https://david-dm.org/bustlelabs/chai-graphql#info=devDependencies)
===========

GraphQL response matcher for Chai [Chai](http://chaijs.com/) assertion library

Works with both parsed JSON responses and local object responses.

## Installation
```
npm install --save-dev chai-graphql
```

## API
- `assert.graphQl(response, expectedData)` performs a deep equals on the `response.data`, throws if there are `response.errors`
- `assert.graphQLError(response)` throws if there are not `response.errors`

## Usage
In your setup
```js
import chai from 'chai'
import chaiGraphQL from 'chai-graphql'
chai.use(chaiGraphQL)
```

in your spec.js
```js
var request = {
  data: {
    foo: 'bar'
  }
}

// Passes
assert.graphQL(request, { foo: 'bar' })
expect(request).to.be.graphQl({ foo: 'bar' })

// Fails
assert.graphQLError(request)
expect(request).to.be.graphQLError()

const badResponse = {
  errors: [
    {
      message: 'Error message',
      stack: 'Prints if present'
    },
    new GraphQLError('GraphQL Error Object'),
    new Error('Regular Error')
  ]
}

// Passes
assert.graphQLError(badResponse)
expect(badResponse).to.be.graphQLError()

// fails
assert.graphQL(badResponse, { foo: 'bar' })
expect(badResponse).to.be.graphQl({ foo: 'bar' })
```
