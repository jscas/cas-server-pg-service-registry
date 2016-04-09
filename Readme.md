# cas-server-pg-service-registry

This module provides a reference implementation of a service registry plugin
for [cas-server][cs].

Intializing the plugin requires a [knex][knex] data source passed in via the
phase one context.

[cs]: https://github.com/jscas/cas-server
[knex]: http://knexjs.org/

## Exported End Points

### /pgServiceRegistry/addService

This plugin adds an endpoint to the CAS server that allows new services to
be added -- `/pgServiceRegistry/addService`. This end point should be blocked
from public access.

To add a new service simply `POST` a JSON object to the end point that matches:

```javascript
{
  "name": "A service name",
  "comment": "A description of the service. Can be null.",
  "url": "http://a.service.url/"
}
```

Note: the URL can be a POSIX compliant regular expression. See the PostgreSQL
[documentation][pdoc] for more detail.

[pdoc]: http://www.postgresql.org/docs/9.4/static/functions-matching.html#FUNCTIONS-POSIX-TABLE

## License

[MIT License](http://jsumners.mit-license.org/)
