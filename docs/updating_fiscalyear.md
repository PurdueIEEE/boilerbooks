# Updating the fiscal year

Updating to add a new fiscal year can be done in the User Interface. Navigate to the Infrastructure tab and "Add Fiscal Year".
Enter the next year in the text box and press the green button. If any red messages appear, fix the problem reported with the input.

For ease of use, you should also update the [sample data set](/.devcontainer/sample-data.sql) to avoid any errors in development.

## Updating the sample data

* Add a new entry towards the end of the file with the new fiscal year id and fiscal year string
* Rebuild any devcontainer images for development
