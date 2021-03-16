require('dotenv').config();
const joi = require('joi');

class BaseConfig {
  async init() {
    throw new Error(`${this.constructor.name} should implement 'init' method.`);
  }

  set(env, validator, defaultVal) {
    let value;
    if (process.env[env] || process.env[env] === '') {
      value = process.env[env];
    } else if (env === 'PORT') {
      value = process.env[env] || 4400;
    } else {
      if (defaultVal === undefined) {
        throw new Error(`Missing default value "${env}".`);
      }
      value = defaultVal;
      console.log(`Missing env variable: "${env}". Default value was applied: ${defaultVal}`);
    }

    if (validator && (typeof validator === 'function' || typeof validator === 'object')) {
      if (typeof validator === 'object') {
        // joi object
        const joiResult = validator.validate(value);
        if (!joiResult.error) return value;
        throw new Error(`Wrong "${env}" variable; Value: "${value}" is invalid. ${joiResult.error}`);
      }

      if (!validator(value)) {
        throw new Error(`Wrong "${env}" variable; Value: "${value}" is invalid.`);
      }

      return value;
    }

    throw new Error('validator should be a function or joi rule.');
  }

  setDirect(val, validator, defaultVal) {
    let value;
    if (val || val === '') {
      value = val;
    } else {
      if (defaultVal === undefined) {
        throw new Error('Missing default value');
      }
      value = defaultVal;
      console.log(`Missing direct value: "${val}". Default value was applied: ${defaultVal}`);
    }

    if (validator && (typeof validator === 'function' || typeof validator === 'object')) {
      if (typeof validator === 'object') {
        // joi object
        const joiResult = validator.validate(value);
        if (!joiResult.error) return value;
        throw new Error(`Value: "${value}" is invalid. ${joiResult.error}`);
      }

      if (!validator(value)) {
        throw new Error(`Value: "${value}" is invalid.`);
      }

      return value;
    }

    throw new Error('validator should be a function or joi rule.');
  }

  get joi() {
    return joi;
  }
}

module.exports = { BaseConfig };
