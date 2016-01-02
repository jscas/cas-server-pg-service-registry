'use strict';

const path = require('path');
const async = require(path.join(__dirname, 'async'));

const tooManyResults = new Error('Query returned too many results');
const tooFewResults = new Error('Query returned too few results');

let log;

function Registry(db, conf, $log) {
  log = $log;
  this.db = db;
  this.Service = db.models.Service;
}

Registry.prototype.addService = function addService(name, url, comment) {
  function* generator() {
    let services;
    try {
      services = yield this.getServiceWithName(name);
      if (services.length > 0) {
        throw new Error('service already present');
      }
    } catch (e) {
      log.error('could not check for existing service: %s', name);
      log.debug('message: %s', e.message);
      log.debug('detail: %s', e.detail);
      throw e;
    }

    let service;
    try {
      service = new this.Service(name, url, comment);
      service = this.Service.query().insert(service);
    } catch (e) {
      log.error('could not add new service: %s', name);
      log.debug('message: %s', e.message);
      log.debug('detail: %s', e.detail);
      throw e;
    }

    return service;
  }

  return async(generator.bind(this));
};

Registry.prototype.getServiceWithName = function getServiceWithName(name) {
  function* generator() {
    let service;
    try {
      service = yield this.Service.query().first({name: name});
    } catch (e) {
      log.error('could not find service: %s', name);
      log.debug('message: %s', e.message);
      log.debug('detail: %s', e.detail);
      throw e;
    }

    return service;
  }

  return async(generator.bind(this));
};

Registry.prototype.getServiceWithUrl = function getServiceWithUrl(url) {
  function* generator() {
    let services;
    try {
      services = yield this.Service.query().whereRaw(`'${url}' ~ url`);
      if (services.length < 1) {
        log.debug('could not find service with url: %s', url);
        throw tooFewResults;
      } else if (services.length > 1) {
        log.debug('found too many services with url: %s', url);
        throw tooManyResults;
      }
    } catch (e) {
      log.error('could not query for service with url: %s', url);
      log.debug('message: %s', e.message);
      log.debug('detail: %s', e.detail);
      throw e;
    }

    return services[0];
  }

  return async(generator.bind(this));
};

Registry.prototype.close = function close() {
  this.db.knex.destroy();
  return Promise.resolve(true);
};

module.exports = Registry;
