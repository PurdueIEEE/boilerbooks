# Updating the fiscal year

To update Boiler Books for the upcoming fiscal year, you must modify one variable and run a SQL command.

First, update the database. Second, update the code.

## Updating the MySQL database

Add the fiscal year as a entry in the fiscal year lookup table. Update the command to reflect the current year.

These commands must be run in a sh/bash/tcsh shell session _after_ connecting to the IEEE server.

* Run the command `docker exec -it boilerbooks-prod_db mysql -u root -p ieee-money` to enter the MySQL shell
* Run the command ``INSERT INTO `fiscal_year` (fiscal_year) VALUES ('2022-2023');`` in the MySQL shell

## Updating the code

* Modify the `current_fiscal_year` variable in [api/src/common_items.js](https://github.com/PurdueIEEE/boilerbooks/blob/master/api/src/common_items.js#L66)
* Rebuild and deploy the application as described in [deployment.md](deployment.md#ieee-deploy-information)
