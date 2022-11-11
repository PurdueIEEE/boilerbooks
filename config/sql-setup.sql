CREATE USER 'boilerbooks'@'localhost' IDENTIFIED BY 'testpassword';
GRANT INSERT,UPDATE,DELETE,SELECT ON `ieee-money`.* TO 'boilerbooks'@'localhost';
FLUSH PRIVILEGES;
