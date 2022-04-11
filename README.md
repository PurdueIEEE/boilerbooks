# Boiler Books

The ultimate IEEE financial recordkeeping system! Boiler Books is used to track income, expenses, dues, and more across all of Purdue IEEE. Originally written with PHP in 2016, it has since been rewritten in JavaScript in 2022.

This system has three components: the database, the API, and the UI. The database is a standard MySQL installation, the API is an Express server, and the UI is a Vue SPA.

Boiler Books is hosted at [money.purdueieee.org](https://money.purdueieee.org).

## Documentation

All the documentation is available in the `docs/` folder, broken up by topic.

* Updating the Fiscal Year to match the current one: [updating_fiscalyear.md](docs/updating_fiscalyear.md)
* Setting up a development environment: [development.md](docs/development.md)
* Deploying app for production: [deployment.md](docs/deployment.md)
* API endpoint documentation: [api_endpoint.md](docs/api_endpoints.md)

## Features

Boiler Books allows any user to create purchase reqeusts on behalf of committees, broken up by budget category. Authorized committee members approve or deny these requests, and the request user can complete their purchase. Finally, the treasurer can reimburse the user for purchases.

Income is also tracked through Boiler Books. Any authorized committee member can create a donation they expect to receive, and the treasurer can modify the income status as it arrives.

Any authorized committee member can view summaries for the committees, listing budgetary breakdowns, income and expense breakdowns, and export purchases as a CSV.

All users can see the dues they have paid thus far and officers can view all dues paying members. Treasurers can report new dues at the start of the semester.

Officers must submit budgets to the treasurer who can approve the budget request for the current fiscal year. Once approved, any user can create purchase requests.

The treasurer can add and remove authorized committee members, officers, and other treasurers from the permission list.
