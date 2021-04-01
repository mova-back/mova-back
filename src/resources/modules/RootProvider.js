const logger = require('../../../logger');
const { EmailAgent } = require('../../agents/EmailAgents');
const config = require('../../config/AppConfig');

class RootProvider {
  constructor() {
    this.emailAgent = new EmailAgent({
      apiKey: config.mailgunApiKey,
      domain: config.mailgunDomain,
      host: config.mailgunHost,
      from: config.from,
      logger,
    });
  }

  async init() {
    logger.debug(`${this.constructor.name} initialized...`);
  }
}

module.exports = new RootProvider();
