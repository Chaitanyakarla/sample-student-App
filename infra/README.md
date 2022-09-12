# Overview
The infrastructure folder handles scripts for automating the creation of both
infrastructure, as well as partner data setup.

## Creating a new Organization
1. Modify `database/testdata/insert_organizations.sql` with the relevant details.
2. Create the IdP configuration (Auth0 or Okta) or get the config from an admin.
If you're using the R&P Okta org, then use `okta/okta-application/main.tf` to create
a new Application and new Authorization Server.
3. Get the IdP config details and edit `database/testdata/insert_applications.sql` to
insert a new application (let psql create the apikey for you, but grab and it paste it
into the sql for the next time).