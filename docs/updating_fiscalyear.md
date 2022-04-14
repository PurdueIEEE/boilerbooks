# Updating the fiscal year

To update Boiler Books for the upcoming fiscal year, you must modify one variable and run some SQL commands.

## Updating the code

* Modify the `current_fiscal_year` variable in [api/src/common_items.js](https://github.com/PurdueIEEE/boilerbooks/blob/master/api/src/common_items.js#L66)
* Rebuild and deploy the application as described in [deployment.md](deployment.md)

## Updating the MySQL database

The below is provided as an example, update the command to reflect all fiscal years supported.

* Run the command `docker exec -it boilerbooks-prod_db mysql -u root -p ieee-money` to enter the MySQL shell
* Run the command ``ALTER TABLE `Purchases` CHANGE `fiscalyear` `fiscalyear` ENUM('2015-2016','2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','2022-2023,'') NOT NULL DEFAULT '2022-2023';``
* Run the command ``ALTER TABLE `Income` CHANGE `fiscalyear` `fiscalyear` ENUM('2015-2016','2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','2022-2023,'') NOT NULL DEFAULT '2022-2023';``
* Run the command ``ALTER TABLE `Dues` CHANGE `fiscal_year` `fiscal_year` ENUM('2015-2016','2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','2022-2023,'') NOT NULL DEFAULT '2022-2023';``
* Run the command ``ALTER TABLE `Budget` CHANGE `year` `year` ENUM('2015-2016','2016-2017','2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','2022-2023,'') NOT NULL DEFAULT '2022-2023';``
