'use strict'

function testRule(path, ruleName, errorMessage, ruleCode, ruleType, invalid, valid) {
  var rule = require(path)
  var RuleTester = require('eslint').RuleTester

  var parserOptions = {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  }

  invalid = [
    {code: `<Item prop={${ruleCode}} />`, line: 1, column: 13},
    {code: `<Item.tag prop={${ruleCode}} />`, line: 1, column: 17},
    {code: `<Item prop={${ruleCode} || true} />`, line: 1, column: 13},
    {code: `<Item prop={false || ${ruleCode}} />`, line: 1, column: 22},
    {code: `<Item prop={false ? foo : ${ruleCode}} />`, line: 1, column: 27},
    {code: `<Item prop={false ? ${ruleCode} : foo} />`, line: 1, column: 21},
    {code: `<Item.tag prop={${ruleCode}} />`, line: 1, column: 17},
    {code: `var a = ${ruleCode};<Item prop={a} />`, line: 1, column: 9},
    {code: `let a = ${ruleCode};<Item prop={a} />`, line: 1, column: 9},
    {code: `const a = ${ruleCode};<Item prop={a} />`, line: 1, column: 11},
    {code: `var a; a = ${ruleCode};<Item prop={a} />`, line: 1, column: 12},
    {code: `let a; a = ${ruleCode};<Item prop={a} />`, line: 1, column: 12},
    {code: `let a; a = ${ruleCode}; a = 1;<Item prop={a} />`, line: 1, column: 12},
    {code: `let a; a = 1; a = ${ruleCode};<Item prop={a} />`, line: 1, column: 19}
  ].map(function({code, line, column}) {
    return {
      code,
      errors: [{
        line,
        column,
        type: ruleType
      }]
    }
  }).concat(invalid)

  valid = [
    '<Item prop={0} />',
    'var a;<Item prop={a} />',
    'var a;a = 1;<Item prop={a} />',
    'var a;a = a;<Item prop={a} />',
    'var a;a = b;<Item prop={a} />'
  ].concat(valid || [])

  new RuleTester().run(ruleName, rule, {
    valid: valid.map((code) => {
      return {
        code,
        parserOptions
      }
    }),
    invalid: invalid.map(e => {
      e.parserOptions = parserOptions
      e.errors.message = errorMessage
      return e
    })
  })
}

module.exports = {
  testRule
}
