# Setting up a development environment

Boiler Books can be run on any OS, but it has been tested with Ubuntu 20.04 LTS.

## Developing with Linux

1. Clone the repository
2. Install the required packages
3. Use the given file to initialize the database, tables, and columns
4. Copy the nginx reverse proxy file so all requests are redirected
5. Install all NPM packages for the UI and API:
6. Create a `.env` file for the API, with database and private variables - use `.env.git` as an example:
7. Start the servers

```sh
git clone origin https://github.com/PurdueIEEE/boilerbooks.git
cd boilerbooks

apt install nginx mysql-server-8.0 nodejs postfix

mysql < config/ieee-money.sql

cp config/nginx-dev.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/nginx-dev.conf /etc/nginx/sites-enabled/ieee-money-dev.conf
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

## \[TODO\] Developing with Docker

WIP
