# AWS Middleware Database

The database currently contains config, local data (user identity) and some caching
to improve performance.

To execute these scripts from your localhost, it assumes that:
- you have set the standard env vars for `psql` (see the `setEnv.sh` file as an example)
- have access to the AWS database host via a ssh tunnel (future requirement. not current as of Jan 2022)
- the database has already been created 