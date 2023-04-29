-- Create a master user
INSERT INTO `boilerbooks`.`Users` (first, last, email, address, city, state, zip, cert, username, password, passwordreset, apikey)
    VALUES ('Infrastructure', 'Account', 'ieee-infrastructure@purdueieee.org', '465 Northwestern Ave', 'West Lafayette', 'IN', '47907', '', 'master', '$2b$10$2SwcYOGA2ltZqSZXMO3r0OunMr.Ff04rU0Hg7PxcUhCz1qZFwv2.W',  '', '');

-- Create an "Admin" committee
INSERT INTO `boilerbooks`.`committees` (display_name, api_name, bank_status, dues_status) VALUES ('Infrastructure', 'general', 'Inactive', 'Inactive');

-- Grant the master user permissions on "Admin" committee"
INSERT INTO `boilerbooks`.`approval` (username, role, committee, amount, category, privilege_level) VALUES ('master', 'Master Account', 1, '0', '*', '6');
