var chai = require('chai')
var chaiGraphql = require('../lib/chai-graphql')
global.expect = chai.expect
global.assert = chai.assert
chai.use(chaiGraphql)
