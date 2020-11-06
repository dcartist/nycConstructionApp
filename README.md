# NYC Construction App

## About this Repo
DOB Job Application Filing (API)

This API is from a dataset that contains all job applications submitted through the New York City Borough Offices, through eFiling, or through the HUB, which have a "Latest Action Date" since January 1, 2000.

## Technology Used

|                   |             |
| ----------------- | ----------- |
| javascript        | ExpressJs   |
| Mongoose/Mongo DB | Body-Parser |
| Heroku            | Cors        |

### Schemas Used

- Contractors ( The contractor who submitted a job)

- Job (The work that was done by the contractor)

- Property (The location of where the work was done)

- Property Owner (The owner of the property)




# Installation
### for Localhost

The following is the instructions in order:
1. Fork and clone the repo.
2. Use `npm install`
4. On a separate terminal window run `mongod`
5. In another terminal window run `mongo`
6. Run `node db/seed.js`
7. After running it in console, you  will see some messages. Once the messages stop press `Ctrl` + `C`
8. Run `node db/populate.js`
9. After 40 seconds use `Ctrl` + `C` to exit out of the file.
10. Run `nodemon index.js` to activate the app
11. In your browser go to localhost.com:8080/

# For Heroku App

https://whispering-bayou-30290.herokuapp.com/api/



## **Properties**

### Property Response:

```javascript
{
	"conLicense": String,
	"_id": ObjectID,
	"borough": String,
	"propNum": String,,
	"street_name": String,
	"propType": String,
	"city": String,
	"jobDescr": String,
	"address": String,
	"jobId": Number,
	"__v": Number,
}
```



#### Get All Properties:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/property/
```

#### Get Property by Borough:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/property/borough/<borough>
```

#### Get Property by City:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/property/city/<cityName>
```

#### Get Property by Address:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/property/address/<address>
```

#### Get Property by Street Number:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/property/streetnumber/<StreetNumber>
```

#### Delete a property by Id:

------

##### Request

```
DELETE https://whispering-bayou-30290.herokuapp.com/api/property/delete/<id>
```

#### Update a property by Id:

------

##### Request

```
PUT https://whispering-bayou-30290.herokuapp.com/api/property/update/<id>
```

#### Create a New Property:

------

##### Request

```
POST https://whispering-bayou-30290.herokuapp.com/api/property/new
```



## Contractor

### Contractor Response:

```javascript
{
	"conLicense": String,
	"_id": String,
	"conFirstName": String,
	"conLastName": String,
	"jobId": Number,
	"__v": Number,
}
```



#### Get All Contractors:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/contractor
```

#### Get Contractor by Last Name:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/contractor/name/<Last Name>
```

#### Get Contractor by ID:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/contractor/id/<id>
```

#### Delete a property by Id:

------

##### Request

```
DELETE https://whispering-bayou-30290.herokuapp.com/api/contractor/delete/<id>
```

#### Update a property by Id:

------

##### Request

```
PUT https://whispering-bayou-30290.herokuapp.com/api/contractor/update/<id>
```

#### Create a New Property:

------

##### Request

```
POST https://whispering-bayou-30290.herokuapp.com/api/contractor/new
```



## Job

### Job Response:

```javascript
{
	{
		"_id": String,
		"owner": {
			"_id": String,
			"ownType": String,
			"ownFirstName": String,
			"ownLastName": String,
			"ownBusinessName":String,
			"jobId": Number,
			"__v": Number
			},
		"contractor": {
			"conLicense": String,
			"_id": String,
			"conFirstName": String,
			"conLastName": String,
			"jobId": Number,
			"__v": Number
			},
	"property": {
		"conLicense": String,
			"_id": String,
			"borough": String,
			"propNum": String,
			"street_name": String,
			"propType": String,
			"city": String,
			"jobDescr": String,
			"jobId": Number,
			"__v": Number
			},
	"jobId": Number,
	"__v": Number
	}
}
```



#### Get All Jobs:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/job/
```

#### Get Contractor by Last Name:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/contractor/name/<Last Name>
```

#### Get Jobs by ID:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/job/id/<id>
```



# Property Owner

### Property Owner Response:

```javascript
{
	"_id": String,
	"ownType": String,
	"ownFirstName": String,
	"ownLastName": String,
	"ownBusinessName": String,
	"jobId": Number,
	"__v": Number,
}
```



#### Get All Property Owners:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/owner
```

#### Get Property Owner by Last Name:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/owner/name/<Last Name>
```

#### Get Property Owner by type:

------

##### Request

```
GET https://whispering-bayou-30290.herokuapp.com/api/owner/type/<type>
```

#### Delete a property by Id:

------

##### Request

```
DELETE https://whispering-bayou-30290.herokuapp.com/api/owner/delete/<id>
```

#### Update a property by Id:

------

##### Request

```
PUT https://whispering-bayou-30290.herokuapp.com/api/owner/update/<id>
```

#### Create a New Property:

------

##### Request

```
POST https://whispering-bayou-30290.herokuapp.com/api/owner/new
```
