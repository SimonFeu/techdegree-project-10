
import React,{ Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import NotFound from './components/NotFound';
import UpdateCourse from './components/UpdateCourse';
import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import Forbidden from './components/Forbidden';
import Error from './components/Error';
import PrivateRoute from './components/PrivateRoute';

class App extends Component {
  render() {
    return (
          <BrowserRouter>
            <div className="App">
              <Header />
              <Switch>
                  <Route exact path="/" component={Courses}/>
                  <PrivateRoute exact path="/courses/create" component={CreateCourse}/>
                  <Route exact path="/courses/:id" component={CourseDetail}/>
                  <PrivateRoute exact path="/courses/:id/update" component={UpdateCourse}/>
                  <Route exact path="/signup" component={UserSignUp}/>
                  <Route exact path="/signin" component={UserSignIn}/>
                  <Route exact path="/signout" component={UserSignOut}/>
                  <Route exact path="/forbidden" component={Forbidden}/>
                  <Route exact path="/error" component={Error}/>
                  <Route component={NotFound} />
              </Switch>
            </div>
          </BrowserRouter>

    );
  }
}

export default App;
