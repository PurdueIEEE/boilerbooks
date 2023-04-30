# Boiler Books

The ultimate student organization financial recordkeeping system!
Boiler Books is used to track income, expenses, dues, and more across an entire club.
Originally written with PHP in 2016, it has since been rewritten in JavaScript in 2022.

This system has three components: the database, the API, and the UI. The database is a standard MySQL installation, the API is an Express server, and the UI is a Vue SPA.

## Public Demos

A public demo Boiler Books instance _will_ be hosted at [fake-money.purdueieee.org](https://fake-money.purdueieee.org).
This demo will reset itself every 12 hours.

The following usernames / passwords will be active for the demo instance:

* username / password / role
* master   / password / Admin Account
* treas    / password / Treasurer
* officer  / password / Officer
* internal / password / Internal Leader
* member   / password / Regular Member

<hr>

Purdue IEEE's Boiler Books instance is hosted at [money.purdueieee.org](https://money.purdueieee.org).

## Features

Boiler Books allows any user to create purchase reqeusts on behalf of committees, broken up by budget category. Authorized committee members approve or deny these requests, and the request user can complete their purchase. Finally, the treasurer can reimburse the user for purchases.

Income is also tracked through Boiler Books. Any authorized committee member can create a donation they expect to receive, and the treasurer can modify the income status as it arrives.

Any authorized committee member can view summaries for the committees, listing budgetary breakdowns, income and expense breakdowns, and export purchases as a CSV.

All users can see the dues they have paid thus far and officers can view all dues paying members. Treasurers can report new dues at the start of the semester.

Officers must submit budgets to the treasurer who can approve the budget request for the current fiscal year. Once approved, any user can create purchase requests.

The treasurer or admin can add and remove authorized committee members, officers, and other treasurers from the permission list.

The treasurer or admin can create new committees and fiscal years right from the interface.

## Documentation

All the documentation is available in the `docs/` folder, broken up by topic.

* Updating the Fiscal Year to match the current one: [updating_fiscalyear.md](docs/updating_fiscalyear.md)
* Setting up a development environment: [development.md](docs/development.md)
* Deploying app for production: [deployment.md](docs/deployment.md)
* API endpoint documentation: [api_endpoint.md](docs/api_endpoints.md)

## Before You Deploy

The prebuilt UI Docker image expects you to be using the Purdue IEEE SSO system.
Because the constants are baked in at build time, if you are not utilizing this system you will need to build the image from scratch after modifications.

### Docker Image Tag Policy

We tag and maintain a few series of Docker image tags:
* `latest`, `2.3`, `2` : latest release
* `master`, `master-dev` (UI only) : latest master commit

The Boiler Books release cadence is around 2 times a year.
If there is an urgent fix you need, the `master` tags on the prebuilt Docker images are always built from the latest master.

## Support

If you encounter a bug or want to suggest a new feature, create a [new issue](https://github.com/PurdueIEEE/boilerbooks/issues/new). If you have an urgent problem, reach out to our infrastructure team via email at [ieee-infrastructure@purdueieeeorg](mailto:ieee-infrastructure@purdueieee.org).
