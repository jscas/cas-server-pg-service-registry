'use strict';

module.exports = function(registry) {
  function handler(req, reply) {
    const name = req.payload.name;
    const url = req.payload.url;
    const comment = req.payload.comment;

    return registry.addService(name, url, comment)
      .then(function(service) {
        reply(service);
      })
      .catch(function(e) {
        reply(e);
      });
  }

  return {
    path: '/pgServiceRegistry/addService',
    method: 'POST',
    config: {
      cache: {
        privacy: 'private',
        expiresIn: 0
      }
    },
    handler: handler
  };
};
