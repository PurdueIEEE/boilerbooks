# Boiler Books

The ultimate IEEE financial recordkeeping system! Boiler Books is used to track income, expenses, dues, and more across all of Purdue IEEE. Originally written with PHP in 2016, it has since been rewritten in JavaScript in 2022.

This system has three components: the database, the API, and the UI. The database is a standard MySQL installation, the API is an Express server, and the UI is a Vue SPA.

Boiler Books is hosted at [money.purdueieee.org](https://money.purdueieee.org).

## Setting up a development environment

Boiler Books can be run on any OS, but it has been tested with Ubuntu 20.04 LTS.

1. Install the required packages:
```
apt install nginx mysql-server-8.0 nodejs postfix
```

2. Use the given file to initialize the database, tables, and columns:
```
mysql < ieee-money.sql
```

3. Copy the nginx reverse proxy file so all requests are redirected:
```
cp ieee-money.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/ieee-money.conf /etc/nginx/sites-enabled/ieee-money.conf
service nginx restart
```

4. Install all NPM packages for the UI and API:
```
npm --prefix ./api ci
npm --prefix ./ui ci
```

5. Create a `.env` file for the API, with database and private variables - use `.env.git` as an example:
```
cp ./api/.env.git ./api/.env
```

6. Start the servers
```
cd api
npm run serve
```
```
cd ui
npm run serve
```

Now you should be ready to launch the program in a web browser! Navigate to `http://localhost/ui/` to begin.

**Note:** All requests to `localhost` that are not for `/ui/` or `/api/` are automatically redirected to `http://localhost/ui/`

## Deploying for production

Coming Soon

## IEEE Deploy Information

### Backups

Backups occur daily and are uploaded automatically to offsite storage.

### SSL

SSL certificates are auto renewed with Let's Encrypt certbot.

### Mail

A proper mailing agent must be configured on the server - `sendmail` may require extra configuration if not using the compatibility binary provided through `postfix`
