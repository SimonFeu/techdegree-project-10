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
