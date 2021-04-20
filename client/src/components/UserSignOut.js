import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Consumer } from './Context';


class UserSignOut extends Component {
    /**
       Using "context" outside the render method to avoid the following Error
       "Warning: Cannot update during an existing state transition (such as within render). 
                 Render methods should be a pure function of props and state."
     */
    _actions=null;
    componentDidMount(){
        this._actions.signOut();
    }

 
     render(){
        return(
            <Consumer>
                {context => {
                       this._actions=context.actions
                       return(
                           <Redirect to="/"/> 
                        );
                }}
            </Consumer>
        );
     }
   
}



export default UserSignOut;