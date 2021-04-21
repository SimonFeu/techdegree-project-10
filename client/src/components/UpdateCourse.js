import React, {Component } from 'react';
import ValidationMessage from './ValidationMessage';
import { Consumer } from './Context';
import { Link } from 'react-router-dom';

class UpdateCourse extends Component {

    constructor() {
        super();
        this.state = {
          title: "",
          author:"",
          userAuth:false,
          description:"",
          estimatedTime:"",
          materialsNeeded:"",
          errorMsg:""
        };
      } 
      
      /* -------------------------------------------------------------------
                            postData function 
        -------------------------------------------------------------------
          This function receives the data from state and updates the coursedata in the database via fetch.
          Data can only be send to the database if the user is authorized. Password and Email
          are send in the fetch headers for authorization. We get this data from the Consumer.
          If the status code is not 204 an response error message is save into the variable "errorMsg".
          This is used to show validation errors on to the webpage in the component "ValidationMessage" seen below.
          If the status is 204 the user is redirected to the "course detail page".
          If another error occurs the user is redirected to the "error" path.
      */
      putData = (event, email, password) => {
        event.preventDefault();
        let title = this.state.title;
        let description = this.state.description;
        let estimatedTime = this.state.estimatedTime;
        let materialsNeeded = this.state.materialsNeeded;
        let statCode=500;

          fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Basic ${btoa(`${email}:${password}`)}`
                },
                body: JSON.stringify({title,description,estimatedTime, materialsNeeded})
            })
            .then(respond => {
                statCode = respond.status;
                if(statCode!==204){
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
                this.props.history.push(`/courses/${this.props.match.params.id}`);
              }
            })
            .catch(error => {
                if(error){
                    this.props.history.push('/error');
                }
            })
        } 
        

        /*
          When the component is mounted in the DOM, the courses data is loaded using fetch
          and stored in the state variable "courses". If a status code of 404 is send, the user
          will be redirected to the  "notfound" path. If the id of the logged user does not match
          the user id in the course data, the user will be redirected to the "forbidden" path.
          If another error occurs, catch redirects to the "error" path. 
        */
        componentDidMount() {
            let statusCode;
            fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
            .then(response => { 
              statusCode = response.status;
              return response.json();
            })
            .then(responseData => {
              if(statusCode===404){
                this.props.history.push('/notfound');
              }
              else if(responseData.userId !== this._userId) {
                this.props.history.push('/forbidden');
              } else { 
                this.setState({ 
                  title: responseData.title,
                  author: `${responseData.User.firstName} ${responseData.User.lastName}`,
                  description: responseData.description,
                  estimatedTime: responseData.estimatedTime || '',
                  materialsNeeded: responseData.materialsNeeded || '',
                  userId: responseData.userId || null
                });
              }
            })
            .catch(error => {
              console.log('Error fetching and parsing data', error);
              this.props.history.push('/error');
            })
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

  /*
    This variable is set to use the value of "context.id" outside of the Consumer-Component.
    If we would use setState and a state variable, this would lead to a react warning message.
  */
  _userId=null;

  render(){
    return(
       <Consumer>
         {context => {
                      this._userId=context.id
                      return(
                        <main>                
                            <div className="wrap">
                                <h2>Update Course</h2>
                                {/* Component "ValidationMessage" gets renderd if a validation error occurs */}
                                {
                                    (this.state.errorMsg.length>0) ?
                                        <ValidationMessage errorMsg={this.state.errorMsg}/>
                                    : ''
                                } 
                                <form onSubmit={(event) => this.putData(event, context.email, context.password )}>
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
                                                value={this.state.author} 
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
                                    <button className="button" type="submit">Update Course</button>
                                    <Link className="button button-secondary" to="/">Cancel</Link>
                                </form>
                                
                            </div>
                        </main>
                    );
                    }
                  }                  
       </Consumer>
    );
  }
} 

export default UpdateCourse;



