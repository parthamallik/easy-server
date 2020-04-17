# easy-db
A container to persist all data for easy-server. It can be run from the main docker-compose file. or can be run individually.
If you wish to use a standalone postgress server. please initialise it with the init.sql

dropdb ikigai;
createdb ikigai;
psql -d ikigai -f init.sql
