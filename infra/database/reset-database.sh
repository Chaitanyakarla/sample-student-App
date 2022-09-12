#!/usr/bin/env zsh

echo "WARNING! You are about to drop (and recreate) all data in: [ $PGHOST ]."
echo "Are you sure (y/N)?"; read doit


if [ "$doit" = "y" ]
then
	echo '*** Dropping all tables ***'
	psql -f sql/drop_tables.sql

	echo '*** Recreating schema ***'
	psql -f sql/create_schema.sql

	echo '*** Inserting bootstrap data ***'
	psql -f testdata/insert_organizations.sql
	psql -f testdata/insert_applications.sql
fi
