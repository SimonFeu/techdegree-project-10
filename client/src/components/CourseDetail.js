import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Consumer } from './Context';


//This Component the details of a signl course
class CourseDetail extends Component {
   
    constructor() {
        super();
        this.state = {
          course: [],
          loading: true
        };
      } 

      /* 
        When the component is mounted in the DOM, the course data is loaded using fetch
        and stored in the state variable "course". If an error occurs with the status code 404, 
        the user is redirected to the "notfound" path. If another error occurs, catch redirects to the "error" path. 
      */
      componentDidMount() {
        let statusCode=0;
        fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
          .then(response => {
            statusCode = response.status;
            return response.json();
          })
          .then(responseData => {
            if(statusCode === 404){
              this.props.history.push('/notfound');
            } else {
              this.setState({ 
                course: responseData,
                loading: false 
              });
            }
          })
          .catch(error => {
            this.props.history.push('/error');
            console.log('Error fetching and parsing data', error);
          });
      }

      /*
        This function delets the course data. It takes in the email and password to authorize the user.
        If the status code is 204 the course is deleted and the user is redirected to the home screen,
        If the status code is 403 the user is redirected to the "forbidden" path.
        If the status code is 404 the user is redirected to the "notfound" path.
        If another error occurs the user is redirected to the "error" path.
      */
      deleteData = (event,email,password) => {
        event.preventDefault();
        let statCode=null;
          fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Authorization': `Basic ${btoa(`${email}:${password}`)}`
              }
            })
            .then(respond => {
                statCode = respond.status;
                if(statCode!==204){
                    return respond.json();   
                }
            })
            .then(res => {
                if(statCode===403){
                  this.props.history.push(`/forbidden`);
                  console.log(res.message);
                } else if(statCode===404){
                  this.props.history.push(`/notfound`);
                  console.log(res.message);
                } else {
                  this.props.history.push(`/`);
                }
            })
            .catch(error => {
                if(error){
                    this.props.history.push('/error');
                }
            })
      }


  render(){
    let title="";
    let user="";
    let description="";
    let estimatedTime="";
    let materialsNeeded="";

    /*
        The loading status is set to false if all state variables received their data.
        With the if-condition can be ensured that the state variables are only 
        transmitted to the page when they have been completely supplied by the database.
    */
    if(!this.state.loading) {
      title=this.state.course.title;
      user=`${this.state.course.User.firstName} ${this.state.course.User.lastName}`;
      description=this.state.course.description;
      estimatedTime=this.state.course.estimatedTime;
      materialsNeeded=this.state.course.materialsNeeded;
    }
    return(
      <Consumer>
        {context => {
           
          return(
                <main>
                <div className="actions--bar">
                    
                    {/* The buttons "update" and "delete" are only shown if the userid of the logged in user matches the user id of the course data */}
                      { (context.id === this.state.course.userId) 
                        ? 
                          <div className="wrap">
                            <Link className="button" to={`${this.props.match.url}/update`}>Update Course</Link>
                            <button className="button" onClick={(event) => this.deleteData(event,context.email,context.password)}>Delete Course</button>
                            <Link className="button button-secondary" to="/">Return to List</Link>
                          </div>
                        : 
                          <div className="wrap">
                              <Link className="button button-secondary" to="/">Return to List</Link>
                          </div>
                      }
                </div>
        
                <div className="wrap">
                    <h2>Course Detail</h2>
                    <form>
                        <div className="main--flex">
                            <div>
                                <h3 className="course--detail--title">Course</h3>
                                <h4 className="course--name">{title}</h4>
                                <p>{user}</p>
                                {/* Using ReactMarkdown for displaying the "description" text in a more presentable */}
                                <ReactMarkdown>{description}</ReactMarkdown>
                            </div>
                            <div>
                                <h3 className="course--detail--title">Estimated Time</h3>
                                <p>{estimatedTime}</p>
        
                                <h3 className="course--detail--title">Materials Needed</h3>
                                <ul className="course--detail--list">
                                  {/* Using ReactMarkdown for displaying the "materialsNeeded" text in a more presentable */}
                                <ReactMarkdown>{materialsNeeded}</ReactMarkdown>
                                    
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                </main>            
          );
        }}
      </Consumer>
      
    );
  }
} 

export default CourseDetail;














