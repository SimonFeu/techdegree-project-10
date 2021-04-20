# techdegree-project-10
### Full Stack App with React and a REST API

## How to Download and Install
1) Download the repo
2) Open a Command Prompt (on Windows) or Terminal (on macOS and Linux) instance and browse to the "api" folder.
3) Run the command "npm install" to install the required dependencies.
4) Run the command "npm seed" to create your application's database and populate it with data.
   (After the command completes, you'll find in the project's root folder a SQLite database file named fsjstd-restapi.db) 
5) Run the command npm start to run the REST API (The REST API is listening on port 5000 -> http://localhost:5000/).
6) Open a Command Prompt (on Windows) or Terminal (on macOS and Linux) instance and browse to the "client" folder.
7) Run the command npm install to install the required dependencies.
8) Run the command npm start to run the the client application (The client is listening on port 3000 -> http://localhost:3000/).


## About the Project
In this project, I developed a Full Stack App with React and REST API.

   ### Backend
   The API provides users with the ability to manage a school database. With the API you can:
   - create new users
   - retrieve user data
   - display individual courses or course lists
   - create, update or delete courses
   ### Frontend
   - The frontend is build with React and enables the user to interact via "User Interface" with the database


## Tech Stack / Used Frameworks
- Express
- Sequelize ORM
- express-validator
- bcryptjs
- basic-auth
- cors
- React Context API
- react-router-dom
- create-react-app
- react-markdown
- fetch

## Helpful Tools
- DB Browser for SQLite for viewing SQLite database tables 
- Postman for the route testing


## Routes
Users:
| Method  | Path | Description|
| ------------- | ------------- | ------------- |
| GET | http://localhost:5000/api/users/:id  |Getting the data from currently authenticated user|
| POST | http://localhost:5000/api/users  | Creating a new user|

Users:
| Method  | Path | Description|
| ------------- | ------------- | ------------- |
| GET | http://localhost:5000/api/courses/  | Sending a list of courses as response|
| GET | http://localhost:5000/api/courses/:id  |Sending a specific courses as response|
| POST | http://localhost:5000/api/courses  |Creating a new course|
| PUT | http://localhost:5000/api/courses/:id  |Updating a specific course|
| DELETE | http://localhost:5000/api/courses/:id  |Deleting a specific course|


## Example of the User routes

```javascript
'use strict';

const express = require('express');
const User = require('../models').User;
const { check, validationResult } = require('express-validator');
const authenticateUser = require("./userauthentication");
const bcryptjs = require('bcryptjs');


// Construct a router instance.
const router = express.Router();



/*----------------------------------------------------------------
                Route-Handler (asyncHandler)
 -----------------------------------------------------------------
    * To make the try-catch-block easier to use 
      and not to have to repeat it all the time we 
      use the middlewar "asyncHandler"
 ----------------------------------------------------------------*/
// Handler function to wrap each route.
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
    }
  }



  

 /*----------------------------------------------------------------
                                GET-Route
 -----------------------------------------------------------------
    *  This route returns the current authenticated user.
    * it uses the middleware "authenticateUser" to get the current authenticated user
 ----------------------------------------------------------------*/
  router.get('/', authenticateUser, asyncHandler( async (req, res) => {
    /*
        The middleware "authenticateUser" stores the "currentUser"
        on the request-object. So we get the current user by
        calling "req.currentUser".
    */
    const user = req.currentUser;
  
    /*
        The current user "firstName", "lastName" and "emailAddress" 
        are send as response with the status code 200.
    */ 
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
    }
));

  



/*----------------------------------------------------------------
                        Input Validation
 -----------------------------------------------------------------
    The function "inputValidator" validates the input for 
    "firstName","lastName","emailAddress","password"
    It is used in the post-route to validate the Input 
    before it is send to the database 
 ----------------------------------------------------------------*/
//Validation for the post route
const inputValidator = [
    check('firstName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "first name"'),
    check('lastName')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "last name"'),
    check('emailAddress')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "email"'),
    check('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "password"')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password length must be between 8 and 20 characters'),
  ];
  






 /*----------------------------------------------------------------
                            POST - route
 -----------------------------------------------------------------
    *  This route creates a new user
    *  First the input data is validated
    *  Then we check if the user is unique or already exists
    *  If user doesn't exist the password is hashed and the user is created
 ----------------------------------------------------------------*/
    router.post('/', inputValidator, asyncHandler( async (req, res) => {
		 //Storing the "validationResult" in variable "errors"
         const errors = validationResult(req);
  
         // If there are validation errors "errors.isEmpty()" would be false. 
        // Therfore the not-operator "!" is used, so that it has the value "true" if a validation error exists
         if (!errors.isEmpty()) {
            // Here the map function is used, to get a list of error messages 
           const errorMessages = errors.array().map(error => error.msg);
          // The Error Message with the status 400 is returned as json object
           return res.status(400).json({ errors: errorMessages });
         }
       
         // Get the user from the request body.
         const user = req.body;

        // check if user already exists in Users table
		 const userIsExisting = await User.findOne({
			where: {
				emailAddress: user.emailAddress
			}
		});


        if(userIsExisting) {
            //if user already exists a status code 400 is send to the client, with 
            res.status(400).json({ message: "Email must be unique. This email already exists." });
        } else {
            // Hash the new user's password.
            user.password = bcryptjs.hashSync(user.password);
            // Add the user to the `users` table.
            await User.create(user);
        
            // Set the status to 201 Created and end the response.
            return res.location('/').status(201).end();
        }
		
	}
));


module.exports = router;
