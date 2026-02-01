# Version 1

# Installation
## for Localhost

The following is the instructions in order:
1. Fork and clone the repo.
2. Use `npm init`
3. Use `npm install`
4. On a separate terminal window run `mongod`
5. In another terminal window run `mongo`
6. Run `node db/seed.js`
7. After running it in console, you  will see some messages. Once the messages stop press `Ctrl` + `C`
8. Run `node db/populate.js`
9. After 40 seconds use `Ctrl` + `C` to exit out of the file.
10. Run `nodemon index.js` to activate the app
11. In your browser go to localhost.com:8080/

## Property:

to show all the properties:
https://whispering-bayou-30290.herokuapp.com/api/property/

to search by city:
(insert city at the end)
https://whispering-bayou-30290.herokuapp.com/api/property/city/

to search by address:
(insert address at the end)
https://whispering-bayou-30290.herokuapp.com/api/property/address/

to search by streetnumber:
(insert address at the end)
https://whispering-bayou-30290.herokuapp.com/api/property/streetnumber/

to search by borough:
(insert borough at the end)
https://whispering-bayou-30290.herokuapp.com/api/property/borough/

Property to insert a new document:
https://whispering-bayou-30290.herokuapp.com/api/property/new

Property to update a document use the _id:
https://whispering-bayou-30290.herokuapp.com/api/property/update/

Property to delete a document use the _id:
https://whispering-bayou-30290.herokuapp.com/api/property/delete/

## Contractor:

Shows all the contractors
https://whispering-bayou-30290.herokuapp.com/api/contractor

Search by last name:
(insert name at the end)
https://whispering-bayou-30290.herokuapp.com/api/contractor/name/

Contractor to insert a new document:
https://whispering-bayou-30290.herokuapp.com/api/contractor/new

Contractor to update a document use the _id
https://whispering-bayou-30290.herokuapp.com/api/contractor/update/

Contractor to delete a document use the _id
https://whispering-bayou-30290.herokuapp.com/api/contractor/delete/


## Job:

lists and shows owner, contractor, properties by jobId
https://whispering-bayou-30290.herokuapp.com/api/job/

Search for jobs by JobId:
(insert a numerical value for the jobId)
https://whispering-bayou-30290.herokuapp.com/api/job/id/

## Property Owner:

Shows all the property owners
https://whispering-bayou-30290.herokuapp.com/api/owner

Search by last name:
(insert name at the end)
https://whispering-bayou-30290.herokuapp.com/api/owner/name/

Owner to insert a new document:
https://whispering-bayou-30290.herokuapp.com/api/owner/new

Owner to update a document use the _id
https://whispering-bayou-30290.herokuapp.com/api/owner/update/

Owner to delete a document use the _id
https://whispering-bayou-30290.herokuapp.com/api/owner/delete/

