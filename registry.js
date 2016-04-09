'use strict';

const path = require('path');
const registriesDB = require('cas-server-registries-db');
const Registry = require(path.join(__dirname, 'lib', 'Registry'));

let db;
let registry;
let server;

module.exports.name = 'pgServiceRegistry';
module.exports.plugin = function plugin(conf, context) {
  if (!db) {
    db = registriesDB(context.dataSources.knex);
  }
  if (!registry) {
    registry = new Registry(db, conf, context.logger);
  }

  return registry;
};

module.exports.postInit = function postInit(context) {
  server = context.server;

  const addServiceRoute = require(
    path.join(__dirname, 'lib', 'routes', 'addService')
  );
  server.route(addServiceRoute(registry));

  return Promise.resolve(true);
};
