const { Assert: assert } = require('./Assert');
const { RequestRule } = require('./RequestRule');

class BaseAction {
  static get baseQueryParams() {
    return {
      page: new RequestRule({
        validate: {
          validator: (v) => Number.isInteger(v) && v >= 0,
          message: (prop) => `${prop.value} - Number; min 0;`,
        },
      }),
      limit: new RequestRule({
        validate: {
          validator: (v) => Number.isInteger(v) && [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(v),
          description: 'Number; One of: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]',
        },
      }),
    };
  }

  static result(result) {
    assert.object(result, { notEmpty: true });
    assert.boolean(result.success);
    assert.integer(result.status);
    assert.array(result.cookies);
    assert.object(result.headers);
    assert.string(result.message);
    assert.ok(result.data);

    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.cookies && { cookies: result.cookies }),
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data }),
    };
  }

  static redirect(options) {
    assert.object(options, { required: true });
    assert.url(options.url, { required: true });
    assert.integer(options.code);

    return {
      redirect: {
        status: options.status || 301,
        url: options.url,
      },
    };
  }
}

module.exports = { BaseAction };
