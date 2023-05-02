# Deploying for production

Boiler Books can be used with SystemD to manage processes. A .service file is provided as an example.

**\[Preferred\]** Boiler Books can also be deployed with Docker. There are prebuilt Docker containers or build from scratch.

If using Docker containers, You will need to first use the .sql files in the `config/` directory to properly initialize the database.
The API _will_ fail to start without this setup.

## Deploying with SystemD (or any process manager)

1. Move built files to the `/srv/boilerbooks` directory.
    * The UI should be in `/srv/boilerbooks/ui`
    * The API should be in `/srv/boilerbooks/api`
2. Copy the .service file: `cp config/systemd-prod.service /lib/systemd/system/boilerbooks.service`
3. Install the service with `systemctl enable boilerbooks.service`
4. Start the service with `systemctl start boilerbooks.service`

The deployment can be restarted with `systemctl restart boilerbooks.service`:

## Deploying with Docker (from scratch)

* Copy the sample `docker-compose.sample.yml` file from the `config/` directory to the root deployment folder
* Modify the file to fit your details, including environment variables
    * The PHPMyAdmin container is completely optional, and does not need to be included
* Replace the `image:` labels with `build:` labels, pointing to the proper Dockerfiles. An example is under this section
    * You can optionally chose to only build certain components, like the UI
* Run the command `docker-compose up -d --build`

docker-compose.yml replacement example:
```yaml
services:
    api:
        build: boilerbooks/api
    ui:
        build:
        context: boilerbooks/ui
        dockerfile: Dockerfile.prod
```

## **\[Preferred\]** Deploying with Docker (prebuilt containers)

* Copy the sample `docker-compose.sample.yml` file from the `config/` directory to the root deployment folder
* Modify the file to fit your details, including environment variables, image tags, etc.
    * The PHPMyAdmin container is completely optional, and does not need to be included
* Run the command `docker-compose up -d`

## IEEE Deploy Information

### Deployment

Deployment is handled with docker-compose and uses the prebuilt containers.

**GitHub Actions will automatically auto-deploy the production application after a push to the master branch.**

If the deploy succeds, a green '✓' will appear next to the commit message. If the deploy fails, a red '✕' will appear next to the commit message. A full artifact log is visible in the 'Actions' tab.

<br>

To manually redeploy the application, ssh to the server and cd to the service folder.

Run a few commands to redeploy the application:

```sh
cd boilerbooks
git pull
cd ..
docker-compose pull
docker-compose up -d
```

### Backups

Backups occur daily and are downloaded automatically to alternate storage.

### SSL

SSL certificates are auto renewed with Let's Encrypt certbot.

### Mail

A proper mailing agent (Postfix) is configured on the server.
