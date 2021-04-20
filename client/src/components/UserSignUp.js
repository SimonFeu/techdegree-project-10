import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ValidationMessage from './ValidationMessage';
import { Consumer } from './Context';

class UserSignUp extends Component {
    constructor() {
        super();
        this.state = {
          firstName: "",
          lastName: "",
          emailAddress: "",
          password: "",
          confirmPassword: "",
          errorMsg: [],
          error: true 
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
        if(targetName === 'firstName') {
            this.setState({ firstName: event.target.value });
        } else if (targetName === 'lastName'){
            this.setState({ lastName: event.target.value });
        }  else if (targetName === 'emailAddress'){
            this.setState({ emailAddress: event.target.value });
        }  else if (targetName === 'password'){
            this.setState({ password: event.target.value });
        }  else if (targetName === 'confirmPassword'){
            this.setState({ confirmPassword: event.target.value });
        } 
      }

       /* --------------------------------------------------------------------------
                                   postData function 
          --------------------------------------------------------------------------
        This function receives the data from state and sends it to the database via fetch.
        If the status code is 400 an response error message is save into the variable "errorMsg".
        This is used to show validation errors on to the webpage in the component "ValidationMessage" seen below.
        If the status is 201 the signIn function which we get from Consumer gets called. 
        This function needs the email adress and the password to sign the newly created user in. It also receives
        "this.props". This is done, because signIn will use "props.history.push" to redirect to the home screen with the pat "/".
        If another error occurs the user is redirected to the "error" path.
       */
      postData = (event, signIn) => {
        event.preventDefault();
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let emailAddress = this.state.emailAddress;
        let password = this.state.password;
        let statCode=201;
        if(this.state.password !== this.state.confirmPassword) {
            this.setState({errorMsg: ['Password does not match Confirm Password']});
        } else {
            fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({firstName,lastName,emailAddress, password})
            })
            .then(respond => {
                statCode = respond.status;
                if(statCode===201){
                    signIn(emailAddress, password, this.props);
                } else {
                    return respond.json();
                }
            })
            .then(res => {
                if(res){
                    if(statCode===400){
                        this.setState({errorMsg: res.errors});
                    } else {
                        this.props.history.push('/error');
                    } 
                }
            })
            .catch(error => {
                if(error){
                    this.props.history.push('/error');
                }
            })
        }
      }

  render(){
    return(    
        <Consumer>
            {context => {
                return(
                    <main>
                    <div className="form--centered">
                        <h2>Sign Up</h2>
                        {/* Component "ValidationMessage" gets renderd if a validation error occurs */}
                        {
                            (this.state.errorMsg.length>0) ?
                                <ValidationMessage errorMsg={this.state.errorMsg}/>
                            : ''
                        }
                        <div id="validationMsg"></div>
                       
                        <form onSubmit={(event) => this.postData(event, context.actions.signIn)}>
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                id="firstName" 
                                name="firstName" 
                                type="text" 
                                value={this.state.firstName} 
                                onChange={this.handleChange}
                            />
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                id="lastName" 
                                name="lastName" 
                                type="text" 
                                value={this.state.lastName} 
                                onChange={this.handleChange}
                            />
                            <label htmlFor="emailAddress">Email Address</label>
                            <input 
                                id="emailAddress" 
                                name="emailAddress" 
                                type="email" 
                                value={this.state.emailAddress} 
                                onChange={this.handleChange}
                            />
                            <label htmlFor="password">Password</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                value={this.state.password} 
                                onChange={this.handleChange}
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type="password" 
                                value={this.state.confirmPassword} 
                                onChange={this.handleChange}
                            />
                            <button className="button" type="submit">Sign Up</button>
                            <Link className="button button-secondary" to="/">Cancel</Link>
                        </form>
                        <p>Already have a user account? Click here to <Link to="/signin">sign in</Link>!</p>
                    </div>
                    </main>
                );
            }}
        </Consumer>
    );
    }
} 

export default UserSignUp;