# boilerbooks
The ultimate IEEE record keeping system!

This program is written using PHP. The website is displayed using the bootstrap framework. It is currently hosted at money.pieee.org.

In order to properly develop code you will likely need access to the database. 

It is also important to setup a mysqldump cron job for database backups (I suggest removing backups after 30 days to save space)

Also use rsync (or a better solution) to make remote backups of the mysqldump's, certs, and the uploaded receipts

Also auto renew the ssl cert