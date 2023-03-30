CREATE USER 'boilerbooks'@'localhost' IDENTIFIED BY 'testpassword';
GRANT INSERT,UPDATE,DELETE,SELECT ON `ieee-money`.* TO 'boilerbooks'@'localhost';
FLUSH PRIVILEGES;

INSERT INTO `ieee-money`.`Users` (first, last, email, address, city, state, zip, cert, username, password, passwordreset, apikey)
    VALUES ('Purdue', 'IEEE', 'ieee-infrastructure@purdueieee.org', '465 Northwestern Ave', 'West Lafayette', 'IN', '47907', '', 'pieee', '$2b$10$2SwcYOGA2ltZqSZXMO3r0OunMr.Ff04rU0Hg7PxcUhCz1qZFwv2.W',  '', '');

INSERT INTO `ieee-money`.`committees` (display_name, api_name, bank_status, dues_status) VALUES ('General IEEE', 'general', 'Active', 'Inactive');

INSERT INTO `ieee-money`.`approval` (username, role, committee, amount, category, privilege_level) VALUES ('pieee', 'Master Account', 1, '0', '*', '6');
