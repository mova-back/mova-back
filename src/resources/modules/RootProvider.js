const { EmailAgent } = require('../../agents/EmailAgents');
const config = require('../../config/AppConfig');

console.log(config);

class RootProvider {
  constructor() {
    this.emailAgent = new EmailAgent({
      apiKey: config.mailgunApiKey,
      domain: config.mailgunDomain,
      host: config.mailgunHost,
      from: config.from,
      // TODO >>> logger
    });
  }

  async init() {
    // TODO : loger debuger
    console.log(`${this.constructor.name} initialized...`);
  }
}

module.exports = new RootProvider();
