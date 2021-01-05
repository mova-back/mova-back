const getStringFromObject = require('./getStringFromObject');

module.exports = (req) => {
  const { url, method, body, query } = req;

  const request = getStringFromObject(body);
  const params = getStringFromObject(query);

  const logToConsole = `incoming request:
  {
    url: ${url},
    method: ${method},
    body: ${request},
    query_params: ${params}
  }`;

  const logToFile = `{ url: ${url}, method: ${method}, body: ${request}, query_params: ${params} }`;

  return { logToConsole, logToFile };
};
