# v2 API Design

## Note

All actions should be able to be completed using only the API. In BBv1, actions are performed from the API and from the UI. To create a separable web application, all UI code should be decoupled from the API.

## Workflows

### Creating a User Account

1. User creates a user account
2. User account permisions can be elevated/lowered using ACLs
3. User views what purchases they have made

### Committee Budgeting

1. Committee Chair enters a budget
2. Committee Chair submits a budget
3. Treasurer approves a budget

### Committee Purchasing

1. User makes a purchase request
2. Committee Approvers approve purchase request
3. User completes purchase
4. Treasurer reimburses purchase

### Income Tracking

1. Income is reported by Officers OR Income is received by BOSO
2. Treasurer marks income status

### Financial Auditing

1. Treasurer and President view all financial transactions
2. Reports filterable based on committe, type, year
3. Committee Chairs view transactions for specific committee

### Dues Tracking

1. Users view their current paid dues
2. Committee Chairs view all dues paying members
3. Treasurer enters members into database

## Endpoints

Each endpoint is prefaced with `/api/v2/`.

Authentication handled by API Token, Authorization handled by ACL on user account

* `/access`: endpoint for setting ACLs
    * `/access/tresurers`
        * GET: get a list of all current treasurers
        * POST: Add a new treasurer
    * `/access/officers`
        * GET: get a list of all current officers
        * POST: Add a new officer
    * `/access/internals`
        * GET: get a list of all current internal leads
        * POST: Add a new internal lead
    * `/access/approvals/{approver}`
        * DELETE: remove approver from ACLs

<hr>

* `/account`: endpoint for user accounts
    * POST: create new account
    * `/account/{user_id}`
        * GET: user details
        * PUT: update account details
        * POST: change account password
    * `/account/{user_id}/purchases`
        * GET: all user purchases
    * `/account/{user_id}/approvals`
        * GET: all purchases user can approve
    * `/account/{user_id}/completions`
        * GET: all purchases user can complete
    * `/account/{user_id}/reimbursements`
        * GET: all purchases uer can reimburse
    * `/account/{user_id}/balances`
        * GET: all committee balances user can view
    * `/account/{user_id}/committees`
        * GET: all committee where user has approval powers
    * `/account/{user_id}/committee/purchases`
        * GET: last committee for which a user made a purchase
    * `/account/{user_id}/committee/income`
        * GET: last committee for which a user entered any income

<hr>

* `/budgets`: endpoint for budgets
    * `/budgets/years`
        * GET: view all fiscal years
    * `/budgets/{committee_id}`
        * POST: submit a committee budget
        * PUT: approve a committee budget
    * `/budget/submitted`
        * GET: view all submitted budgets

<hr>

* `/committee`: endpoint for committee finances
    * GET: list of all committees
    * `/committee/{committee_id}/categories`
        * GET: list all committee budget categories
    * `/committee/{committee_id}/balance`
        * GET: view total committee balance
    * `/committee/{committee_id}/budget/{year?}`
        * GET: view committee budget for an optional year
    * `/committee/{committee_id}/expensetotal/{year?}`
        * GET: view committee expenses total for an optional year
    * `/committee/{committee_id}/incometotal/{year?}`
        * GET: view committee income total for an optional year
    * `/committee/{committee_id}/purchases/{year?}`
        * GET: view committee expenses list for an optional year
    * `/committee/{committee_id}/income/{year?}`
        * GET: view committee income list for an optional year
    * `/committee/{committee_id}/summary/{year?}`
        * GET: view committee financial summary for an optional year

<hr>

* `/dues`: endpoint for dues tracking
    * POST: add a new dues member
    * `/dues/committees`
        * GET: list all dues committees (different from fiscal committees)
    * `/dues/summary/{year?}`
        * GET: view total counts of dues members for each committee
    * `/dues/all/{year?}`
        * GET: view all dues paying members for a year

<hr>

* `/income`: endpoint for committee income
    * POST: report a new income
    * GET: view all reported income
    * `/income/{income_id}`
        * PUT: update income status

<hr>

* `/login`: endpoint for authentication
    * POST: login user
    * `/forgot-user`
        * POST: find all usernames associated with an email
    * `/forgot-pass`
        * POST: send password reset email to user
    * `/reset`
        * POST: reset a user account password

<hr>

* `/purchase`: endpoint for purchasing
    * POST: create a new purchase request
    * `/purchase/treasurer`
        * POST: reimburse purchases
    * `/purchase/{purchase_id}`
        * GET: view details of a purchase
        * DELETE: cancel a purchase
    * `/purchase/{purchase_id}/approve`
        * POST: approve or deny purchase request
    * `/purchase/{purchase_id}/complete`
        * POST: complete a purchase request

<hr>

* `/receipt`: endpoint for purchase receipts
    * `/receipt/{file}`
        * GET: view a purchase receipt
