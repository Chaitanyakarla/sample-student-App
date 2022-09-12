#!/usr/bin/env zsh

psql -f sql/create_schema.sql

psql -f testdata/insert_applications.sql
