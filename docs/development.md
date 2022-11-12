# Setting up a development environment

Boiler Books can be run on any OS, but it has been tested with Ubuntu 20.04 LTS.

The preferred development environment uses Visual Studio Code devcontainers. However, a normal Linux machine can be used instead.

## Important Notes

By default, a bootstrap account is created with the username `pieee` and the password `test`.
This account has Treasurer permissions and should be used to grant permissions to your actual testing accounts.
While this is a local testing platform, changing the default password is highly recommended.

If desired, a sample data set is available in [.devcontainer/sample-data.sql](/.devcontainer/sample-data.sql).
Following these instructions will automatically include the sample data set and create some more  accounts with different permissions for testing.
The accounts are:

* Username - Password - Role
* `pp` (Purdue Pete)               - `qwertyuiop` - member
* `trainboi` (Boilermaker Express) - `qwertyuiop` - internal leader (Aerial Robotics)
* `mdma` (Mitch Daniels)           - `qwertyuiop` - officer (Computer Society)
* `pain` (ECE Department)          - `qwertyuiop` - treasurer


## Developing with Visual Studio Code \[Preferred\]

Visual Studio Code (VSCode) has a powerful feature called "devcontainers" that allows a seamless and repeatable development environment setup process.
This setup uses Docker to create an image with the programs needed for development, and only works well with VSCode.

First, [install Docker](https://docs.docker.com/engine/install/) for your machine.
If possible, use the "server"/"engine" installation instructions over the "Docker Desktop" instructions.
This will save you some performance and the GUI desktop application is not needed.
Some platforms, like Windows, can only use the Docker Desktop which creates a full Linux VM to run Docker.

Second, [install VSCode](https://code.visualstudio.com/Download) for your machine.
After installation, install the "Remote Development" extension for VSCode (`ms-vscode-remote.vscode-remote-extensionpack`).

Third, clone the Boiler Books repository and open it within VSCode.
The command for this is most likely `git clone origin https://github.com/PurdueIEEE/boilerbooks.git`.

Somewhere on screen, there will be a popup asking to reopen the workspace in a container.
Accept this, and wait 30 seconds to 3 minutes for all installation and setup instructions.
From then, open a split terminal and start both the API and UI servers.

```sh
cd api
npm run serve

cd ui
npm run serve
```

Now you should be ready to launch the program in a web browser!
Navigate to `http://localhost:8080/ui` to begin.

**IMPORTANT CAVEAT: Because Docker is a stateless image, changes made to the database will not persist properly. The sample data set is designed to be a repeatable base covering many types of data entries.**

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
mysql < config/sql-setup.sql

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
