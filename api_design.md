# v2 API Design ===WIP===

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
1. Income is recieved by BOSO
2. Treasurer reports income and assigns to committee

### Dues Tracking
1. Users view their current paid dues
2. Committee Chairs enter members, [dues unpaid]
3. Treasurer enters members [dues paid], marks unpaid dues as paid

### Financial Auditing
1. Treasurer, President, Secretary view all financial transactions
2. Reports filterable based on committe, type, year
3. Committee Chairs view transactions for specific committee

## Endpoints
Each endpoint should be prefaced with a versioning scheme, like `/api/v2` or just `/v2`

Authentication handled by API Token, Authorization handled by ACL on user account

* (TBD) Authentication endpoint
* `/account`: endpoint for user accounts
    * POST: create new account
    * `/account/{user_id}`
        * GET: user details
        * DELETE: delete user account
        * PUT: update ACL permissions
    * `/account/{user_id}/purchases`
        * GET: all user purchases
    * `/account/{user_id}/dues`
        * GET: view all paid dues
        * POST: add membership to committee, mark unpaid
* `/budgets`: endpoint for budgets
    * no methods
    * `/budgets/{committee_id}`
        * GET: view all budgets for committee
        * POST: create new annual budget for committee
    * `/budgets/{committee_id}/{year}`
        * GET: view budget for year
        * PUT: modify budget
        * POST: submit or approve budget
    * `/budget/{committee_id}/submitted`
        * GET: view submitted budgets
    * `/budget/{committee_id}/approved`
        * GET: view approved budgets
* `/purchase`: endpoint for purchasing
    * no methods
    * `/purchase/view/{purchase_id}`
        * GET: view purchase
    * `/purchase/new`
        * POST: create a new purchase request
    * `/purchase/request/{purchase_id}`
        * POST: approve purchase request
    * `/purchase/complete/{purchase_id}`
        * POST: complete purchase request
    * `/purchase/treasurer/{purchase_id}`
        * POST: update purchase status
* `/dues`: (TBD) Dues endpoint
