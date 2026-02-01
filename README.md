# nycConstructionApp

## About this Repo

DOB Job Application Filing

This dataset contains all job applications submitted through the Borough Offices, through eFiling, or through the HUB, which have a "Latest Action Date" since January 1, 2000.

## Technology Used

*   javascript
*   ExpressJS
*   Jest
*   Swagger
*   Morgan
*   Heroku
*   Mongoose/Mongo DB
*   Cors
*   Body-Parser

# Installation

## for Localhost

The following is the instructions in order:

1.  Fork and clone the repo.
2.  Use `npm init`
3.  Use `npm install`
4.  On a separate terminal window run `mongod`
5.  In another terminal window run `mongo`
6.  Run `node db/seed.js`
7.  After running it in console, you will see some messages. Once the messages stop press `Ctrl` + `C`
8.  Run `node db/populate.js`
9.  After 40 seconds use `Ctrl` + `C` to exit out of the file.
10.  Run `nodemon index.js` to activate the app
11.  In your browser go to localhost.com:8080/

# For Heroku App or Postman

Main App:  
https://whispering-bayou-30290.herokuapp.com/api/

## Updates:

The API has been changed to have the original (v1) and also version 2 (v2)

[version one link](/version1.md)