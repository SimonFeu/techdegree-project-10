import React, {Component} from 'react';
import { Link } from 'react-router-dom';

//Course is a Component which renders the single Course elements on the home screen Component "Courses"
class Course extends Component {
  render(){
      let url=`/courses/${this.props.id}`;
    return(
                <Link to={url} className="course--module course--link">
                    <h2 className="course--label">Course</h2>
                    <h3 className="course--title">{this.props.title}</h3>
                </Link>
    );
  }
} 

export default Course;