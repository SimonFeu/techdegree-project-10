import React, { Component } from 'react';

const AppContext = React.createContext();

export class Provider extends Component {

    //global state
    constructor() {
        super();
        this.state = {
            username: "",
            email: "", 
            password: "",
            id: null,
            errorMsg: ""
        };
      } 

   /*   --------------------------------
                    Sign in
        --------------------------------
        This function is used to do the user sign in.
        If the respond status is 200 the global state variables "email, password, username and id"
        save the response data from the database and redirect the user to the home screen.
        If the respond sends an error with status code 401, the error is svae in the state "errorMsg"
        which will be shown in the UserSignIn-Route. If any other error occurs a seprate Error page will be shown. 
   */
   handelSignIn = (email, password, props) => {
        let statCode = null;
        fetch('http://localhost:5000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${btoa(`${email}:${password}`)}`
            }
        })
        .then(respond => {
            statCode = respond.status
            return respond.json()
        })
        .then(res => {
            if(statCode===200){
                this.setState({
                    email: res.emailAddress,
                    password: password,
                    username: `${res.firstName} ${res.lastName}`,
                    id: res.id
                });
                props.history.push('/');
            }
            else if(statCode===401){
                this.setState({errorMsg: [res.message]});
            } else {
                props.history.push('/error');
            }
        })
        .catch(error => {
            if(error){
               props.history.push('/error');
            }
        })
       }
      
       


    /*  --------------------------------
                     Sign out
        --------------------------------
        The sign out function resets the state variables back to the empty initial values.
   */  
    handelSignOut = () => {
        this.setState({
            username: "",
            email: "", 
            password: "",
            id: null,
            errorMsg: ""
        })
    }
           

    //Here the state variables and the signin and signout function are made available to the Provider 
    render(){
        return(
            <AppContext.Provider value={{
                    email: this.state.email,
                    password: this.state.password,
                    username: this.state.username,
                    id: this.state.id,
                    errorMsg: this.state.errorMsg,
                    actions: {
                        signIn: this.handelSignIn,
                        signOut: this.handelSignOut
                    }

            }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export const Consumer = AppContext.Consumer;