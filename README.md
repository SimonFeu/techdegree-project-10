# techdegree-project-10
### Full Stack App with React and a REST API
This Full Stack App provides a way for users to administer a school database via a webbase "User Interface". Data is loaded and stored via the REST API.


![image](https://user-images.githubusercontent.com/63255333/115453924-74f81280-a220-11eb-97da-673d7fc1e9f3.png)


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


## Example 
### Frontend (Client):	CreateCourse

```javascript
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ValidationMessage from './ValidationMessage';
import { Consumer } from './Context';

class CreateCourse extends Component {

    constructor() {
        super();
        this.state = {
          title: "",
          author:"",
          description:"",
          estimatedTime:"",
          materialsNeeded:"",
          errorMsg:""
        };
      } 


      /* --------------------------------------
                     handleChange 
         --------------------------------------
         This function is used to receive the changes in the input field of the form.
         If a user types data into a form input field the values are saved via setState.
      */
      handleChange = (event) => {
        let targetName = event.target.name;
        if(targetName === 'courseTitle') {
            this.setState({ title: event.target.value });
        } else if (targetName === 'courseDescription'){
            this.setState({ description: event.target.value });
        } else if (targetName === 'estimatedTime'){
            this.setState({ estimatedTime: event.target.value });
        } else if (targetName === 'materialsNeeded'){
            this.setState({ materialsNeeded: event.target.value });
        }
      }

      



      render(){
        return(
            <Consumer>
            {context => {
                    /* --------------------------------------
                                postData function 
                        --------------------------------------
                        This function receives the data from state and sends it to the database via fetch.
                        Data can only be send to the database if the user is authorized. Password and Email
                        are send in the fetch headers for authorization. We get this data from the Consumer.
                        If the status code is not 201 an response error message is save into the variable "errorMsg".
                        This is used to show validation errors on to the webpage in the component "ValidationMessage" seen below.
                        If the status is 201 the user is redirected to the home screen.
                        If another error occurs the user is redirected to the "error" path.
                    */
                   const postData = (event) => {
                        event.preventDefault();
                        let title = this.state.title;
                        let description = this.state.description;
                        let estimatedTime = this.state.estimatedTime;
                        let materialsNeeded = this.state.materialsNeeded;
                        let statCode = null;
                            fetch('http://localhost:5000/api/courses', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Authorization': `Basic ${btoa(`${context.email}:${context.password}`)}`
                                },
                                body: JSON.stringify({title,description,estimatedTime, materialsNeeded})
                            })
                            .then(respond => {
                                statCode = respond.status;
                                if(statCode!==201){
                                    return respond.json();   
                                }
                            })
                            .then(res => {
                            if(res){
                                if(res.message){
                                this.setState({errorMsg: [res.message]});
                                }
                            else if(res.errors){
                                this.setState({errorMsg: res.errors});
                                }             
                            }  else {
                                this.props.history.push(`/`);
                            }
                            })
                            .catch(error => {
                                if(error){
                                    this.props.history.push('/error');
                                }
                            })
                    }
                    return(
                            <main>
                                <div className="wrap">
                                <h2>Create Course</h2>   
                                    {/* Component "ValidationMessage" gets renderd if a validation error occurs */}
                                    {
                                        (this.state.errorMsg.length>0) ?
                                            <ValidationMessage errorMsg={this.state.errorMsg}/>
                                        : ''
                                    }
                                
                                        <form onSubmit={postData}>
                                        <div className="main--flex">
                                            <div>
                                                <label htmlFor="courseTitle">Course Title</label>
                                                <input 
                                                    id="courseTitle" 
                                                    name="courseTitle" 
                                                    type="text" 
                                                    value={this.state.title} 
                                                    onChange={this.handleChange}
                                                />
        
                                                <label htmlFor="courseAuthor">Course Author</label>
                                                <input 
                                                    id="courseAuthor" 
                                                    name="courseAuthor" 
                                                    type="text" 
                                                    value={context.username} 
                                                    style={{backgroundColor:'#e7e7e7'}}
                                                    readOnly
                                                />
        
                                                <label htmlFor="courseDescription">Course Description</label>
                                                <textarea 
                                                    id="courseDescription" 
                                                    name="courseDescription" 
                                                    value={this.state.description} 
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="estimatedTime">Estimated Time</label>
                                                <input 
                                                    id="estimatedTime" 
                                                    name="estimatedTime" 
                                                    type="text" 
                                                    value={this.state.estimatedTime} 
                                                    onChange={this.handleChange}
                                                />
        
                                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                                <textarea 
                                                    id="materialsNeeded" 
                                                    name="materialsNeeded" 
                                                    value={this.state.materialsNeeded}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <button className="button" type="submit">Create Course</button>
                                        <Link className="button button-secondary" to="/">Cancel</Link>
                                    </form>
                                </div>
                            </main>
                    );
            }}
            </Consumer>
                        
        );
      }
} 

export default CreateCourse;
```
### Backend (REST API):  User routes

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
