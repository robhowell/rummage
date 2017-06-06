require('dotenv-safe').load();

const h2o2 = require('h2o2');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Joi = require('joi');
const PackageJson = require('../package');
const Routes = require('./routes/routes');
const Vision = require('vision');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 5000
});

const options = {
  info: {
    'title': 'Rummage API',
    'version': PackageJson.version,
  }
};

server.register([
  Inert,
  Vision,
  h2o2,
  {
    'register': HapiSwagger,
    'options': options
  }], (err) => {
    server.start((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Server running at:', server.info.uri);
      }
    });
  });

server.route(Routes);
