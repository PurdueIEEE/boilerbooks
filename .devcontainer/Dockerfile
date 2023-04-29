FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16

# Copy configuration files
COPY config/boilerbooks.sql /tmp/config/
COPY .devcontainer/sql-presetup.sql /tmp/config/
COPY config/sql-setup.sql  /tmp/config/
COPY config/nginx-dev.conf /tmp/config/

# Copy files for development
COPY .devcontainer/sample-data.sql /tmp/config/sample-data.sql
COPY .devcontainer/aliases /etc/aliases

# Preselect some options for postfix
RUN echo "postfix postfix/mailname string localhost" | debconf-set-selections \
    && echo "postfix postfix/main_mailer_type string 'Internet Site'" | debconf-set-selections

# Install required packages
RUN apt update && export DEBIAN_FRONTEND=noninteractive \
    && apt -y install git mariadb-server-10.5 nginx postfix

# Setup the database
RUN service mariadb start && mariadb < /tmp/config/boilerbooks.sql && mariadb < /tmp/config/sql-presetup.sql && mariadb < /tmp/config/sql-setup.sql

# Setup NGINX
RUN mv /tmp/config/nginx-dev.conf /etc/nginx/sites-enabled/default && nginx -t

# Setup Postfix
RUN service postfix start && newaliases

# Create a sample dataset
RUN mkdir /var/log/boilerbooks && chown node:node /var/log/boilerbooks
RUN mkdir /var/www/receipts && chown node:node /var/www/receipts
RUN service mariadb start && mariadb boilerbooks < /tmp/config/sample-data.sql
ADD .devcontainer/receipts /var/www/receipts/
