# Deploying for production

Boiler Books can be used with SystemD to manage processes. A .service file is provided as an example.

Boiler Books can also be deployed using docker-compose to network the db, api, and ui/proxy services.

## Deploying with SystemD (or any process manager)

1. Move built files to the `/srv/boilerbooks` directory.
    * The UI should be in `/srv/boilerbooks/ui`
    * The API should be in `/srv/boilerbooks/api`
2. Copy the .service file: `cp config/systemd-prod.service /lib/systemd/system/boilerbooks.service`
2. Start the service with `systemctl start boilerbooks.service`
3. Install the service with `systemctl enable boilerbooks.service`

The deployment can be restarted with `systemctl restart boilerbooks.service`:

## Deploying with Docker-Compoe

Coming Soon

## IEEE Deploy Information

### Deployment

Deployment is handled with dockr-compose and uses the Dockerfiles provided.

### Backups

Backups occur weekly and are uploaded automatically to alternate storage.

### SSL

SSL certificates are auto renewed with Let's Encrypt certbot.

### Mail

A proper mailing agent (Postfix) is configured on the server.
