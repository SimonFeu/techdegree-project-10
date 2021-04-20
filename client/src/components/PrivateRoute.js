import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Consumer } from './Context';


/*
    PrivateRoute is a Component for protected Routes.
    This Component receives the data from Consumers an checks if a user is loggedin via the user ID (context.id).
    If the user is signin the component that had been passed in to the PrivateRoute will be rendered.
    If the user is not signin it will redirect the user to the "signin" path.
*/
const PrivateRoute = ({ component: Component, ...rest}) => {
    return( 
        <Consumer>
            {context =>{
                return(
                    <Route {...rest} render={(props) => (context.id!==null) ? <Component {...props}/> : <Redirect to="/signin" />} />
                );
                }
            }
        </Consumer>
    )
}




export default PrivateRoute;
