# Updating the fiscal year

To update Boiler Books for the upcoming fiscal year, you must modify one variable and run a SQL command.

First, update the database. Second, update the code. Upon a push to the 'master' branch, GitHub Actions will automatically deploy the application.

For ease of use, you should also update the [sample data set](/.devcontainer/sample-data.sql) to avoid any errors in development.

## Updating the MySQL database

Add the fiscal year as a entry in the fiscal year lookup table. Update the command to reflect the current year.

The update can be done either visually with PHPMyAdmin _or_ through a shell on the IEEE Server.

### Updating using PHPMyAdmin

* Navigate to the PHPMyAdmin interface and log in
* Click the `ieee-money` database on the left pane
* Click the `fiscal_year` table on the center pane
* Open the MySQL console from the tab on the bottom of the screen
* Type the command ``INSERT INTO `fiscal_year` (fiscal_year) VALUES ('2022-2023');`` in the MySQL console (change `2022-2023` to the current year)
* Press Ctrl+Enter to execute the command

### Updating using a shell

* Run the command `docker exec -it boilerbooks-prod_db mysql -u root -p ieee-money` to enter the MySQL console
* Run the command ``INSERT INTO `fiscal_year` (fiscal_year) VALUES ('2022-2023');`` in the MySQL console (change `2022-2023` to the current year)

## Updating the code

* Modify the `current_fiscal_year` variable in [api/src/common_items.js](https://github.com/PurdueIEEE/boilerbooks/blob/master/api/src/common_items.js#L66)
* Rebuild and deploy the application as described in [deployment.md](deployment.md#ieee-deploy-information)

## Updating the sample data

* Add a new entry towards the end of the file with the new fiscal year id and fiscal year string
* Rebuild any devcontainer images for development
