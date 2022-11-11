FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16

COPY config/ieee-money.sql /tmp/config/
COPY config/sql-setup.sql  /tmp/config/
COPY config/nginx-dev.conf /tmp/config/

RUN apt update && export DEBIAN_FRONTEND=noninteractive \
    && apt -y install git mariadb-server-10.5 nginx
RUN service mariadb start && mariadb < /tmp/config/ieee-money.sql && mariadb < /tmp/config/sql-setup.sql
RUN mv /tmp/config/nginx-dev.conf /etc/nginx/sites-enabled/default \
    && service nginx reload

RUN mkdir /var/log/boilerbooks && chown node:node /var/log/boilerbooks
RUN mkdir /var/www/receipts && chown node:node /var/www/receipts
