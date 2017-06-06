const Joi = require('joi');
const Wreck = require('wreck');

const thumbnail = {
  method: 'GET',
  path: '/thumbnail/{thumbnailPath*}',
  config: {
    tags: ['api'],
    description: 'Get thumbnail for file',
    notes: 'Returns a thumbnail image for the specified path',
    validate: {
      params: {
        thumbnailPath: Joi.string()
          .required()
          .description('the target thumbnail path'),
      }
    }
  },
  handler: {
    proxy: {
      mapUri: function (request, callback) {
        const headers = {
          auth: {
            'user': process.env.SEARCH_USERNAME,
            'pass': process.env.SEARCH_PASSWORD
          }
        };

        callback(null, `${process.env.THUMBNAIL_HOST}/${request.params.thumbnailPath}`, headers);
      },
      onResponse: function (err, res, request, reply, settings, ttl) {
        Wreck.read(res, { json: true }, function (err, payload) {
          reply(payload).headers = res.headers;
        });
      }
    }
  }
};

module.exports = thumbnail;
