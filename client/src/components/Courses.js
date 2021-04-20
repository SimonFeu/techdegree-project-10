import React, {Component} from 'react';
import Course from './Course';
import { Link } from 'react-router-dom';

//This Component shows an overview of all Courses in the database
class Courses extends Component {

  constructor() {
    super();
    this.state = {
      courses: [],
      loading: true
    };
  } 

  /*
    When the component is mounted in the DOM, all courses data is loaded using fetch
    and stored in the state variable "courses". If an error occurs, catch redirects to the "error" path. 
  */
  componentDidMount() {
    fetch('http://localhost:5000/api/courses')
      .then(response => response.json())
      .then(responseData => {
        this.setState({ 
          courses: responseData,
          loading: false 
        });
      })
      .catch(error => {
        this.props.history.push('/error');
      });
  }


  render(){
     /*
        The loading status is set to false if all state variables received their data.
        With the if-condition can be ensured that the state variables are only 
        transmitted to the page when they have been completely supplied by the database.
        The map-function is used to create a component "<Course />" for each course.
        All course components are then saved in the variable "courseElement".
    */
    let courseElement;
    if(!this.state.loading) {
      courseElement = this.state.courses.map(course =>  (<Course title={course.title} id={course.id} key={course.id.toString()}/>));
    }

    return(
      <main>
            <div className="wrap main--grid">
              {/* Here all course components are loaded on to the page*/}
                {courseElement}
                <Link className="course--module course--add--module" to="/courses/create">
                    <span className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                        New Course
                    </span>
                </Link>
            </div>
        </main>
    );
  }
} 

export default Courses;