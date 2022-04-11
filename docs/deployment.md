# Deploying for production

Boiler Books can be used with SystemD to manage processes. A .service file is provided as an example.

Boiler Books can also be deployed using docker-compose to network the db, api, and ui/proxy services.

## IEEE Deploy Information

### Backups

Backups occur daily and are uploaded automatically to alternate storage.

### SSL

SSL certificates are auto renewed with Let's Encrypt certbot.

### Mail

A proper mailing agent must be configured on the server.
