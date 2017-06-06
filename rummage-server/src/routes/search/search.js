const Joi = require('joi');
const getResults = require('./getResults');

const search = {
  method: 'GET',
  path: '/search/{keywords}',
  config: {
    tags: ['api'],
    description: 'Search for files',
    notes: 'Returns an array of files found that match the specified keywords',
    validate: {
      params: {
        keywords: Joi.string()
          .required()
          .description('the keywords to search for'),
      }
    }
  },
  handler: function (request, reply) {
    getResults(request.params.keywords, (searchResults) => {
      reply(searchResults);
    });
  }
};

module.exports = search;
