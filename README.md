# Boiler Books

The ultimate IEEE financial recordkeeping system! Boiler Books is used to track income, expenses, dues, and more across all of Purdue IEEE. Originally written with PHP in 2016, it has since been rewritten in JavaScript in 2022.

This system has three components: the database, the API, and the UI. The database is a standard MySQL installation, the API is an Express server, and the UI is a Vue SPA.

Boiler Books is hosted at [money.purdueieee.org](https://money.purdueieee.org).

## Setting up a development environment

Boiler Books can be run on any OS, but it has been tested with Ubuntu 20.04 LTS.

1. Install the required packages
2. Use the given file to initialize the database, tables, and columns
3. Copy the nginx reverse proxy file so all requests are redirected
4. Install all NPM packages for the UI and API:
5. Create a `.env` file for the API, with database and private variables - use `.env.git` as an example:
6. Start the servers

```
apt install nginx mysql-server-8.0 nodejs postfix

mysql < ieee-money.sql

cp ieee-money-dev.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/ieee-money-dev.conf /etc/nginx/sites-enabled/ieee-money-dev.conf
service nginx reload

npm --prefix ./api ci
npm --prefix ./ui ci

cp ./api/.env.git ./api/.env

cd api
npm run serve
cd ui
npm run serve
```

Now you should be ready to launch the program in a web browser! Navigate to `http://localhost/ui/` to begin.

## Deploying for production

Boiler Books can be used with SystemD to manage processes. These steps assume you installed the dependencies and configurations from before

1. Build the output files
2. Enable the nginx configuration
3. Install the SystemD service
4. Copy output files to the proper directory
5. Start API

```
npm --prefix ./api run build
npm --prefix ./ui run build

cp ieee-money-prod.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/ieee-money-prod.conf /etc/nginx/sites-enabled/ieee-money-prod.conf
service nginx reload

cp ieee-money.service /lib/systemd/system/

cp -r ./api /srv/boilerbooks/api'
cp -r ./ui/dist /srv/boilerbooks/ui

systemctl daemon-reload
systemctl start ieee-money
```

## IEEE Deploy Information

### Backups

Backups occur daily and are uploaded automatically to alternate storage.

### SSL

SSL certificates are auto renewed with Let's Encrypt certbot.

### Mail

A proper mailing agent must be configured on the server - `sendmail` may require extra configuration if not using the compatibility binary provided through `postfix`
