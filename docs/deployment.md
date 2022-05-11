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

* Create a `docker-compose.yml` file and setup 4 (or 3) services:
    * `ui_proxy` for the frontend and internal reverse proxy
    * `api` for the actual API
    * `db` for the database, probably MySQL
    * (optional) `pma` for PHPMyAdmin
* Point the `ui_proxy` and `api` services to build off the given Dockerfiles
    * The API uses [api/Dockerfile](/api/Dockerfile)
    * The UI can use [ui/Dockerfile.dev](/ui/Dockerfile.dev) for developments builds
    * The UI can use [ui/Dockerfile.prod](/ui/Dockerfile.prod) for production builds
* Set the environment variables for the api as defined in [the dotenv file](/api/.env.git)
* Bind mount the necessary logs, database volumes, etc. to the host machine
    * Optionally, use Docker volumes instead
* Setup a network link for the SMTP server to the Docker gateway
* Run the command `docker-compose up --build -d`

## IEEE Deploy Information

### Deployment

Deployment is handled with docker-compose and uses the Dockerfiles provided.

**GitHub Actions will automatically auto-deploy the production application after a push to the master branch.**

If the deploy succeds, a green '✓' will appear next to the commit message. If the deploy fails, a red '✕' will appear next to the commit message. A full artifact log is visible in the 'Actions' tab.

<br>

To manually redeploy the application, ssh to the server and cd to the service folder.

Run a few commands to redeploy the application:

```
cd boilerbooks
git pull
cd ..
docker-compose up --build -d
```

### Backups

Backups occur weekly and are uploaded automatically to alternate storage.

### SSL

SSL certificates are auto renewed with Let's Encrypt certbot.

### Mail

A proper mailing agent (Postfix) is configured on the server.
