const { Assert: assert } = require('./Assert');

class RequestRule {
  constructor(schemaRule, { required = false, allowed = [] } = {}) {
    // eslint-disable-next-line prefer-rest-params
    assert.object(arguments[1]);
    assert.boolean(required);
    assert.array(allowed);

    this.schemaRule = schemaRule;
    this.options = { required, allowed };
  }
}

module.exports = { RequestRule };
