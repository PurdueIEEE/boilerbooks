FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16

COPY config/ieee-money.sql /tmp/config/
COPY config/sql-setup.sql  /tmp/config/
COPY config/nginx-dev.conf /tmp/config/

COPY .devcontainer/sample-data.sql /tmp/config/sample-data.sql

RUN echo "postfix postfix/mailname string localhost" | debconf-set-selections\
    && echo "postfix postfix/main_mailer_type string 'Internet Site'" | debconf-set-selections

RUN apt update && export DEBIAN_FRONTEND=noninteractive \
    && apt -y install git mariadb-server-10.5 nginx postfix
RUN service mariadb start && mariadb < /tmp/config/ieee-money.sql && mariadb < /tmp/config/sql-setup.sql
RUN mv /tmp/config/nginx-dev.conf /etc/nginx/sites-enabled/default \
    && service nginx reload

RUN mkdir /var/log/boilerbooks && chown node:node /var/log/boilerbooks
RUN mkdir /var/www/receipts && chown node:node /var/www/receipts

RUN service mariadb start && mariadb ieee-money < /tmp/config/sample-data.sql
ADD .devcontainer/receipts /var/www/receipts/
