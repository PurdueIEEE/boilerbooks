# v2 API Design ===WIP===

## Note
All actions should be able to be completed using only the API. In BBv1, actions are performed from the API and from the UI. To create a separable web application, all UI code should be decoupled from the API.

## Workflows

### Creating a User Account
1. User creates a user account
2. User account permisions can be elevated/lowered using ACLs

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

### Financial Auditing
1. Treasurer, President, Secretary view all financial transactions
2. Reports filterable based on committe, type, year

## Endpoints
Each endpoint should be prefaced with a versioning scheme, like `/api/v2` or just `/v2`
