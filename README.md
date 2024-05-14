# Eind oplevering project voor Programmeren 4

Hallo, dit is de versie van Renze Westerink van het eind project van Programmeren 4.

## Installing

To install clone and run `npm install`.

## Local server
To run the server localy, whilst having a server active, type `npm start`. (or you can use `npm run dev` whilst programming.
There are also 2 scripts you can run on your server to create a database and put information in it:

- share-a-meal.create.sql -> to create the database
- share-a-meal.sql -> to populate the database

## .env
You have to add a .env file with the following atributes of your local server
DB_HOST=
DB_PORT=
DB_USER=
DB_DATABASE=share-a-meal
DB_PASSWORD=

## Test
You can run `npm test` or `clear && npm test` (to get a clean console) to see the test results. The database connected in the .env needs to be active...

## Repopulate the database
You can also use `npm run addData` to repopulate the database if its already there. This uses the following command: "mysql -u root -e \"USE share-a-meal; SOURCE share-a-meal.sql;\"". Depending on where your database is running you need to edid this.

## Release
The server uses the release branche and not the main...
