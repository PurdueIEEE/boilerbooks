-- Create a user for the database, but only for development setups

CREATE USER 'boilerbooks'@'localhost' IDENTIFIED BY 'testpassword';
GRANT INSERT,UPDATE,DELETE,SELECT ON `boilerbooks`.* TO 'boilerbooks'@'localhost';
FLUSH PRIVILEGES;
